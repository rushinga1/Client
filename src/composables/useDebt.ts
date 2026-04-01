import { computed } from 'vue'
import { usePaymentStore } from '../stores/payment.store'
import { formatCurrency } from '../utils/currency'

export interface DebtInfo {
  totalDebt: number
  weeksOwed: number
  monthsBehind: number
  isBanned: boolean
  nextPaymentAmount: number
  nextPaymentDate: string
}

export function useDebt() {
  const paymentStore = usePaymentStore()

  const debtInfo = computed<DebtInfo>(() => {
    const unpaidWeeks = paymentStore.weeks.filter(week => 
      week.status === 'pending' || week.status === 'overdue'
    )
    
    const totalDebt = unpaidWeeks.reduce((sum: number, week: any) => sum + week.amount, 0)
    const weeksOwed = unpaidWeeks.length
    
    // Calculate months behind (simplified - assumes 4 weeks per month)
    const monthsBehind = Math.floor(weeksOwed / 4)
    
    // Service is banned if 2+ months behind
    const isBanned = monthsBehind >= 2
    
    // Find next payment
    const nextWeek = unpaidWeeks[0]
    const nextPaymentAmount = nextWeek?.amount || 0
    const nextPaymentDate = nextWeek?.dueDate || ''
    
    return {
      totalDebt,
      weeksOwed,
      monthsBehind,
      isBanned,
      nextPaymentAmount,
      nextPaymentDate
    }
  })

  const formattedDebt = computed(() => {
    return formatCurrency(debtInfo.value.totalDebt, 'RWF')
  })

  const hasDebt = computed(() => debtInfo.value.totalDebt > 0)

  const debtStatus = computed(() => {
    if (debtInfo.value.isBanned) return 'banned'
    if (debtInfo.value.monthsBehind >= 1) return 'danger'
    if (debtInfo.value.weeksOwed > 0) return 'warning'
    return 'clear'
  })

  const getDebtMessage = () => {
    const { totalDebt, weeksOwed, monthsBehind, isBanned } = debtInfo.value
    
    if (isBanned) {
      return `Service banned: ${weeksOwed} weeks overdue (${formatCurrency(totalDebt, 'RWF')})`
    }
    
    if (monthsBehind >= 1) {
      return `Urgent: ${monthsBehind} month${monthsBehind > 1 ? 's' : ''} behind`
    }
    
    if (weeksOwed > 0) {
      return `${weeksOwed} week${weeksOwed > 1 ? 's' : ''} pending (${formatCurrency(totalDebt, 'RWF')})`
    }
    
    return 'All payments up to date'
  }

  const getBannerVariant = () => {
    if (debtInfo.value.isBanned) return 'danger'
    if (debtInfo.value.monthsBehind >= 1) return 'warning'
    return 'info'
  }

  return {
    debtInfo,
    formattedDebt,
    hasDebt,
    debtStatus,
    getDebtMessage,
    getBannerVariant
  }
}
