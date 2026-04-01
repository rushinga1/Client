<template>
  <div class="statement-container">
    <!-- Statement Header -->
    <div class="statement-header">
      <div class="header-left">
        <h2 class="statement-title">
          <Icon icon="ph:receipt" />
          Payment Account Statement
        </h2>
        <p class="statement-period">
          Statement from {{ formatDate(periodStart) }} to {{ formatDate(periodEnd) }}
        </p>
      </div>
      <div class="header-right">
        <button class="action-btn action-btn--secondary">
          <Icon icon="ph:download" />
          Export PDF
        </button>
        <button class="action-btn action-btn--secondary">
          <Icon icon="ph:printer" />
          Print
        </button>
      </div>
    </div>

    <!-- Summary Stats -->
    <div class="statement-summary">
      <div class="summary-card summary-card--paid">
        <div class="summary-icon">
          <Icon icon="ph:check-circle-fill" />
        </div>
        <div class="summary-content">
          <span class="summary-label">Total Paid</span>
          <span class="summary-amount">{{ formatCurrency(totalPaid) }}</span>
          <span class="summary-detail">{{ paidCount }} payments</span>
        </div>
      </div>

      <div class="summary-card summary-card--pending">
        <div class="summary-icon">
          <Icon icon="ph:hourglass" />
        </div>
        <div class="summary-content">
          <span class="summary-label">Outstanding</span>
          <span class="summary-amount">{{ formatCurrency(totalOutstanding) }}</span>
          <span class="summary-detail">{{ unpaidCount }} weeks</span>
        </div>
      </div>

      <div class="summary-card summary-card--average">
        <div class="summary-icon">
          <Icon icon="ph:chart-line" />
        </div>
        <div class="summary-content">
          <span class="summary-label">Average Payment</span>
          <span class="summary-amount">{{ formatCurrency(averagePayment) }}</span>
          <span class="summary-detail">Per transaction</span>
        </div>
      </div>
    </div>

    <!-- Verified Payments Table -->
    <div class="statement-section">
      <div class="section-header">
        <h3>
          <Icon icon="ph:check-circle-fill" />
          Verified Payments
        </h3>
        <span class="section-count">{{ paidCount }} verified</span>
      </div>

      <div class="payments-table">
        <div class="table-header">
          <div class="col col--date">Date</div>
          <div class="col col--weeks">Weeks</div>
          <div class="col col--method">Payment Method</div>
          <div class="col col--amount">Amount</div>
          <div class="col col--tx">Transaction ID</div>
          <div class="col col--status">Status</div>
        </div>

        <div
          v-for="payment in verifiedPayments"
          :key="payment.id"
          class="table-row table-row--verified"
          @click="expandedPayment = expandedPayment === payment.id ? null : payment.id"
        >
          <div class="col col--date">
            <span class="date-value">{{ formatDate(payment.date) }}</span>
            <span class="date-time">{{ formatTime(payment.date) }}</span>
          </div>
          <div class="col col--weeks">
            <span class="weeks-badge">{{ payment.weeks.length }} weeks</span>
          </div>
          <div class="col col--method">
            <div class="method-display">
              <Icon :icon="getMethodIcon(payment.method)" />
              <span>{{ payment.method }}</span>
            </div>
          </div>
          <div class="col col--amount">
            <span class="amount-verified">{{ formatCurrency(payment.amount) }}</span>
          </div>
          <div class="col col--tx">
            <code class="tx-id">{{ truncateId(payment.txId) }}</code>
          </div>
          <div class="col col--status">
            <span class="status-badge status-badge--verified">
              <Icon icon="ph:check-circle-fill" />
              Verified
            </span>
          </div>
        </div>

        <!-- Expanded Row Detail -->
        <transition>
          <div v-if="expandedPayment" class="table-detail">
            <PaymentEvidenceCard
              :key="`detail-${expandedPayment}`"
              v-bind="getPaymentDetails(expandedPayment)"
              @close="expandedPayment = null"
            />
          </div>
        </transition>
      </div>
    </div>

    <!-- Outstanding Payments -->
    <div v-if="outstandingPayments.length > 0" class="statement-section">
      <div class="section-header">
        <h3>
          <Icon icon="ph:hourglass" />
          Outstanding Payments
        </h3>
        <span class="section-count">{{ unpaidCount }} due</span>
      </div>

      <div class="payments-table">
        <div class="table-header">
          <div class="col col--period">Week</div>
          <div class="col col--amount">Amount Due</div>
          <div class="col col--duedate">Due Date</div>
          <div class="col col--status">Status</div>
          <div class="col col--action">Action</div>
        </div>

        <div
          v-for="payment in outstandingPayments"
          :key="payment.id"
          class="table-row table-row--outstanding"
        >
          <div class="col col--period">
            <span class="period-value">{{ payment.label }}</span>
          </div>
          <div class="col col--amount">
            <span class="amount-outstanding">{{ formatCurrency(payment.amount) }}</span>
          </div>
          <div class="col col--duedate">
            <span class="due-date" :class="getDueDateClass(payment.dueDate)">
              {{ formatDate(payment.dueDate) }}
            </span>
          </div>
          <div class="col col--status">
            <span class="status-badge" :class="getStatusClass(payment.status)">
              {{ formatStatus(payment.status) }}
            </span>
          </div>
          <div class="col col--action">
            <button class="action-link">
              <Icon icon="ph:arrow-right" />
              Pay Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Dispute History (if any) -->
    <div v-if="disputes.length > 0" class="statement-section">
      <div class="section-header">
        <h3>
          <Icon icon="ph:flag" />
          Dispute History
        </h3>
        <span class="section-count">{{ disputes.length }} on record</span>
      </div>

      <div class="disputes-list">
        <div
          v-for="dispute in disputes"
          :key="dispute.id"
          class="dispute-item"
          :class="`dispute-item--${dispute.severity}`"
        >
          <div class="dispute-left">
            <Icon :icon="getDisputeIcon(dispute.severity)" />
            <div class="dispute-info">
              <div class="dispute-title">{{ dispute.type }}</div>
              <div class="dispute-date">{{ formatDate(dispute.reportedAt) }}</div>
            </div>
          </div>
          <div class="dispute-right">
            <span class="dispute-status" :class="`dispute-status--${dispute.status}`">
              {{ formatStatus(dispute.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Notes -->
    <div class="statement-footer">
      <div class="footer-note">
        <Icon icon="ph:info" />
        <p>
          This statement shows all verified payments and outstanding balances. For questions about specific transactions,
          contact our support team or download the full receipt.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import PaymentEvidenceCard from './PaymentEvidenceCard.vue'

interface Payment {
  id: number
  date: string
  weeks: number[]
  amount: number
  method: string
  txId: string
  status: 'verified' | 'pending' | 'failed'
  phone?: string
  customer?: string
}

interface Outstanding {
  id: number
  label: string
  amount: number
  dueDate: string
  status: 'pending' | 'overdue'
}

interface Dispute {
  id: number
  type: string
  reportedAt: string
  severity: 'warning' | 'error' | 'critical'
  status: 'open' | 'in-progress' | 'resolved'
  amount?: number
}

interface Props {
  payments: Payment[]
  outstandingWeeks: Outstanding[]
  disputes?: Dispute[]
  periodStart: string
  periodEnd: string
}

const props = withDefaults(defineProps<Props>(), {
  disputes: () => []
})

const expandedPayment = ref<number | null>(null)

const verifiedPayments = computed(() => {
  return props.payments.filter(p => p.status === 'verified')
})

const outstandingPayments = computed(() => {
  return props.outstandingWeeks.filter(w => w.status === 'pending' || w.status === 'overdue')
})

const paidCount = computed(() => verifiedPayments.value.length)
const unpaidCount = computed(() => outstandingPayments.value.length)

const totalPaid = computed(() => {
  return verifiedPayments.value.reduce((sum, p) => sum + p.amount, 0)
})

const totalOutstanding = computed(() => {
  return outstandingPayments.value.reduce((sum, p) => sum + p.amount, 0)
})

const averagePayment = computed(() => {
  return paidCount.value > 0 ? totalPaid.value / paidCount.value : 0
})

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('en-RW')} RWF`
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')
}

const truncateId = (id: string) => {
  return id.length > 20 ? id.substring(0, 10) + '...' + id.substring(id.length - 10) : id
}

const getMethodIcon = (method: string) => {
  switch (method) {
    case 'MTN MoMo':
      return 'ph:phone'
    case 'Airtel Money':
      return 'ph:phone'
    case 'Bank Transfer':
      return 'ph:bank'
    default:
      return 'ph:credit-card'
  }
}

const getDueDateClass = (dueDate: string) => {
  const now = new Date()
  const due = new Date(dueDate)
  if (due < now) return 'overdue'
  if (due.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) return 'due-soon'
  return 'due-normal'
}

const getStatusClass = (status: string) => {
  return `status-badge--${status}`
}

const getDisputeIcon = (severity: string) => {
  switch (severity) {
    case 'warning':
      return 'ph:warning-circle-fill'
    case 'error':
      return 'ph:x-circle-fill'
    case 'critical':
      return 'ph:prohibit-fill'
    default:
      return 'ph:info-circle-fill'
  }
}

const getPaymentDetails = (paymentId: number) => {
  const payment = props.payments.find(p => p.id === paymentId)
  if (!payment) return {}
  return {
    amount: payment.amount,
    paymentDate: formatDate(payment.date),
    paymentTime: formatTime(payment.date),
    transactionId: payment.txId,
    referenceCode: `REF-${payment.id}`,
    method: payment.method,
    phone: payment.phone || '+250788123456',
    customerName: payment.customer || 'Customer',
    houseLocation: 'Location',
    customerCategory: 'Category',
    weekCount: payment.weeks.length
  }
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.statement-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.statement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.statement-title {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.statement-title svg {
  width: 28px;
  height: 28px;
  color: #3b82f6;
}

.statement-period {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.header-right {
  display: flex;
  gap: var(--space-3);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-md);
  background: white;
  color: #64748b;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.action-btn svg {
  width: 16px;
  height: 16px;
}

/* Summary Stats */
.statement-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.summary-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  background: white;
}

.summary-card--paid {
  border-color: #dbeafe;
  background: #f0f9ff;
}

.summary-card--pending {
  border-color: #fcd34d;
  background: #fef3c7;
}

.summary-card--average {
  border-color: #dbeafe;
  background: #eff6ff;
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.summary-card--paid .summary-icon {
  background: #dbeafe;
  color: #1e3a8a;
}

.summary-card--pending .summary-icon {
  background: #fcd34d;
  color: #d97706;
}

.summary-card--average .summary-icon {
  background: #dbeafe;
  color: #3b82f6;
}

.summary-icon svg {
  width: 24px;
  height: 24px;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.summary-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-amount {
  font-family: var(--font-mono);
  font-size: var(--text-xl);
  font-weight: var(--font-extrabold);
}

.summary-card--paid .summary-amount {
  color: #1e3a8a;
}

.summary-card--pending .summary-amount {
  color: #d97706;
}

.summary-card--average .summary-amount {
  color: #3b82f6;
}

.summary-detail {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Statement Section */
.statement-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-2);
}

.section-header h3 {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-header svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

.section-count {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-medium);
}

/* Payments Table */
.payments-table {
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 140px 100px 150px 120px 180px 120px;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  display: grid;
  grid-template-columns: 140px 100px 150px 120px 180px 120px;
  gap: var(--space-3);
  padding: var(--space-4);
  border-bottom: 1px solid #e2e8f0;
  align-items: center;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.table-row--verified:hover {
  background: #f0f9ff;
}

.table-row--outstanding {
  background: #fef3c7;
}

.col {
  display: flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

.col--date {
  flex-direction: column;
  gap: 2px;
}

.date-value {
  font-weight: var(--font-semibold);
}

.date-time {
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.col--weeks {
  justify-content: center;
}

.weeks-badge {
  padding: 4px 8px;
  border-radius: var(--radius-md);
  background: #dbeafe;
  color: #0369a1;
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.col--method {
  gap: var(--space-2);
}

.col--method svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.col--amount {
  justify-content: flex-end;
}

.amount-verified {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: #1e3a8a;
}

.amount-outstanding {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
  color: #d97706;
}

.col--tx {
  justify-content: center;
}

.tx-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: var(--radius-md);
}

.col--status {
  justify-content: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge--verified {
  background: #dbeafe;
  color: #1e3a8a;
}

.status-badge--pending {
  background: #fef3c7;
  color: #d97706;
}

.status-badge--overdue {
  background: #fee2e2;
  color: #dc2626;
}

.status-badge svg {
  width: 14px;
  height: 14px;
}

/* Outstanding Payment Specific */
.col--period {
  font-weight: var(--font-semibold);
}

.col--duedate {
  justify-content: center;
}

.due-date {
  padding: 4px 8px;
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
}

.due-date.due-normal {
  background: #dbeafe;
  color: #0369a1;
}

.due-date.due-soon {
  background: #fef3c7;
  color: #b45309;
}

.due-date.overdue {
  background: #fee2e2;
  color: #991b1b;
}

.col--action {
  justify-content: center;
}

.action-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: #3b82f6;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  cursor: pointer;
  transition: color var(--duration-fast);
}

.action-link:hover {
  color: #1e40af;
}

.action-link svg {
  width: 14px;
  height: 14px;
}

/* Table Detail Expansion */
.table-detail {
  grid-column: 1 / -1;
  padding: var(--space-4);
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

/* Disputes List */
.disputes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dispute-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border-left: 4px solid;
}

.dispute-item--warning {
  border-left-color: #d97706;
  background: #fef3c7;
}

.dispute-item--error {
  border-left-color: #dc2626;
  background: #fee2e2;
}

.dispute-item--critical {
  border-left-color: #991b1b;
  background: #fef2f2;
}

.dispute-left {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dispute-left svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.dispute-item--warning .dispute-left svg {
  color: #d97706;
}

.dispute-item--error .dispute-left svg {
  color: #dc2626;
}

.dispute-item--critical .dispute-left svg {
  color: #991b1b;
}

.dispute-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dispute-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.dispute-date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.dispute-right {
  display: flex;
  align-items: center;
}

.dispute-status {
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.dispute-status--open {
  background: #fee2e2;
  color: #dc2626;
}

.dispute-status--in-progress {
  background: #dbeafe;
  color: #0369a1;
}

.dispute-status--resolved {
  background: #dbeafe;
  color: #1e3a8a;
}

/* Footer */
.statement-footer {
  display: flex;
  justify-content: center;
  padding: var(--space-6);
}

.footer-note {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  max-width: 600px;
  padding: var(--space-4);
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-md);
}

.footer-note svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.footer-note p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
  margin: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 120px 80px 120px 100px 140px 100px;
    gap: var(--space-2);
    padding: var(--space-3);
  }
}

@media (max-width: 768px) {
  .statement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-4);
  }

  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .statement-summary {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-2);
    padding: var(--space-2);
    font-size: var(--text-xs);
  }

  .col--amount {
    grid-column: 2;
    justify-content: flex-start;
  }

  .col--tx,
  .col--status {
    display: none;
  }
}

@media (max-width: 480px) {
  .statement-title {
    font-size: var(--text-lg);
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: var(--space-2);
    padding: var(--space-2);
  }

  .col {
    flex-direction: row;
  }

  .col::before {
    content: attr(data-label);
    font-weight: var(--font-bold);
    min-width: 80px;
  }
}
</style>

