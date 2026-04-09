<template>
  <div class="language-switcher" :class="{ 'language-switcher--compact': compact }">
    <button
      class="language-switcher__trigger"
      @click="toggleDropdown"
      :class="{ 'language-switcher__trigger--active': isOpen }"
    >
      <Icon icon="ph:translate" />
      <span v-if="!compact">{{ currentLanguageLabel }}</span>
      <Icon icon="ph:caret-down" class="dropdown-arrow" />
    </button>
    
    <Transition name="dropdown">
      <div v-if="isOpen" class="language-switcher__dropdown">
        <ul class="language-list">
          <li v-for="locale in availableLocales" :key="locale.code">
            <button
              class="language-option"
              :class="{ 'language-option--active': locale.code === currentLocale }"
              @click="selectLanguage(locale.code)"
            >
              <span class="language-option__flag">{{ locale.flag }}</span>
              <span class="language-option__name">{{ locale.name }}</span>
              <span class="language-option__native">{{ locale.native }}</span>
              <Icon
                v-if="locale.code === currentLocale"
                icon="ph:check"
                class="language-option__check"
              />
            </button>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import { locale as activeLocale, setLocale, availableLocales } from '../../i18n'

interface Props {
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  compact: false
})

const isOpen = ref(false)

const currentLocale = computed(() => activeLocale.value)

const currentLanguageLabel = computed(() => {
  const current = (availableLocales as readonly any[]).find(l => l.code === currentLocale.value)
  return current?.native || current?.name || 'Language'
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (code: any) => {
  setLocale(code)
  isOpen.value = false
}

const closeDropdown = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.language-switcher {
  position: relative;
  display: inline-block;
}

.language-switcher--compact {
  width: auto;
}

.language-switcher__trigger {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  white-space: nowrap;
}

.language-switcher--compact .language-switcher__trigger {
  padding: var(--space-2);
}

.language-switcher__trigger:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
  border-color: var(--color-border-strong);
}

.language-switcher__trigger--active {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.dropdown-arrow {
  transition: transform var(--duration-fast) var(--ease-default);
}

.language-switcher__trigger--active .dropdown-arrow {
  transform: rotate(180deg);
}

.language-switcher__dropdown {
  position: absolute;
  top: calc(100% + var(--space-2));
  right: 0;
  min-width: 200px;
  background-color: var(--color-bg-surface);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  overflow: hidden;
}

.language-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
}

.language-option {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-snug);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  text-align: left;
}

.language-option:hover {
  background-color: var(--color-neutral-50);
}

.language-option--active {
  background-color: var(--color-primary-50);
  color: var(--color-primary-700);
}

.language-option__flag {
  font-size: var(--text-lg);
  line-height: 1;
  flex-shrink: 0;
}

.language-option__name {
  flex: 1;
  font-weight: var(--font-medium);
}

.language-option__native {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-style: italic;
}

.language-option__check {
  color: var(--color-primary-600);
  flex-shrink: 0;
}

/* Dropdown transitions */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* Compact mode adjustments */
.language-switcher--compact .language-switcher__dropdown {
  right: 0;
  left: auto;
}

.language-switcher--compact .language-option {
  padding: var(--space-2) var(--space-3);
  gap: var(--space-2);
}

.language-switcher--compact .language-option__native {
  display: none;
}
</style>
