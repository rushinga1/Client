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
          size="sm"
          @click="$emit('payNow')"
        >
          {{ $t('payment.payNow') }}
        </BaseButton>
      </div>
    </div>
    
    <div v-if="monthsBehind >= 2" class="debt-banner__pulse">
      <div class="pulse-ring"></div>
      <div class="pulse-ring pulse-ring-2"></div>
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
  if (props.monthsBehind >= 2) return 'debt.title.danger'
  if (props.monthsBehind === 1) return 'debt.title.warning'
  return 'debt.title.default'
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
  width: var(--space-10);
  height: var(--space-10);
  border-radius: var(--radius-full);
  background-color: currentColor;
  color: var(--color-text-inverse);
  flex-shrink: 0;
}

.debt-banner__icon svg {
  width: 20px;
  height: 20px;
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

/* Pulse effect for danger state */
.debt-banner__pulse {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: var(--space-6);
  width: var(--space-10);
  height: var(--space-10);
  border-radius: 50%;
  border: 2px solid var(--color-danger);
  transform: translate(-50%, -50%);
  animation: pulse-ring 2s infinite;
}

.pulse-ring-2 {
  animation-delay: 1s;
}

@keyframes pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

/* Warning state pulse */
.debt-banner--warning .pulse-ring {
  border-color: var(--color-warning);
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
