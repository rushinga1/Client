<template>
  <div class="refund-record-container">
    <!-- Compact Card (Click to open modal) -->
    <div 
      class="compact-card"
      :class="[{ 'compact-card--expanded': isOpen }, `compact-card--${status.toLowerCase()}`]"
      @click="isOpen = true"
    >
      <div class="compact-status">
        <Icon :icon="statusIcon" class="status-icon" />
        <span class="status-label">{{ status }}</span>
      </div>
      <div class="compact-amount">
        <span class="currency">RWF</span>
        <span class="amount" :class="`amount--${type.toLowerCase()}`">{{ formatCurrency(refundAmount) }}</span>
      </div>
      <div class="compact-meta">
        <div class="meta-item">
          <span class="meta-label">{{ type }}</span>
          <span class="meta-value">{{ reason }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Date</span>
          <span class="meta-value">{{ refundDate }}</span>
        </div>
      </div>
      <div class="compact-cta">
        <span class="cta-text">View Details</span>
        <Icon icon="ph:arrow-right" />
      </div>
    </div>

    <!-- Modal Overlay -->
    <Teleport to="body">
      <transition
        name="modal-fade"
        @after-leave="isOpen = false"
      >
        <div v-show="isOpen" class="modal-overlay" @click.self="closeModal">
          <!-- Modal Content -->
          <div class="modal-content" @click.stop>
            <!-- Close Button -->
            <button 
              class="modal-close"
              @click="closeModal"
              aria-label="Close modal"
              title="Close"
            >
              <Icon icon="ph:x" />
            </button>

            <!-- Refund Status Badge -->
            <div class="modal-header">
              <div class="refund-badge" :class="`refund-badge--${status.toLowerCase()}`">
                <Icon :icon="statusIcon" class="badge-icon" />
                <div class="badge-content">
                  <span class="badge-text">{{ status }}</span>
                  <span class="badge-time">{{ processedTime }}</span>
                </div>
              </div>
              <div class="refund-type-badge" :class="`refund-type--${type.toLowerCase()}`">
                {{ type }}
              </div>
            </div>

            <!-- Refund Amount Hero Section -->
            <div class="modal-hero" :class="`modal-hero--${type.toLowerCase()}`">
              <span class="hero-label">Refund Amount</span>
              <div class="hero-amount">
                <span class="hero-currency">RWF</span>
                <span class="hero-value">{{ formatCurrency(refundAmount) }}</span>
              </div>
              <span class="hero-reason">{{ reason }}</span>
            </div>

            <!-- Refund Details -->
            <div class="modal-section">
              <h3 class="section-title">Refund Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Refund ID</span>
                  <span class="detail-value detail-value--monospace">{{ refundId }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Original Transaction</span>
                  <span class="detail-value detail-value--monospace">{{ originalTransactionId }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Original Amount</span>
                  <span class="detail-value">{{ formatCurrency(originalAmount) }} RWF</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Refund Type</span>
                  <span class="detail-value">{{ type }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Reason</span>
                  <span class="detail-value">{{ reason }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">{{ status }}</span>
                </div>
              </div>
            </div>

            <!-- Timeline Section -->
            <div class="modal-section">
              <h3 class="section-title">Timeline</h3>
              <div class="timeline">
                <div class="timeline-item timeline-item--initiated">
                  <div class="timeline-marker">
                    <Icon icon="ph:check-circle-fill" />
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-label">Refund Initiated</span>
                    <span class="timeline-date">{{ initiatedDate }} at {{ initiatedTime }}</span>
                  </div>
                </div>

                <div class="timeline-item" :class="`timeline-item--${status.toLowerCase()}`">
                  <div class="timeline-marker">
                    <Icon :icon="statusIcon" />
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-label">{{ status }}</span>
                    <span class="timeline-date">{{ processedDate }} at {{ processedTime }}</span>
                  </div>
                </div>

                <div v-if="completedDate" class="timeline-item timeline-item--completed">
                  <div class="timeline-marker">
                    <Icon icon="ph:check-circle-fill" />
                  </div>
                  <div class="timeline-content">
                    <span class="timeline-label">Refund Completed</span>
                    <span class="timeline-date">{{ completedDate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment Method -->
            <div class="modal-section">
              <h3 class="section-title">Refund Destination</h3>
              <div class="method-box">
                <div class="method-header">
                  <Icon :icon="getMethodIcon(refundMethod)" class="method-icon" />
                  <div class="method-details">
                    <span class="method-label">Refunded To</span>
                    <span class="method-name">{{ refundMethod }}</span>
                  </div>
                </div>
                <div class="method-phone">
                  <Icon icon="ph:phone" class="phone-icon" />
                  <span>{{ formatPhone(refundPhone) }}</span>
                </div>
              </div>
            </div>

            <!-- Notes Section -->
            <div v-if="notes" class="modal-section">
              <h3 class="section-title">Notes</h3>
              <div class="notes-box">
                <p>{{ notes }}</p>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button class="action-button action-button--secondary">
                <Icon icon="ph:download" />
                <span>Download Receipt</span>
              </button>
              <button class="action-button action-button--secondary">
                <Icon icon="ph:receipt" />
                <span>View Original</span>
              </button>
              <button class="action-button action-button--warning">
                <Icon icon="ph:warning" />
                <span>Report Issue</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  refundAmount: number
  originalAmount: number
  reason: string
  type: 'Full Reversal' | 'Partial Refund' | 'Dispute Adjustment'
  status: 'Processed' | 'Pending' | 'Failed'
  refundId: string
  originalTransactionId: string
  refundDate: string
  initiatedDate: string
  initiatedTime: string
  processedDate: string
  processedTime: string
  completedDate?: string
  refundMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
  refundPhone: string
  notes?: string
}

const props = defineProps<Props>()
const isOpen = ref(false)

const statusIcon = computed(() => {
  switch (props.status) {
    case 'Processed':
      return 'ph:check-circle-fill'
    case 'Pending':
      return 'ph:hourglass-medium-fill'
    case 'Failed':
      return 'ph:x-circle-fill'
    default:
      return 'ph:circle'
  }
})

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

const closeModal = () => {
  isOpen.value = false
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

.refund-record-container {
  display: contents;
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPACT CARD
───────────────────────────────────────────────────────────────────────────────── */
.compact-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%);
  border: 1px solid #fcd34d;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  overflow: hidden;
}

.compact-card--processed {
  background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 100%);
  border-color: #86efac;
}

.compact-card--pending {
  background: linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%);
  border-color: #fcd34d;
}

.compact-card--failed {
  background: linear-gradient(135deg, #fef2f2 0%, #f8fafc 100%);
  border-color: #fecaca;
}

.compact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.compact-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.compact-card--processed:hover {
  border-color: #4ade80;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.15);
}

.compact-card--pending:hover {
  border-color: #facc15;
  box-shadow: 0 8px 24px rgba(234, 179, 8, 0.15);
}

.compact-card--failed:hover {
  border-color: #f87171;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.15);
}

.compact-card:hover::before {
  opacity: 1;
}

.compact-card--expanded {
  opacity: 0.5;
}

.compact-status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.compact-card--processed .compact-status {
  color: #1e3a8a;
}

.compact-card--pending .compact-status {
  color: #ea580c;
}

.compact-card--failed .compact-status {
  color: #dc2626;
}

.status-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.compact-amount {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  line-height: 1;
}

.currency {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
}

.amount {
  font-family: var(--font-mono);
  font-size: var(--text-2xl);
  font-weight: var(--font-extrabold);
}

.amount--full\ reversal {
  color: #dc2626;
}

.amount--partial\ refund {
  color: #ea580c;
}

.amount--dispute\ adjustment {
  color: #f59e0b;
}

.compact-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.meta-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.compact-cta {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  margin-top: var(--space-2);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
}

.compact-card--processed .compact-cta {
  color: #1e3a8a;
}

.compact-card--pending .compact-cta {
  color: #ea580c;
}

.compact-card--failed .compact-cta {
  color: #dc2626;
}

.compact-cta svg {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.compact-card:hover .compact-cta svg {
  transform: translateX(2px);
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL OVERLAY
───────────────────────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: var(--space-4);
  animation: fadeIn 0.25s cubic-bezier(0.19, 1, 0.22, 1);
  will-change: opacity;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: white;
  border-radius: var(--radius-xl);
  padding: var(--space-5);
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  animation: slideUp 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal-close {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease;
  z-index: 10;
}

.modal-close:hover {
  background: var(--color-neutral-100);
  color: var(--color-text-primary);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid #f1f5f9;
}

.refund-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.refund-badge--processed {
  color: #1e3a8a;
}

.refund-badge--pending {
  color: #ea580c;
}

.refund-badge--failed {
  color: #dc2626;
}

.badge-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.badge-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.badge-text {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-extrabold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.badge-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.refund-badge--processed .badge-time {
  color: #65a30d;
}

.refund-badge--pending .badge-time {
  color: #d97706;
}

.refund-badge--failed .badge-time {
  color: #f87171;
}

.refund-type-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  border-radius: var(--radius-md);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.refund-type--full\ reversal {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.refund-type--partial\ refund {
  background: #fed7aa;
  color: #ea580c;
  border: 1px solid #fdba74;
}

.refund-type--dispute\ adjustment {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
}

/* Modal Hero Section */
.modal-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6);
  border-radius: var(--radius-lg);
  border: 2px solid;
  text-align: center;
}

.modal-hero--full\ reversal {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.modal-hero--partial\ refund {
  background: #fed7aa;
  border-color: #fdba74;
  color: #ea580c;
}

.modal-hero--dispute\ adjustment {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #d97706;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  opacity: 0.8;
}

.hero-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: var(--space-2);
  line-height: 1;
}

.hero-currency {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  opacity: 0.8;
}

.hero-value {
  font-family: var(--font-mono);
  font-size: var(--text-4xl);
  font-weight: var(--font-extrabold);
}

.hero-reason {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  opacity: 0.8;
}

/* Modal Sections */
.modal-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.section-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-primary);
  margin: 0;
}

/* Details Grid */
.details-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.detail-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.detail-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.detail-value--monospace {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  background: #f1f5f9;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  word-break: break-all;
  letter-spacing: 0.5px;
  color: #64748b;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.timeline-item {
  display: flex;
  gap: var(--space-3);
}

.timeline-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  color: white;
  font-size: 16px;
}

.timeline-item--initiated .timeline-marker {
  background: #1e3a8a;
}

.timeline-item--processed .timeline-marker {
  background: #1e3a8a;
}

.timeline-item--pending .timeline-marker {
  background: #ea580c;
}

.timeline-item--failed .timeline-marker {
  background: #dc2626;
}

.timeline-item--completed .timeline-marker {
  background: #1e3a8a;
}

.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 2px;
}

.timeline-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.timeline-date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Method Box */
.method-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.method-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.method-icon {
  width: 36px;
  height: 36px;
  color: #f59e0b;
  flex-shrink: 0;
}

.method-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.method-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.method-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.method-phone {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding-top: var(--space-2);
  border-top: 1px solid #e2e8f0;
}

.phone-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* Notes Box */
.notes-box {
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.notes-box p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-normal);
  margin: 0;
}

/* Action Buttons */
.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid #f1f5f9;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.action-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.action-button--secondary {
  grid-column: span 1;
  color: #3b82f6;
  border-color: #dbeafe;
  background: #f0f9ff;
}

.action-button--secondary:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
}

.action-button--warning {
  grid-column: span 1;
  color: #d97706;
  border-color: #fcd34d;
  background: #fef3c7;
}

.action-button--warning:hover {
  background: #fef08a;
  border-color: #f59e0b;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────────────────────────────────────────── */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
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
  transition: opacity 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* ─────────────────────────────────────────────────────────────────────────────
   RESPONSIVE
───────────────────────────────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .compact-card {
    padding: var(--space-3) var(--space-4);
  }

  .modal-content {
    padding: var(--space-6);
    max-width: calc(100% - var(--space-4) * 2);
    border-radius: var(--radius-lg);
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .action-button--danger {
    grid-column: span 2;
  }
}
</style>
