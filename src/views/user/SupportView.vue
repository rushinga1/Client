<template>
  <div class="support-view">
    <div class="support-view__header">
      <h1>Support</h1>
      <p>Get help with your waste collection service</p>
    </div>
    
    <div class="support-view__content">
      <div class="support-grid">
        <BaseCard variant="elevated" padding="lg" hoverable>
          <div class="support-card">
            <div class="support-card__icon">
              <Icon icon="ph:phone" />
            </div>
            <h3>Call Support</h3>
            <p>Speak with our support team directly</p>
            <BaseButton variant="primary" size="sm">
              Call Now
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard variant="elevated" padding="lg" hoverable>
          <div class="support-card">
            <div class="support-card__icon">
              <Icon icon="ph:chat-circle-dots" />
            </div>
            <h3>Live Chat</h3>
            <p>Chat with our support team online</p>
            <BaseButton variant="primary" size="sm">
              Start Chat
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard variant="elevated" padding="lg" hoverable>
          <div class="support-card">
            <div class="support-card__icon">
              <Icon icon="ph:envelope" />
            </div>
            <h3>Email Support</h3>
            <p>Send us an email and we'll respond</p>
            <BaseButton variant="primary" size="sm">
              Send Email
            </BaseButton>
          </div>
        </BaseCard>
        
        <BaseCard variant="elevated" padding="lg" hoverable>
          <div class="support-card">
            <div class="support-card__icon">
              <Icon icon="ph:question" />
            </div>
            <h3>FAQ</h3>
            <p>Find answers to common questions</p>
            <BaseButton variant="primary" size="sm">
              View FAQ
            </BaseButton>
          </div>
        </BaseCard>
      </div>
      
      <BaseCard variant="elevated" padding="lg">
        <div class="contact-info">
          <h2>Contact Information</h2>
          <div class="contact-details">
            <div class="contact-item">
              <Icon icon="ph:phone" />
              <span>+250 788 123 456</span>
            </div>
            <div class="contact-item">
              <Icon icon="ph:envelope" />
              <span>support@agruni.rw</span>
            </div>
            <div class="contact-item">
              <Icon icon="ph:map-pin" />
              <span>Kigali, Rwanda</span>
            </div>
            <div class="contact-item">
              <Icon icon="ph:clock" />
              <span>Mon-Fri: 8AM-6PM</span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BaseCard from '../../components/base/BaseCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.support-view {
  padding: var(--space-6);
  max-width: 1200px;
  margin: 0 auto;
}

.support-view__header {
  margin-bottom: var(--space-6);
}

.support-view__header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-2) 0;
}

.support-view__header p {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}

.support-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.support-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-4);
}

.support-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-3);
}

.support-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-12);
  height: var(--space-12);
  border-radius: var(--radius-full);
  background-color: var(--color-primary-100);
  color: var(--color-primary-600);
}

.support-card__icon svg {
  width: 24px;
  height: 24px;
}

.support-card h3 {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0;
}

.support-card p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}

.contact-info h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-4) 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.contact-item svg {
  width: 20px;
  height: 20px;
  color: var(--color-primary-600);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .support-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-details {
    gap: var(--space-2);
  }
}
</style>
