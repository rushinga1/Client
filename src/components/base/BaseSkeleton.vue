<template>
  <div :class="skeletonClasses">
    <div v-if="variant === 'text'" class="skeleton-text" :style="textStyles"></div>
    <div v-else-if="variant === 'avatar'" class="skeleton-avatar" :style="avatarStyles"></div>
    <div v-else-if="variant === 'button'" class="skeleton-button" :style="buttonStyles"></div>
    <div v-else-if="variant === 'card'" class="skeleton-card" :style="cardStyles">
      <div v-if="showHeader" class="skeleton-card__header">
        <div class="skeleton-text skeleton-text--title" style="width: 60%; height: 20px;"></div>
        <div class="skeleton-text" style="width: 40px; height: 40px; border-radius: 50%;"></div>
      </div>
      <div class="skeleton-card__content">
        <div v-for="i in lines" :key="i" class="skeleton-text" :style="getLineStyle(i)"></div>
      </div>
      <div v-if="showFooter" class="skeleton-card__footer">
        <div class="skeleton-text" style="width: 80px; height: 16px;"></div>
        <div class="skeleton-text" style="width: 60px; height: 16px;"></div>
      </div>
    </div>
    <div v-else-if="variant === 'table'" class="skeleton-table">
      <div class="skeleton-table__header">
        <div v-for="i in columns" :key="i" class="skeleton-text skeleton-text--header" :style="{ width: getColumnWidth(i) }"></div>
      </div>
      <div v-for="row in rows" :key="row" class="skeleton-table__row">
        <div v-for="col in columns" :key="col" class="skeleton-text" :style="{ width: getColumnWidth(col) }"></div>
      </div>
    </div>
    <div v-else class="skeleton-shape" :style="shapeStyles"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'avatar' | 'button' | 'card' | 'table' | 'shape'
  width?: string | number
  height?: string | number
  lines?: number
  columns?: number
  rows?: number
  showHeader?: boolean
  showFooter?: boolean
  circle?: boolean
  rounded?: boolean
  shimmer?: boolean
  animation?: 'pulse' | 'wave' | 'shimmer' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  lines: 3,
  columns: 4,
  rows: 5,
  showHeader: true,
  showFooter: false,
  circle: false,
  rounded: false,
  shimmer: true,
  animation: 'shimmer'
})

const skeletonClasses = computed(() => [
  'base-skeleton',
  `base-skeleton--${props.variant}`,
  `base-skeleton--${props.animation}`,
  {
    'base-skeleton--circle': props.circle,
    'base-skeleton--rounded': props.rounded,
    'base-skeleton--shimmer': props.shimmer && props.animation !== 'none'
  }
])

const textStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '16px'
}))

const avatarStyles = computed(() => {
  const size = typeof props.width === 'number' ? props.width : 40
  return {
    width: `${size}px`,
    height: `${size}px`
  }
})

const buttonStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '120px',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '40px'
}))

const cardStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || 'auto'
}))

const shapeStyles = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width || '100%',
  height: typeof props.height === 'number' ? `${props.height}px` : props.height || '100%'
}))

const getLineStyle = (lineIndex: number) => {
  const widths = ['100%', '85%', '60%', '75%', '90%']
  const height = lineIndex === 1 ? '18px' : '16px'
  const width = widths[(lineIndex - 1) % widths.length]
  
  return { width, height }
}

const getColumnWidth = (columnIndex: number) => {
  const widths = ['20%', '25%', '30%', '15%', '10%']
  return widths[(columnIndex - 1) % widths.length]
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-skeleton {
  display: inline-block;
  background-color: var(--color-neutral-200);
  border-radius: var(--radius-sm);
  position: relative;
  overflow: hidden;
}

.base-skeleton--circle {
  border-radius: 50%;
}

.base-skeleton--rounded {
  border-radius: var(--radius-md);
}

/* Text skeleton */
.skeleton-text {
  display: block;
  border-radius: var(--radius-sm);
}

.skeleton-text--title {
  border-radius: var(--radius-md);
}

.skeleton-text--header {
  height: 12px;
}

/* Avatar skeleton */
.skeleton-avatar {
  flex-shrink: 0;
}

/* Button skeleton */
.skeleton-button {
  border-radius: var(--radius-md);
}

/* Card skeleton */
.skeleton-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
}

.skeleton-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.skeleton-card__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeleton-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border-default);
}

/* Table skeleton */
.skeleton-table {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeleton-table__header {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  background-color: var(--color-neutral-50);
  border-radius: var(--radius-md);
}

.skeleton-table__row {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
}

/* Shape skeleton */
.skeleton-shape {
  border-radius: var(--radius-md);
}

/* Animations */

/* Pulse animation */
.base-skeleton--pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

/* Wave animation */
.base-skeleton--wave {
  animation: wave 1.5s ease-in-out infinite;
}

@keyframes wave {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Shimmer animation */
.base-skeleton--shimmer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.6) 60%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-card {
    padding: var(--space-3);
  }
  
  .skeleton-table__header,
  .skeleton-table__row {
    padding: var(--space-2);
    gap: var(--space-2);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .base-skeleton {
    background-color: var(--color-neutral-700);
  }
  
  .base-skeleton--shimmer::before {
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.2) 60%,
      transparent 100%
    );
  }
}

/* Loading state variations */
.base-skeleton--loading {
  min-height: 20px;
}

.base-skeleton--loading.skeleton-text {
  min-height: 16px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .base-skeleton {
    background-color: var(--color-neutral-300);
    border: 1px solid var(--color-neutral-400);
  }
  
  .base-skeleton--shimmer::before {
    background: linear-gradient(
      90deg,
      transparent 0%,
      var(--color-neutral-400) 50%,
      transparent 100%
    );
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .base-skeleton--pulse,
  .base-skeleton--wave,
  .base-skeleton--shimmer::before {
    animation: none;
  }
  
  .base-skeleton {
    opacity: 0.6;
  }
}
</style>
