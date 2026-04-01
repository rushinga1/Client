<template>
  <div class="history-view">
    <div class="history-view__header">
      <h1>Payment History</h1>
      <p>View your past payments and transactions</p>
    </div>
    
    <div class="history-view__content">
      <div v-if="isLoading" class="loading">Loading payments...</div>
      <div v-else-if="recentTransactions.length === 0" class="empty">
        <p>No payments yet</p>
      </div>
      <div v-else class="payments-grid">
        <PaymentEvidenceModal
          v-for="payment in recentTransactions"
          :key="payment.id"
          :amount="payment.amount"
          :payment-date="formatDate(payment.createdAt)"
          :payment-time="formatTime(payment.createdAt)"
          :transaction-id="payment.id"
          :reference-code="payment.referenceCode"
          :method="payment.method || 'Bank Transfer'"
          :phone="payment.phone || '+250788000000'"
          :customer-name="payment.customerName || 'You'"
          :house-location="payment.houseLocation || 'Unknown'"
          :customer-category="payment.status"
          :week-count="payment.weekIds?.length || 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import PaymentEvidenceModal from '../../components/domain/payment/PaymentEvidenceModal.vue'
import { usePaymentStore } from '../../stores/payment.store'
import { useToast } from '../../composables/useToast'

const paymentStore = usePaymentStore()
const toast = useToast()

const isLoading = ref(true)

const recentTransactions = computed(() => paymentStore.recentTransactions)

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (dateString: string) => {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`
}

onMounted(async () => {
  try {
    isLoading.value = true
    await paymentStore.initializePayments()
  } catch (error) {
    console.error('Failed to load payment history:', error)
    toast.error('Failed to load payment history')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.history-view {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.history-view__header {
  margin-bottom: var(--space-6);
}

.history-view__header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-2) 0;
}

.history-view__header p {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}

.history-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.payments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-4);
}

.loading {
  text-align: center;
  padding: var(--space-6);
  color: var(--color-text-secondary);
}

.empty {
  text-align: center;
  padding: var(--space-6);
  color: var(--color-text-secondary);
}

.amount {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}
</style>
