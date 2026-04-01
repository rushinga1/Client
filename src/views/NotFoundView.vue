<template>
  <div class="not-found">
    <div class="not-found__content">
      <div class="not-found__icon">
        <Icon icon="ph:warning-circle" />
      </div>
      <h1 class="not-found__title">404</h1>
      <h2 class="not-found__subtitle">Page Not Found</h2>
      <p class="not-found__description">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <BaseButton variant="primary" @click="$router.push('/dashboard')">
        Go to Dashboard
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BaseButton from '../components/base/BaseButton.vue'
</script>

<style scoped>
@import '../assets/styles/tokens.css';

.not-found {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-bg-base);
  padding: var(--space-6);
}

.not-found__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  text-align: center;
  max-width: 400px;
}

.not-found__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-20);
  height: var(--space-20);
  border-radius: var(--radius-full);
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
}

.not-found__icon svg {
  width: 48px;
  height: 48px;
}

.not-found__title {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: var(--font-black);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0;
}

.not-found__subtitle {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-text-secondary);
  line-height: var(--leading-tight);
  margin: 0;
}

.not-found__description {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}
</style>
