<template>
  <aside :class="['sidebar', { 'sidebar--collapsed': isCollapsed }]">
    <!-- Logo Section -->
    <div class="sidebar__brand">
      <div class="brand-logo">
        <div class="logo-icon">
          <Icon icon="ph:recycle" />
        </div>
        <div v-if="!isCollapsed" class="logo-text">
          <span class="logo-name">AGRUNI</span>
          <span class="logo-tagline">Client Portal</span>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="sidebar__nav">
      <div class="nav-section">
        <div v-if="!isCollapsed" class="nav-section-title">{{ $t('dashboard.title') }}</div>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/dashboard" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.dashboard')">
              <Icon icon="ph:squares-four" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.dashboard') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/pay" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.payments')">
              <Icon icon="ph:credit-card" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.payments') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/history" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.history')">
              <Icon icon="ph:clock-counter-clockwise" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.history') }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div v-if="!isCollapsed" class="nav-section-title">Finance & Status</div>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/reminders" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.reminders')">
              <Icon icon="ph:bell-simple" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.reminders') }}</span>
              <span v-if="!isCollapsed && reminderCount > 0" class="nav-badge nav-badge--warning">{{ reminderCount }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/debts" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.debts')">
              <Icon icon="ph:money" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.debts') }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div v-if="!isCollapsed" class="nav-section-title">Communication</div>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/messages" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.messages')">
              <Icon icon="ph:chat-circle-dots" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.messages') }}</span>
              <span v-if="!isCollapsed && messageCount > 0" class="nav-badge nav-badge--info">{{ messageCount }}</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <div v-if="!isCollapsed" class="nav-section-title">Profile</div>
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/account" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.account')">
              <Icon icon="ph:user-focus" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.account') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/settings" class="nav-link" active-class="nav-link--active" :data-tooltip="$t('nav.settings')">
              <Icon icon="ph:gear" />
              <span v-if="!isCollapsed" class="nav-text">{{ $t('nav.settings') }}</span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- User Section -->
    <div class="sidebar__user">
      <div class="user-profile">
        <div class="user-avatar overflow-hidden">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="User" class="avatar-img" />
          <div v-else class="user-avatar-initials">{{ userInitials }}</div>
        </div>
        <div v-if="!isCollapsed" class="user-info">
          <div class="user-name">{{ authStore.user?.name || 'User' }}</div>
          <div class="user-role">{{ $t('nav.customerOfAgruni') }}</div>
        </div>
        <button v-if="!isCollapsed" class="user-logout" @click="handleLogout" :title="$t('nav.logout')">
          <Icon icon="ph:sign-out" />
        </button>
      </div>
    </div>

    <!-- Collapse Toggle -->
    <button class="sidebar__toggle" @click="toggleCollapse">
      <Icon :icon="isCollapsed ? 'ph:caret-right' : 'ph:caret-left'" />
    </button>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const messageCount = ref(4)
const notificationCount = ref(7)
const reminderCount = ref(12)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 272px;
  height: 100vh;
  background: linear-gradient(175deg, #0f1d3d 0%, #162a5c 40%, #1a3570 100%);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 32px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.sidebar--collapsed {
  width: 76px;
}

/* Brand Section */
.sidebar__brand {
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 12px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
}

.logo-icon svg {
  width: 24px;
  height: 24px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-name {
  font-size: 20px;
  font-weight: 700;
  color: white;
  line-height: 1;
  letter-spacing: -0.02em;
}

.logo-tagline {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1;
  font-weight: 500;
}

/* Navigation */
.sidebar__nav {
  flex: 1;
  padding: 16px 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar__nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar__nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 4px;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section:last-child {
  margin-bottom: 0;
}

.nav-section-title {
  padding: 0 24px 8px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 1.2px;
}

.nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  margin-bottom: 1px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.95);
}

.nav-link--active {
  background: rgba(59, 130, 246, 0.15);
  color: white;
  border-left-color: #3b82f6;
}

.nav-link--active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: #3b82f6;
  border-radius: 3px 0 0 3px;
}

.nav-link svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  opacity: 0.85;
}

.nav-link--active svg {
  opacity: 1;
  color: #60a5fa;
}

.nav-text {
  flex: 1;
  white-space: nowrap;
}

.nav-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 700;
  border-radius: 10px;
  color: white;
}

.nav-badge--danger {
  background: #ef4444;
}

.nav-badge--warning {
  background: #f59e0b;
}

.nav-badge--info {
  background: #3b82f6;
}

/* User Section */
.sidebar__user {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overflow-hidden {
  overflow: hidden;
}

.user-avatar-initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
}

.user-role {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.3;
  letter-spacing: 0.3px;
}

.user-logout {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-logout:hover {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.user-logout svg {
  width: 16px;
  height: 16px;
}

/* Collapse Toggle */
.sidebar__toggle {
  position: absolute;
  top: 50%;
  right: -12px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #1e40af;
  border: 2px solid #f8fafc;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.sidebar__toggle:hover {
  background: #3b82f6;
  transform: translateY(-50%) scale(1.1);
}

.sidebar__toggle svg {
  width: 12px;
  height: 12px;
}

/* Collapsed State */
.sidebar--collapsed .nav-section-title {
  display: none;
}

.sidebar--collapsed .nav-link {
  justify-content: center;
  padding: 12px;
  border-left-color: transparent;
  position: relative;
}

/* CSS Tooltips on collapsed sidebar */
.sidebar--collapsed .nav-link::after {
  content: attr(data-tooltip);
  position: absolute;
  left: calc(100% + 12px);
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 12px;
  background: var(--color-neutral-800, #1e293b);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
  z-index: 1002;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.sidebar--collapsed .nav-link:hover::after {
  opacity: 1;
}

.sidebar--collapsed .nav-link--active::after {
  display: none;
}

.sidebar--collapsed .nav-text,
.sidebar--collapsed .nav-badge,
.sidebar--collapsed .user-info,
.sidebar--collapsed .user-logout {
  display: none;
}

.sidebar--collapsed .user-profile {
  justify-content: center;
}

.sidebar--collapsed .brand-logo {
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .sidebar--mobile-open {
    transform: translateX(0);
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.3);
  }

  .sidebar__toggle {
    display: none;
  }
}
</style>
