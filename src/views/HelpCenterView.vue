<template>
  <div class="help-center-page">
    <div class="view-header" v-motion-fade>
      <h1 class="view-title">{{ $t('help.title') }}</h1>
      <p class="view-description">{{ $t('help.description') }}</p>
    </div>

    <!-- Search Section -->
    <div class="search-section" v-motion-slide-top>
      <div class="search-bar">
        <Icon icon="ph:magnifying-glass" class="search-icon" />
        <input type="text" :placeholder="$t('help.searchPlaceholder')" class="search-input" />
      </div>
    </div>

    <div class="help-content-grid">
      <!-- About Agruni -->
      <BaseCard variant="elevated" padding="lg" class="content-card" v-motion-fade>
        <div class="card-header">
          <div class="header-icon primary-icon"><Icon icon="ph:leaf" /></div>
          <h3>{{ $t('help.aboutAgruni') }}</h3>
        </div>
        <div class="card-body">
          <p>{{ $t('help.aboutText') }}</p>
          <ul class="benefit-list">
            <li><Icon icon="ph:check-circle-fill" /> {{ $t('help.benefit1') }}</li>
            <li><Icon icon="ph:check-circle-fill" /> {{ $t('help.benefit2') }}</li>
            <li><Icon icon="ph:check-circle-fill" /> {{ $t('help.benefit3') }}</li>
          </ul>
        </div>
      </BaseCard>

      <!-- How the System Works -->
      <BaseCard variant="elevated" padding="lg" class="content-card" v-motion-fade>
        <div class="card-header">
          <div class="header-icon info-icon"><Icon icon="ph:gear-six" /></div>
          <h3>{{ $t('help.howItWorks') }}</h3>
        </div>
        <div class="card-body">
          <p>{{ $t('help.howItWorksIntro') }}</p>
          <div class="step-guide">
            <div class="step">
              <span class="step-num">01</span>
              <div>
                <strong>{{ $t('help.step1Title') }}</strong>
                {{ $t('help.step1Text') }}
              </div>
            </div>
            <div class="step">
              <span class="step-num">02</span>
              <div>
                <strong>{{ $t('help.step2Title') }}</strong>
                {{ $t('help.step2Text') }}
              </div>
            </div>
            <div class="step">
              <span class="step-num">03</span>
              <div>
                <strong>{{ $t('help.step3Title') }}</strong>
                {{ $t('help.step3Text') }}
              </div>
            </div>
          </div>
        </div>
      </BaseCard>

      <!-- FAQ Section -->
      <BaseCard variant="elevated" padding="lg" class="full-width-card" v-motion-fade>
        <div class="card-header">
          <div class="header-icon warning-icon"><Icon icon="ph:question" /></div>
          <h3>{{ $t('help.faq') }}</h3>
        </div>
        <div class="faq-list">
          <details class="faq-item">
            <summary>{{ $t('help.faq1Q') }}</summary>
            <div class="faq-answer">{{ $t('help.faq1A') }}</div>
          </details>
          <details class="faq-item">
            <summary>{{ $t('help.faq2Q') }}</summary>
            <div class="faq-answer">{{ $t('help.faq2A') }}</div>
          </details>
          <details class="faq-item">
            <summary>{{ $t('help.faq3Q') }}</summary>
            <div class="faq-answer">{{ $t('help.faq3A') }}</div>
          </details>
        </div>
      </BaseCard>

      <!-- Contact Support CTA -->
      <div class="contact-cta" v-motion-slide-bottom>
        <div class="cta-content">
          <h3>{{ $t('help.needMoreHelp') }}</h3>
          <p>{{ $t('help.supportAvailability') }}</p>
        </div>
        <BaseButton variant="primary" iconLeft="ph:paper-plane-tilt" @click="navigateToMessages">
          {{ $t('help.contactSupport') }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'

const router = useRouter()

const navigateToMessages = () => {
  router.push('/messages')
}
</script>

<style scoped>
.help-center-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.search-section {
  margin-bottom: 32px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.search-bar:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.1);
}

.search-icon {
  font-size: 20px;
  color: #9ca3af;
  margin-right: 12px;
}

.search-input {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 16px;
  color: #374151;
  outline: none;
}

.help-content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.full-width-card {
  grid-column: span 2;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.primary-icon { background: #eff6ff; color: #3b82f6; }
.info-icon { background: #f0fdf4; color: #22c55e; }
.warning-icon { background: #fffbeb; color: #f59e0b; }

.card-header h3 {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.card-body p {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
}

.benefit-list {
  list-style: none;
  padding: 0;
}

.benefit-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #4b5563;
  margin-bottom: 8px;
  font-size: 14px;
}

.benefit-list li svg {
  color: #22c55e;
}

.step-guide {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 16px;
}

.step-num {
  font-family: var(--font-mono, monospace);
  font-weight: 800;
  color: #3b82f6;
  font-size: 18px;
  opacity: 0.5;
}

.step strong {
  display: block;
  color: #1f2937;
  margin-bottom: 2px;
}

.step div {
  font-size: 14px;
  color: #6b7280;
}

/* FAQ */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.faq-item {
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  background: #f9fafb;
}

.faq-item summary {
  padding: 16px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq-item summary::after {
  content: '↓';
  font-size: 14px;
  opacity: 0.5;
}

.faq-item[open] summary::after {
  content: '↑';
}

.faq-answer {
  padding: 0 16px 16px;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.5;
}

/* CTA */
.contact-cta {
  grid-column: span 2;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 20px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  margin-top: 16px;
}

.cta-content h3 {
  font-size: 24px;
  margin-bottom: 8px;
}

.cta-content p {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .help-content-grid {
    grid-template-columns: 1fr;
  }
  
  .full-width-card {
    grid-column: span 1;
  }
  
  .contact-cta {
    grid-column: span 1;
    flex-direction: column;
    text-align: center;
    gap: 24px;
  }
}
</style>
