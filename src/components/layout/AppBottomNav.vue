<template>
  <nav class="app-bottom-nav">
    <div class="bottom-nav__content">
      <ul class="bottom-nav__list">
        <li v-for="item in navigationItems" :key="item.path">
          <router-link
            :to="item.path"
            class="bottom-nav__item"
            :class="{ 'bottom-nav__item--active': isActive(item.path) }"
          >
            <div class="bottom-nav__icon">
              <Icon :icon="item.icon" />
              <BaseBadge
                v-if="item.badge"
                :variant="item.badge.variant"
                size="sm"
                dot
                class="nav-badge"
              >
                {{ item.badge.count }}
              </BaseBadge>
            </div>
            <span class="bottom-nav__label">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseBadge from '../base/BaseBadge.vue'

interface NavigationItem {
  path: string
  label: string
  icon: string
  badge?: {
    count: number
    variant: 'default' | 'primary' | 'success' | 'danger' | 'warning'
  }
}

interface Props {
  navigationItems: NavigationItem[]
}

defineProps<Props>()

const route = useRoute()

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.app-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-bg-surface);
  border-top: 1px solid var(--color-border-default);
  z-index: var(--z-sticky);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(255, 255, 255, 0.95);
}

.bottom-nav__content {
  padding: var(--space-2) var(--space-4);
  max-width: 100%;
}

.bottom-nav__list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: var(--space-2);
}

.bottom-nav__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-1);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-default);
  position: relative;
}

.bottom-nav__item:hover {
  background-color: var(--color-neutral-50);
  color: var(--color-text-primary);
}

.bottom-nav__item--active {
  color: var(--portal-accent, var(--color-primary-600));
  background-color: var(--portal-accent, var(--color-primary-50));
}

.bottom-nav__icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-6);
  height: var(--space-6);
}

.bottom-nav__icon svg {
  width: 24px;
  height: 24px;
  transition: all var(--duration-fast) var(--ease-default);
}

.bottom-nav__item--active .bottom-nav__icon svg {
  transform: scale(1.1);
}

.nav-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  z-index: 1;
}

.bottom-nav__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  text-align: center;
  transition: all var(--duration-fast) var(--ease-default);
}

.bottom-nav__item--active .bottom-nav__label {
  font-weight: var(--font-semibold);
}

/* Active state accent line */
.bottom-nav__item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: var(--portal-accent, var(--color-primary-600));
  border-radius: var(--radius-full);
}

/* Touch feedback */
@media (hover: none) {
  .bottom-nav__item:active {
    transform: scale(0.95);
    transition: transform var(--duration-fast) var(--ease-default);
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .bottom-nav__content {
    padding: var(--space-1) var(--space-2);
  }
  
  .bottom-nav__icon svg {
    width: 20px;
    height: 20px;
  }
  
  .bottom-nav__label {
    font-size: 10px;
  }
}

/* Glassmorphism effect */
.app-bottom-nav {
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.05);
}

/* Portal-specific accent colors */
.portal-admin .bottom-nav__item--active {
  color: var(--color-portal-admin);
  background-color: rgba(124, 58, 237, 0.1);
}

.portal-admin .bottom-nav__item--active::before {
  background-color: var(--color-portal-admin);
}

.portal-worker .bottom-nav__item--active {
  color: var(--color-portal-worker);
  background-color: rgba(245, 158, 11, 0.1);
}

.portal-worker .bottom-nav__item--active::before {
  background-color: var(--color-portal-worker);
}
</style>
