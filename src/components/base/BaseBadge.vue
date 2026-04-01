<template>
  <span :class="badgeClasses">
    <span v-if="dot" class="base-badge__dot"></span>
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  dot: false
})

const badgeClasses = computed(() => [
  'base-badge',
  `base-badge--${props.variant}`,
  `base-badge--${props.size}`,
  {
    'base-badge--dot': props.dot
  }
])
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  white-space: nowrap;
}

.base-badge--sm {
  padding: var(--space-1) var(--space-2);
  font-size: 10px;
}

.base-badge--md {
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}

.base-badge--lg {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.base-badge--default {
  background-color: var(--color-neutral-100);
  color: var(--color-text-secondary);
}

.base-badge--primary {
  background-color: var(--color-primary-100);
  color: var(--color-primary-700);
}

.base-badge--success {
  background-color: var(--color-success-light);
  color: var(--color-success-dark);
}

.base-badge--danger {
  background-color: var(--color-danger-light);
  color: var(--color-danger-dark);
}

.base-badge--warning {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.base-badge--info {
  background-color: var(--color-info-light);
  color: var(--color-info-dark);
}

.base-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: currentColor;
}

.base-badge--dot {
  padding: var(--space-2);
  border-radius: var(--radius-full);
}
</style>
