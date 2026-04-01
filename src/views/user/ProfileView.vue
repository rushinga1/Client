<template>
  <div class="profile-view">
    <div class="profile-view__header">
      <h1>Profile</h1>
      <p>Manage your account settings</p>
    </div>
    
    <div class="profile-view__content">
      <BaseCard variant="elevated" padding="lg">
        <div class="profile-section">
          <h2>Personal Information</h2>
          <div class="profile-info">
            <div class="info-item">
              <label>Name</label>
              <span>{{ currentUser.name }}</span>
            </div>
            <div class="info-item">
              <label>Email</label>
              <span>{{ currentUser.email }}</span>
            </div>
            <div class="info-item">
              <label>Phone</label>
              <span>{{ currentUser.phone }}</span>
            </div>
            <div class="info-item">
              <label>Role</label>
              <span>{{ currentUser.role }}</span>
            </div>
          </div>
        </div>
        
        <div class="profile-section">
          <h2>Preferences</h2>
          <div class="preferences">
            <div class="preference-item">
              <label>Language</label>
              <BaseLanguageSwitcher />
            </div>
            <div class="preference-item">
              <label>Notifications</label>
              <BaseButton variant="outline" size="sm">
                Manage Notifications
              </BaseButton>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseCard from '../../components/base/BaseCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseLanguageSwitcher from '../../components/base/BaseLanguageSwitcher.vue'
import { useAuthStore } from '../../stores/auth.store'

const authStore = useAuthStore()

const currentUser = computed(() => authStore.user || {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+250 788 123 456',
  role: 'user'
})
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.profile-view {
  padding: var(--space-6);
  max-width: 800px;
  margin: 0 auto;
}

.profile-view__header {
  margin-bottom: var(--space-6);
}

.profile-view__header h1 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0 0 var(--space-2) 0;
}

.profile-view__header p {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
  margin: 0;
}

.profile-view__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.profile-section h2 {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin: 0;
}

.profile-info,
.preferences {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.info-item,
.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border-default);
}

.info-item:last-child,
.preference-item:last-child {
  border-bottom: none;
}

.info-item label,
.preference-item label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.info-item span {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}
</style>
