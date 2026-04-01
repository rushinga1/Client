import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Week {
  id: number
  label: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'upcoming'
  dueDate?: string
  paidDate?: string
  transactionId?: string
}

export interface Transaction {
  id: string
  weekIds: number[]
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  completedAt?: string
  method: 'mobile_money' | 'bank' | 'cash'
  reference?: string
}

export const usePaymentStore = defineStore('payment', () => {
  // State
  const weeks = ref<Week[]>([])
  const transactions = ref<Transaction[]>([])
  const isLoading = ref(false)
  const error = ref<string>('')

  // Mock data generation
  const generateMockWeeks = (): Week[] => {
    const currentWeek = new Date()
    const weeks: Week[] = []
    
    // Generate 52 weeks (1 year)
    for (let i = 0; i < 52; i++) {
      const weekDate = new Date(currentWeek)
      weekDate.setDate(weekDate.getDate() + (i * 7))
      
      const weekNumber = Math.floor(i / 4) + 1
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const label = `Week ${i + 1}, ${monthNames[weekDate.getMonth()]} ${weekDate.getFullYear()}`
      
      let status: Week['status'] = 'upcoming'
      let dueDate: string | undefined
      let paidDate: string | undefined
      let transactionId: string | undefined
      
      // Set some weeks as paid (first 20 weeks)
      if (i < 20) {
        status = 'paid'
        paidDate = new Date(weekDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
        transactionId = `TXN${1000 + i}`
      } 
      // Set some weeks as pending (weeks 20-25)
      else if (i < 26) {
        status = 'pending'
        dueDate = weekDate.toISOString()
      }
      // Set some weeks as overdue (weeks 26-30)
      else if (i < 31) {
        status = 'overdue'
        dueDate = new Date(weekDate.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
      // Rest are upcoming
      else {
        status = 'upcoming'
        dueDate = weekDate.toISOString()
      }
      
      weeks.push({
        id: i + 1,
        label,
        amount: 2500, // RWF 2,500 per week
        status,
        dueDate,
        paidDate,
        transactionId
      })
    }
    
    return weeks
  }

  const generateMockTransactions = (): Transaction[] => {
    const transactions: Transaction[] = []
    
    // Generate transactions for paid weeks
    for (let i = 0; i < 20; i++) {
      const weekIds = [i + 1]
      const createdAt = new Date(Date.now() - (i * 7 * 24 * 60 * 60 * 1000)).toISOString()
      
      transactions.push({
        id: `TXN${1000 + i}`,
        weekIds,
        amount: 2500,
        currency: 'RWF',
        status: 'completed',
        createdAt,
        completedAt: createdAt,
        method: i % 2 === 0 ? 'mobile_money' : 'bank',
        reference: `REF${1000 + i}`
      })
    }
    
    // Add a recent failed transaction
    transactions.push({
      id: 'TXN2001',
      weekIds: [26, 27],
      amount: 5000,
      currency: 'RWF',
      status: 'failed',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      method: 'mobile_money'
    })
    
    return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  // Computed
  const unpaidWeeks = computed(() => {
    return weeks.value.filter((week: any) => week.status === 'pending' || week.status === 'overdue')
  })

  const overdueWeeks = computed(() => {
    return weeks.value.filter((week: any) => week.status === 'overdue')
  })

  const paidWeeks = computed(() => {
    return weeks.value.filter((week: any) => week.status === 'paid')
  })

  const upcomingWeeks = computed(() => {
    return weeks.value.filter((week: any) => week.status === 'upcoming')
  })

  const totalDebt = computed(() => {
    return unpaidWeeks.value.reduce((sum: number, week: any) => sum + week.amount, 0)
  })

  const recentTransactions = computed(() => {
    return transactions.value.slice(0, 10)
  })

  const successfulTransactions = computed(() => {
    return transactions.value.filter((t: any) => t.status === 'completed')
  })

  const failedTransactions = computed(() => {
    return transactions.value.filter((t: any) => t.status === 'failed')
  })

  // Actions
  const initializePayments = async () => {
    isLoading.value = true
    error.value = ''

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      weeks.value = generateMockWeeks()
      transactions.value = generateMockTransactions()
    } catch (err) {
      error.value = 'Failed to load payment data'
      console.error('Payment initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  const markWeeksAsPaid = async (weekIds: number[]) => {
    isLoading.value = true
    error.value = ''

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      const transactionId = `TXN${Date.now()}`
      const amount = weekIds.reduce((sum: number, weekId: number) => {
        const week = weeks.value.find((w: any) => w.id === weekId)
        return sum + (week?.amount || 0)
      }, 0)

      // Update weeks status
      weekIds.forEach((weekId: number) => {
        const week = weeks.value.find((w: any) => w.id === weekId)
        if (week) {
          week.status = 'paid'
          week.paidDate = new Date().toISOString()
          week.transactionId = transactionId
        }
      })

      // Add transaction
      const newTransaction: Transaction = {
        id: transactionId,
        weekIds,
        amount,
        currency: 'RWF',
        status: 'completed',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        method: 'mobile_money',
        reference: `REF${Date.now()}`
      }

      transactions.value.unshift(newTransaction)

      return true
    } catch (err) {
      error.value = 'Failed to process payment'
      console.error('Payment processing error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const getWeekById = (id: number) => {
    return weeks.value.find((week: any) => week.id === id)
  }

  const getTransactionById = (id: string) => {
    return transactions.value.find((transaction: any) => transaction.id === id)
  }

  const getWeeksByTransaction = (transactionId: string) => {
    const transaction = getTransactionById(transactionId)
    if (!transaction) return []
    
    return weeks.value.filter((week: any) => transaction.weekIds.includes(week.id))
  }

  const refreshData = async () => {
    await initializePayments()
  }

  // Initialize store
  const init = () => {
    initializePayments()
  }

  return {
    // State
    weeks,
    transactions,
    isLoading,
    error,
    
    // Computed
    unpaidWeeks,
    overdueWeeks,
    paidWeeks,
    upcomingWeeks,
    totalDebt,
    recentTransactions,
    successfulTransactions,
    failedTransactions,
    
    // Actions
    initializePayments,
    markWeeksAsPaid,
    getWeekById,
    getTransactionById,
    getWeeksByTransaction,
    refreshData,
    init
  }
})
