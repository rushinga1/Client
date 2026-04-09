<template>
  <div class="base-input" :class="{ 'base-input--error': error }">
    <label v-if="label" :for="inputId" class="base-input__label">
      {{ label }}
    </label>
    
    <div class="base-input__wrapper">
      <span v-if="prefix" class="base-input__prefix">{{ prefix }}</span>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        v-bind="$attrs"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <span v-if="suffix" class="base-input__suffix">{{ suffix }}</span>
    </div>
    
    <div v-if="error || hint" class="base-input__message">
      <span v-if="error" class="base-input__error">{{ error }}</span>
      <span v-else-if="hint" class="base-input__hint">{{ hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: 'text' | 'number' | 'password' | 'email' | 'tel' | 'date'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  prefix?: string
  suffix?: string
  disabled?: boolean
  readonly?: boolean
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  readonly: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const isFocused = ref(false)
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => [
  'base-input__field',
  {
    'base-input__field--focused': isFocused.value,
    'base-input__field--disabled': props.disabled,
    'base-input__field--error': !!props.error
  }
])

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.base-input__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.base-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input__field {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  transition: all var(--duration-fast) var(--ease-default);
}

.base-input__field::placeholder {
  color: var(--color-text-disabled);
}

.base-input__field:focus {
  outline: none;
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.base-input__field--error {
  border-color: var(--color-border-danger);
}

.base-input__field--error:focus {
  box-shadow: var(--shadow-focus-danger);
}

.base-input__field--disabled {
  background-color: var(--color-bg-sunken);
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.base-input__field--disabled::placeholder {
  color: var(--color-text-disabled);
}

.base-input__prefix,
.base-input__suffix {
  position: absolute;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.base-input__prefix {
  left: var(--space-3);
}

.base-input__suffix {
  right: var(--space-3);
}

.base-input__field:has(+ .base-input__suffix) {
  padding-right: var(--space-8);
}

.base-input__field:has(~ .base-input__prefix) {
  padding-left: var(--space-8);
}

.base-input__message {
  font-size: var(--text-xs);
  line-height: var(--leading-snug);
}

.base-input__error {
  color: var(--color-danger);
}

.base-input__hint {
  color: var(--color-text-secondary);
}
</style>
