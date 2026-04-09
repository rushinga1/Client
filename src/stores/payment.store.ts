import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface PaymentRecord {
  id: string
  date: string
  amount: number
  service: string
  method: 'MTN MoMo' | 'Airtel Money' | 'Visa' | 'Mastercard'
  status: 'completed' | 'pending' | 'failed'
  transactionId: string
}

export const usePaymentStore = defineStore('payment', () => {
  // Mock Payment History
  const history = ref<PaymentRecord[]>([
    {
      id: 'PAY-2026-001',
      date: '2026-04-05',
      amount: 5000,
      service: 'Base Waste Collection',
      method: 'MTN MoMo',
      status: 'completed',
      transactionId: 'TXN88229103'
    },
    {
      id: 'PAY-2026-002',
      date: '2026-03-28',
      amount: 5000,
      service: 'Base Waste Collection',
      method: 'MTN MoMo',
      status: 'completed',
      transactionId: 'TXN88229104'
    },
    {
      id: 'PAY-2026-003',
      date: '2026-03-15',
      amount: 12000,
      service: 'Special Waste Removal',
      method: 'Visa',
      status: 'completed',
      transactionId: 'TXN88229105'
    },
    {
      id: 'PAY-2026-004',
      date: '2026-02-25',
      amount: 5000,
      service: 'Base Waste Collection',
      method: 'Airtel Money',
      status: 'completed',
      transactionId: 'TXN88229106'
    },
    {
      id: 'PAY-2026-005',
      date: '2026-02-10',
      amount: 1500,
      service: 'Late Fee Payment',
      method: 'MTN MoMo',
      status: 'completed',
      transactionId: 'TXN88229107'
    },
    {
      id: 'PAY-2026-006',
      date: '2026-01-20',
      amount: 5000,
      service: 'Base Waste Collection',
      method: 'MTN MoMo',
      status: 'completed',
      transactionId: 'TXN88229108'
    }
  ])

  // Mock Trend Data (Last 6 months)
  const trends = ref([
    { month: 'Oct 2025', amount: 5000 },
    { month: 'Nov 2025', amount: 6500 },
    { month: 'Dec 2025', amount: 5000 },
    { month: 'Jan 2026', amount: 5000 },
    { month: 'Feb 2026', amount: 6500 },
    { month: 'Mar 2026', amount: 17000 },
    { month: 'Apr 2026', amount: 5000 }
  ])

  // Actions
  const addPayment = (payment: Omit<PaymentRecord, 'id' | 'status'>) => {
    const newPayment: PaymentRecord = {
      ...payment,
      id: `PAY-2026-${String(history.value.length + 1).padStart(3, '0')}`,
      status: 'completed'
    }
    history.value.unshift(newPayment)
    
    // Update current month trend
    const currentMonth = new Date().toLocaleString('default', { month: 'short', year: 'numeric' })
    const trendIndex = trends.value.findIndex(t => t.month === currentMonth)
    if (trendIndex !== -1) {
      trends.value[trendIndex].amount += payment.amount
    } else {
      trends.value.push({ month: currentMonth, amount: payment.amount })
    }
  }

  // ── Backward Compatibility for UserDashboard.vue ──
  const paidWeeks = ref<any[]>([])
  const recentTransactions = ref<any[]>([])

  const initializePayments = async () => {
    // Simulate loading old dashboard data
    await new Promise(resolve => setTimeout(resolve, 500))
    paidWeeks.value = Array.from({ length: 42 }, (_, i) => ({ id: i, amount: 5000 }))
    recentTransactions.value = history.value.map(p => ({
      id: p.id,
      amount: p.amount,
      createdAt: p.date,
      status: p.status,
      weekIds: [1, 2]
    }))
  }

  return {
    // New Client Logic
    history,
    trends,
    addPayment,
    
    // Legacy/Dashboard Support
    paidWeeks,
    recentTransactions,
    initializePayments
  }
})
