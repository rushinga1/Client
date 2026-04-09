<template>
  <Teleport to="body">
    <Transition name="bottom-sheet">
      <div
        v-if="modelValue"
        class="base-bottom-sheet"
        @click="handleOverlayClick"
      >
        <div
          ref="sheetRef"
          class="bottom-sheet__panel"
          :class="panelClasses"
          :style="panelStyles"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <!-- Handle -->
          <div class="bottom-sheet__handle" @click="handleHandleClick">
            <div class="handle-bar"></div>
          </div>
          
          <!-- Header -->
          <div v-if="$slots.header || title" class="bottom-sheet__header">
            <div class="bottom-sheet__title">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </div>
            <button
              v-if="showClose"
              class="bottom-sheet__close"
              @click="handleClose"
              aria-label="Close bottom sheet"
            >
              <Icon icon="ph:x" />
            </button>
          </div>
          
          <!-- Content -->
          <div class="bottom-sheet__content" :class="contentClasses">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="bottom-sheet__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted, useSlots } from 'vue'
import { Icon } from '@iconify/vue'

const slots = useSlots()

interface SnapPoint {
  label: string
  height: number | string
  default?: boolean
}

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  snapPoints?: SnapPoint[]
  showClose?: boolean
  closeOnOverlay?: boolean
  disableSwipe?: boolean
  maxSnapPoints?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  snapPoints: () => [
    { label: 'compact', height: '25%', default: true },
    { label: 'half', height: '50%' },
    { label: 'full', height: '90%' }
  ],
  showClose: true,
  closeOnOverlay: true,
  disableSwipe: false,
  maxSnapPoints: 3
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  'snap-change': [snapPoint: SnapPoint]
}>()

// State
const sheetRef = ref<HTMLElement>()
const currentSnapIndex = ref(0)
const isDragging = ref(false)
const startY = ref(0)
const currentY = ref(0)
const sheetHeight = ref(0)

// Computed
const panelClasses = computed(() => [
  'bottom-sheet__panel',
  `bottom-sheet__panel--${props.size}`,
  {
    'bottom-sheet__panel--dragging': isDragging.value,
    'bottom-sheet__panel--no-swipe': props.disableSwipe
  }
])

const contentClasses = computed(() => ({
  'bottom-sheet__content--no-header': !props.title && !slots.header,
  'bottom-sheet__content--no-footer': !slots.footer
}))

const currentSnapPoint = computed(() => props.snapPoints[currentSnapIndex.value])

const panelStyles = computed(() => {
  const height = typeof currentSnapPoint.value.height === 'string'
    ? currentSnapPoint.value.height
    : `${currentSnapPoint.value.height}px`
  
  return {
    height: isDragging.value ? `${sheetHeight.value}px` : height,
    transform: isDragging.value ? `translateY(${currentY.value}px)` : 'translateY(0)'
  }
})

// Methods
const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    handleClose()
  }
}

const handleHandleClick = () => {
  // Cycle through snap points when handle is clicked
  const nextIndex = (currentSnapIndex.value + 1) % props.snapPoints.length
  setSnapPoint(nextIndex)
}

const setSnapPoint = (index: number) => {
  if (index >= 0 && index < props.snapPoints.length) {
    currentSnapIndex.value = index
    emit('snap-change', props.snapPoints[index])
  }
}

const snapToNearest = (velocity: number = 0) => {
  const snapPoints = props.snapPoints
  const snapHeight = sheetHeight.value
  const maxHeight = window.innerHeight
  
  // Find closest snap point
  let closestIndex = 0
  let closestDistance = Math.abs(snapHeight - getSnapHeight(snapPoints[0]))
  
  for (let i = 1; i < snapPoints.length; i++) {
    const distance = Math.abs(snapHeight - getSnapHeight(snapPoints[i]))
    if (distance < closestDistance) {
      closestDistance = distance
      closestIndex = i
    }
  }
  
  // Consider velocity for swipe gestures
  if (Math.abs(velocity) > 0.5) {
    if (velocity > 0 && closestIndex < snapPoints.length - 1) {
      closestIndex++
    } else if (velocity < 0 && closestIndex > 0) {
      closestIndex--
    }
  }
  
  // Close if swiped down significantly
  if (snapHeight < maxHeight * 0.1 || (velocity < -1 && closestIndex === 0)) {
    handleClose()
  } else {
    setSnapPoint(closestIndex)
  }
}

const getSnapHeight = (snapPoint: SnapPoint) => {
  const maxHeight = window.innerHeight
  return typeof snapPoint.height === 'string'
    ? (parseFloat(snapPoint.height) / 100) * maxHeight
    : snapPoint.height
}

// Touch handlers
const handleTouchStart = (event: TouchEvent) => {
  if (props.disableSwipe) return
  
  const touch = event.touches[0]
  startY.value = touch.clientY
  isDragging.value = true
  
  // Set initial sheet height
  const snapHeight = getSnapHeight(currentSnapPoint.value)
  sheetHeight.value = snapHeight
  currentY.value = 0
}

const handleTouchMove = (event: TouchEvent) => {
  if (!isDragging.value || props.disableSwipe) return
  
  event.preventDefault()
  const touch = event.touches[0]
  const deltaY = touch.clientY - startY.value
  
  // Only allow dragging down from current position
  if (deltaY > 0) {
    currentY.value = deltaY
    sheetHeight.value = getSnapHeight(currentSnapPoint.value) + deltaY
  }
}

const handleTouchEnd = (event: TouchEvent) => {
  if (!isDragging.value || props.disableSwipe) return
  
  const touch = event.changedTouches[0]
  const deltaY = touch.clientY - startY.value
  const deltaTime = Date.now() - (event.timeStamp || 0)
  const velocity = deltaY / Math.max(deltaTime, 1)
  
  isDragging.value = false
  currentY.value = 0
  
  snapToNearest(velocity)
}

// Keyboard handling
const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue) {
    handleClose()
  }
}

// Initialize default snap point
onMounted(() => {
  const defaultIndex = props.snapPoints.findIndex(point => point.default)
  if (defaultIndex !== -1) {
    currentSnapIndex.value = defaultIndex
  }
  
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-bottom-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-overlay);
  z-index: var(--z-modal);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.bottom-sheet__panel {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: height var(--duration-normal) var(--ease-bounce), transform var(--duration-fast) var(--ease-default);
  overflow: hidden;
}

.bottom-sheet__panel--dragging {
  transition: none;
}

.bottom-sheet__panel--sm {
  max-height: 40vh;
}

.bottom-sheet__panel--md {
  max-height: 60vh;
}

.bottom-sheet__panel--lg {
  max-height: 80vh;
}

.bottom-sheet__panel--full {
  max-height: 95vh;
  border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
}

.bottom-sheet__handle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-3) var(--space-4);
  cursor: grab;
  user-select: none;
}

.bottom-sheet__handle:active {
  cursor: grabbing;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background-color: var(--color-neutral-300);
  border-radius: var(--radius-full);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.bottom-sheet__handle:hover .handle-bar {
  background-color: var(--color-neutral-400);
}

.bottom-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}

.bottom-sheet__title h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.bottom-sheet__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  border: none;
  background: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.bottom-sheet__close:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
}

.bottom-sheet__close svg {
  width: 20px;
  height: 20px;
}

.bottom-sheet__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

.bottom-sheet__content--no-header {
  padding-top: var(--space-6);
}

.bottom-sheet__content--no-footer {
  padding-bottom: var(--space-6);
}

.bottom-sheet__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}

/* Bottom sheet transitions */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-from .bottom-sheet__panel,
.bottom-sheet-leave-to .bottom-sheet__panel {
  transform: translateY(100%);
}

.bottom-sheet-enter-active .bottom-sheet__panel,
.bottom-sheet-leave-active .bottom-sheet__panel {
  transition: transform var(--duration-normal) var(--ease-bounce);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .bottom-sheet__panel {
    border-radius: var(--radius-2xl) var(--radius-2xl) 0 0;
  }
  
  .bottom-sheet__header,
  .bottom-sheet__content,
  .bottom-sheet__footer {
    padding-left: var(--space-4);
    padding-right: var(--space-4);
  }
  
  .bottom-sheet__content {
    padding-top: var(--space-4);
    padding-bottom: var(--space-4);
  }
}

@media (max-width: 480px) {
  .bottom-sheet__header,
  .bottom-sheet__content,
  .bottom-sheet__footer {
    padding-left: var(--space-3);
    padding-right: var(--space-3);
  }
  
  .bottom-sheet__title h2 {
    font-size: var(--text-lg);
  }
}

/* Touch feedback */
@media (hover: none) {
  .bottom-sheet__handle:active .handle-bar {
    background-color: var(--color-neutral-500);
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .bottom-sheet__panel {
    transition: none;
  }
  
  .bottom-sheet-enter-active,
  .bottom-sheet-leave-active {
    transition: opacity var(--duration-normal) var(--ease-default);
  }
  
  .bottom-sheet-enter-active .bottom-sheet__panel,
  .bottom-sheet-leave-active .bottom-sheet__panel {
    transition: none;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bottom-sheet__panel {
    border: 2px solid var(--color-border-strong);
  }
  
  .handle-bar {
    background-color: var(--color-text-primary);
  }
}
</style>
