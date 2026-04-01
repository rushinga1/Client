<template>
  <div class="payment-evidence">
    <!-- Verification Status Banner -->
    <div class="evidence-header">
      <div class="evidence-status">
        <Icon icon="ph:check-circle-fill" />
        <div class="status-content">
          <span class="status-badge">PAYMENT VERIFIED</span>
          <span class="status-time">{{ verifiedTime }}</span>
        </div>
      </div>
      <div class="evidence-actions">
        <button class="action-btn action-btn--icon" title="Download receipt">
          <Icon icon="ph:download" />
        </button>
        <button class="action-btn action-btn--icon" title="View original receipt">
          <Icon icon="ph:link" />
        </button>
        <button class="action-btn action-btn--icon action-btn--danger" title="Report issue">
          <Icon icon="ph:flag" />
        </button>
      </div>
    </div>

    <!-- Receipt Style Layout -->
    <div class="receipt-container">
      <!-- Amount as Hero Element -->
      <div class="receipt-hero">
        <span class="hero-currency">RWF</span>
        <span class="hero-amount">{{ formatCurrency(amount) }}</span>
        <span class="hero-label">Payment Confirmed</span>
      </div>

      <!-- Payment Method Section -->
      <div class="receipt-section">
        <div class="section-label">Payment Method</div>
        <div class="method-display">
          <div class="method-icon">
            <Icon :icon="getMethodIcon(method)" />
          </div>
          <div class="method-details">
            <div class="method-name">{{ method }}</div>
            <div class="method-phone">{{ formatPhone(phone) }}</div>
          </div>
        </div>
      </div>

      <!-- Transaction IDs Section -->
      <div class="receipt-section">
        <div class="section-label">Transaction Details</div>
        <div class="tx-grid">
          <div class="tx-item">
            <span class="tx-label">Transaction ID</span>
            <span class="tx-id">{{ transactionId }}</span>
          </div>
          <div class="tx-item">
            <span class="tx-label">Reference Code</span>
            <span class="tx-id">{{ referenceCode }}</span>
          </div>
        </div>
      </div>

      <!-- Timing Section -->
      <div class="receipt-section">
        <div class="section-label">Transaction Time</div>
        <div class="timing-grid">
          <div class="timing-item">
            <span class="timing-label">Date</span>
            <span class="timing-value">{{ paymentDate }}</span>
          </div>
          <div class="timing-item">
            <span class="timing-label">Time</span>
            <span class="timing-value">{{ paymentTime }}</span>
          </div>
          <div class="timing-item">
            <span class="timing-label">Verified</span>
            <span class="timing-value">{{ verifyTime }}</span>
          </div>
        </div>
      </div>

      <!-- Customer Context Box -->
      <div class="customer-context">
        <div class="context-icon">
          <Icon icon="ph:user-circle" />
        </div>
        <div class="context-content">
          <div class="context-label">Paid by</div>
          <div class="context-name">{{ customerName }}</div>
          <div class="context-location">
            <Icon icon="ph:map-pin" />
            {{ houseLocation }}
          </div>
        </div>
      </div>

      <!-- Supporting Details -->
      <div class="receipt-section">
        <div class="section-label">Additional Information</div>
        <div class="details-grid">
          <div class="detail-row">
            <span class="detail-label">Weeks Paid</span>
            <span class="detail-value">{{ weekCount }} week{{ weekCount !== 1 ? 's' : '' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Category</span>
            <span class="detail-value">{{ customerCategory }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="evidence-footer">
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:download" />
        Download Receipt
      </button>
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:link" />
        View Original
      </button>
      <button class="footer-btn footer-btn--danger">
        <Icon icon="ph:flag" />
        Report Issue
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  amount: number
  paymentDate: string
  paymentTime: string
  transactionId: string
  referenceCode: string
  method: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
  phone: string
  customerName: string
  houseLocation: string
  customerCategory: string
  weekCount?: number
  verifyTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  weekCount: 1,
  verifyTime: '2 min ago'
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatPhone = (phone: string) => {
  // Format as: +250 788 *** 3456
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `+250 788 *** ${last4}`
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

const verifiedTime = computed(() => {
  return `Verified ${props.verifyTime}`
})
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.payment-evidence {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 1px solid #dbeafe;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

/* Header with Verification Status */
.evidence-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid #dbeafe;
}

.evidence-status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: #1e3a8a;
}

.evidence-status svg {
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
  color: #1e3a8a;
}

.status-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #65a30d;
  font-weight: var(--font-medium);
}

.evidence-actions {
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
  border: 1px solid #dbeafe;
  border-radius: var(--radius-md);
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #f0f9ff;
}

.action-btn--icon svg {
  width: 16px;
  height: 16px;
}

.action-btn--danger:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

/* Receipt Container */
.receipt-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Hero Amount */
.receipt-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
  background: white;
  border-radius: var(--radius-lg);
  border: 2px solid #dbeafe;
  text-align: center;
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
  font-size: 48px;
  font-weight: var(--font-extrabold);
  color: #1e3a8a;
  line-height: 1;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #65a30d;
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

/* Receipt Sections */
.receipt-section {
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

/* Payment Method */
.method-display {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.method-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: #f0f9ff;
  color: #1e3a8a;
  flex-shrink: 0;
}

.method-icon svg {
  width: 24px;
  height: 24px;
}

.method-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.method-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.method-phone {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Transaction Grid */
.tx-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-3);
}

.tx-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.tx-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tx-id {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  word-break: break-all;
}

/* Timing Grid */
.timing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.timing-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
  text-align: center;
}

.timing-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timing-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

/* Customer Context Box */
.customer-context {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border: 2px solid #dbeafe;
  border-radius: var(--radius-lg);
}

.context-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: #eff6ff;
  color: #3b82f6;
  flex-shrink: 0;
}

.context-icon svg {
  width: 28px;
  height: 28px;
}

.context-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
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

.context-location {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

.context-location svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
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

/* Footer Actions */
.evidence-footer {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid #dbeafe;
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

.footer-btn--secondary {
  color: #475569;
}

.footer-btn--secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.footer-btn--danger {
  border-color: #fecaca;
  color: #dc2626;
}

.footer-btn--danger:hover {
  border-color: #ef4444;
  background: #fef2f2;
  color: #ef4444;
}

.footer-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .payment-evidence {
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .receipt-hero {
    padding: var(--space-4);
  }

  .hero-amount {
    font-size: 36px;
  }

  .tx-grid {
    grid-template-columns: 1fr;
  }

  .timing-grid {
    grid-template-columns: 1fr;
  }

  .customer-context {
    gap: var(--space-3);
    padding: var(--space-3);
  }

  .context-icon {
    width: 48px;
    height: 48px;
  }

  .context-icon svg {
    width: 24px;
    height: 24px;
  }

  .evidence-footer {
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .evidence-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .evidence-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-amount {
    font-size: 32px;
  }

  .tx-grid,
  .timing-grid {
    grid-template-columns: 1fr;
  }
}
</style>
