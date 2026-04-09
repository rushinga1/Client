<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="base-modal-overlay"
        @click="handleOverlayClick"
      >
        <div
          class="base-modal"
          :class="modalClasses"
          @click.stop
        >
          <div v-if="$slots.header || title" class="base-modal__header">
            <div class="base-modal__title">
              <slot name="header">
                <h2>{{ title }}</h2>
              </slot>
            </div>
            <button
              v-if="!persistent"
              class="base-modal__close"
              @click="handleClose"
              aria-label="Close modal"
            >
              <Icon icon="ph:x" />
            </button>
          </div>
          
          <div class="base-modal__body" :class="bodyClasses">
            <slot />
          </div>
          
          <div v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, useSlots } from 'vue'
import { Icon } from '@iconify/vue'

const slots = useSlots()

interface Props {
  modelValue: boolean
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  persistent?: boolean
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  persistent: false,
  closeOnEscape: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const modalClasses = computed(() => [
  'base-modal',
  `base-modal--${props.size}`
])

const bodyClasses = computed(() => ({
  'base-modal__body--no-header': !props.title && !slots.header,
  'base-modal__body--no-footer': !slots.footer
}))

const handleClose = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.persistent) {
    handleClose()
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.modelValue && props.closeOnEscape) {
    handleClose()
  }
}

onMounted(() => {
  if (props.closeOnEscape) {
    document.addEventListener('keydown', handleEscape)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--space-4);
  backdrop-filter: blur(8px); /* Increased blur for better focus */
}

.base-modal {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-2xl); /* Smoother, larger radius */
  box-shadow: var(--shadow-xl), 0 0 0 1px rgba(0, 0, 0, 0.05);
  max-height: 85vh; /* Ensure modal stays within viewport */
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow: hidden; /* Critical: clip internal scroll */
  border: 1px solid rgba(255, 255, 255, 0.3); /* Premium border edge */
}

.base-modal--sm {
  max-width: 400px;
}

.base-modal--md {
  max-width: 500px;
}

.base-modal--lg {
  max-width: 700px;
}

.base-modal--xl {
  max-width: 900px;
}

.base-modal--full {
  max-width: 100%;
  max-height: 100vh;
  border-radius: 0;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-8) var(--space-8) var(--space-6); /* Significantly more top padding */
  border-bottom: 1px solid var(--color-border-default);
  background-color: rgba(255, 255, 255, 0.75); /* Translucent for glass effect */
  backdrop-filter: blur(16px) saturate(180%);
  position: relative;
  z-index: 10;
  flex-shrink: 0; /* Header doesn't shrink */
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.08); /* Subtle separation */
}

.base-modal__header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.base-modal__title {
  flex: 1;
  text-align: center; /* Center the title for ultra visibility */
}

.base-modal__title h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-2xl); /* Larger, more readable title */
  font-weight: var(--font-extrabold);
  color: var(--color-primary-900); /* High-contrast branded color */
  line-height: var(--leading-tight);
}

.base-modal__close {
  position: absolute; /* Lock to side so centered title isn't crowded */
  right: var(--space-6);
  top: 50%;
  transform: translateY(-50%);
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

.base-modal__close:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
}

.base-modal__body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

.base-modal__body--no-header {
  padding-top: var(--space-6);
}

.base-modal__body--no-footer {
  padding-bottom: var(--space-6);
}

.base-modal__footer {
  padding: var(--space-6) var(--space-8);
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
  flex-shrink: 0; /* Footer doesn't shrink */
  z-index: 10;
  box-shadow: 0 -4px 6px -4px rgba(0, 0, 0, 0.05); /* Subtle separation */
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .base-modal,
.modal-leave-to .base-modal {
  transform: translateY(30px) scale(0.98); /* Slide up and grow slightly */
  opacity: 0;
}

.modal-enter-active .base-modal,
.modal-leave-active .base-modal {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); /* Ultra-smooth Ease-Out-Expo */
}
</style>
