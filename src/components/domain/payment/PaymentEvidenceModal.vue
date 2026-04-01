<template>
  <div class="payment-evidence-container">
    <!-- Compact Card (Click to open modal) -->
    <div 
      class="compact-card"
      @click="isOpen = true"
    >
      <div class="compact-status">✓ Verified</div>
      <div class="compact-amount">RWF {{ formatCurrency(amount) }}</div>
      <div class="compact-meta">{{ method }} • {{ paymentTime }}</div>
      <div class="compact-cta">Click to view →</div>
    </div>

    <!-- Button below card -->
    <button class="view-receipt-btn" @click="viewReceipt">📄 View Full Receipt</button>

    <!-- Receipt Modal -->
    <Teleport to="body">
      <transition name="modal-fade">
        <div v-show="isOpen" class="modal-overlay" @click.self="closeModal">
          <div class="modal-content" @click.stop="e => e.stopPropagation()">
            <!-- Close Button -->
            <button class="modal-close" @click.stop="closeModal">✕</button>

            <!-- Receipt Header -->
            <div class="receipt-header">
              <div class="receipt-title">PAYMENT RECEIPT</div>
              <div class="receipt-divider"></div>
            </div>

            <!-- Amount Section -->
            <div class="amount-section">
              <div class="amount-label">Amount Paid</div>
              <div class="amount-display">
                <span class="amount-currency">RWF</span>
                <span class="amount-value">{{ formatCurrency(amount) }}</span>
              </div>
              <div class="status-badge">✓ PAID</div>
            </div>

            <div class="receipt-divider"></div>

            <!-- Details Section -->
            <div class="receipt-details">
              <div class="detail-row">
                <span class="detail-key">Date</span>
                <span class="detail-val">{{ paymentDate }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Time</span>
                <span class="detail-val">{{ paymentTime }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Method</span>
                <span class="detail-val">{{ method }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Phone</span>
                <span class="detail-val detail-mono">{{ formatPhone(phone) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Weeks</span>
                <span class="detail-val">{{ weekCount }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">Category</span>
                <span class="detail-val">{{ customerCategory }}</span>
              </div>
            </div>

            <div class="receipt-divider"></div>

            <!-- Transaction IDs -->
            <div class="receipt-details">
              <div class="detail-row">
                <span class="detail-key">TX ID</span>
                <span class="detail-val detail-mono">{{ transactionId }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-key">REF</span>
                <span class="detail-val detail-mono">{{ referenceCode }}</span>
              </div>
            </div>

            <div class="receipt-divider"></div>

            <!-- Customer Info -->
            <div class="customer-section">
              <div class="customer-name">{{ customerName }}</div>
              <div class="customer-location">📍 {{ houseLocation }}</div>
            </div>

            <div class="receipt-divider"></div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  amount: number
  paymentDate: string
  paymentTime: string
  transactionId: string
  referenceCode: string
  method: string
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

const isOpen = ref(false)

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `+250 788 *** ${last4}`
}

const closeModal = () => {
  isOpen.value = false
}

const viewReceipt = () => {
  const query = new URLSearchParams({
    amount: String(props.amount),
    paymentDate: props.paymentDate,
    paymentTime: props.paymentTime,
    transactionId: props.transactionId,
    referenceCode: props.referenceCode,
    method: props.method,
    phone: props.phone,
    customerName: props.customerName,
    houseLocation: props.houseLocation,
    customerCategory: props.customerCategory,
    weekCount: String(props.weekCount)
  })
  window.location.href = `/receipt?${query.toString()}`
  closeModal()
}

// Close modal on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeModal()
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('keydown', handleKeydown)
}
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.payment-evidence-container {
  display: contents;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPACT CARD
───────────────────────────────────────────────────────────────────────────────── */
.compact-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #1e293b;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.compact-card:hover {
  border-color: #1e3a8a;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.15);
  transform: translateY(-1px);
}

.compact-status {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #1e3a8a;
  text-transform: uppercase;
}

.compact-amount {
  font-family: var(--font-mono);
  font-size: 16px;
  font-weight: 700;
  color: #1e3a8a;
}

.compact-meta {
  font-size: 12px;
  color: #475569;
}

.compact-cta {
  font-size: 12px;
  font-weight: 600;
  color: #1e3a8a;
  margin-top: 4px;
}

.card-hidden {
  display: none;
}

.view-receipt-btn {
  width: 100%;
  padding: 10px 12px;
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
}

.view-receipt-btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(30, 58, 138, 0.3);
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL OVERLAY
───────────────────────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 58, 138, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 16px;
  animation: fadeIn 0.25s ease;
  will-change: opacity;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: white;
  border-radius: 0;
  padding: 0;
  max-width: 320px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(30, 58, 138, 0.4);
  position: relative;
  animation: slideUp 0.25s ease;
  max-height: 95vh;
  overflow: hidden;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: rgba(30, 58, 138, 0.1);
  border: none;
  border-radius: 2px;
  color: #1e3a8a;
  cursor: pointer;
  font-size: 18px;
  z-index: 10;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: #1e3a8a;
  color: white;
}

/* Receipt Header */
.receipt-header {
  padding: 16px 12px;
  text-align: center;
  background: #1e3a8a;
  color: white;
}

.receipt-title {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: white;
  margin: 0;
}

.receipt-divider {
  height: 1px;
  background: #cbd5e1;
  margin: 10px 12px;
}

/* Amount Section */
.amount-section {
  padding: 12px;
  text-align: center;
  background: #f8fafc;
}

.amount-label {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1px;
  color: #475569;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.amount-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  margin-bottom: 6px;
}

.amount-currency {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: #1e3a8a;
}

.amount-value {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 700;
  color: #1e3a8a;
}

.status-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1e3a8a;
}

/* Details Grid */
.receipt-details {
  padding: 0 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 11px;
  line-height: 1.5;
  border-bottom: 1px solid #e2e8f0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-key {
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-val {
  font-weight: 500;
  color: #1e293b;
  text-align: right;
  flex: 1;
  margin-left: 12px;
}

.detail-mono {
  font-family: var(--font-mono);
  font-size: 10px;
  word-break: break-all;
}

/* Customer Section */
.customer-section {
  padding: 12px;
  text-align: center;
  background: #f8fafc;
}

.customer-name {
  font-size: 12px;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 4px;
}

.customer-location {
  font-size: 10px;
  color: #475569;
}

/* Footer */
.receipt-footer {
  padding: 12px;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Mobile */
@media (max-width: 640px) {
  .modal-content {
    max-width: calc(100% - 32px);
  }
}
</style>
