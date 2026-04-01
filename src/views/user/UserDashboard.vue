<template>
  <div class="portal-user">
    <div class="user-dashboard">
      <!-- Loading State -->
      <div v-if="isLoading" class="dashboard__loading">
        <div class="dashboard__skeleton-grid">
          <div class="skeleton-item skeleton-item--large">
            <BaseSkeleton variant="card" :lines="4" :show-header="true" />
          </div>
          <div class="skeleton-item skeleton-item--medium">
            <BaseSkeleton variant="card" :lines="3" />
          </div>
          <div class="skeleton-item skeleton-item--medium">
            <BaseSkeleton variant="card" :lines="3" />
          </div>
          <div class="skeleton-item skeleton-item--wide">
            <BaseSkeleton variant="table" :rows="5" :columns="4" />
          </div>
          <div class="skeleton-item skeleton-item--small">
            <BaseSkeleton variant="card" :lines="2" />
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <template v-else>
        <!-- Crisis Header - Debt Banner -->
        <div v-if="hasDebt" class="dashboard__crisis-header">
          <DebtBanner
            :total-debt="debtInfo.totalDebt"
            :weeks-owed="debtInfo.weeksOwed"
            :months-behind="debtInfo.monthsBehind"
            @pay-now="openPaymentModal"
          />
        </div>

        <!-- Main Bento Grid -->
        <div class="dashboard__bento-grid">
          <!-- Quick-Pay Hub - Large Card (2x2) -->
          <div class="bento-item bento-item--large">
            <BaseCard variant="elevated" padding="lg" hoverable>
              <div class="quick-pay-hub">
                <div class="quick-pay-hub__header">
                  <h3>{{ $t('dashboard.quickPaymentHub') }}</h3>
                  <BaseBadge variant="primary" size="sm">
                    {{ $t('payment.selectedWeeks', { count: selectedWeeks.length }) }}
                  </BaseBadge>
                </div>
                
                <div class="quick-pay-hub__selector">
                  <WeekSelector
                    v-model="selectedWeekIds"
                    :weeks="eligibleWeeks"
                    :max-weeks="12"
                  />
                </div>
                
                <div class="quick-pay-hub__progress">
                  <BaseProgressBar
                    :value="paidWeeksCount"
                    :max="52"
                    variant="success"
                    label="Year Progress"
                    show-value
                  />
                </div>
                
                <div class="quick-pay-hub__actions">
                  <BaseButton
                    variant="primary"
                    size="lg"
                    block
                    :disabled="selectedWeeks.length === 0"
                    @click="openPaymentModal"
                  >
                    {{ $t('payment.payNow') }}
                    <span class="amount">{{ formattedTotal }}</span>
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Service Tracking - Medium Card (1x1) -->
          <div class="bento-item bento-item--medium">
            <BaseCard variant="elevated" padding="md" hoverable>
              <div class="service-tracking">
                <div class="service-tracking__header">
                  <h4>{{ $t('dashboard.serviceStatus') }}</h4>
                  <BaseStatusDot status="active" pulse />
                </div>
                
                <div class="service-tracking__content">
                  <div class="worker-info">
                    <div class="worker-avatar">
                      <div class="avatar-placeholder">
                        <Icon icon="ph:user" />
                      </div>
                    </div>
                    <div class="worker-details">
                      <div class="worker-name">Agent Marie</div>
                      <div class="worker-status">{{ $t('service.onRoute') }} • 2.3 {{ $t('service.distance', { distance: 'km' }) }}</div>
                    </div>
                  </div>
                  
                  <div class="route-info">
                    <div class="route-item">
                      <Icon icon="ph:map-pin" />
                      <span>Kiyovu Sector</span>
                    </div>
                    <div class="route-item">
                      <Icon icon="ph:clock" />
                      <span>{{ $t('service.estimatedTime', { time: '15 min' }) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="service-tracking__actions">
                  <BaseButton variant="outline" size="sm" block>
                    {{ $t('dashboard.trackCollection') }}
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Payment Summary - Medium Card (1x1) -->
          <div class="bento-item bento-item--medium">
            <BaseCard variant="elevated" padding="md" hoverable>
              <div class="payment-summary">
                <div class="payment-summary__header">
                  <h4>{{ $t('dashboard.paymentSummary') }}</h4>
                  <BaseBadge variant="success" size="sm">
                    {{ paidWeeksCount }}/52 {{ $t('datetime.weeks', { count: paidWeeksCount }) }}
                  </BaseBadge>
                </div>
                
                <div class="payment-summary__stats">
                  <div class="stat-item">
                    <span class="stat-label">{{ $t('payment.totalAmount') }}</span>
                    <span class="stat-value amount">{{ formatCurrency(totalPaid, 'RWF') }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Outstanding</span>
                    <span class="stat-value amount">{{ formatCurrency(debtInfo.totalDebt, 'RWF') }}</span>
                  </div>
                </div>
                
                <div class="payment-summary__chart">
                  <div class="chart-bar">
                    <div 
                      class="chart-fill" 
                      :style="{ width: `${paymentProgress}%` }"
                    ></div>
                  </div>
                  <div class="chart-label">{{ paymentProgress }}% Complete</div>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Recent History - Wide Card (2x1) -->
          <div class="bento-item bento-item--wide">
            <BaseCard variant="elevated" padding="md" hoverable>
              <div class="recent-history">
                <div class="recent-history__header">
                  <h4>{{ $t('dashboard.recentTransactions') }}</h4>
                  <BaseButton variant="ghost" size="sm">
                    {{ $t('dashboard.viewAll') }}
                    <Icon icon="ph:arrow-right" />
                  </BaseButton>
                </div>
                
                <div class="recent-history__table">
                  <BaseTable
                    :columns="transactionColumns"
                    :rows="recentTransactions.slice(0, 5)"
                    :loading="false"
                    :clickable="false"
                    :show-pagination="false"
                  >
                    <template #cell-status="{ row }">
                      <BaseBadge :variant="row.status === 'completed' ? 'success' : 'danger'" size="sm">
                        {{ row.status }}
                      </BaseBadge>
                    </template>
                    <template #cell-amount="{ row }">
                      <span class="amount">{{ formatCurrency(row.amount, 'RWF') }}</span>
                    </template>
                  </BaseTable>
                </div>
              </div>
            </BaseCard>
          </div>

          <!-- Quick Actions - Small Card (1x1) -->
          <div class="bento-item bento-item--small">
            <BaseCard variant="elevated" padding="md" hoverable>
              <div class="quick-actions">
                <div class="quick-actions__header">
                  <h4>{{ $t('dashboard.quickActions') }}</h4>
                </div>
                
                <div class="quick-actions__grid">
                  <BaseButton variant="ghost" size="sm" @click="$router.push('/payments')">
                    <Icon icon="ph:credit-card" />
                    <span>{{ $t('nav.payments') }}</span>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="$router.push('/history')">
                    <Icon icon="ph:clock-counter-clockwise" />
                    <span>{{ $t('nav.history') }}</span>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="$router.push('/profile')">
                    <Icon icon="ph:user" />
                    <span>{{ $t('nav.profile') }}</span>
                  </BaseButton>
                  <BaseButton variant="ghost" size="sm" @click="$router.push('/support')">
                    <Icon icon="ph:headset" />
                    <span>Support</span>
                  </BaseButton>
                </div>
              </div>
            </BaseCard>
          </div>
        </div>
      </template>

      <!-- Payment Modal -->
      <PaymentConfirmModal
        v-model="showPaymentModal"
        :weeks="selectedWeeks"
        @confirm="handlePaymentConfirm"
      />

      <!-- Mobile Payment Bottom Sheet -->
      <BaseBottomSheet
        v-if="isMobile"
        v-model="showMobilePaymentSheet"
        title="{{ $t('payment.confirmPayment') }}"
        size="lg"
      >
        <div class="mobile-payment-sheet">
          <div class="mobile-payment-summary">
            <h4>{{ $t('payment.paymentSummary') }}</h4>
            <div class="summary-item">
              <span>{{ $t('payment.weeksSelected') }}</span>
              <span class="amount">{{ selectedWeeks.length }}</span>
            </div>
            <div class="summary-item">
              <span>{{ $t('payment.totalAmount') }}</span>
              <span class="amount">{{ formattedTotal }}</span>
            </div>
          </div>
          
          <div class="mobile-payment-pin">
            <h4>{{ $t('payment.enterPin') }}</h4>
            <BasePinInput
              v-model="mobilePinCode"
              :length="6"
              :mask="true"
              @complete="handleMobilePayment"
            />
          </div>
          
          <div class="mobile-payment-actions">
            <BaseButton
              variant="ghost"
              @click="showMobilePaymentSheet = false"
            >
              {{ $t('common.cancel') }}
            </BaseButton>
            <BaseButton
              variant="primary"
              :disabled="mobilePinCode.length !== 6"
              @click="handleMobilePayment"
            >
              {{ $t('payment.confirmPay') }}
            </BaseButton>
          </div>
        </div>
      </BaseBottomSheet>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseCard from '../../components/base/BaseCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseProgressBar from '../../components/base/BaseProgressBar.vue'
import BaseStatusDot from '../../components/base/BaseStatusDot.vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseSkeleton from '../../components/base/BaseSkeleton.vue'
import BaseBottomSheet from '../../components/base/BaseBottomSheet.vue'
import BasePinInput from '../../components/base/BasePinInput.vue'
import DebtBanner from '../../components/domain/debt/DebtBanner.vue'
import WeekSelector from '../../components/domain/payment/WeekSelector.vue'
import PaymentConfirmModal from '../../components/domain/payment/PaymentConfirmModal.vue'
import { useDebt } from '../../composables/useDebt'
import { usePayment } from '../../composables/usePayment'
import { usePaymentStore } from '../../stores/payment.store'
import { useToast } from '../../composables/useToast'
import { useUIStore } from '../../stores/ui.store'

// Composables
const debtInfo = useDebt()
const paymentComposable = usePayment()
const paymentStore = usePaymentStore()
const toast = useToast()
const uiStore = useUIStore()

// State
const isLoading = ref(true)
const showMobilePaymentSheet = ref(false)
const mobilePinCode = ref('')

// Payment state
const selectedWeekIds = computed({
  get: () => paymentComposable.selectedWeekIds.value,
  set: (value) => {
    paymentComposable.selectedWeekIds.value = value
  }
})

const selectedWeeks = computed(() => paymentComposable.selectedWeeks.value)
const eligibleWeeks = computed(() => paymentComposable.getEligibleWeeks())
const formattedTotal = computed(() => paymentComposable.formattedTotal.value)

// Modal state
const showPaymentModal = computed({
  get: () => paymentComposable.showPaymentModal.value,
  set: (value) => {
    paymentComposable.showPaymentModal.value = value
  }
})

// Computed properties
const isMobile = computed(() => uiStore.isMobile)
const hasDebt = computed(() => debtInfo.hasDebt.value)
const paidWeeksCount = computed(() => paymentStore.paidWeeks.length)
const totalPaid = computed(() => {
  return paymentStore.paidWeeks.reduce((sum, week) => sum + week.amount, 0)
})
const paymentProgress = computed(() => {
  return Math.round((paidWeeksCount.value / 52) * 100)
})
const recentTransactions = computed(() => paymentStore.recentTransactions)

// Table columns for transaction feed
const transactionColumns = computed(() => [
  {
    key: 'weekIds',
    label: 'Weeks',
    sortable: false,
    formatter: (value: number[]) => `${value.length} week${value.length > 1 ? 's' : ''}`
  },
  {
    key: 'createdAt',
    label: 'Date',
    sortable: true,
    formatter: (value: string) => new Date(value).toLocaleDateString()
  },
  {
    key: 'amount',
    label: 'Amount',
    align: 'right' as const,
    sortable: true
  },
  {
    key: 'status',
    label: 'Status',
    align: 'center' as const,
    sortable: false
  }
])

// Methods
const openPaymentModal = () => {
  if (isMobile.value) {
    showMobilePaymentSheet.value = true
  } else {
    paymentComposable.openPaymentModal()
  }
}

const handlePaymentConfirm = async (pinCode: string) => {
  const success = await paymentComposable.processPayment(pinCode)
  if (success) {
    toast.success('Payment processed successfully!')
  }
}

const handleMobilePayment = async (pinCode: string) => {
  const success = await paymentComposable.processPayment(pinCode)
  if (success) {
    showMobilePaymentSheet.value = false
    mobilePinCode.value = ''
    toast.success('Payment processed successfully!')
  }
}

const formatCurrency = (amount: number, currency: string) => {
  return `${currency} ${amount.toLocaleString()}`
}

// Initialize
onMounted(async () => {
  try {
    isLoading.value = true
    await paymentStore.initializePayments()
  } catch (error) {
    console.error('Failed to initialize dashboard:', error)
    toast.error('Failed to load payment data')
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.portal-user {
  min-height: 100vh;
  background-color: var(--color-bg-base);
}

.user-dashboard {
  padding: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

/* Loading State */
.dashboard__loading {
  padding: var(--space-6);
}

.dashboard__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
  grid-auto-rows: minmax(120px, auto);
}

.skeleton-item--large {
  grid-column: span 6;
  grid-row: span 2;
}

.skeleton-item--medium {
  grid-column: span 3;
  grid-row: span 1;
}

.skeleton-item--wide {
  grid-column: span 6;
  grid-row: span 1;
}

.skeleton-item--small {
  grid-column: span 3;
  grid-row: span 1;
}

.dashboard__crisis-header {
  margin-bottom: var(--space-6);
}

.dashboard__bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-4);
  grid-auto-rows: minmax(120px, auto);
}

/* Bento item sizes */
.bento-item--large {
  grid-column: span 6;
  grid-row: span 2;
}

.bento-item--medium {
  grid-column: span 3;
  grid-row: span 1;
}

.bento-item--wide {
  grid-column: span 6;
  grid-row: span 1;
}

.bento-item--small {
  grid-column: span 3;
  grid-row: span 1;
}

/* Component styles */
.quick-pay-hub {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}

.quick-pay-hub__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.quick-pay-hub__header h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.quick-pay-hub__selector {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.quick-pay-hub__progress {
  margin-top: var(--space-2);
}

.quick-pay-hub__actions {
  margin-top: auto;
  padding-top: var(--space-4);
}

.quick-pay-hub__actions .amount {
  margin-left: var(--space-2);
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}

.service-tracking {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  height: 100%;
}

.service-tracking__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.service-tracking__header h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.service-tracking__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  flex: 1;
}

.worker-info {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.worker-avatar {
  width: var(--space-10);
  height: var(--space-10);
  border-radius: var(--radius-full);
  overflow: hidden;
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

.worker-details {
  flex: 1;
}

.worker-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.worker-status {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.route-info {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.route-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.route-item svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.service-tracking__actions {
  margin-top: auto;
}

.payment-summary {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.payment-summary__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.payment-summary__header h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.payment-summary__stats {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.stat-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.payment-summary__chart {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.chart-bar {
  height: 8px;
  background-color: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  background-color: var(--color-success);
  border-radius: var(--radius-full);
  transition: width var(--duration-slow) var(--ease-bounce);
}

.chart-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  text-align: center;
  line-height: var(--leading-snug);
}

.recent-history {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.recent-history__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.recent-history__header h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.recent-history__table {
  min-height: 200px;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.quick-actions__header h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.quick-actions__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.quick-actions__grid .base-button {
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
  font-size: var(--text-xs);
}

.quick-actions__grid svg {
  width: 16px;
  height: 16px;
}

/* Mobile Payment Sheet */
.mobile-payment-sheet {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.mobile-payment-summary,
.mobile-payment-pin,
.mobile-payment-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.mobile-payment-summary h4,
.mobile-payment-pin h4 {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.mobile-payment-actions {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.mobile-payment-actions .base-button {
  flex: 1;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard__bento-grid,
  .dashboard__skeleton-grid {
    grid-template-columns: repeat(8, 1fr);
  }
  
  .bento-item--large,
  .skeleton-item--large {
    grid-column: span 4;
  }
  
  .bento-item--medium,
  .skeleton-item--medium {
    grid-column: span 4;
  }
  
  .bento-item--wide,
  .skeleton-item--wide {
    grid-column: span 8;
  }
  
  .bento-item--small,
  .skeleton-item--small {
    grid-column: span 4;
  }
}

@media (max-width: 768px) {
  .user-dashboard {
    padding: var(--space-4);
  }
  
  .dashboard__bento-grid,
  .dashboard__skeleton-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .bento-item--large,
  .bento-item--medium,
  .bento-item--wide,
  .bento-item--small,
  .skeleton-item--large,
  .skeleton-item--medium,
  .skeleton-item--wide,
  .skeleton-item--small {
    grid-column: span 1;
    grid-row: span 1;
  }
  
  .quick-actions__grid {
    grid-template-columns: 1fr;
  }
  
  .mobile-payment-actions {
    flex-direction: column;
  }
}

/* Entrance animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bento-item {
  animation: fadeInUp var(--duration-normal) var(--ease-bounce) forwards;
}

.bento-item:nth-child(1) { animation-delay: 100ms; }
.bento-item:nth-child(2) { animation-delay: 200ms; }
.bento-item:nth-child(3) { animation-delay: 300ms; }
.bento-item:nth-child(4) { animation-delay: 400ms; }
.bento-item:nth-child(5) { animation-delay: 500ms; }

/* Amount styling */
.amount {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}
</style>
