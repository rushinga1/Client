<template>
  <div class="base-pin-input">
    <div class="base-pin-input__inputs">
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => inputRefs[index] = el"
        :value="digit"
        :type="mask ? 'password' : 'text'"
        :class="inputClasses"
        :maxlength="1"
        :disabled="disabled"
        v-bind="$attrs"
        @input="handleInput(index, $event)"
        @keydown="handleKeydown(index, $event)"
        @paste="handlePaste"
        @focus="handleFocus(index)"
      />
    </div>
    
    <div v-if="error" class="base-pin-input__error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
  modelValue: string
  length?: number
  mask?: boolean
  disabled?: boolean
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  length: 4,
  mask: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  complete: [value: string]
}>()

const inputRefs = ref<(HTMLInputElement | null)[]>([])

const digits = computed(() => {
  return props.modelValue.split('').concat(Array(props.length - props.modelValue.length).fill(''))
})

const inputClasses = computed(() => [
  'base-pin-input__input',
  {
    'base-pin-input__input--error': !!props.error,
    'base-pin-input__input--disabled': props.disabled
  }
])

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value.slice(-1) // Take only the last character
  
  const newDigits = [...digits.value]
  newDigits[index] = value
  const newValue = newDigits.join('')
  
  emit('update:modelValue', newValue)
  
  // Move to next input if current one is filled
  if (value && index < props.length - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
  
  // Check if complete
  if (newValue.length === props.length) {
    emit('complete', newValue)
  }
}

const handleKeydown = (index: number, event: KeyboardEvent) => {
  const target = event.target as HTMLInputElement
  
  // Handle backspace
  if (event.key === 'Backspace' && !target.value && index > 0) {
    event.preventDefault()
    const newDigits = [...digits.value]
    newDigits[index - 1] = ''
    const newValue = newDigits.join('')
    emit('update:modelValue', newValue)
    
    nextTick(() => {
      inputRefs.value[index - 1]?.focus()
    })
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    inputRefs.value[index - 1]?.focus()
  }
  
  if (event.key === 'ArrowRight' && index < props.length - 1) {
    event.preventDefault()
    inputRefs.value[index + 1]?.focus()
  }
}

const handlePaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''
  const cleanData = pastedData.replace(/\D/g, '').slice(0, props.length)
  
  emit('update:modelValue', cleanData)
  
  if (cleanData.length === props.length) {
    emit('complete', cleanData)
  } else {
    // Focus on the next empty input
    const nextEmptyIndex = cleanData.length
    nextTick(() => {
      inputRefs.value[nextEmptyIndex]?.focus()
    })
  }
}

const handleFocus = (index: number) => {
  inputRefs.value[index]?.select()
}

// Watch for external value changes
watch(() => props.modelValue, (newValue) => {
  if (newValue.length === props.length) {
    emit('complete', newValue)
  }
})

// Expose focus method
defineExpose({
  focus: (index = 0) => {
    inputRefs.value[index]?.focus()
  },
  clear: () => {
    emit('update:modelValue', '')
    inputRefs.value[0]?.focus()
  }
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-pin-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.base-pin-input__inputs {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
}

.base-pin-input__input {
  width: var(--space-12);
  height: var(--space-12);
  text-align: center;
  border: 2px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  line-height: 1;
  transition: all var(--duration-fast) var(--ease-default);
}

.base-pin-input__input:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.base-pin-input__input--error {
  border-color: var(--color-border-danger);
}

.base-pin-input__input--error:focus {
  box-shadow: var(--shadow-focus-danger);
}

.base-pin-input__input--disabled {
  background-color: var(--color-bg-sunken);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.base-pin-input__error {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-danger);
  text-align: center;
  line-height: var(--leading-snug);
}
</style>
