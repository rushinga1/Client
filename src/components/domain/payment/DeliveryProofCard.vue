<template>
  <div class="delivery-proof">
    <!-- Verification Status Banner -->
    <div class="proof-header">
      <div class="proof-status">
        <Icon icon="ph:check-circle-fill" />
        <div class="status-content">
          <span class="status-badge">DELIVERY CONFIRMED</span>
          <span class="status-time">{{ verifiedTime }}</span>
        </div>
      </div>
      <div class="proof-actions">
        <button class="action-btn action-btn--icon" title="Download proof">
          <Icon icon="ph:download" />
        </button>
        <button class="action-btn action-btn--icon" title="View photos">
          <Icon icon="ph:image" />
        </button>
      </div>
    </div>

    <!-- Proof Container -->
    <div class="proof-container">
      <!-- Delivery Status as Hero -->
      <div class="proof-hero">
        <div class="hero-icon">
          <Icon icon="ph:package-check" />
        </div>
        <div class="hero-content">
          <span class="hero-label">Waste Collected</span>
          <span class="hero-weight">{{ weight }} kg</span>
          <span class="hero-category">{{ category }}</span>
        </div>
      </div>

      <!-- Collection Info -->
      <div class="proof-section">
        <div class="section-label">Collection Details</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Location</span>
            <span class="info-value">{{ location }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Route</span>
            <span class="info-value">{{ route }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Date Collected</span>
            <span class="info-value">{{ collectionDate }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Time Collected</span>
            <span class="info-value">{{ collectionTime }}</span>
          </div>
        </div>
      </div>

      <!-- Worker/Agent Info Box -->
      <div class="agent-box">
        <div class="agent-avatar">
          <Icon icon="ph:user-circle" />
        </div>
        <div class="agent-info">
          <div class="agent-label">Collected by</div>
          <div class="agent-name">{{ agentName }}</div>
          <div class="agent-id">{{ agentId }}</div>
        </div>
      </div>

      <!-- Proof Evidence Items -->
      <div class="proof-section">
        <div class="section-label">Evidence</div>
        <div class="evidence-items">
          <div class="evidence-item">
            <Icon icon="ph:camera" />
            <span>Photo proof attached</span>
          </div>
          <div class="evidence-item">
            <Icon icon="ph:map-pin" />
            <span>GPS coordinates recorded</span>
          </div>
          <div class="evidence-item">
            <Icon icon="ph:signature" />
            <span>Agent confirmed</span>
          </div>
        </div>
      </div>

      <!-- Supporting Details -->
      <div class="proof-section">
        <div class="section-label">Additional Information</div>
        <div class="details-grid">
          <div class="detail-row">
            <span class="detail-label">Waste Type</span>
            <span class="detail-value">{{ wasteType }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Condition</span>
            <span class="detail-value">{{ condition }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="proof-footer">
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:download" />
        Download Proof
      </button>
      <button class="footer-btn footer-btn--secondary">
        <Icon icon="ph:image" />
        View Photos
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  weight: number
  category: string
  location: string
  route: string
  collectionDate: string
  collectionTime: string
  agentName: string
  agentId: string
  wasteType: string
  condition: string
  verifyTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  verifyTime: '5 min ago'
})

const verifiedTime = computed(() => {
  return `Verified ${props.verifyTime}`
})
</script>

<style scoped>
@import '../../../assets/styles/tokens.css';

.delivery-proof {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-lg);
  padding: var(--space-6);
}

/* Header */
.proof-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-4);
  border-bottom: 1px solid #bfdbfe;
}

.proof-status {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: #3b82f6;
}

.proof-status svg {
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
  color: #3b82f6;
}

.status-time {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #0369a1;
  font-weight: var(--font-medium);
}

.proof-actions {
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
  border: 1px solid #bfdbfe;
  border-radius: var(--radius-md);
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.action-btn--icon svg {
  width: 16px;
  height: 16px;
}

/* Container */
.proof-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

/* Hero */
.proof-hero {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5);
  background: white;
  border-radius: var(--radius-lg);
  border: 2px solid #bfdbfe;
}

.hero-icon {
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

.hero-weight {
  font-family: var(--font-mono);
  font-size: 32px;
  font-weight: var(--font-extrabold);
  color: #3b82f6;
  line-height: 1;
}

.hero-category {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: #0369a1;
  font-weight: var(--font-medium);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

/* Sections */
.proof-section {
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

/* Info Grid */
.info-grid {
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

/* Agent Box */
.agent-box {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: white;
  border: 2px solid #dbeafe;
  border-radius: var(--radius-lg);
}

.agent-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background: #eff6ff;
  color: #3b82f6;
  flex-shrink: 0;
}

.agent-avatar svg {
  width: 24px;
  height: 24px;
}

.agent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.agent-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.agent-name {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
}

.agent-id {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-secondary);
}

/* Evidence Items */
.evidence-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.evidence-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid #e2e8f0;
}

.evidence-item svg {
  width: 18px;
  height: 18px;
  color: #3b82f6;
  flex-shrink: 0;
}

.evidence-item span {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
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

/* Footer */
.proof-footer {
  display: flex;
  gap: var(--space-3);
  padding-top: var(--space-4);
  border-top: 1px solid #bfdbfe;
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

.footer-btn svg {
  width: 16px;
  height: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .delivery-proof {
    padding: var(--space-4);
    gap: var(--space-4);
  }

  .proof-hero {
    padding: var(--space-4);
  }

  .hero-weight {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .agent-box {
    gap: var(--space-3);
    padding: var(--space-3);
  }

  .proof-footer {
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .proof-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .proof-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .hero-weight {
    font-size: 28px;
  }
}
</style>
