<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Left Section -->
      <div class="header-left">
        <div class="catchphrase">
          <div class="agruni-lettermark">A</div>
          <span><strong>Agruni</strong> — Keeping Rwanda Clean and Green</span>
        </div>
      </div>

      <!-- Right Section -->
      <div class="header-right">
        <!-- Notifications -->
        <div class="header-item">
          <button class="icon-button" @click="toggleNotifications" :aria-label="notificationCount > 0 ? notificationCount + ' unread notifications' : 'Notifications'">
            <Icon icon="ph:bell" />
            <span v-if="notificationCount > 0" class="notification-badge" aria-hidden="true">{{ notificationCount }}</span>
          </button>
        </div>

        <!-- Messages -->
        <div class="header-item">
          <button class="icon-button" @click="toggleMessages" :aria-label="messageCount > 0 ? messageCount + ' unread messages' : 'Messages'">
            <Icon icon="ph:chat-circle-dots" />
            <span v-if="messageCount > 0" class="message-badge" aria-hidden="true">{{ messageCount }}</span>
          </button>
        </div>


        <!-- User Menu -->
        <div class="header-item user-menu">
          <button class="user-button" @click="toggleUserMenu">
            <div class="user-avatar">
              <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="User" />
              <div v-else class="avatar-fallback">{{ userInitials }}</div>
            </div>
            <div class="user-info">
              <div class="user-name">{{ authStore.user?.name || $t('nav.account') }}</div>
              <div class="user-status">{{ $t('nav.online') }}</div>
            </div>
            <Icon icon="ph:caret-down" class="dropdown-icon" />
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="dropdown notifications-dropdown">
      <div class="dropdown-header">
        <h3>Notifications</h3>
        <button class="mark-all-read" @click="markAllRead">Mark all read</button>
      </div>
      <div class="notifications-list">
        <div v-for="notification in notifications" :key="notification.id" class="notification-item">
          <div class="notification-icon" :class="notification.type">
            <Icon :icon="getNotificationIcon(notification.type)" />
          </div>
          <div class="notification-content">
            <div class="notification-title">{{ notification.title }}</div>
            <div class="notification-message">{{ notification.message }}</div>
            <div class="notification-time">{{ notification.time }}</div>
          </div>
          <button class="notification-dismiss" @click="dismissNotification(notification.id)">
            <Icon icon="ph:x" />
          </button>
        </div>
      </div>
    </div>

    <!-- Messages Dropdown -->
    <div v-if="showMessages" class="dropdown messages-dropdown">
      <div class="dropdown-header">
        <h3>Messages</h3>
        <router-link to="/messages" class="view-all">View all</router-link>
      </div>
      <div class="messages-list">
        <div v-for="message in messages" :key="message.id" class="message-item">
          <div class="message-avatar">
            <img :src="message.avatar" :alt="message.sender" />
          </div>
          <div class="message-content">
            <div class="message-sender">{{ message.sender }}</div>
            <div class="message-text">{{ message.text }}</div>
            <div class="message-time">{{ message.time }}</div>
          </div>
          <div v-if="message.unread" class="message-unread"></div>
        </div>
      </div>
    </div>

    <!-- User Menu Dropdown -->
    <div v-if="showUserMenu" class="dropdown user-dropdown">
      <div class="user-dropdown-header">
        <div class="user-avatar-large">
          <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" alt="User" />
          <div v-else class="avatar-fallback-large">{{ userInitials }}</div>
        </div>
        <div class="user-details">
          <div class="user-name">{{ authStore.user?.name }}</div>
          <div class="user-email">{{ authStore.user?.email }}</div>
          <div class="user-role">{{ $t('nav.clientOfAgruni') }}</div>
        </div>
      </div>
      <div class="dropdown-menu">
        <router-link to="/account" class="dropdown-item">
          <Icon icon="ph:user-focus" />
          <span>{{ $t('nav.account') }}</span>
        </router-link>
        <router-link to="/settings" class="dropdown-item">
          <Icon icon="ph:gear" />
          <span>{{ $t('nav.settings') }}</span>
        </router-link>
        <router-link to="/help" class="dropdown-item">
          <Icon icon="ph:question" />
          <span>{{ $t('nav.help') }}</span>
        </router-link>
        <div class="dropdown-divider"></div>
        <button class="dropdown-item logout" @click="handleLogout">
          <Icon icon="ph:sign-out" />
          <span>{{ $t('nav.logout') }}</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const showNotifications = ref(false)
const showMessages = ref(false)
const showUserMenu = ref(false)

// Mock data
const notificationCount = ref(4)
const messageCount = ref(2)

const userInitials = computed(() => {
  const name = authStore.user?.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const notifications = ref([
  {
    id: 1,
    type: 'info',
    title: 'Collection Schedule Update',
    message: 'Tomorrow’s waste collection is rescheduled to 8 AM.',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'success',
    title: 'Payment Received',
    message: 'We have successfully received your MoMo payment.',
    time: '1 day ago'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Waste Sorting Reminder',
    message: 'Please remember to separate organic waste from plastics.',
    time: '2 days ago'
  },
  {
    id: 4,
    type: 'info',
    title: 'Holiday Notice',
    message: 'No collections will be made on Friday due to Umuganda.',
    time: '3 days ago'
  }
])

const messages = ref([
  {
    id: 1,
    sender: 'Agent Jean-Paul N.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    text: 'I will be arriving at your location in 10 minutes for the collection.',
    time: '5 min ago',
    unread: true
  },
  {
    id: 2,
    sender: 'Agent Jean-Paul N.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    text: 'Please make sure the waste bags are tied securely. Thank you!',
    time: '3 hours ago',
    unread: true
  }
])

// Methods
const toggleMobileMenu = () => {
  // Emit event or call store method
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showMessages.value = false
  showUserMenu.value = false
}

const toggleMessages = () => {
  showMessages.value = !showMessages.value
  showNotifications.value = false
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showMessages.value = false
}


const markAllRead = () => {
  notificationCount.value = 0
}

const dismissNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
  notificationCount.value = Math.max(0, notificationCount.value - 1)
}

const getNotificationIcon = (type: string) => {
  const icons = {
    success: 'ph:check-circle',
    warning: 'ph:warning',
    info: 'ph:info',
    error: 'ph:x-circle'
  }
  return icons[type as keyof typeof icons] || 'ph:info'
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e: MouseEvent) => {
  const target = e.target as HTMLElement | null
  if (target && !target.closest('.header-item')) {
    showNotifications.value = false
    showMessages.value = false
    showUserMenu.value = false
  }
})
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 72px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  z-index: 999;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
  max-width: 100%;
}

/* Left Section */
.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.catchphrase {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  color: #2563eb;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.catchphrase strong {
  font-weight: 700;
  color: #1d4ed8;
}

.agruni-lettermark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  font-family: system-ui, sans-serif;
  font-weight: 800;
  font-size: 16px;
  line-height: 1;
}

/* Right Section */
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-item {
  position: relative;
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.icon-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.icon-button svg {
  width: 20px;
  height: 20px;
}

.notification-badge,
.message-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 9px;
  border: 2px solid white;
}

.message-badge {
  background: #3b82f6;
}

/* User Menu */
.user-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-button:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback, .avatar-fallback-large {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-600, #2563eb);
  color: white;
  font-weight: 700;
  font-size: 12px;
}

.avatar-fallback-large {
  font-size: 18px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.2;
}

.user-status {
  font-size: 12px;
  color: #1e3a8a;
  line-height: 1.2;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
}

/* Dropdowns */
.dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 320px;
  max-height: 480px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

.mark-all-read,
.view-all {
  font-size: 12px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.mark-all-read:hover,
.view-all:hover {
  color: #2563eb;
}

/* Notifications */
.notifications-list {
  padding: 8px 0;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: #f9fafb;
}

.notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
}

.notification-icon.success {
  background: #f0f9ff;
  color: #3b82f6;
}

.notification-icon.warning {
  background: #fef3c7;
  color: #f59e0b;
}

.notification-icon.info {
  background: #eff6ff;
  color: #3b82f6;
}

.notification-icon svg {
  width: 16px;
  height: 16px;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
  margin-bottom: 2px;
}

.notification-message {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
}

.notification-time {
  font-size: 11px;
  color: #9ca3af;
}

.notification-dismiss {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s ease;
}

.notification-dismiss:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.notification-dismiss svg {
  width: 14px;
  height: 14px;
}

/* Messages */
.messages-list {
  padding: 8px 0;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 20px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.message-item:hover {
  background: #f9fafb;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content {
  flex: 1;
  min-width: 0;
}

.message-sender {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.3;
  margin-bottom: 2px;
}

.message-text {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-time {
  font-size: 11px;
  color: #9ca3af;
}

.message-unread {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  margin-top: 8px;
  flex-shrink: 0;
}

/* User Dropdown */
.user-dropdown-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  overflow: hidden;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-details .user-name {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
}

.user-details .user-email {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 2px;
}

.user-details .user-role {
  font-size: 12px;
  color: #9ca3af;
}

.dropdown-menu {
  padding: 8px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #374151;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: #f9fafb;
  color: #374151;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
  color: #ef4444;
}

.dropdown-item svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    left: 0;
  }
  
  .header-container {
    padding: 0 16px;
  }
  
  .catchphrase {
    font-size: 14px;
  }
  
  .user-info {
    display: none;
  }
  
  .dropdown {
    right: -8px;
    left: 8px;
    min-width: 280px;
  }
}

@media (max-width: 640px) {
  .header-left {
    gap: 12px;
  }
  
  .header-right {
    gap: 4px;
  }
  
  .icon-button {
    width: 36px;
    height: 36px;
  }
}
</style>

