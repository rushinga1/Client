<template>
  <div class="dispute-record" :class="`dispute-record--${severity}`">
    <!-- Status Banner -->
    <div class="record-header">
      <div class="record-status">
        <Icon :icon="getStatusIcon(severity)" />
        <div class="status-content">
          <span class="status-badge">{{ getStatusLabel(severity) }}</span>
          <span class="status-time">{{ createdTime }}</span>
        </div>
      </div>
      <div class="record-actions">
        <button class="action-btn action-btn--icon" title="View details">
          <Icon icon="ph:note-pencil" />
        </button>
        <button class="action-btn action-btn--icon" title="Add comment">
          <Icon icon="ph:chat" />
        </button>
      </div>
    </div>

    <!-- Record Container -->
    <div class="record-container">
      <!-- Issue Type Hero -->
      <div class="record-hero">
        <div class="hero-icon" :class="`hero-icon--${severity}`">
          <Icon :icon="getIssueIcon(issueType)" />
        </div>
        <div class="hero-content">
          <span class="hero-label">Issue Type</span>
          <span class="hero-title">{{ issueType }}</span>
          <span class="hero-severity">{{ severity | uppercase }}</span>
        </div>
      </div>

      <!-- Issue Details -->
      <div class="record-section">
        <div class="section-label">Issue Details</div>
        <div class="description-box">
          {{ description }}
        </div>
      </div>

      <!-- Affected Payment Info -->
      <div class="record-section">
        <div class="section-label">Affected Payment</div>
        <div class="payment-info">
          <div class="info-item">
            <span class="info-label">Amount Disputed</span>
            <span class="info-value amount">{{ formatCurrency(amount) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Transaction ID</span>
            <span class="info-value mono">{{ transactionId }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Original Date</span>
            <span class="info-value">{{ originalDate }}</span>
          </div>
        </div>
      </div>

      <!-- Customer Context -->
      <div class="customer-context">
        <div class="context-icon">
          <Icon icon="ph:user-circle" />
        </div>
        <div class="context-content">
          <div class="context-label">Reported by</div>
          <div class="context-name">{{ reportedBy }}</div>
          <div class="context-sub">{{ customerRole }}</div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="record-section">
        <div class="section-label">Timeline</div>
        <div class="timeline">
          <div class="timeline-item timeline-item--reported">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-time">Reported {{ reportedDate }}</div>
              <div class="timeline-label">Issue submitted</div>
            </div>
          </div>
          <div v-if="lastUpdate" class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
              <div class="timeline-time">{{ lastUpdate }}</div>
              <div class="timeline-label">Status updated</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resolution Info (if applicable) -->
      <div v-if="resolution" class="record-section">
        <div class="section-label">Resolution</div>
        <div class="resolution-box" :class="`resolution-box--${resolutionStatus}`">
          <div class="resolution-status">{{ resolution }}</div>
          <div class="resolution-details">{{ resolutionDetails }}</div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="record-footer">
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:note-pencil" />
        Edit Details
      </button>
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:chat" />
        Add Comment
      </button>
      <button v-if="severity !== 'resolved'" class="footer-btn footer-btn--primary">
        <Icon icon="ph:check-circle" />
        Mark Resolved
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  issueType: string
  description: string
  amount: number
  transactionId: string
  originalDate: string
  reportedBy: string
  customerRole: string
  reportedDate: string
  severity: 'warning' | 'error' | 'critical' | 'resolved'
  lastUpdate?: string
  resolution?: string
  resolutionStatus?: 'pending' | 'in-progress' | 'resolved'
  resolutionDetails?: string
  createdTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  createdTime: '2 hours ago',
  resolutionStatus: 'pending'
})

const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('en-RW')} RWF`
}

const getStatusIcon = (severity: string) => {
  switch (severity) {
    case 'warning':
      return 'ph:warning-circle-fill'
    case 'error':
      return 'ph:x-circle-fill'
    case 'critical':
      return 'ph:prohibit-fill'
    case 'resolved':
      return 'ph:check-circle-fill'
    default:
      return 'ph:info-circle-fill'
  }
}

const getStatusLabel = (severity: string) => {
  switch (severity) {
    case 'warning':
      return 'DISPUTE FILED'
    case 'error':
      return 'PAYMENT ERROR'
    case 'critical':
      return 'CRITICAL ISSUE'
    case 'resolved':
      return 'RESOLVED'
    default:
      return 'ISSUE REPORTED'
  }
}

const getIssueIcon = (type: string) => {
  if (type.toLowerCase().includes('duplicate')) return 'ph:copy'
  if (type.toLowerCase().includes('failed')) return 'ph:x-circle'
  if (type.toLowerCase().includes('missing')) return 'ph:magnifying-glass'
  if (type.toLowerCase().includes('amount')) return 'ph:calculator'
  return 'ph:warning-circle'
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.dispute-record {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid #fde2e4;
}

.dispute-record--warning {
  background: linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%);
  border-color: #fcd34d;
}

.dispute-record--error {
  background: linear-gradient(135deg, #fee2e2 0%, #f8fafc 100%);
  border-color: #fca5a5;
}

.dispute-record--critical {
  background: linear-gradient(135deg, #fef2f2 0%, #f8fafc 100%);
  border-color: #fecaca;
}

.dispute-record--resolved {
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border-color: #dbeafe;
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

.dispute-record--warning .record-header {
  border-bottom-color: #fcd34d;
}

.dispute-record--error .record-header {
  border-bottom-color: #fca5a5;
}

.dispute-record--critical .record-header {
  border-bottom-color: #fecaca;
}

.dispute-record--resolved .record-header {
  border-bottom-color: #dbeafe;
}

.record-status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dispute-record--warning .record-status {
  color: #d97706;
}

.dispute-record--error .record-status {
  color: #dc2626;
}

.dispute-record--critical .record-status {
  color: #991b1b;
}

.dispute-record--resolved .record-status {
  color: #1e3a8a;
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

.dispute-record--warning .status-badge {
  color: #d97706;
}

.dispute-record--error .status-badge {
  color: #dc2626;
}

.dispute-record--critical .status-badge {
  color: #991b1b;
}

.dispute-record--resolved .status-badge {
  color: #1e3a8a;
}

.status-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.dispute-record--warning .status-time {
  color: #b45309;
}

.dispute-record--error .status-time {
  color: #b91c1c;
}

.dispute-record--critical .status-time {
  color: #7f1d1d;
}

.dispute-record--resolved .status-time {
  color: #1e293b;
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

.dispute-record--warning .action-btn:hover {
  border-color: #d97706;
  color: #d97706;
  background: #fef3c7;
}

.dispute-record--error .action-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  background: #fee2e2;
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
  opacity: 0.15;
}

.dispute-record--warning .record-hero {
  border-color: #d97706;
}

.dispute-record--error .record-hero {
  border-color: #dc2626;
}

.dispute-record--critical .record-hero {
  border-color: #991b1b;
}

.dispute-record--resolved .record-hero {
  border-color: #1e3a8a;
}

.hero-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  flex-shrink: 0;
  color: white;
}

.hero-icon--warning {
  background: #d97706;
}

.hero-icon--error {
  background: #dc2626;
}

.hero-icon--critical {
  background: #991b1b;
}

.hero-icon--resolved {
  background: #1e3a8a;
}

.hero-icon svg {
  width: 28px;
  height: 28px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: #64748b;
}

.hero-title {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
}

.dispute-record--warning .hero-title {
  color: #b45309;
}

.dispute-record--error .hero-title {
  color: #991b1b;
}

.dispute-record--critical .hero-title {
  color: #7f1d1d;
}

.dispute-record--resolved .hero-title {
  color: #166534;
}

.hero-severity {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dispute-record--warning .hero-severity {
  color: #d97706;
}

.dispute-record--error .hero-severity {
  color: #dc2626;
}

.dispute-record--critical .hero-severity {
  color: #991b1b;
}

.dispute-record--resolved .hero-severity {
  color: #1e3a8a;
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

/* Description Box */
.description-box {
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-relaxed);
  color: var(--color-text-primary);
}

/* Payment Info */
.payment-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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

.info-value.amount {
  color: #dc2626;
  font-size: var(--text-base);
}

.info-value.mono {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

/* Customer Context */
.customer-context {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border: 2px solid currentColor;
  opacity: 0.15;
  border-radius: var(--radius-lg);
}

.dispute-record--warning .customer-context {
  border-color: #d97706;
}

.dispute-record--error .customer-context {
  border-color: #dc2626;
}

.context-icon {
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

.context-icon svg {
  width: 24px;
  height: 24px;
}

.context-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.context-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.context-name {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.context-sub {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
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

.timeline-item--reported .timeline-marker {
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

/* Resolution Box */
.resolution-box {
  padding: var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid currentColor;
  background: white;
}

.resolution-box--pending {
  border-color: #fcd34d;
  background: #fef3c7;
}

.resolution-box--in-progress {
  border-color: #93c5fd;
  background: #dbeafe;
}

.resolution-box--resolved {
  border-color: #86efac;
  background: #dbeafe;
}

.resolution-status {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-2);
}

.resolution-box--pending .resolution-status {
  color: #b45309;
}

.resolution-box--in-progress .resolution-status {
  color: #1e40af;
}

.resolution-box--resolved .resolution-status {
  color: #166534;
}

.resolution-details {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: var(--leading-normal);
  opacity: 0.75;
}

/* Footer */
.record-footer {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid currentColor;
  opacity: 0.3;
}

.dispute-record--warning .record-footer {
  border-top-color: #fcd34d;
}

.dispute-record--error .record-footer {
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

.footer-btn--primary {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.footer-btn--primary:hover {
  background: #1e293b;
  border-color: #1e293b;
}

.footer-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .dispute-record {
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .record-hero {
    padding: var(--space-4);
  }

  .hero-title {
    font-size: var(--text-base);
  }

  .payment-info {
    grid-template-columns: 1fr;
  }

  .customer-context {
    gap: var(--space-3);
    padding: var(--space-3);
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
}
</style>

