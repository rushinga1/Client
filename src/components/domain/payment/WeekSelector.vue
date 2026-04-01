<template>
  <div class="week-selector">
    <div class="week-selector__header">
      <h3 class="week-selector__title">{{ $t('payment.selectWeeks') }}</h3>
      <div class="week-selector__actions">
        <BaseButton
          variant="ghost"
          size="sm"
          @click="selectAll"
          :disabled="selectedWeeks.length === weeks.length"
        >
          {{ $t('common.selectAll') }}
        </BaseButton>
        <BaseButton
          variant="ghost"
          size="sm"
          @click="clearSelection"
          :disabled="selectedWeeks.length === 0"
        >
          {{ $t('common.clear') }}
        </BaseButton>
      </div>
    </div>
    
    <div class="week-selector__grid">
      <div
        v-for="week in weeks"
        :key="week.id"
        :class="weekClasses(week)"
        @click="toggleWeek(week)"
      >
        <div class="week-selector__checkbox">
          <input
            type="checkbox"
            :checked="isSelected(week.id)"
            :disabled="week.disabled"
            @change="toggleWeek(week)"
          />
          <div class="checkbox-indicator">
            <Icon icon="ph:check" />
          </div>
        </div>
        
        <div class="week-selector__content">
          <div class="week-selector__label">{{ week.label }}</div>
          <div class="week-selector__amount amount">
            {{ formatCurrency(week.amount, 'RWF') }}
          </div>
          <div v-if="week.status" class="week-selector__status">
            <BaseBadge :variant="getStatusVariant(week.status)" size="sm">
              {{ getStatusLabel(week.status) }}
            </BaseBadge>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="selectedWeeks.length > 0" class="week-selector__summary">
      <div class="week-selector__total">
        <span>{{ $t('payment.selectedWeeks', { count: selectedWeeks.length }) }}</span>
        <span class="amount">{{ formatCurrency(totalAmount, 'RWF') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '../../base/BaseButton.vue'
import BaseBadge from '../../base/BaseBadge.vue'

interface Week {
  id: number
  label: string
  amount: number
  status?: 'paid' | 'pending' | 'overdue' | 'upcoming'
  disabled?: boolean
}

interface Props {
  modelValue: number[]
  weeks: Week[]
  maxWeeks?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxWeeks: 52
})

const emit = defineEmits<{
  'update:modelValue': [value: number[]]
}>()

const selectedWeeks = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const totalAmount = computed(() => {
  return selectedWeeks.value.reduce((total, weekId) => {
    const week = props.weeks.find(w => w.id === weekId)
    return total + (week?.amount || 0)
  }, 0)
})

const isSelected = (weekId: number) => {
  return selectedWeeks.value.includes(weekId)
}

const toggleWeek = (week: Week) => {
  if (week.disabled) return
  
  const newSelection = [...selectedWeeks.value]
  const index = newSelection.indexOf(week.id)
  
  if (index > -1) {
    newSelection.splice(index, 1)
  } else {
    if (newSelection.length < props.maxWeeks) {
      newSelection.push(week.id)
    }
  }
  
  selectedWeeks.value = newSelection
}

const selectAll = () => {
  const eligibleWeeks = props.weeks.filter(w => !w.disabled && !isSelected(w.id))
  const newSelection = [...selectedWeeks.value, ...eligibleWeeks.map(w => w.id)]
  selectedWeeks.value = newSelection.slice(0, props.maxWeeks)
}

const clearSelection = () => {
  selectedWeeks.value = []
}

const weekClasses = (week: Week) => [
  'week-selector__item',
  {
    'week-selector__item--selected': isSelected(week.id),
    'week-selector__item--disabled': week.disabled,
    'week-selector__item--paid': week.status === 'paid',
    'week-selector__item--overdue': week.status === 'overdue'
  }
]

const getStatusVariant = (status: string) => {
  const variants = {
    paid: 'success',
    pending: 'warning',
    overdue: 'danger',
    upcoming: 'default'
  }
  return variants[status as keyof typeof variants] || 'default'
}

const getStatusLabel = (status: string) => {
  const labels = {
    paid: 'payment.status.paid',
    pending: 'payment.status.pending',
    overdue: 'payment.status.overdue',
    upcoming: 'payment.status.upcoming'
  }
  return labels[status as keyof typeof labels] || status
}

// Utility function
const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.week-selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.week-selector__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.week-selector__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.week-selector__actions {
  display: flex;
  gap: var(--space-2);
}

.week-selector__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-3);
  max-height: 400px;
  overflow-y: auto;
  padding: var(--space-1);
}

.week-selector__item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-surface);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.week-selector__item:hover:not(.week-selector__item--disabled) {
  border-color: var(--color-primary-300);
  background-color: var(--color-primary-50);
}

.week-selector__item--selected {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-50);
  box-shadow: var(--shadow-focus);
}

.week-selector__item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-bg-sunken);
}

.week-selector__item--paid {
  border-color: var(--color-success);
  background-color: var(--color-success-light);
}

.week-selector__item--overdue {
  border-color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.week-selector__checkbox {
  position: relative;
  flex-shrink: 0;
  margin-top: var(--space-1);
}

.week-selector__checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-5);
  height: var(--space-5);
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-surface);
  transition: all var(--duration-fast) var(--ease-default);
}

.week-selector__item:hover .checkbox-indicator {
  border-color: var(--color-primary-400);
}

.week-selector__item--selected .checkbox-indicator {
  border-color: var(--color-primary-500);
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.checkbox-indicator svg {
  width: 12px;
  height: 12px;
  opacity: 0;
  transition: opacity var(--duration-fast) var(--ease-default);
}

.week-selector__item--selected .checkbox-indicator svg {
  opacity: 1;
}

.week-selector__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.week-selector__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.week-selector__amount {
  font-family: var(--font-mono);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.week-selector__status {
  align-self: flex-start;
}

.week-selector__summary {
  padding: var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  background-color: var(--color-neutral-50);
}

.week-selector__total {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.week-selector__total .amount {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  color: var(--color-primary-600);
}
</style>
