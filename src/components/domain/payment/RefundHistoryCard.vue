<template>
  <div class="refund-record" :class="`refund-record--${status}`">
    <!-- Status Banner -->
    <div class="record-header">
      <div class="record-status">
        <Icon :icon="getStatusIcon(status)" />
        <div class="status-content">
          <span class="status-badge">{{ getStatusLabel(status) }}</span>
          <span class="status-time">{{ processedTime }}</span>
        </div>
      </div>
      <div class="record-actions">
        <button class="action-btn action-btn--icon" title="Download receipt">
          <Icon icon="ph:download" />
        </button>
        <button class="action-btn action-btn--icon" title="View details">
          <Icon icon="ph:eye" />
        </button>
      </div>
    </div>

    <!-- Record Container -->
    <div class="record-container">
      <!-- Amount as Hero -->
      <div class="record-hero">
        <div class="hero-badge" :class="`hero-badge--${status}`">-</div>
        <div class="hero-content">
          <span class="hero-currency">RWF</span>
          <span class="hero-amount">{{ formatCurrency(amount) }}</span>
          <span class="hero-label">Refunded</span>
        </div>
      </div>

      <!-- Refund Reason -->
      <div class="record-section">
        <div class="section-label">Refund Reason</div>
        <div class="reason-box">
          <div class="reason-icon">
            <Icon :icon="getReasonIcon(reason)" />
          </div>
          <div class="reason-content">
            <div class="reason-title">{{ reason }}</div>
            <div class="reason-description">{{ reasonDescription }}</div>
          </div>
        </div>
      </div>

      <!-- Original Transaction -->
      <div class="record-section">
        <div class="section-label">Original Transaction</div>
        <div class="transaction-info">
          <div class="info-item">
            <span class="info-label">Transaction ID</span>
            <span class="info-value mono">{{ originalTxId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Original Amount</span>
            <span class="info-value">{{ formatCurrency(originalAmount) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Original Date</span>
            <span class="info-value">{{ originalDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Payment Method</span>
            <span class="info-value">{{ paymentMethod }}</span>
          </div>
        </div>
      </div>

      <!-- Refund Timeline -->
      <div class="record-section">
        <div class="section-label">Refund Processing</div>
        <div class="timeline">
          <div class="timeline-item timeline-item--processed">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-time">Initiated {{ requestedDate }}</div>
              <div class="timeline-label">Refund request processed</div>
            </div>
          </div>
          <div class="timeline-item" :class="`timeline-item--${status}`">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-time">{{ processedDate }}</div>
              <div class="timeline-label">{{ getStatusLabel(status) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Destination Info -->
      <div class="record-section">
        <div class="section-label">Refund Destination</div>
        <div class="destination-box">
          <div class="dest-icon">
            <Icon :icon="getMethodIcon(paymentMethod)" />
          </div>
          <div class="dest-content">
            <div class="dest-method">{{ paymentMethod }}</div>
            <div class="dest-phone">{{ formatPhone(phone) }}</div>
            <div v-if="refundCode" class="dest-code">Refund Code: {{ refundCode }}</div>
          </div>
        </div>
      </div>

      <!-- Additional Details -->
      <div class="record-section">
        <div class="section-label">Additional Information</div>
        <div class="details-grid">
          <div class="detail-row">
            <span class="detail-label">Weeks Affected</span>
            <span class="detail-value">{{ weeksAffected }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Processed by</span>
            <span class="detail-value">{{ processedBy }}</span>
          </div>
        </div>
      </div>

      <!-- Status Notes (if applicable) -->
      <div v-if="notes" class="record-section">
        <div class="section-label">Notes</div>
        <div class="notes-box">{{ notes }}</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="record-footer">
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:download" />
        Download Proof
      </button>
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:eye" />
        View Details
      </button>
      <button v-if="status === 'pending'" class="footer-btn footer-btn--warning">
        <Icon icon="ph:warning-circle" />
        Approve Refund
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  amount: number
  reason: string
  reasonDescription: string
  originalTxId: string
  originalAmount: number
  originalDate: string
  paymentMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
  phone: string
  requestedDate: string
  processedDate: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  refundCode?: string
  weeksAffected: string
  processedBy: string
  notes?: string
  processedTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  processedTime: '1 hour ago'
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-RW')
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `+250 788 *** ${last4}`
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return 'ph:hourglass'
    case 'processing':
      return 'ph:gear'
    case 'completed':
      return 'ph:check-circle-fill'
    case 'failed':
      return 'ph:x-circle-fill'
    default:
      return 'ph:info-circle-fill'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'PENDING APPROVAL'
    case 'processing':
      return 'PROCESSING'
    case 'completed':
      return 'REFUNDED'
    case 'failed':
      return 'REFUND FAILED'
    default:
      return 'REFUND'
  }
}

const getReasonIcon = (reason: string) => {
  if (reason.toLowerCase().includes('duplicate')) return 'ph:copy'
  if (reason.toLowerCase().includes('overpayment')) return 'ph:exceeds'
  if (reason.toLowerCase().includes('failed')) return 'ph:x-circle'
  if (reason.toLowerCase().includes('cancel')) return 'ph:x-square'
  return 'ph:arrow-left'
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
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.refund-record {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid #fed7aa;
}

.refund-record--pending {
  background: linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%);
  border-color: #fcd34d;
}

.refund-record--processing {
  background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 100%);
  border-color: #93c5fd;
}

.refund-record--completed {
  background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 100%);
  border-color: #86efac;
}

.refund-record--failed {
  background: linear-gradient(135deg, #fee2e2 0%, #f8fafc 100%);
  border-color: #fca5a5;
}

/* Header */
.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid currentColor;
  opacity: 0.3;
}

.refund-record--pending .record-header {
  border-bottom-color: #fcd34d;
}

.refund-record--processing .record-header {
  border-bottom-color: #93c5fd;
}

.refund-record--completed .record-header {
  border-bottom-color: #86efac;
}

.refund-record--failed .record-header {
  border-bottom-color: #fca5a5;
}

.record-status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.refund-record--pending .record-status {
  color: #d97706;
}

.refund-record--processing .record-status {
  color: #3b82f6;
}

.refund-record--completed .record-status {
  color: #1e3a8a;
}

.refund-record--failed .record-status {
  color: #dc2626;
}

.record-status svg {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.status-badge {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-extrabold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.refund-record--pending .status-badge {
  color: #d97706;
}

.refund-record--processing .status-badge {
  color: #3b82f6;
}

.refund-record--completed .status-badge {
  color: #1e3a8a;
}

.refund-record--failed .status-badge {
  color: #dc2626;
}

.status-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.refund-record--pending .status-time {
  color: #b45309;
}

.refund-record--processing .status-time {
  color: #1e40af;
}

.refund-record--completed .status-time {
  color: #1e293b;
}

.refund-record--failed .status-time {
  color: #b91c1c;
}

.record-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid currentColor;
  border-radius: var(--radius-md);
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all var(--duration-fast);
  opacity: 0.6;
}

.action-btn:hover {
  opacity: 1;
}

.refund-record--pending .action-btn:hover {
  border-color: #d97706;
  color: #d97706;
  background: #fef3c7;
}

.refund-record--completed .action-btn:hover {
  border-color: #1e3a8a;
  color: #1e3a8a;
  background: #dbeafe;
}

.action-btn--icon svg {
  width: 16px;
  height: 16px;
}

/* Container */
.record-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Hero */
.record-hero {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: white;
  border-radius: var(--radius-lg);
  border: 2px solid currentColor;
  opacity: 0.2;
}

.refund-record--pending .record-hero {
  border-color: #d97706;
}

.refund-record--processing .record-hero {
  border-color: #3b82f6;
}

.refund-record--completed .record-hero {
  border-color: #1e3a8a;
}

.refund-record--failed .record-hero {
  border-color: #dc2626;
}

.hero-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  font-size: 32px;
  font-weight: var(--font-extrabold);
  flex-shrink: 0;
  color: white;
}

.hero-badge--pending {
  background: #fbbf24;
}

.hero-badge--processing {
  background: #60a5fa;
}

.hero-badge--completed {
  background: #34d399;
}

.hero-badge--failed {
  background: #f87171;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-currency {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #78716c;
}

.hero-amount {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: var(--font-extrabold);
  line-height: 1;
}

.refund-record--pending .hero-amount {
  color: #b45309;
}

.refund-record--processing .hero-amount {
  color: #1e40af;
}

.refund-record--completed .hero-amount {
  color: #1e293b;
}

.refund-record--failed .hero-amount {
  color: #991b1b;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.refund-record--pending .hero-label {
  color: #d97706;
}

.refund-record--processing .hero-label {
  color: #3b82f6;
}

.refund-record--completed .hero-label {
  color: #1e3a8a;
}

.refund-record--failed .hero-label {
  color: #dc2626;
}

/* Sections */
.record-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-extrabold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #64748b;
}

/* Reason Box */
.reason-box {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.reason-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: #f1f5f9;
  color: #64748b;
  flex-shrink: 0;
}

.reason-icon svg {
  width: 20px;
  height: 20px;
}

.reason-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.reason-title {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.reason-description {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Transaction Info */
.transaction-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.info-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.info-value.mono {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.timeline-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid #e2e8f0;
  position: relative;
}

.timeline-item:first-child {
  border-top: none;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e1;
  flex-shrink: 0;
  margin-top: 4px;
}

.timeline-item--processed .timeline-marker {
  background: #3b82f6;
}

.timeline-item--completed .timeline-marker {
  background: #1e3a8a;
}

.timeline-item--failed .timeline-marker {
  background: #dc2626;
}

.timeline-item--processing .timeline-marker {
  background: #3b82f6;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.timeline-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: #64748b;
}

.timeline-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
}

/* Destination Box */
.destination-box {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.dest-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: #f1f5f9;
  color: #64748b;
  flex-shrink: 0;
}

.dest-icon svg {
  width: 24px;
  height: 24px;
}

.dest-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dest-method {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.dest-phone {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.dest-code {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: #1e3a8a;
  font-weight: var(--font-semibold);
}

/* Details Grid */
.details-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.detail-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
}

.detail-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* Notes Box */
.notes-box {
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}

/* Footer */
.record-footer {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid currentColor;
  opacity: 0.3;
}

.refund-record--pending .record-footer {
  border-top-color: #fcd34d;
}

.refund-record--processing .record-footer {
  border-top-color: #93c5fd;
}

.refund-record--completed .record-footer {
  border-top-color: #86efac;
}

.refund-record--failed .record-footer {
  border-top-color: #fca5a5;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

.footer-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
  color: #475569;
}

.footer-btn--secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.footer-btn--warning {
  background: #fef3c7;
  color: #b45309;
  border-color: #fcd34d;
}

.footer-btn--warning:hover {
  background: #fde68a;
  color: #d97706;
  border-color: #fbbf24;
}

.footer-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .refund-record {
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .record-hero {
    padding: var(--space-4);
  }

  .hero-amount {
    font-size: 24px;
  }

  .transaction-info {
    grid-template-columns: 1fr;
  }

  .record-footer {
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .record-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-amount {
    font-size: 20px;
  }
}
</style>

