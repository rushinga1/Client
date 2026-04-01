import { ref, computed } from 'vue'
import { usePaymentStore } from '../stores/payment.store'
import { useToast } from './useToast'
import { formatCurrency } from '../utils/currency'

export interface Week {
  id: number
  label: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'upcoming'
  dueDate?: string
  disabled?: boolean
}

export interface PaymentSummary {
  selectedWeeks: Week[]
  totalAmount: number
  weeksCount: number
}

export function usePayment() {
  const paymentStore = usePaymentStore()
  const toast = useToast()
  
  const selectedWeekIds = ref<number[]>([])
  const isProcessing = ref(false)
  const showPaymentModal = ref(false)

  const weeks = computed<Week[]>(() => paymentStore.weeks)

  const selectedWeeks = computed<Week[]>(() => {
    return weeks.value.filter(week => selectedWeekIds.value.includes(week.id))
  })

  const paymentSummary = computed<PaymentSummary>(() => {
    const totalAmount = selectedWeeks.value.reduce((sum, week) => sum + week.amount, 0)
    
    return {
      selectedWeeks: selectedWeeks.value,
      totalAmount,
      weeksCount: selectedWeeks.value.length
    }
  })

  const formattedTotal = computed(() => {
    return formatCurrency(paymentSummary.value.totalAmount, 'RWF')
  })

  const canPay = computed(() => {
    return selectedWeekIds.value.length > 0 && !isProcessing.value
  })

  const toggleWeek = (weekId: number) => {
    const index = selectedWeekIds.value.indexOf(weekId)
    
    if (index > -1) {
      selectedWeekIds.value.splice(index, 1)
    } else {
      const week = weeks.value.find(w => w.id === weekId)
      if (week && !week.disabled) {
        selectedWeekIds.value.push(weekId)
      }
    }
  }

  const selectAllWeeks = () => {
    const eligibleWeeks = weeks.value.filter(week => 
      !week.disabled && (week.status === 'pending' || week.status === 'overdue')
    )
    selectedWeekIds.value = eligibleWeeks.map(week => week.id)
  }

  const clearSelection = () => {
    selectedWeekIds.value = []
  }

  const openPaymentModal = () => {
    if (canPay.value) {
      showPaymentModal.value = true
    }
  }

  const closePaymentModal = () => {
    showPaymentModal.value = false
  }

  const processPayment = async (pinCode: string) => {
    if (!canPay.value) return false

    isProcessing.value = true

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate PIN validation
      if (pinCode !== '123456') {
        toast.error('Invalid PIN. Please try again.')
        return false
      }

      // Update payment status in store
      await paymentStore.markWeeksAsPaid(selectedWeekIds.value)

      // Show success message
      const weeksText = selectedWeekIds.value.length === 1 
        ? '1 week' 
        : `${selectedWeekIds.value.length} weeks`
      
      toast.success(`Payment successful! ${weeksText} marked as paid.`)

      // Clear selection and close modal
      clearSelection()
      closePaymentModal()

      return true
    } catch (error) {
      toast.error('Payment failed. Please try again.')
      return false
    } finally {
      isProcessing.value = false
    }
  }

  const getWeekStatusVariant = (status: Week['status']) => {
    const variants = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
      upcoming: 'default'
    }
    return variants[status]
  }

  const getWeekStatusLabel = (status: Week['status']) => {
    const labels = {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      upcoming: 'Upcoming'
    }
    return labels[status]
  }

  const isWeekSelected = (weekId: number) => {
    return selectedWeekIds.value.includes(weekId)
  }

  const getEligibleWeeks = () => {
    return weeks.value.filter(week => 
      !week.disabled && (week.status === 'pending' || week.status === 'overdue')
    )
  }

  const getUpcomingWeeks = () => {
    return weeks.value.filter(week => week.status === 'upcoming')
  }

  const getPaidWeeks = () => {
    return weeks.value.filter(week => week.status === 'paid')
  }

  return {
    // State
    selectedWeekIds,
    isProcessing,
    showPaymentModal,
    
    // Computed
    weeks,
    selectedWeeks,
    paymentSummary,
    formattedTotal,
    canPay,
    
    // Actions
    toggleWeek,
    selectAllWeeks,
    clearSelection,
    openPaymentModal,
    closePaymentModal,
    processPayment,
    
    // Utilities
    getWeekStatusVariant,
    getWeekStatusLabel,
    isWeekSelected,
    getEligibleWeeks,
    getUpcomingWeeks,
    getPaidWeeks
  }
}
