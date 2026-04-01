<template>
  <div class="payments-view">
    <div class="payments-view__header">
      <h1>Payments</h1>
      <p>Manage your waste collection payments</p>
    </div>
    
    <div class="payments-view__content">
      <BaseCard variant="elevated" padding="lg">
        <WeekSelector
          v-model="selectedWeekIds"
          :weeks="eligibleWeeks"
          :max-weeks="12"
        />
        
        <div class="payment-actions">
          <BaseButton
            variant="primary"
            size="lg"
            :disabled="selectedWeeks.length === 0"
            @click="openPaymentModal"
          >
            Pay Now - {{ formattedTotal }}
          </BaseButton>
        </div>
      </BaseCard>
    </div>
    
    <PaymentConfirmModal
      v-model="showPaymentModal"
      :weeks="selectedWeeks"
      @confirm="handlePaymentConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseCard from '../../components/base/BaseCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import WeekSelector from '../../components/domain/payment/WeekSelector.vue'
import PaymentConfirmModal from '../../components/domain/payment/PaymentConfirmModal.vue'
import { usePayment } from '../../composables/usePayment'
import { useToast } from '../../composables/useToast'

const paymentComposable = usePayment()
const toast = useToast()

const selectedWeekIds = computed({
  get: () => paymentComposable.selectedWeekIds.value,
  set: (value) => {
    paymentComposable.selectedWeekIds.value = value
  }
})

const selectedWeeks = computed(() => paymentComposable.selectedWeeks.value)
const eligibleWeeks = computed(() => paymentComposable.getEligibleWeeks())
const formattedTotal = computed(() => paymentComposable.formattedTotal.value)

const showPaymentModal = ref(false)

const openPaymentModal = () => {
  showPaymentModal.value = true
}

const handlePaymentConfirm = async (pinCode: string) => {
  const success = await paymentComposable.processPayment(pinCode)
  if (success) {
    toast.success('Payment processed successfully!')
    showPaymentModal.value = false
  }
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.payments-view {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.payments-view__header {
  margin-bottom: var(--space-6);
}

.payments-view__header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-2) 0;
}

.payments-view__header p {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}

.payments-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.payment-actions {
  margin-top: var(--space-6);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border-default);
}
</style>
