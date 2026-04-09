<template>
  <div class="base-progress-bar">
    <div v-if="label || showValue" class="base-progress-bar__header">
      <span v-if="label" class="base-progress-bar__label">{{ label }}</span>
      <span v-if="showValue" class="base-progress-bar__value">{{ percentage }}%</span>
    </div>
    
    <div class="base-progress-bar__track" :class="`base-progress-bar__track--${props.size}`">
      <div
        class="base-progress-bar__fill"
        :class="fillClasses"
        :style="fillStyle"
      >
        <span v-if="variant === 'animated'" class="base-progress-bar__shimmer"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'animated'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  variant: 'default',
  size: 'md',
  showValue: true
})

const percentage = computed(() => {
  const result = (props.value / props.max) * 100
  return Math.min(Math.max(result, 0), 100)
})

const fillClasses = computed(() => [
  'base-progress-bar__fill',
  `base-progress-bar__fill--${props.variant}`,
  `base-progress-bar__fill--${props.size}`
])

const fillStyle = computed(() => ({
  width: `${percentage.value}%`
}))
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-progress-bar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.base-progress-bar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
}

.base-progress-bar__label {
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.base-progress-bar__value {
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
  font-family: var(--font-mono);
}

.base-progress-bar__track {
  position: relative;
  width: 100%;
  background-color: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.base-progress-bar__track--sm {
  height: 4px;
}

.base-progress-bar__track--md {
  height: 8px;
}

.base-progress-bar__track--lg {
  height: 12px;
}

.base-progress-bar__fill {
  height: 100%;
  background-color: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-bounce);
  position: relative;
  overflow: hidden;
}

.base-progress-bar__fill--sm {
  height: 4px;
}

.base-progress-bar__fill--md {
  height: 8px;
}

.base-progress-bar__fill--lg {
  height: 12px;
}

.base-progress-bar__fill--success {
  background-color: var(--color-success);
}

.base-progress-bar__fill--danger {
  background-color: var(--color-danger);
}

.base-progress-bar__fill--warning {
  background-color: var(--color-warning);
}

.base-progress-bar__fill--animated {
  background: linear-gradient(
    90deg,
    var(--color-primary-500) 0%,
    var(--color-primary-400) 50%,
    var(--color-primary-500) 100%
  );
  background-size: 200% 100%;
}

.base-progress-bar__shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
