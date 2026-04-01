<template>
  <div class="dispute-record-container">
    <!-- Compact Card (Click to open modal) -->
    <div 
      class="compact-card"
      :class="[{ 'compact-card--expanded': isOpen }, `compact-card--${priority.toLowerCase()}`]"
      @click="isOpen = true"
    >
      <div class="compact-status">
        <Icon :icon="statusIcon" class="status-icon" />
        <span class="status-label">{{ status }}</span>
      </div>
      <div class="compact-issue">
        <span class="issue-type">{{ issueType }}</span>
      </div>
      <div class="compact-meta">
        <div class="meta-item">
          <span class="meta-label">Filed</span>
          <span class="meta-value">{{ filedTime }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Priority</span>
          <span class="meta-value" :class="`priority-${priority.toLowerCase()}`">{{ priority }}</span>
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

            <!-- Dispute Status Badge -->
            <div class="modal-header">
              <div class="dispute-badge" :class="`dispute-badge--${status.toLowerCase()}`">
                <Icon :icon="statusIcon" class="badge-icon" />
                <div class="badge-content">
                  <span class="badge-text">{{ status }}</span>
                  <span class="badge-time">Filed {{ filedTime }}</span>
                </div>
              </div>
              <div class="priority-badge" :class="`priority-badge--${priority.toLowerCase()}`">
                {{ priority }}
              </div>
            </div>

            <!-- Issue Hero Section -->
            <div class="modal-hero" :class="`modal-hero--${priority.toLowerCase()}`">
              <span class="hero-label">Issue Type</span>
              <span class="hero-issue">{{ issueType }}</span>
              <span class="hero-description">{{ description }}</span>
            </div>

            <!-- Dispute Details -->
            <div class="modal-section">
              <h3 class="section-title">Dispute Details</h3>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Dispute ID</span>
                  <span class="detail-value detail-value--monospace">{{ disputeId }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Related Transaction</span>
                  <span class="detail-value detail-value--monospace">{{ relatedTransactionId }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Amount Affected</span>
                  <span class="detail-value">{{ affectedAmount }} RWF</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Status</span>
                  <span class="detail-value">{{ status }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Filed Date</span>
                  <span class="detail-value">{{ filedDate }} at {{ filedTime }}</span>
                </div>

                <div class="detail-item">
                  <span class="detail-label">Last Updated</span>
                  <span class="detail-value">{{ lastUpdated }}</span>
                </div>
              </div>
            </div>

            <!-- Filer Information -->
            <div class="modal-section">
              <h3 class="section-title">Reported By</h3>
              <div class="filer-box">
                <div class="filer-header">
                  <Icon icon="ph:user-circle" class="filer-icon" />
                  <div class="filer-details">
                    <span class="filer-label">Reporter</span>
                    <span class="filer-name">{{ reporterName }}</span>
                  </div>
                </div>
                <div class="filer-role">
                  <Icon icon="ph:briefcase" class="role-icon" />
                  <span>{{ reporterRole }}</span>
                </div>
              </div>
            </div>

            <!-- Resolution Section -->
            <div class="modal-section">
              <h3 class="section-title">Resolution</h3>
              <div class="resolution-box">
                <div class="resolution-item">
                  <span class="resolution-label">Expected Resolution</span>
                  <span class="resolution-value">{{ expectedResolution }}</span>
                </div>
                <div v-if="resolutionNotes" class="resolution-item">
                  <span class="resolution-label">Notes</span>
                  <p class="resolution-notes">{{ resolutionNotes }}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="modal-actions">
              <button class="action-button action-button--secondary">
                <Icon icon="ph:download" />
                <span>Download Report</span>
              </button>
              <button class="action-button action-button--warning">
                <Icon icon="ph:pencil" />
                <span>Update Status</span>
              </button>
              <button class="action-button action-button--danger">
                <Icon icon="ph:trash" />
                <span>Close Dispute</span>
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
  issueType: string
  description: string
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  disputeId: string
  relatedTransactionId: string
  affectedAmount: number
  reporterName: string
  reporterRole: string
  filedTime: string
  filedDate: string
  lastUpdated: string
  expectedResolution: string
  resolutionNotes?: string
}

const props = defineProps<Props>()
const isOpen = ref(false)

const statusIcon = computed(() => {
  switch (props.status) {
    case 'Open':
      return 'ph:alert-circle-fill'
    case 'In Review':
      return 'ph:hourglass-medium-fill'
    case 'Resolved':
      return 'ph:check-circle-fill'
    case 'Closed':
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

.dispute-record-container {
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
  background: linear-gradient(135deg, #fef2f2 0%, #f8fafc 100%);
  border: 1px solid #fecaca;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  position: relative;
  overflow: hidden;
}

.compact-card--critical {
  background: linear-gradient(135deg, #fef2f2 0%, #fde2e4 100%);
  border-color: #fca5a5;
}

.compact-card--high {
  background: linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%);
  border-color: #fcd34d;
}

.compact-card--medium {
  background: linear-gradient(135deg, #fed7aa 0%, #f8fafc 100%);
  border-color: #fdba74;
}

.compact-card--low {
  background: linear-gradient(135deg, #dbeafe 0%, #f8fafc 100%);
  border-color: #7dd3fc;
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

.compact-card--critical:hover {
  border-color: #f87171;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.15);
}

.compact-card--high:hover {
  border-color: #fbbf24;
  box-shadow: 0 8px 24px rgba(217, 119, 6, 0.15);
}

.compact-card--medium:hover {
  border-color: #fb923c;
  box-shadow: 0 8px 24px rgba(234, 88, 12, 0.15);
}

.compact-card--low:hover {
  border-color: #38bdf8;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.15);
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

.compact-card--critical .compact-status {
  color: #dc2626;
}

.compact-card--high .compact-status {
  color: #d97706;
}

.compact-card--medium .compact-status {
  color: #ea580c;
}

.compact-card--low .compact-status {
  color: #3b82f6;
}

.status-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.compact-issue {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.issue-type {
  font-family: var(--font-body);
  font-size: var(--text-sm);
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

.priority-critical {
  color: #dc2626;
}

.priority-high {
  color: #d97706;
}

.priority-medium {
  color: #ea580c;
}

.priority-low {
  color: #3b82f6;
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

.compact-card--critical .compact-cta {
  color: #dc2626;
}

.compact-card--high .compact-cta {
  color: #d97706;
}

.compact-card--medium .compact-cta {
  color: #ea580c;
}

.compact-card--low .compact-cta {
  color: #3b82f6;
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

.dispute-badge {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.dispute-badge--open {
  color: #dc2626;
}

.dispute-badge--in\ review {
  color: #d97706;
}

.dispute-badge--resolved {
  color: #1e3a8a;
}

.dispute-badge--closed {
  color: #64748b;
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

.dispute-badge--open .badge-time {
  color: #f87171;
}

.dispute-badge--in\ review .badge-time {
  color: #fb923c;
}

.dispute-badge--resolved .badge-time {
  color: #86efac;
}

.dispute-badge--closed .badge-time {
  color: #cbd5e1;
}

.priority-badge {
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

.priority-badge--critical {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.priority-badge--high {
  background: #fef3c7;
  color: #d97706;
  border: 1px solid #fcd34d;
}

.priority-badge--medium {
  background: #fed7aa;
  color: #ea580c;
  border: 1px solid #fdba74;
}

.priority-badge--low {
  background: #dbeafe;
  color: #3b82f6;
  border: 1px solid #7dd3fc;
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

.modal-hero--critical {
  background: #fef2f2;
  border-color: #fecaca;
  color: #dc2626;
}

.modal-hero--high {
  background: #fef3c7;
  border-color: #fcd34d;
  color: #d97706;
}

.modal-hero--medium {
  background: #fed7aa;
  border-color: #fdba74;
  color: #ea580c;
}

.modal-hero--low {
  background: #dbeafe;
  border-color: #7dd3fc;
  color: #3b82f6;
}

.hero-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  opacity: 0.8;
}

.hero-issue {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.hero-description {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  opacity: 0.8;
  max-width: 90%;
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

/* Filer Box */
.filer-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.filer-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.filer-icon {
  width: 36px;
  height: 36px;
  color: #3b82f6;
  flex-shrink: 0;
}

.filer-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.filer-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.filer-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
}

.filer-role {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  padding-top: var(--space-2);
  border-top: 1px solid #e2e8f0;
}

.role-icon {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

/* Resolution Box */
.resolution-box {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f8fafc;
  border-radius: var(--radius-lg);
  border: 1px solid #e2e8f0;
}

.resolution-item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.resolution-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-secondary);
}

.resolution-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.resolution-notes {
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
