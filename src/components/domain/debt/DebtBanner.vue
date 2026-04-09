<template>
  <div :class="bannerClasses">
    <div class="debt-banner__content">
      <div class="debt-banner__icon">
        <Icon :icon="iconName" />
      </div>
      
      <div class="debt-banner__text">
        <h4 class="debt-banner__title">
          {{ title }}
        </h4>
        <p class="debt-banner__message">
          <span class="amount">{{ formatCurrency(totalDebt, currency) }}</span>
          {{ $t('debt.owedFor', { count: weeksOwed }) }}
        </p>
        <p v-if="monthsBehind >= 2" class="debt-banner__warning">
          <Icon icon="ph:warning" />
          {{ $t('debt.serviceBanWarning') }}
        </p>
      </div>
      
      <div class="debt-banner__actions">
        <BaseButton
          variant="primary"
          size="md"
          class="debt-banner__pay-btn"
          @click="$emit('payNow')"
        >
          <Icon icon="ph:credit-card-bold" />
          {{ $t('payment.payNow') }}
        </BaseButton>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '../../base/BaseButton.vue'

interface Props {
  totalDebt: number
  weeksOwed: number
  currency?: string
  monthsBehind: number
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'RWF'
})

const emit = defineEmits<{
  payNow: []
}>()

const bannerClasses = computed(() => [
  'debt-banner',
  {
    'debt-banner--warning': props.monthsBehind === 1,
    'debt-banner--danger': props.monthsBehind >= 2
  }
])

const iconName = computed(() => {
  if (props.monthsBehind >= 2) return 'ph:warning-circle'
  if (props.monthsBehind === 1) return 'ph:info'
  return 'ph:credit-card'
})

const title = computed(() => {
  if (props.monthsBehind >= 2) return 'Critical: Immediate Action Required'
  if (props.monthsBehind === 1) return 'Attention: Outstanding Balance'
  return 'Payment Summary'
})

// Utility function
const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.debt-banner {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-lg);
  transition: all var(--duration-normal) var(--ease-default);
}

.debt-banner--warning {
  background-color: var(--color-warning-light);
  border: 1px solid var(--color-warning);
  color: var(--color-warning-dark);
}

.debt-banner--danger {
  background-color: var(--color-danger-light);
  border: 1px solid var(--color-danger);
  color: var(--color-danger-dark);
}

.debt-banner:not(.debt-banner--warning):not(.debt-banner--danger) {
  background-color: var(--color-info-light);
  border: 1px solid var(--color-info);
  color: var(--color-info-dark);
}

.debt-banner__content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-6);
  position: relative;
  z-index: 1;
}

.debt-banner__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-12);
  height: var(--space-12);
  color: currentColor;
  flex-shrink: 0;
}

.debt-banner__icon svg {
  width: 32px;
  height: 32px;
}

.debt-banner__text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.debt-banner__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.debt-banner__message {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.debt-banner__message .amount {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
}

.debt-banner__warning {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
}

.debt-banner__warning svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.debt-banner__actions {
  flex-shrink: 0;
}

.debt-banner__pay-btn {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-weight: 700;
  letter-spacing: 0.02em;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  border: none;
  transition: all var(--duration-fast) var(--ease-default);
}

.debt-banner__pay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.debt-banner__pay-btn svg {
  margin-right: var(--space-2);
}


/* Responsive adjustments */
@media (max-width: 768px) {
  .debt-banner__content {
    flex-direction: column;
    text-align: center;
    gap: var(--space-3);
  }
  
  .debt-banner__actions {
    width: 100%;
  }
  
  .debt-banner__actions .base-button {
    width: 100%;
  }
}
</style>
