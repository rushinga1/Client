<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="loading-spinner"></span>
    <Icon v-else-if="iconLeft" :icon="iconLeft" class="icon-left" />
    <span class="button-text">
      <slot />
    </span>
    <Icon v-if="iconRight && !loading" :icon="iconRight" class="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  iconLeft?: string
  iconRight?: string
  block?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  block: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--loading': props.loading,
    'base-button--disabled': props.disabled,
    'base-button--block': props.block
  }
])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  border: none;
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: none;
  box-shadow: var(--shadow-focus);
}

.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Size variants */
.base-button--sm {
  padding: var(--space-2) var(--space-3);
  font-size: var(--text-sm);
}

.base-button--md {
  padding: var(--space-3) var(--space-4);
  font-size: var(--text-base);
}

.base-button--lg {
  padding: var(--space-4) var(--space-6);
  font-size: var(--text-lg);
}

.base-button--xl {
  padding: var(--space-5) var(--space-8);
  font-size: var(--text-xl);
}

/* Variant styles */
.base-button--primary {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: var(--color-primary-600);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--primary:active:not(.base-button--disabled) {
  background-color: var(--color-primary-700);
  transform: translateY(0);
}

.base-button--secondary {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: var(--color-neutral-200);
  border-color: var(--color-border-strong);
}

.base-button--ghost {
  background-color: transparent;
  color: var(--color-text-secondary);
}

.base-button--ghost:hover:not(.base-button--disabled) {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
}

.base-button--danger {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}

.base-button--danger:hover:not(.base-button--disabled) {
  background-color: var(--color-danger-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--outline {
  background-color: transparent;
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-500);
}

.base-button--outline:hover:not(.base-button--disabled) {
  background-color: var(--color-primary-50);
  border-color: var(--color-primary-600);
}

.base-button--block {
  width: 100%;
}

.loading-spinner {
  width: 1em;
  height: 1em;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.icon-left,
.icon-right {
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
