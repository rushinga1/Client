<template>
  <BaseModal
    v-model="modelValue"
    :title="$t('payment.confirmPayment')"
    size="md"
    :persistent="processing"
    @close="handleClose"
  >
    <div class="payment-confirm-modal">
      <div class="payment-confirm-modal__summary">
        <h4>{{ $t('payment.paymentSummary') }}</h4>
        <div class="summary-item">
          <span>{{ $t('payment.weeksSelected') }}</span>
          <span>{{ weeks.length }}</span>
        </div>
        <div class="summary-item">
          <span>{{ $t('payment.totalAmount') }}</span>
          <span class="amount">{{ formatCurrency(totalAmount, 'RWF') }}</span>
        </div>
      </div>
      
      <div class="payment-confirm-modal__weeks">
        <h4>{{ $t('payment.selectedWeeks') }}</h4>
        <div class="weeks-list">
          <div
            v-for="week in weeks"
            :key="week.id"
            class="week-item"
          >
            <span>{{ week.label }}</span>
            <span class="amount">{{ formatCurrency(week.amount, 'RWF') }}</span>
          </div>
        </div>
      </div>
      
      <div class="payment-confirm-modal__pin">
        <h4>{{ $t('payment.enterPin') }}</h4>
        <BasePinInput
          v-model="pinCode"
          :length="6"
          :mask="true"
          :error="pinError"
          @complete="handlePinComplete"
        />
        <p class="pin-hint">
          {{ $t('payment.pinHint') }}
        </p>
      </div>
      
      <div v-if="error" class="payment-confirm-modal__error">
        <Icon icon="ph:warning-circle" />
        <span>{{ error }}</span>
      </div>
    </div>
    
    <template #footer>
      <div class="modal-footer">
        <BaseButton
          variant="ghost"
          @click="handleClose"
          :disabled="processing"
        >
          {{ $t('common.cancel') }}
        </BaseButton>
        <BaseButton
          variant="primary"
          @click="handleConfirm"
          :loading="processing"
          :disabled="!canConfirm"
        >
          {{ processing ? $t('payment.processing') : $t('payment.confirmPay') }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseModal from '../../base/BaseModal.vue'
import BaseButton from '../../base/BaseButton.vue'
import BasePinInput from '../../base/BasePinInput.vue'

interface Week {
  id: number
  label: string
  amount: number
}

interface Props {
  modelValue: boolean
  weeks: Week[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: [pinCode: string]
  close: []
}>()

const pinCode = ref('')
const processing = ref(false)
const error = ref('')
const pinError = ref('')

const totalAmount = computed(() => {
  return props.weeks.reduce((total, week) => total + week.amount, 0)
})

const canConfirm = computed(() => {
  return pinCode.value.length === 6 && !processing.value
})

const handlePinComplete = (code: string) => {
  pinCode.value = code
  pinError.value = ''
}

const handleConfirm = async () => {
  if (!canConfirm.value) return
  
  error.value = ''
  pinError.value = ''
  processing.value = true
  
  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate PIN validation (123456 is correct for demo)
    if (pinCode.value !== '123456') {
      pinError.value = 'Invalid PIN. Please try again.'
      return
    }
    
    emit('confirm', pinCode.value)
    handleClose()
  } catch (err) {
    error.value = 'Payment failed. Please try again.'
  } finally {
    processing.value = false
  }
}

const handleClose = () => {
  pinCode.value = ''
  error.value = ''
  pinError.value = ''
  processing.value = false
  emit('update:modelValue', false)
  emit('close')
}

// Utility function
const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.payment-confirm-modal {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.payment-confirm-modal__summary,
.payment-confirm-modal__weeks,
.payment-confirm-modal__pin {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.payment-confirm-modal__summary h4,
.payment-confirm-modal__weeks h4,
.payment-confirm-modal__pin h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.summary-item .amount {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  color: var(--color-text-primary);
}

.weeks-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 120px;
  overflow-y: auto;
  padding: var(--space-1);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-neutral-50);
}

.week-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-surface);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
}

.week-item .amount {
  font-family: var(--font-mono);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.pin-hint {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
  text-align: center;
}

.payment-confirm-modal__error {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
}

.payment-confirm-modal__error svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-3);
}
</style>
