<template>
  <div class="debts-view">
    <div class="view-header" v-motion-fade>
      <!-- Hero Section Card -->
      <BaseCard variant="elevated" padding="lg" class="hero-card">
        <div class="header-main-section">
          <h1 class="view-title">My Debts</h1>
          <p class="view-description">View your outstanding balances, monthly debt details, and payment progress.</p>
        </div>

        <!-- Red Banner -->
        <div v-if="debtInfo.totalDebt > 0" class="banner-section" v-motion-slide-top>
          <DebtBanner
            :total-debt="debtInfo.totalDebt"
            :weeks-owed="debtInfo.weeksOwed"
            :months-behind="debtInfo.monthsBehind"
            @pay-now="openPaymentModal"
          />
        </div>
      </BaseCard>

      <!-- Summary Cards -->
      <div class="summary-grid">
        <BaseCard variant="elevated" padding="md" class="summary-card" v-motion-fade>
          <div class="summary-card__content">
            <div class="summary-card__icon icon--danger">
              <Icon icon="ph:money-bold" />
            </div>
            <div class="summary-card__data">
              <span class="label">Total Owed</span>
              <span class="value amount">RWF {{ debtInfo.totalDebt.toLocaleString() }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="md" class="summary-card" v-motion-fade>
          <div class="summary-card__content">
            <div class="summary-card__icon icon--warning">
              <Icon icon="ph:calendar-bold" />
            </div>
            <div class="summary-card__data">
              <span class="label">Months Behind</span>
              <span class="value">{{ debtInfo.monthsBehind }} Month{{ debtInfo.monthsBehind !== 1 ? 's' : '' }}</span>
            </div>
          </div>
        </BaseCard>

        <BaseCard variant="elevated" padding="md" class="summary-card" v-motion-fade>
          <div class="summary-card__content">
            <div class="summary-card__icon icon--primary">
              <Icon icon="ph:trend-up-bold" />
            </div>
            <div class="summary-card__data">
              <span class="label">Average Monthly</span>
              <span class="value amount">RWF 5,000</span>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Progress Section -->
      <BaseCard variant="elevated" padding="lg" class="progress-section" v-motion-fade>
        <div class="progress-header">
          <h3>2026 Payment Progress</h3>
          <span class="progress-count">{{ paidMonthsCount }}/12 Months Paid</span>
        </div>
        <BaseProgressBar
          :value="paidMonthsCount"
          :max="12"
          variant="success"
          show-value
        />
        <p class="progress-hint">Regular payments keep your service active and avoid late fees.</p>
      </BaseCard>

      <!-- Monthly Table -->
      <div class="table-section" v-motion-fade>
        <div class="section-header">
          <h3>Monthly Details</h3>
          <BaseButton 
            variant="primary" 
            size="sm" 
            iconLeft="ph:download-simple"
            @click="downloadReport"
          >
            Download History
          </BaseButton>
        </div>
        <BaseTable
          :columns="debtColumns"
          :rows="unpaidMonthlyDetails"
          :clickable="true"
          :striped="true"
          @row-click="handleRowClick"
        >
          <template #cell-status="{ value }">
            <BaseBadge :variant="getStatusVariant(value)" size="sm">
              {{ value }}
            </BaseBadge>
          </template>
          <template #cell-amount="{ value }">
            <span class="amount">RWF {{ value.toLocaleString() }}</span>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Detail Modal -->
    <BaseModal
      v-model="showDetailModal"
      :title="selectedMonth?.month + ' Payment Details'"
      size="md"
    >
      <div v-if="selectedMonth" class="month-detail-content">
        <div class="detail-summary">
          <div class="detail-item">
            <span class="label">Base Service Fee</span>
            <span class="value">RWF {{ selectedMonth.baseAmount.toLocaleString() }}</span>
          </div>
          <div v-if="selectedMonth.lateFee > 0" class="detail-item">
            <span class="label">Late Fee</span>
            <span class="value text-danger">+ RWF {{ selectedMonth.lateFee.toLocaleString() }}</span>
          </div>
          <div v-if="selectedMonth.specialFee > 0" class="detail-item">
            <span class="label">Special Collection</span>
            <span class="value">+ RWF {{ selectedMonth.specialFee.toLocaleString() }}</span>
          </div>
          <div class="detail-divider"></div>
          <div class="detail-item total">
            <span class="label">Total for Month</span>
            <span class="value">RWF {{ selectedMonth.amount.toLocaleString() }}</span>
          </div>
        </div>
        
        <div class="detail-status">
          <Icon :icon="selectedMonth.status === 'Paid' ? 'ph:check-circle-fill' : 'ph:warning-circle-fill'" 
                :class="selectedMonth.status === 'Paid' ? 'text-success' : 'text-danger'" />
          <span>Status: <strong>{{ selectedMonth.status }}</strong></span>
        </div>

        <div class="modal-actions">
          <BaseButton v-if="selectedMonth.status !== 'Paid'" variant="primary" block @click="openPaymentModal">
            Pay Month Now
          </BaseButton>
          <BaseButton variant="ghost" block @click="showDetailModal = false">
            Close
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import BaseTable from '../components/base/BaseTable.vue'
import BaseProgressBar from '../components/base/BaseProgressBar.vue'
import BaseModal from '../components/base/BaseModal.vue'
import DebtBanner from '../components/domain/debt/DebtBanner.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Mock Debt Info
const debtInfo = ref({
  totalDebt: 24000,
  weeksOwed: 12,
  monthsBehind: 3
})

const paidMonthsCount = ref(9)

// Monthly Details Table
const debtColumns = [
  { key: 'month', label: 'Month', sortable: true },
  { key: 'amount', label: 'Amount', align: 'right' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'dueDate', label: 'Due Date' }
]

const monthlyDetails = ref([
  { month: 'April 2026', amount: 5000, status: 'Pending', dueDate: 'Apr 30, 2026', baseAmount: 5000, lateFee: 0, specialFee: 0 },
  { month: 'March 2026', amount: 9500, status: 'Overdue', dueDate: 'Mar 31, 2026', baseAmount: 5000, lateFee: 1500, specialFee: 3000 },
  { month: 'February 2026', amount: 9500, status: 'Overdue', dueDate: 'Feb 28, 2026', baseAmount: 5000, lateFee: 1500, specialFee: 3000 },
  { month: 'January 2026', amount: 5000, status: 'Paid', dueDate: 'Jan 31, 2026', baseAmount: 5000, lateFee: 0, specialFee: 0 },
  { month: 'December 2025', amount: 5000, status: 'Paid', dueDate: 'Dec 31, 2025', baseAmount: 5000, lateFee: 0, specialFee: 0 },
  { month: 'November 2025', amount: 5000, status: 'Paid', dueDate: 'Nov 30, 2025', baseAmount: 5000, lateFee: 0, specialFee: 0 },
  { month: 'October 2025', amount: 5000, status: 'Paid', dueDate: 'Oct 31, 2025', baseAmount: 5000, lateFee: 0, specialFee: 0 },
])

const unpaidMonthlyDetails = computed(() => monthlyDetails.value.filter(item => item.status !== 'Paid'))

const showDetailModal = ref(false)
const selectedMonth = ref<any>(null)

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Paid': return 'success'
    case 'Overdue': return 'danger'
    default: return 'warning'
  }
}

const handleRowClick = (row: any) => {
  selectedMonth.value = row
  showDetailModal.value = true
}

const openPaymentModal = () => {
  router.push('/pay')
}

const downloadReport = () => {
  alert('Downloading payment report...')
}
</script>

<style scoped>
@import '../assets/styles/tokens.css';

.debts-view {
  padding: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.hero-card {
  background: linear-gradient(135deg, white 0%, var(--color-neutral-50) 100%);
  border: 1px solid var(--color-border-default);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.hero-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, var(--color-primary-500), var(--color-primary-700));
}

.hero-card::before {
  content: '';
  position: absolute;
  top: -50px;
  right: -50px;
  width: 150px;
  height: 150px;
  background: var(--color-primary-500);
  opacity: 0.03;
  border-radius: 50%;
  pointer-events: none;
}

.header-main-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-6);
}

.view-title {
  font-size: var(--text-2xl);
  font-weight: 900;
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary-600) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.04em;
  margin-bottom: var(--space-1);
}

.view-description {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 500;
  opacity: 0.8;
  max-width: 600px;
}

/* Banner */
.banner-section {
  margin-bottom: var(--space-2);
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.summary-card {
  border-left: 4px solid transparent;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.summary-card__content {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.summary-card__icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.icon--danger { background: var(--color-danger-light); color: var(--color-danger-dark); }
.icon--warning { background: var(--color-warning-light); color: var(--color-warning-dark); }
.icon--primary { background: var(--color-primary-light); color: var(--color-primary-dark); }

.summary-card__data {
  display: flex;
  flex-direction: column;
}

.summary-card__data .label {
  font-size: var(--text-xs);
  text-transform: uppercase;
  color: var(--color-text-secondary);
  font-weight: 600;
  letter-spacing: var(--tracking-wider);
}

.summary-card__data .value {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-text-primary);
}

.amount {
  font-family: var(--font-mono);
}

/* Progress Section */
.progress-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  background: linear-gradient(to right, white, var(--color-neutral-50));
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-header h3 {
  font-size: var(--text-lg);
  font-weight: 700;
}

.progress-count {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-success-dark);
}

.progress-hint {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
  margin-top: var(--space-2);
}

/* Table Section */
.table-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: var(--text-lg);
  font-weight: 700;
}

/* Modal Content */
.month-detail-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.detail-summary {
  background: var(--color-neutral-50);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-sm);
}

.detail-item.total {
  font-weight: 700;
  font-size: var(--text-base);
  margin-top: var(--space-1);
}

.detail-divider {
  height: 1px;
  background: var(--color-border-default);
  margin: var(--space-1) 0;
}

.detail-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  justify-content: center;
  padding: var(--space-4);
  border: 1px dashed var(--color-border-default);
  border-radius: var(--radius-lg);
}

.detail-status svg { font-size: 24px; }

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.text-danger { color: var(--color-danger); }
.text-success { color: var(--color-success); }

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
