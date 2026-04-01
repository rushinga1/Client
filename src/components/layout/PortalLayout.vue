<template>
  <div class="portal-layout" :class="layoutClasses">
    <!-- Desktop Sidebar -->
    <AppSidebar
      v-if="!isMobile"
      :collapsed="sidebarCollapsed"
      :user="currentUser"
      :navigation-items="navigationItems"
      @toggle-collapse="toggleSidebar"
      @logout="handleLogout"
    />
    
    <!-- Main Content Area -->
    <main class="portal-layout__main" :class="{ 'portal-layout__main--sidebar-collapsed': sidebarCollapsed && !isMobile }">
      <!-- Mobile Top Bar -->
      <header v-if="isMobile" class="portal-layout__mobile-header">
        <div class="mobile-header__content">
          <div class="mobile-header__logo">
            <div class="logo-icon">
              <Icon icon="ph:recycle" />
            </div>
            <span class="logo-text">Agruni</span>
          </div>
          
          <div class="mobile-header__actions">
            <BaseLanguageSwitcher :compact="true" />
            <BaseButton variant="ghost" size="sm" @click="toggleMobileMenu">
              <Icon icon="ph:list" />
            </BaseButton>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <div class="portal-layout__content">
        <slot />
      </div>
    </main>
    
    <!-- Mobile Bottom Navigation -->
    <AppBottomNav
      v-if="isMobile"
      :navigation-items="navigationItems"
    />
    
    <!-- Mobile Menu Overlay -->
    <div
      v-if="isMobile && mobileMenuOpen"
      class="portal-layout__mobile-overlay"
      @click="closeMobileMenu"
    >
      <div class="mobile-menu" @click.stop>
        <div class="mobile-menu__header">
          <div class="mobile-menu__user">
            <div class="user-avatar">
              <img
                v-if="currentUser.avatar"
                :src="currentUser.avatar"
                :alt="currentUser.name"
                class="avatar-img"
              />
              <div v-else class="avatar-placeholder">
                <Icon icon="ph:user" />
              </div>
            </div>
            <div class="user-info">
              <div class="user-name">{{ currentUser.name }}</div>
              <div class="user-role">{{ currentUser.role }}</div>
            </div>
          </div>
          
          <BaseButton variant="ghost" size="sm" @click="closeMobileMenu">
            <Icon icon="ph:x" />
          </BaseButton>
        </div>
        
        <nav class="mobile-menu__nav">
          <ul class="mobile-nav-list">
            <li v-for="item in navigationItems" :key="item.path">
              <router-link
                :to="item.path"
                class="mobile-nav-item"
                :class="{ 'mobile-nav-item--active': isActive(item.path) }"
                @click="closeMobileMenu"
              >
                <div class="mobile-nav-item__icon">
                  <Icon :icon="item.icon" />
                </div>
                <span class="mobile-nav-item__label">{{ item.label }}</span>
                <BaseBadge
                  v-if="item.badge"
                  :variant="item.badge.variant"
                  size="sm"
                >
                  {{ item.badge.count }}
                </BaseBadge>
              </router-link>
            </li>
          </ul>
        </nav>
        
        <div class="mobile-menu__footer">
          <BaseButton variant="ghost" size="sm" @click="handleLogout" class="logout-btn">
            <Icon icon="ph:sign-out" />
            <span>{{ $t('nav.logout') }}</span>
          </BaseButton>
        </div>
      </div>
    </div>
    
    <!-- Toast Container -->
    <div class="portal-layout__toast-container">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['portal-toast', `portal-toast--${toast.type}`]"
        >
          <div class="toast-icon">
            <Icon :icon="getToastIcon(toast.type)" />
          </div>
          <div class="toast-content">
            <span class="toast-message">{{ toast.message }}</span>
            <button
              v-if="!toast.persistent"
              class="toast-close"
              @click="removeToast(toast.id)"
            >
              <Icon icon="ph:x" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useI18n } from 'vue-i18n'
import AppSidebar from './AppSidebar.vue'
import AppBottomNav from './AppBottomNav.vue'
import BaseButton from '../base/BaseButton.vue'
import BaseBadge from '../base/BaseBadge.vue'
import BaseLanguageSwitcher from '../base/BaseLanguageSwitcher.vue'
import { useUIStore } from '../../stores/ui.store'
import { useAuthStore } from '../../stores/auth.store'
import { useToast } from '../../composables/useToast'

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
  portalType?: 'user' | 'admin' | 'worker'
  navigationItems?: NavigationItem[]
}

const props = withDefaults(defineProps<Props>(), {
  portalType: 'user',
  navigationItems: () => [
    { path: '/dashboard', label: 'Dashboard', icon: 'ph:house' },
    { path: '/payments', label: 'Payments', icon: 'ph:credit-card' },
    { path: '/history', label: 'History', icon: 'ph:clock-counter-clockwise' },
    { path: '/profile', label: 'Profile', icon: 'ph:user' }
  ]
})

const route = useRoute()
const { t } = useI18n()
const uiStore = useUIStore()
const authStore = useAuthStore()
const toast = useToast()

// State
const mobileMenuOpen = ref(false)

// Computed
const isMobile = computed(() => uiStore.isMobile)
const sidebarCollapsed = computed(() => uiStore.sidebarCollapsed)
const currentUser = computed(() => authStore.user || { name: 'User', role: 'user' })
const toasts = computed(() => toast.toasts)

const layoutClasses = computed(() => [
  `portal-${props.portalType}`,
  {
    'portal-layout--mobile': isMobile.value,
    'portal-layout--desktop': !isMobile.value,
    'portal-layout--sidebar-collapsed': sidebarCollapsed.value && !isMobile.value
  }
])

// Methods
const toggleSidebar = () => {
  uiStore.toggleSidebar()
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const handleLogout = async () => {
  await authStore.logout()
}

const removeToast = (id: string) => {
  toast.removeToast(id)
}

const getToastIcon = (type: string) => {
  const icons = {
    success: 'ph:check-circle',
    error: 'ph:x-circle',
    warning: 'ph:warning',
    info: 'ph:info'
  }
  return icons[type as keyof typeof icons] || 'ph:info'
}

// Responsive handling
const handleResize = () => {
  uiStore.setMobile(window.innerWidth < 768)
  if (window.innerWidth < 768) {
    uiStore.setSidebarCollapsed(true)
  }
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  
  // Initialize responsive behavior
  const cleanup = uiStore.initResponsive()
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    cleanup()
  })
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.portal-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-bg-base);
  position: relative;
}

.portal-layout--desktop {
  flex-direction: row;
}

.portal-layout--mobile {
  flex-direction: column;
}

/* Main Content Area */
.portal-layout__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 280px;
  transition: margin-left var(--duration-normal) var(--ease-default);
}

.portal-layout__main--sidebar-collapsed {
  margin-left: 80px;
}

.portal-layout--mobile .portal-layout__main {
  margin-left: 0;
  margin-bottom: 60px; /* Space for bottom nav */
}

/* Mobile Header */
.portal-layout__mobile-header {
  display: none;
  background-color: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-border-default);
  padding: var(--space-3) var(--space-4);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}

.portal-layout--mobile .portal-layout__mobile-header {
  display: block;
}

.mobile-header__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-header__logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  border-radius: var(--radius-md);
  background-color: var(--portal-accent, var(--color-primary-500));
  color: var(--color-text-inverse);
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.logo-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.mobile-header__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Content Area */
.portal-layout__content {
  flex: 1;
  padding: var(--space-6);
  overflow-y: auto;
}

.portal-layout--mobile .portal-layout__content {
  padding: var(--space-4);
}

/* Mobile Menu Overlay */
.portal-layout__mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--color-bg-overlay);
  z-index: var(--z-modal);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--space-4);
}

.mobile-menu {
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  width: 320px;
  max-width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--color-border-default);
}

.mobile-menu__user {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.user-avatar {
  width: var(--space-10);
  height: var(--space-10);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--color-neutral-200);
  color: var(--color-text-secondary);
}

.avatar-placeholder svg {
  width: 20px;
  height: 20px;
}

.user-info {
  flex: 1;
}

.user-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.user-role {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.mobile-menu__nav {
  flex: 1;
  padding: var(--space-2);
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all var(--duration-fast) var(--ease-default);
}

.mobile-nav-item:hover {
  background-color: var(--color-neutral-50);
  color: var(--color-text-primary);
}

.mobile-nav-item--active {
  background-color: var(--portal-accent, var(--color-primary-50));
  color: var(--portal-accent, var(--color-primary-700));
}

.mobile-nav-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-6);
  height: var(--space-6);
  flex-shrink: 0;
}

.mobile-nav-item__icon svg {
  width: 20px;
  height: 20px;
}

.mobile-nav-item__label {
  flex: 1;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
}

.mobile-menu__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-default);
}

.logout-btn {
  width: 100%;
  justify-content: flex-start;
  gap: var(--space-3);
}

/* Toast Container */
.portal-layout__toast-container {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  z-index: var(--z-toast);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}

.portal-toast {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  background-color: var(--color-bg-surface);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-default);
  pointer-events: all;
  min-width: 300px;
  max-width: 400px;
}

.portal-toast--success {
  border-color: var(--color-success);
  background-color: var(--color-success-light);
}

.portal-toast--error {
  border-color: var(--color-danger);
  background-color: var(--color-danger-light);
}

.portal-toast--warning {
  border-color: var(--color-warning);
  background-color: var(--color-warning-light);
}

.portal-toast--info {
  border-color: var(--color-info);
  background-color: var(--color-info-light);
}

.toast-icon {
  flex-shrink: 0;
  width: var(--space-5);
  height: var(--space-5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
}

.portal-toast--success .toast-icon {
  background-color: var(--color-success);
  color: var(--color-text-inverse);
}

.portal-toast--error .toast-icon {
  background-color: var(--color-danger);
  color: var(--color-text-inverse);
}

.portal-toast--warning .toast-icon {
  background-color: var(--color-warning);
  color: var(--color-text-inverse);
}

.portal-toast--info .toast-icon {
  background-color: var(--color-info);
  color: var(--color-text-inverse);
}

.toast-icon svg {
  width: 16px;
  height: 16px;
}

.toast-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.toast-message {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  color: var(--color-text-primary);
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-6);
  height: var(--space-6);
  border: none;
  background: none;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.toast-close:hover {
  background-color: var(--color-neutral-100);
  color: var(--color-text-primary);
}

.toast-close svg {
  width: 14px;
  height: 14px;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all var(--duration-normal) var(--ease-default);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform var(--duration-normal) var(--ease-default);
}
</style>
