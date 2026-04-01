<template>
  <div class="delivery-proof-container">
    <!-- Compact Card (Click to open modal) -->
    <div 
      class="compact-card"
      :class="{ 'compact-card--expanded': isOpen }"
      @click="isOpen = true"
    >
      <div class="compact-status">
        <Icon :icon="statusIcon" class="status-icon" />
        <span class="status-label">{{ status }}</span>
      </div>
      <div class="compact-location">
        <span class="location-text">{{ location }}</span>
      </div>
      <div class="compact-meta">
        <div class="meta-item">
          <span class="meta-label">Delivered</span>
          <span class="meta-value">{{ deliveryTime }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Weight</span>
          <span class="meta-value">{{ weight }}kg</span>
        </div>
      </div>
      <div class="compact-cta">
        <span class="cta-text">View Proof</span>
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

            <!-- Status Badge -->
            <div class="modal-header">
              <div class="status-badge" :class="`status-badge--${status.toLowerCase()}`">
                <Icon :icon="statusIcon" class="badge-icon" />
                <div class="badge-content">
                  <span class="badge-text">{{ status }}</span>
                  <span class="badge-time">{{ deliveryConfirmedTime }}</span>
                </div>
              </div>
            </div>

            <!-- Delivery Hero Section -->
            <div class="modal-hero">
              <span class="hero-label">Delivery Confirmed</span>
              <div class="hero-info">
                <Icon icon="ph:map-pin" class="hero-icon" />
                <span class="hero-location">{{ location }}</span>
              </div>
              <span class="hero-address">{{ address }}</span>
            </div>

            <!-- Service Details Grid -->
            <div class="modal-section">
              <h3 class="section-title">Service Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Weight Collected</span>
                  <span class="detail-value">{{ weight }} kg</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Collection Method</span>
                  <span class="detail-value">{{ collectionMethod }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Time of Delivery</span>
                  <span class="detail-value">{{ deliveryTime }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Proof ID</span>
                  <span class="detail-value detail-value--monospace">{{ proofId }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Photo Evidence</span>
                  <span class="detail-value">{{ photoCount }} Photo{{ photoCount !== 1 ? 's' : '' }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">GPS Location</span>
                  <span class="detail-value detail-value--monospace">{{ gpsCoords }}</span>
                </div>
              </div>
            </div>

            <!-- Worker Info -->
            <div class="modal-section">
              <h3 class="section-title">Worker Information</h3>
              <div class="worker-box">
                <div class="worker-header">
                  <Icon icon="ph:user-circle" class="worker-icon" />
                  <div class="worker-details">
                    <span class="worker-label">Collected by</span>
                    <span class="worker-name">{{ workerName }}</span>
                  </div>
                </div>
                <div class="worker-badge" :class="`worker-badge--${workerStatus.toLowerCase()}`">
                  {{ workerStatus }}
                </div>
              </div>
            </div>

            <!-- Customer Signature -->
            <div class="modal-section">
              <h3 class="section-title">Customer Acknowledgment</h3>
              <div class="signature-box">
                <div class="signature-item">
                  <span class="signature-label">Customer Name</span>
                  <span class="signature-value">{{ customerName }}</span>
                </div>
                <div class="signature-item">
                  <span class="signature-label">Verified On</span>
                  <span class="signature-value">{{ verifiedDate }} at {{ verifiedTime }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button class="action-button action-button--secondary">
                <Icon icon="ph:download" />
                <span>Download Proof</span>
              </button>
              <button class="action-button action-button--secondary">
                <Icon icon="ph:image" />
                <span>View Photos</span>
              </button>
              <button class="action-button action-button--danger">
                <Icon icon="ph:flag" />
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
  location: string
  address: string
  weight: number
  collectionMethod: string
  deliveryTime: string
  proofId: string
  photoCount: number
  gpsCoords: string
  workerName: string
  workerStatus: 'On Duty' | 'Off Duty'
  customerName: string
  verifiedDate: string
  verifiedTime: string
  status?: 'Completed' | 'Pending' | 'Failed'
  deliveryConfirmedTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  status: 'Completed',
  deliveryConfirmedTime: 'Verified 2 min ago'
})

const isOpen = ref(false)

const statusIcon = computed(() => {
  switch (props.status) {
    case 'Completed':
      return 'ph:check-circle-fill'
    case 'Pending':
      return 'ph:clock'
    case 'Failed':
      return 'ph:x-circle-fill'
    default:
      return 'ph:circle'
  }
})

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

.delivery-proof-container {
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
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border: 1px solid #dbeafe;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  overflow: hidden;
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
  border-color: #86efac;
  box-shadow: 0 8px 24px rgba(22, 163, 74, 0.12);
  transform: translateY(-2px);
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
  color: #1e3a8a;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.status-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.compact-location {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.location-text {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
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
  color: #1e3a8a;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
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

.status-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.status-badge--completed {
  color: #1e3a8a;
}

.status-badge--pending {
  color: #ea580c;
}

.status-badge--failed {
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

.status-badge--completed .badge-time {
  color: #65a30d;
}

.status-badge--pending .badge-time {
  color: #d97706;
}

.status-badge--failed .badge-time {
  color: #f87171;
}

/* Modal Hero Section */
.modal-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: linear-gradient(135deg, #f0f9ff 0%, #f8fafc 100%);
  border-radius: var(--radius-lg);
  border: 1px solid #dbeafe;
  text-align: center;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-text-secondary);
}

.hero-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
}

.hero-icon {
  width: 20px;
  height: 20px;
  color: #1e3a8a;
  flex-shrink: 0;
}

.hero-location {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.hero-address {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
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

/* Worker Box */
.worker-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.worker-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.worker-icon {
  width: 36px;
  height: 36px;
  color: #3b82f6;
  flex-shrink: 0;
}

.worker-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.worker-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.worker-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.worker-badge {
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
  width: fit-content;
}

.worker-badge--on\ duty {
  background: #dbeafe;
  color: #1e3a8a;
}

.worker-badge--off\ duty {
  background: #fee2e2;
  color: #dc2626;
}

/* Signature Box */
.signature-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.signature-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.signature-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.signature-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
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

.action-button--danger {
  grid-column: span 2;
  color: #dc2626;
  border-color: #fecaca;
  background: #fef2f2;
}

.action-button--danger:hover {
  background: #fee2e2;
  border-color: #fca5a5;
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
