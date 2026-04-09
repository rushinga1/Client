<template>
  <div class="dashboard">
    <!-- Sync Status -->
    <div class="sync-bar" role="status" aria-label="Sync status">
      <div class="sync-bar-left">
        <span class="sync-dot" :class="{ 'sync-dot--active': !syncError }"></span>
        <span class="sync-text">{{ syncText }}</span>
      </div>
      <button class="sync-refresh" @click="handleSync" :disabled="isSyncing" aria-label="Refresh data">
        <Icon icon="ph:arrows-clockwise" :class="{ 'spin': isSyncing }" />
      </button>
    </div>

    <!-- Welcome Banner -->
    <section class="welcome-banner" aria-label="Welcome banner">
      <div class="welcome-content">
        <div class="welcome-text">
          <h2 class="welcome-title">Muraho, Marie</h2>
          <p class="welcome-subtitle">Here's your overview for today — {{ todayFormatted }}</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat">
            <span class="welcome-stat-value">{{ paidMonthsCount }} / 12</span>
            <span class="welcome-stat-label">
              <Icon icon="ph:check-circle" class="stat-icon" /> months paid in the year
            </span>
          </div>
          <div class="welcome-stat-divider"></div>
          <div class="welcome-stat">
            <span class="welcome-stat-value welcome-stat-value--danger">{{ unpaidMonthsCount }} / 12</span>
            <span class="welcome-stat-label">
              <Icon icon="ph:x-circle" class="stat-icon" /> debts in the year
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Warning Alert — Expanded with at-risk customers -->
    <!-- Status Notice -->
    <section class="warning-alert-section" aria-label="Eligibility status">
      <div class="warning-alert-header" @click="warningExpanded = !warningExpanded">
        <div class="warning-alert-icon">
          <Icon icon="ph:info" />
        </div>
        <div class="warning-alert-content">
          You are <strong>{{ isEligible ? 'eligible to access the service' : 'approaching ban status' }}</strong>.
        </div>
        <div class="warning-alert-toggle">
          <Icon :icon="warningExpanded ? 'ph:caret-up' : 'ph:caret-down'" />
        </div>
      </div>
      <transition name="expand">
        <div v-if="warningExpanded" class="warning-alert-details">
          <div class="at-risk-item">
            <div class="at-risk-info">
              <div class="at-risk-name">Payment Summary (Last 4 Months)</div>
              <div class="at-risk-meta">You have maintained consistent payments over the last 4 months, confirming your eligibility.</div>
            </div>
          </div>
        </div>
      </transition>
    </section>

    <!-- Metrics Grid -->
    <!-- Main Grid -->
    <div class="dashboard-grid">
      <!-- Recent Payments -->
      <section class="dashboard-card" aria-label="Recent payments">
        <div class="card-header">
          <h3><Icon icon="ph:receipt" /> Recent Payments</h3>
          <router-link to="/history" class="view-all-link">View all <Icon icon="ph:arrow-right" /></router-link>
        </div>
        <div class="payments-list">
          <div v-for="payment in recentPayments" :key="payment.id" class="payment-item">
            <div class="payment-avatar">
              <Icon :icon="payment.method === 'MoMo' ? 'ph:device-mobile' : 'ph:bank'" width="20" height="20" />
            </div>
            <div class="payment-details">
              <div class="payment-name">{{ payment.method }}</div>
              <div class="payment-meta">{{ payment.date }} • {{ payment.time }}</div>
            </div>
            <div class="payment-amount">
              <span class="amount-value">{{ payment.amount.toLocaleString() }}</span>
              <span class="amount-currency">RWF</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Actions -->
      <section class="dashboard-card" aria-label="Quick actions">
        <div class="card-header">
          <h3><Icon icon="ph:lightning" /> Quick Actions</h3>
        </div>
        <div class="quick-actions">
          <button class="action-btn action-btn--primary" @click="$router.push('/pay')" aria-label="Pay now">
            <div class="action-btn-icon">
              <Icon icon="ph:currency-circle-dollar" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Pay Now</span>
              <span class="action-btn-desc">Make a new payment</span>
            </div>
          </button>
          <button class="action-btn action-btn--blue" @click="$router.push('/reminders')" aria-label="Reminders">
            <div class="action-btn-icon">
              <Icon icon="ph:bell" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Reminders</span>
              <span class="action-btn-desc">View your reminders</span>
            </div>
          </button>
          <button class="action-btn action-btn--amber" @click="$router.push('/account')" aria-label="Account">
            <div class="action-btn-icon">
              <Icon icon="ph:user-circle" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Account</span>
              <span class="action-btn-desc">Manage your profile</span>
            </div>
          </button>
          <button class="action-btn action-btn--teal" @click="$router.push('/notification')" aria-label="Notifications">
            <div class="action-btn-icon">
              <Icon icon="ph:megaphone-simple" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Notification</span>
              <span class="action-btn-desc">View latest announcements</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Announcements -->
      <section class="dashboard-card" aria-label="Latest Announcements">
        <div class="card-header">
          <h3><Icon icon="ph:megaphone" /> Announcements</h3>
        </div>
        <div class="announcements-list">
          <div v-for="announcement in recentAnnouncements" :key="announcement.id" class="announcement-item">
            <div class="announcement-content">
              <h4 class="announcement-title">{{ announcement.title }}</h4>
              <p class="announcement-desc">{{ announcement.description }}</p>
              <div class="announcement-meta">Posted by {{ announcement.author }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Client Profile -->
      <section class="dashboard-card" aria-label="Client Profile">
        <div class="card-header">
          <h3><Icon icon="ph:user-focus" /> Profile Description</h3>
        </div>
        <div class="profile-details">
          <div class="profile-avatar">
            <span>{{ clientProfile.initials }}</span>
          </div>
          <div class="profile-info">
            <h4 class="profile-name">{{ clientProfile.name }}</h4>
            <p class="profile-meta"><Icon icon="ph:map-pin" /> {{ clientProfile.address }}</p>
            <p class="profile-meta"><Icon icon="ph:phone" /> {{ clientProfile.phone }}</p>
            <div class="profile-status">
              <span class="status-badge" :class="'status-badge--' + clientProfile.status.toLowerCase()">
                {{ clientProfile.status }}
              </span>
              <span class="member-since">Member since {{ clientProfile.joinDate }}</span>
            </div>
            <div class="profile-details-grid">
              <div class="detail-card">
                <span class="detail-label">District</span>
                <span class="detail-value">{{ clientProfile.district }}</span>
              </div>
              <div class="detail-card">
                <span class="detail-label">Sector</span>
                <span class="detail-value">{{ clientProfile.sector }}</span>
              </div>
              <div class="detail-card">
                <span class="detail-label">Cell</span>
                <span class="detail-value">{{ clientProfile.cell }}</span>
              </div>
              <div class="detail-card">
                <span class="detail-label">Village</span>
                <span class="detail-value">{{ clientProfile.village }}</span>
              </div>
              <div class="detail-card">
                <span class="detail-label">Agent</span>
                <span class="detail-value">{{ clientProfile.agent }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Digital Payment Encouragement Notice -->
    <div class="no-cash-notice" role="alert">
      <Icon icon="ph:shield-check" />
      <span>For your convenience and security, please make all payments digitally using <strong>MTN MoMo</strong>, <strong>Airtel Money</strong>, or <strong>Bank Card</strong>. Enjoy a fast, safe, and paperless payment experience!</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'

// ── Date ──
const todayFormatted = new Date().toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})

// ── Core Metrics ──
const paidMonthsCount = ref(8)
const unpaidMonthsCount = ref(4)
const isEligible = ref(true)

// ── At-Risk Customers (expanded warning) ──
const warningExpanded = ref(false)

// ── Sync Status ──
const lastSyncTime = ref(new Date())
const isSyncing = ref(false)
const syncError = ref(false)
let syncInterval: ReturnType<typeof setInterval> | null = null

const syncText = computed(() => {
  if (isSyncing.value) return 'Syncing...'
  if (syncError.value) return 'Sync failed — tap to retry'
  const diff = Math.round((Date.now() - lastSyncTime.value.getTime()) / 60000)
  if (diff < 1) return 'Synced just now'
  return `Synced ${diff} min ago`
})

const handleSync = () => {
  isSyncing.value = true
  setTimeout(() => {
    isSyncing.value = false
    lastSyncTime.value = new Date()
  }, 1500)
}

onMounted(() => {
  syncInterval = setInterval(() => {
    lastSyncTime.value = new Date(lastSyncTime.value) // trigger reactivity
  }, 60000)
})

onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval)
})

// ── Recent Payments ──
const recentPayments = ref([
  { id: 1, method: 'MoMo', date: 'Apr 8', amount: 5700, time: '10:00 AM' },
  { id: 2, method: 'Bank Transfer', date: 'Apr 1', amount: 5700, time: '09:15 AM' },
  { id: 3, method: 'MoMo', date: 'Mar 24', amount: 5700, time: '14:30 PM' },
  { id: 4, method: 'Bank Transfer', date: 'Mar 17', amount: 5700, time: '11:45 AM' },
])

// ── Announcements ──
const recentAnnouncements = ref([
  { id: 1, title: 'Umuganda Update', description: 'Monthly community work has been rescheduled to next Sunday.', author: 'Emmanuel K.' },
  { id: 2, title: 'New Payment Method', description: 'Clients can now use Airtel Money to pay their monthly dues.', author: 'Jean-Paul N.' },
  { id: 3, title: 'System Maintenance', description: 'The dashboard will be under short maintenance tonight.', author: 'Admin Team' },
  { id: 4, title: 'Congratulations', description: 'Kacyiru sector recorded 100% fast compliance this week.', author: 'Marie C.' }
])

// ── Client Profile ──
const clientProfile = ref({
  name: 'Marie Claire',
  initials: 'MC',
  address: 'Kacyiru, Kigali',
  phone: '+250 788 123 456',
  status: 'Active',
  joinDate: 'Jan 2024',
  district: 'Gasabo',
  sector: 'Kacyiru',
  cell: 'Kamukina',
  village: 'Kanserege',
  agent: 'Jean-Paul N.'
})

// ── Helpers ──
const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}
</script>

<style scoped>
/* ═══════════════════════════════════════
   DASHBOARD — Blue & White Brand
   All colors use CSS custom properties
   ═══════════════════════════════════════ */

.dashboard {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

/* ── Sync Bar ── */
.sync-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  background: var(--color-neutral-50);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
}

.sync-bar-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.sync-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-neutral-400);
  flex-shrink: 0;
}

.sync-dot--active {
  background: var(--color-success);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.sync-text {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.sync-refresh {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  border-radius: var(--radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.sync-refresh:hover {
  background: var(--color-neutral-200);
  color: var(--color-text-primary);
}

.sync-refresh svg { width: 16px; height: 16px; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Welcome Banner ── */
.welcome-banner {
  background: linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-600) 50%, var(--color-primary-500) 100%);
  border-radius: var(--radius-xl);
  padding: var(--space-6) var(--space-8);
  color: var(--color-neutral-0);
  position: relative;
  overflow: hidden;
}

.welcome-banner::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}

.welcome-banner::after {
  content: '';
  position: absolute;
  bottom: -40%;
  right: 15%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.04);
  border-radius: 50%;
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
  gap: var(--space-6);
}

.welcome-text {
  flex: 1;
  min-width: 0;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  margin: 0 0 var(--space-1) 0;
  line-height: var(--leading-tight);
}

.welcome-subtitle {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  opacity: 0.9;
  margin: 0;
  line-height: var(--leading-normal);
}

.welcome-stats {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-lg);
  padding: var(--space-4) var(--space-6);
  border: 1px solid rgba(255,255,255,0.15);
  flex-shrink: 0;
}

.welcome-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.welcome-stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: var(--font-extrabold);
  line-height: var(--leading-tight);
}

.welcome-stat-value--danger {
  color: var(--color-danger-300);
}

.welcome-stat-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  opacity: 0.85;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-icon { width: 12px; height: 12px; }

.welcome-stat-divider {
  width: 1px;
  height: var(--space-10);
  background: rgba(255, 255, 255, 0.2);
}

/* ── Warning Alert (Expandable) ── */
.warning-alert-section {
  background: var(--color-warning-light);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--duration-fast) var(--ease-default);
}

.warning-alert-header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-default);
}

.warning-alert-header:hover {
  background: rgba(245, 158, 11, 0.08);
}

.warning-alert-icon {
  color: var(--color-warning);
  flex-shrink: 0;
}

.warning-alert-icon svg {
  width: var(--space-6);
  height: var(--space-6);
}

.warning-alert-content {
  flex: 1;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-warning-dark);
  line-height: var(--leading-normal);
}

.warning-alert-toggle {
  color: var(--color-warning-dark);
  flex-shrink: 0;
}

.warning-alert-toggle svg { width: 18px; height: 18px; }

.warning-alert-details {
  border-top: 1px solid rgba(245, 158, 11, 0.2);
  padding: var(--space-3) var(--space-5) var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.at-risk-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-neutral-0);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
}

.at-risk-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-warning), #d97706);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-0);
  font-size: 11px;
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.at-risk-info {
  flex: 1;
  min-width: 0;
}

.at-risk-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.at-risk-meta {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.at-risk-action {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-0);
  border: 1px solid var(--color-warning);
  border-radius: var(--radius-md);
  color: var(--color-warning-dark);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
  min-height: var(--touch-target-min);
  flex-shrink: 0;
}

.at-risk-action:hover {
  background: var(--color-warning);
  color: var(--color-neutral-0);
}

.at-risk-action svg { width: 14px; height: 14px; }

.warning-view-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3);
  color: var(--color-warning-dark);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  border-radius: var(--radius-md);
  transition: background var(--duration-fast) var(--ease-default);
}

.warning-view-all:hover { background: rgba(245, 158, 11, 0.1); }
.warning-view-all svg { width: 16px; height: 16px; }

/* Expand transition */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s var(--ease-default);
  max-height: 400px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* ── Metrics Grid ── */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.metric-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5);
  background: var(--color-neutral-0);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: all 0.25s var(--ease-default);
  min-height: var(--touch-target-min);
}

.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-border-strong);
}

.metric-card:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  flex-shrink: 0;
}

.metric-icon svg { width: 24px; height: 24px; }

.metric-icon--primary { background: var(--color-primary-50); color: var(--color-primary-600); }
.metric-icon--success { background: var(--color-success-light); color: var(--color-success); }
.metric-icon--danger  { background: var(--color-danger-light); color: var(--color-danger); }
.metric-icon--warning { background: var(--color-warning-light); color: var(--color-warning); }

.metric-content { flex: 1; min-width: 0; }

.metric-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-extrabold);
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: 2px;
}

.metric-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

.metric-period {
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--color-neutral-400);
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.metric-change {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: var(--font-semibold);
  margin-top: 3px;
}

.metric-change svg { width: 12px; height: 12px; }

.metric-change--positive { color: var(--color-success); }
.metric-change--negative { color: var(--color-danger); }

.metric-sparkline {
  width: 56px;
  height: 24px;
  flex-shrink: 0;
}

.sparkline { width: 100%; height: 100%; }
.sparkline--primary polyline { stroke: var(--color-primary-500); }
.sparkline--success polyline { stroke: var(--color-success); }
.sparkline--danger polyline  { stroke: var(--color-danger); }

.metric-arrow {
  color: var(--color-neutral-400);
  flex-shrink: 0;
}

.metric-arrow svg { width: 18px; height: 18px; }

/* ── Dashboard Grid ── */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
}

.dashboard-card {
  background: var(--color-neutral-0);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border-default);
  box-shadow: var(--shadow-xs);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-5);
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.card-header h3 svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary-500);
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-primary-600);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  transition: color var(--duration-fast);
}

.view-all-link:hover { color: var(--color-primary-700); }
.view-all-link svg { width: 14px; height: 14px; }

/* ── Payments List ── */
.payments-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.payment-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) var(--ease-default);
}

.payment-item:hover { background: var(--color-neutral-100); }

.payment-avatar {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-0);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.payment-details { flex: 1; min-width: 0; }

.payment-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.payment-meta {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

.payment-amount { text-align: right; }

.amount-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-success);
}

.amount-currency {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--color-neutral-400);
  margin-left: 3px;
}

/* ── Quick Actions ── */
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-default);
  background: var(--color-neutral-0);
  cursor: pointer;
  transition: all 0.2s var(--ease-default);
  text-align: left;
  min-height: var(--touch-target-min);
}

.action-btn:hover {
  transform: translateX(4px);
  box-shadow: var(--shadow-md);
}

.action-btn:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

.action-btn-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-btn-icon svg { width: 20px; height: 20px; }

.action-btn--primary .action-btn-icon { background: var(--color-success-light); color: var(--color-success); }
.action-btn--blue .action-btn-icon { background: var(--color-primary-50); color: var(--color-primary-600); }
.action-btn--amber .action-btn-icon { background: var(--color-warning-light); color: var(--color-warning); }
.action-btn--teal .action-btn-icon { background: #ccfbf1; color: #0d9488; }

.action-btn--primary:hover { border-color: var(--color-success); }
.action-btn--blue:hover { border-color: var(--color-primary-500); }
.action-btn--amber:hover { border-color: var(--color-warning); }
.action-btn--teal:hover { border-color: #14b8a6; }

.action-btn-text { flex: 1; }

.action-btn-title {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.action-btn-desc {
  display: block;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

/* ── Announcements ── */
.announcements-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.announcement-item {
  padding: var(--space-3);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary-500);
}

.announcement-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}

.announcement-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin: 0 0 6px 0;
}

.announcement-meta {
  font-family: var(--font-body);
  font-size: 11px;
  color: var(--color-neutral-400);
  font-style: italic;
}

/* ── Client Profile ── */
.profile-details {
  display: flex;
  gap: var(--space-5);
  margin-top: var(--space-2);
  align-items: flex-start;
}

.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.profile-name {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.profile-meta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.profile-status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-1);
}

.status-badge {
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 11px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.status-badge--active {
  background: var(--color-success-light);
  color: var(--color-success-dark);
}

.member-since {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

.profile-details-grid {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-4);
  width: 100%;
}

.detail-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-3);
  background: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-100);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--color-primary-400);
  min-width: 100px;
  flex: 1 1 auto;
}

.detail-label {
  font-family: var(--font-body);
  font-size: 10px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2px;
}

.detail-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-semibold);
}

/* ── No Cash Notice ── */
.no-cash-notice {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-5);
  background: var(--color-info-light);
  border: 1px solid var(--color-primary-200);
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-primary-800);
}

.no-cash-notice svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════ */

@media (max-width: 1024px) {
  .dashboard { padding: var(--space-5); }
  .metrics-grid { grid-template-columns: repeat(2, 1fr); }
  .dashboard-grid { grid-template-columns: 1fr; }
  .welcome-content { flex-direction: column; gap: var(--space-4); align-items: flex-start; }
  .welcome-stats { width: 100%; justify-content: center; }
}

@media (max-width: 768px) {
  .dashboard { padding: var(--space-4); }
  .welcome-banner { padding: var(--space-5); }
  .welcome-title { font-size: var(--text-xl); }
  .metric-sparkline { display: none; }
  .category-info { min-width: 140px; }
}

@media (max-width: 640px) {
  .dashboard { padding: var(--space-3); gap: var(--space-4); }
  .metrics-grid { grid-template-columns: 1fr; }
  .welcome-banner { padding: var(--space-4); }
  .welcome-title { font-size: var(--text-lg); }
  .welcome-stats { width: 100%; justify-content: center; }
  .category-info { min-width: 110px; }
  .legend-row { flex-direction: column; gap: var(--space-1); }
  .dashboard-card { padding: var(--space-4); }
}
</style>
