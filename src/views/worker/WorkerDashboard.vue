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
          <h2 class="welcome-title">Muraho, Agent Marie</h2>
          <p class="welcome-subtitle">Here's your overview for today — {{ todayFormatted }}</p>
        </div>
        <div class="welcome-stats">
          <div class="welcome-stat">
            <span class="welcome-stat-value">{{ paidThisWeek }}</span>
            <span class="welcome-stat-label">
              <Icon icon="ph:check-circle" class="stat-icon" /> Paid
            </span>
          </div>
          <div class="welcome-stat-divider"></div>
          <div class="welcome-stat">
            <span class="welcome-stat-value welcome-stat-value--danger">{{ unpaidThisWeek }}</span>
            <span class="welcome-stat-label">
              <Icon icon="ph:x-circle" class="stat-icon" /> Unpaid
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Warning Alert — Expanded with at-risk customers -->
    <section v-if="warningCount > 0" class="warning-alert-section" aria-label="At-risk customers warning">
      <div class="warning-alert-header" @click="warningExpanded = !warningExpanded">
        <div class="warning-alert-icon">
          <Icon icon="ph:warning-circle-fill" />
        </div>
        <div class="warning-alert-content">
          <strong>{{ warningCount }} customers</strong> are in the warning zone and approaching ban status.
        </div>
        <div class="warning-alert-toggle">
          <Icon :icon="warningExpanded ? 'ph:caret-up' : 'ph:caret-down'" />
        </div>
      </div>
      <transition name="expand">
        <div v-if="warningExpanded" class="warning-alert-details">
          <div v-for="customer in atRiskCustomers" :key="customer.id" class="at-risk-item">
            <div class="at-risk-avatar">
              <span>{{ getInitials(customer.name) }}</span>
            </div>
            <div class="at-risk-info">
              <div class="at-risk-name">{{ customer.name }}</div>
              <div class="at-risk-meta">{{ customer.village }} • {{ customer.weeksUnpaid }} weeks unpaid</div>
            </div>
            <button class="at-risk-action" @click.stop="sendReminder(customer.id)" :aria-label="'Send reminder to ' + customer.name">
              <Icon icon="ph:bell-ringing" />
              <span>Remind</span>
            </button>
          </div>
          <router-link to="/reminders" class="warning-view-all" @click.stop>
            <span>View all {{ warningCount }} customers</span>
            <Icon icon="ph:arrow-right" />
          </router-link>
        </div>
      </transition>
    </section>

    <!-- Metrics Grid -->
    <section class="metrics-grid" aria-label="Key metrics">
      <article
        class="metric-card"
        @click="$router.push('/houses')"
        aria-label="Total Customers: 120"
        tabindex="0"
        @keydown.enter="$router.push('/houses')"
      >
        <div class="metric-icon metric-icon--primary">
          <Icon icon="ph:house-line" />
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ totalCustomers }}</div>
          <div class="metric-label">Total Customers</div>
          <div class="metric-period">All time</div>
        </div>
        <div class="metric-sparkline" aria-hidden="true">
          <svg viewBox="0 0 56 24" class="sparkline sparkline--primary">
            <polyline :points="sparklinePoints.customers" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </article>

      <article
        class="metric-card"
        @click="$router.push('/houses')"
        :aria-label="'Paid This Week: ' + paidThisWeek + ', ' + paidPercentage + '% of total'"
        tabindex="0"
        @keydown.enter="$router.push('/houses')"
      >
        <div class="metric-icon metric-icon--success">
          <Icon icon="ph:check-circle" />
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ paidThisWeek }}</div>
          <div class="metric-label">Paid This Week</div>
          <div class="metric-change metric-change--positive">
            <Icon icon="ph:trend-up" />
            <span>+5 vs last week</span>
          </div>
        </div>
        <div class="metric-sparkline" aria-hidden="true">
          <svg viewBox="0 0 56 24" class="sparkline sparkline--success">
            <polyline :points="sparklinePoints.paid" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </article>

      <article
        class="metric-card"
        @click="$router.push('/houses')"
        :aria-label="'Unpaid This Week: ' + unpaidThisWeek + ', ' + unpaidPercentage + '% of total'"
        tabindex="0"
        @keydown.enter="$router.push('/houses')"
      >
        <div class="metric-icon metric-icon--danger">
          <Icon icon="ph:x-circle" />
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ unpaidThisWeek }}</div>
          <div class="metric-label">Unpaid This Week</div>
          <div class="metric-change metric-change--negative">
            <Icon icon="ph:trend-down" />
            <span>−3 vs last week</span>
          </div>
        </div>
        <div class="metric-sparkline" aria-hidden="true">
          <svg viewBox="0 0 56 24" class="sparkline sparkline--danger">
            <polyline :points="sparklinePoints.unpaid" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </article>

      <article
        class="metric-card"
        @click="$router.push('/banned')"
        :aria-label="'Banned Houses: ' + bannedHouses"
        tabindex="0"
        @keydown.enter="$router.push('/banned')"
      >
        <div class="metric-icon metric-icon--warning">
          <Icon icon="ph:prohibit" />
        </div>
        <div class="metric-content">
          <div class="metric-value">{{ bannedHouses }}</div>
          <div class="metric-label">Banned Houses</div>
          <div class="metric-period">This month</div>
        </div>
        <div class="metric-arrow">
          <Icon icon="ph:arrow-right" />
        </div>
      </article>
    </section>

    <!-- Main Grid -->
    <div class="dashboard-grid">
      <!-- Recent Payments -->
      <section class="dashboard-card" aria-label="Recent payments">
        <div class="card-header">
          <h3><Icon icon="ph:receipt" /> Recent Payments</h3>
          <router-link to="/houses" class="view-all-link">View all <Icon icon="ph:arrow-right" /></router-link>
        </div>
        <div class="payments-list">
          <div v-for="payment in recentPayments" :key="payment.id" class="payment-item">
            <div class="payment-avatar">
              <span>{{ getInitials(payment.name) }}</span>
            </div>
            <div class="payment-details">
              <div class="payment-name">{{ payment.name }}</div>
              <div class="payment-meta">{{ payment.village }} • {{ payment.time }}</div>
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
          <button class="action-btn action-btn--primary" @click="$router.push('/register')" aria-label="Register a new customer">
            <div class="action-btn-icon">
              <Icon icon="ph:user-plus" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Register Customer</span>
              <span class="action-btn-desc">Add new household</span>
            </div>
          </button>
          <button class="action-btn action-btn--blue" @click="$router.push('/houses')" aria-label="View all houses">
            <div class="action-btn-icon">
              <Icon icon="ph:house-line" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">View Houses</span>
              <span class="action-btn-desc">Check payment status</span>
            </div>
          </button>
          <button class="action-btn action-btn--amber" @click="$router.push('/reminders')" :aria-label="warningCount + ' pending warnings'">
            <div class="action-btn-icon">
              <Icon icon="ph:warning-circle" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">View Reminders</span>
              <span class="action-btn-desc">{{ warningCount }} pending warnings</span>
            </div>
          </button>
          <button class="action-btn action-btn--teal" @click="$router.push('/announcements')" aria-label="Send an announcement">
            <div class="action-btn-icon">
              <Icon icon="ph:megaphone-simple" />
            </div>
            <div class="action-btn-text">
              <span class="action-btn-title">Send Announcement</span>
              <span class="action-btn-desc">Notify customers</span>
            </div>
          </button>
        </div>
      </section>

      <!-- Payment by Category -->
      <section class="dashboard-card" aria-label="Payment breakdown by category">
        <div class="card-header">
          <h3><Icon icon="ph:chart-donut" /> Payment by Category</h3>
        </div>
        <div class="category-stats">
          <div class="category-item">
            <div class="category-info">
              <div class="category-dot category-dot--rich"></div>
              <span class="category-name">Abakire (Rich)</span>
            </div>
            <div class="category-bar-wrapper">
              <div class="category-bar category-bar--rich" :style="{ width: '75%' }"></div>
            </div>
            <div class="category-numbers">
              <span class="category-paid">15</span>/<span class="category-total">20</span>
            </div>
          </div>
          <div class="category-item">
            <div class="category-info">
              <div class="category-dot category-dot--medium"></div>
              <span class="category-name">Icyiciro cya 2 (Medium)</span>
            </div>
            <div class="category-bar-wrapper">
              <div class="category-bar category-bar--medium" :style="{ width: '60%' }"></div>
            </div>
            <div class="category-numbers">
              <span class="category-paid">30</span>/<span class="category-total">50</span>
            </div>
          </div>
          <div class="category-item">
            <div class="category-info">
              <div class="category-dot category-dot--poor"></div>
              <span class="category-name">Abakene (Poor)</span>
            </div>
            <div class="category-bar-wrapper">
              <div class="category-bar category-bar--poor" :style="{ width: '45%' }"></div>
            </div>
            <div class="category-numbers">
              <span class="category-paid">18</span>/<span class="category-total">40</span>
            </div>
          </div>
          <div class="category-item">
            <div class="category-info">
              <div class="category-dot category-dot--business"></div>
              <span class="category-name">Business Org.</span>
            </div>
            <div class="category-bar-wrapper">
              <div class="category-bar category-bar--business" :style="{ width: '80%' }"></div>
            </div>
            <div class="category-numbers">
              <span class="category-paid">8</span>/<span class="category-total">10</span>
            </div>
          </div>
        </div>
        <div class="category-legend">
          <div class="legend-row">
            <span class="legend-label">Rich: <strong>5,700 RWF</strong>/week</span>
            <span class="legend-label">Medium: <strong>3,800 RWF</strong>/week</span>
          </div>
          <div class="legend-row">
            <span class="legend-label">Poor: <strong>2,000 RWF</strong>/week</span>
            <span class="legend-label">Business: <strong>TBD</strong></span>
          </div>
        </div>
      </section>

      <!-- Weekly Collection Chart -->
      <section class="dashboard-card" aria-label="Weekly collections chart">
        <div class="card-header">
          <h3><Icon icon="ph:chart-bar" /> This Week's Collections</h3>
        </div>
        <div class="chart-container">
          <div class="chart-bars">
            <div v-for="(day, index) in weeklyData" :key="index" class="chart-col">
              <div class="chart-bar-stack">
                <div
                  class="chart-bar chart-bar--paid"
                  :style="{ height: `${day.paidPct}%` }"
                  :title="`Paid: ${day.paid}`"
                ></div>
                <div
                  class="chart-bar chart-bar--unpaid"
                  :style="{ height: `${day.unpaidPct}%` }"
                  :title="`Unpaid: ${day.unpaid}`"
                ></div>
              </div>
              <span class="chart-day" :class="{ 'chart-day--today': day.isToday }">{{ day.day }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-dot legend-dot--paid"></div>
              <span><Icon icon="ph:check" class="legend-icon" /> Paid</span>
            </div>
            <div class="legend-item">
              <div class="legend-dot legend-dot--unpaid"></div>
              <span><Icon icon="ph:x" class="legend-icon" /> Unpaid</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- No Cash Notice -->
    <div class="no-cash-notice" role="alert">
      <Icon icon="ph:info" />
      <span>All payments are processed digitally via MoMo or bank transfer. <strong>Do not accept cash payments.</strong></span>
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
const totalCustomers = ref(120)
const paidThisWeek = ref(71)
const unpaidThisWeek = computed(() => totalCustomers.value - paidThisWeek.value - bannedHouses.value)
const bannedHouses = ref(5)
const warningCount = ref(12)

const paidPercentage = computed(() => Math.round((paidThisWeek.value / totalCustomers.value) * 100))
const unpaidPercentage = computed(() => Math.round((unpaidThisWeek.value / totalCustomers.value) * 100))

// ── At-Risk Customers (expanded warning) ──
const warningExpanded = ref(false)
const atRiskCustomers = ref([
  { id: 101, name: 'Uwimana Jean', village: 'Kiyovu', weeksUnpaid: 3 },
  { id: 102, name: 'Mukeshimana Alice', village: 'Gisozi', weeksUnpaid: 2 },
  { id: 103, name: 'Nzeyimana Claude', village: 'Remera', weeksUnpaid: 2 },
])

const sendReminder = (customerId: number) => {
  // TODO: Wire to API
  console.log('Sending reminder to customer', customerId)
}

// ── Sparkline Data (last 7 days) ──
const sparklineData = {
  customers: [105, 108, 110, 112, 115, 118, 120],
  paid:      [52, 58, 60, 63, 65, 68, 71],
  unpaid:    [50, 48, 47, 46, 45, 44, 44],
}

const sparklinePoints = computed(() => {
  const toPoints = (data: number[]) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    return data.map((v, i) => {
      const x = (i / (data.length - 1)) * 56
      const y = 22 - ((v - min) / range) * 20
      return `${x},${y}`
    }).join(' ')
  }
  return {
    customers: toPoints(sparklineData.customers),
    paid: toPoints(sparklineData.paid),
    unpaid: toPoints(sparklineData.unpaid),
  }
})

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
  { id: 1, name: 'Uwimana Jean', village: 'Kiyovu', amount: 5700, time: '10 min ago' },
  { id: 2, name: 'Mukeshimana Alice', village: 'Nyamirambo', amount: 2000, time: '25 min ago' },
  { id: 3, name: 'Habimana Patrick', village: 'Kimihurura', amount: 3800, time: '1 hour ago' },
  { id: 4, name: 'Ingabire Diane', village: 'Gisozi', amount: 2000, time: '2 hours ago' },
  { id: 5, name: 'Nzeyimana Claude', village: 'Remera', amount: 5700, time: '3 hours ago' },
])

// ── Weekly Chart ──
const weeklyData = ref([
  { day: 'Mon', paid: 18, unpaid: 8, paidPct: 69, unpaidPct: 31, isToday: false },
  { day: 'Tue', paid: 22, unpaid: 5, paidPct: 81, unpaidPct: 19, isToday: false },
  { day: 'Wed', paid: 15, unpaid: 12, paidPct: 56, unpaidPct: 44, isToday: false },
  { day: 'Thu', paid: 16, unpaid: 9, paidPct: 64, unpaidPct: 36, isToday: true },
  { day: 'Fri', paid: 0, unpaid: 0, paidPct: 0, unpaidPct: 0, isToday: false },
  { day: 'Sat', paid: 0, unpaid: 0, paidPct: 0, unpaidPct: 0, isToday: false },
  { day: 'Sun', paid: 0, unpaid: 0, paidPct: 0, unpaidPct: 0, isToday: false },
])

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
  color: #fca5a5;
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

/* ── Category Stats ── */
.category-stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.category-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.category-info {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-width: 170px;
}

.category-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.category-dot--rich     { background: var(--color-portal-admin); }
.category-dot--medium   { background: var(--color-primary-500); }
.category-dot--poor     { background: var(--color-success); }
.category-dot--business { background: var(--color-portal-worker); }

.category-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-medium);
}

.category-bar-wrapper {
  flex: 1;
  height: 8px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.category-bar {
  height: 100%;
  border-radius: var(--radius-sm);
  transition: width 0.5s var(--ease-default);
}

.category-bar--rich     { background: linear-gradient(90deg, var(--color-portal-admin), #6d28d9); }
.category-bar--medium   { background: linear-gradient(90deg, var(--color-primary-500), var(--color-primary-600)); }
.category-bar--poor     { background: linear-gradient(90deg, var(--color-success), var(--color-success-dark)); }
.category-bar--business { background: linear-gradient(90deg, var(--color-warning), var(--color-warning-dark)); }

.category-numbers {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  min-width: 44px;
  text-align: right;
}

.category-paid { color: var(--color-text-primary); }

.category-legend {
  margin-top: var(--space-5);
  padding-top: var(--space-4);
  border-top: 1px solid var(--color-neutral-100);
}

.legend-row {
  display: flex;
  gap: var(--space-6);
  margin-bottom: 4px;
}

.legend-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

/* ── Chart ── */
.chart-container { margin-top: var(--space-2); }

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 180px;
  gap: var(--space-3);
  padding-bottom: var(--space-1);
}

.chart-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  gap: var(--space-2);
}

.chart-bar-stack {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 2px;
  max-width: 48px;
}

.chart-bar {
  width: 100%;
  border-radius: var(--radius-sm);
  transition: height 0.4s var(--ease-default);
  min-height: 2px;
}

.chart-bar--paid   { background: linear-gradient(180deg, var(--color-success), var(--color-success-dark)); }
.chart-bar--unpaid { background: linear-gradient(180deg, var(--color-warning), var(--color-warning-dark)); }

.chart-day {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
  font-weight: var(--font-medium);
}

.chart-day--today {
  color: var(--color-primary-600);
  font-weight: var(--font-bold);
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: var(--space-5);
  margin-top: var(--space-4);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.legend-icon { width: 12px; height: 12px; }

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}

.legend-dot--paid   { background: var(--color-success); }
.legend-dot--unpaid { background: var(--color-warning); }

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
