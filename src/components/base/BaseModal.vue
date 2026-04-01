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
import { computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

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
  'base-modal__body--no-header': !props.title && !props.$slots?.header,
  'base-modal__body--no-footer': !props.$slots?.footer
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
}

.base-modal {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
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
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}

.base-modal__title h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.base-modal__close {
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
  padding: var(--space-6);
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
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
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.modal-enter-active .base-modal,
.modal-leave-active .base-modal {
  transition: all var(--duration-normal) var(--ease-bounce);
}
</style>
