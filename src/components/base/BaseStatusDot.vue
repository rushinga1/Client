<template>
  <span :class="dotClasses" :title="title">
    <span class="base-status-dot__inner"></span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  status: 'active' | 'pending' | 'banned' | 'offline'
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  pulse: true
})

const dotClasses = computed(() => [
  'base-status-dot',
  `base-status-dot--${props.status}`,
  `base-status-dot--${props.size}`,
  {
    'base-status-dot--pulse': props.pulse && props.status === 'active'
  }
])

const title = computed(() => {
  const titles = {
    active: 'Active',
    pending: 'Pending',
    banned: 'Banned',
    offline: 'Offline'
  }
  return titles[props.status]
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-status-dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.base-status-dot--sm {
  width: var(--space-3);
  height: var(--space-3);
}

.base-status-dot--md {
  width: var(--space-4);
  height: var(--space-4);
}

.base-status-dot--lg {
  width: var(--space-5);
  height: var(--space-5);
}

.base-status-dot__inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  transition: all var(--duration-fast) var(--ease-default);
}

/* Status colors */
.base-status-dot--active .base-status-dot__inner {
  background-color: var(--color-success);
}

.base-status-dot--pending .base-status-dot__inner {
  background-color: var(--color-warning);
}

.base-status-dot--banned .base-status-dot__inner {
  background-color: var(--color-danger);
}

.base-status-dot--offline .base-status-dot__inner {
  background-color: var(--color-neutral-400);
}

/* Pulse animation for active status */
.base-status-dot--pulse .base-status-dot__inner {
  position: relative;
}

.base-status-dot--pulse .base-status-dot__inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--color-success);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
