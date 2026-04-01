<template>
  <div
    :class="cardClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </div>
    
    <div class="base-card__body" :class="bodyClasses">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hoverable: false,
  clickable: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const cardClasses = computed(() => [
  'base-card',
  `base-card--${props.variant}`,
  `base-card--padding-${props.padding}`,
  {
    'base-card--hoverable': props.hoverable,
    'base-card--clickable': props.clickable
  }
])

const bodyClasses = computed(() => ({
  'base-card__body--padded': props.padding !== 'none'
}))

const handleClick = (event: MouseEvent) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-card {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-normal) var(--ease-default);
}

.base-card--default {
  border: 1px solid var(--color-border-default);
}

.base-card--outlined {
  border: 1px solid var(--color-border-strong);
  background-color: transparent;
}

.base-card--elevated {
  border: none;
  box-shadow: var(--shadow-sm);
}

.base-card--glass {
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.base-card--hoverable:hover,
.base-card--clickable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.base-card--clickable {
  cursor: pointer;
}

.base-card--elevated:hover {
  box-shadow: var(--shadow-lg);
}

.base-card__header {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}

.base-card__body {
  position: relative;
}

.base-card__body--padded {
  padding: var(--space-6);
}

.base-card--padding-sm .base-card__body--padded {
  padding: var(--space-3);
}

.base-card--padding-md .base-card__body--padded {
  padding: var(--space-4);
}

.base-card--padding-lg .base-card__body--padded {
  padding: var(--space-6);
}

.base-card--padding-xl .base-card__body--padded {
  padding: var(--space-8);
}

.base-card__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}
</style>
