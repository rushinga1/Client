<template>
  <div class="settings-page">
    <div class="view-header" v-motion-fade>
      <h1 class="view-title">{{ $t('settings.title') }}</h1>
      <p class="view-description">{{ $t('settings.description') }}</p>
    </div>

    <div class="settings-container">
      <!-- Profile Shortcut -->
      <BaseCard variant="elevated" padding="md" class="profile-link-card" v-motion-fade>
        <div class="profile-link-content">
          <div class="icon-box primary"><Icon icon="ph:user-focus" /></div>
          <div class="text-box">
            <h3>{{ $t('settings.personalInfo') }}</h3>
            <p>{{ $t('settings.personalInfoHint') }}</p>
          </div>
          <BaseButton variant="outline" size="sm" @click="router.push('/account')">
            {{ $t('common.goToAccount') }}
          </BaseButton>
        </div>
      </BaseCard>

      <div class="settings-grid">
        <!-- Security Section -->
        <BaseCard variant="elevated" padding="lg" v-motion-slide-left>
          <div class="section-title">
            <Icon icon="ph:shield-check" />
            {{ $t('settings.security') }}
          </div>
          <div class="settings-form">
            <div class="password-field">
              <BaseInput
                v-model="security.currentPassword"
                :label="$t('settings.currentPassword')"
                :type="showPasswords ? 'text' : 'password'"
                placeholder="••••••••"
              />
            </div>
            <div class="password-field">
              <BaseInput
                v-model="security.newPassword"
                :label="$t('settings.newPassword')"
                :type="showPasswords ? 'text' : 'password'"
                placeholder="••••••••"
                :hint="passwordStrengthText"
                :error="passwordError"
              />
              <div v-if="security.newPassword" class="strength-meter">
                <div :class="['strength-bar', passwordStrengthClass]" :style="{ width: passwordStrengthPercent + '%' }"></div>
              </div>
            </div>
            <div class="toggle-password-container">
              <label class="checkbox-label">
                <input type="checkbox" v-model="showPasswords" />
                <span>{{ $t('settings.showPasswords') }}</span>
              </label>
            </div>
            <div class="pt-4">
              <BaseButton variant="primary" :disabled="!isPasswordValid">{{ $t('settings.updatePassword') }}</BaseButton>
            </div>
          </div>
        </BaseCard>

        <div class="right-column">
          <!-- Notifications Section -->
          <BaseCard variant="elevated" padding="lg" class="mb-6" v-motion-slide-right>
            <div class="section-title">
              <Icon icon="ph:bell" />
              {{ $t('settings.notifications') }}
            </div>
            <div class="preference-list">
              <div class="pref-item">
                <div class="pref-info">
                  <strong>{{ $t('settings.smsNotifications') }}</strong>
                  <p>{{ $t('settings.smsNotificationsHint') }}</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="preferences.notifications.sms" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="pref-item">
                <div class="pref-info">
                  <strong>{{ $t('settings.emailReceipts') }}</strong>
                  <p>{{ $t('settings.emailReceiptsHint') }}</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="preferences.notifications.email" />
                  <span class="slider"></span>
                </label>
              </div>
              <div class="pref-item">
                <div class="pref-info">
                  <strong>{{ $t('settings.pushNotifications') }}</strong>
                  <p>{{ $t('settings.pushNotificationsHint') }}</p>
                </div>
                <label class="switch">
                  <input type="checkbox" v-model="preferences.notifications.push" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </BaseCard>

          <!-- Preferences Section -->
          <BaseCard variant="elevated" padding="lg" v-motion-slide-right>
            <div class="section-title">
              <Icon icon="ph:sliders-horizontal" />
              {{ $t('settings.servicePreferences') }}
            </div>
            <div class="settings-form">
              <div class="form-group">
                <label class="field-label">{{ $t('settings.language') }}</label>
                <div class="language-selector-wrapper">
                  <BaseLanguageSwitcher />
                </div>
              </div>
              <div class="form-group pt-2">
                <label class="field-label">{{ $t('settings.collectionTiming') }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" value="morning" v-model="preferences.collectionTime" />
                    <span>{{ $t('settings.morning') }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" value="afternoon" v-model="preferences.collectionTime" />
                    <span>{{ $t('settings.afternoon') }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" value="any" v-model="preferences.collectionTime" />
                    <span>{{ $t('settings.anytime') }}</span>
                  </label>
                </div>
              </div>
              <div class="pt-4">
                <BaseButton variant="primary" @click="savePreferences">{{ $t('settings.savePreferences') }}</BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Icon } from '@iconify/vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseLanguageSwitcher from '../components/base/BaseLanguageSwitcher.vue'

const router = useRouter()
const { t } = useI18n()

const showPasswords = ref(false)
const security = ref({
  currentPassword: '',
  newPassword: ''
})

const preferences = ref({
  notifications: {
    sms: true,
    email: true,
    push: false
  },
  collectionTime: 'morning'
})

// Password Strength Logic
const passwordStrengthPercent = computed(() => {
  const p = security.value.newPassword
  if (!p) return 0
  let score = 0
  if (p.length > 6) score += 25
  if (p.length > 10) score += 25
  if (/[A-Z]/.test(p)) score += 25
  if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score += 25
  return score
})

const passwordStrengthClass = computed(() => {
  const p = passwordStrengthPercent.value
  if (p <= 25) return 'low'
  if (p <= 75) return 'medium'
  return 'high'
})

const passwordStrengthText = computed(() => {
  if (!security.value.newPassword) return ''
  const p = passwordStrengthPercent.value
  if (p <= 25) return t('settings.strength.weak')
  if (p <= 75) return t('settings.strength.medium')
  return t('settings.strength.strong')
})

const passwordError = computed(() => {
  if (security.value.newPassword && security.value.newPassword.length < 6) {
    return 'Password must be at least 6 characters'
  }
  return ''
})

const isPasswordValid = computed(() => {
  return security.value.currentPassword && security.value.newPassword.length >= 6
})

const savePreferences = () => {
  // Mock saving behavior
  alert('Preferences saved successfully!')
}
</script>

<style scoped>
.settings-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.settings-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.profile-link-card {
  background: #f8fafc;
  border-style: dashed;
}

.profile-link-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.icon-box.primary { background: #eff6ff; color: #3b82f6; }

.text-box {
  flex: 1;
}

.text-box h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
  color: #1e293b;
}

.text-box p {
  font-size: 14px;
  color: #64748b;
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.section-title svg {
  font-size: 24px;
  color: #3b82f6;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pt-4 { padding-top: 16px; }
.pt-2 { padding-top: 8px; }
.mb-6 { margin-bottom: 24px; }

/* Password Strength */
.strength-meter {
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.strength-bar {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-bar.low { background: #ef4444; }
.strength-bar.medium { background: #f59e0b; }
.strength-bar.high { background: #22c55e; }

.toggle-password-container {
  margin-top: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
}

/* Preferences List */
.preference-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pref-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pref-info strong {
  display: block;
  font-size: 14px;
  color: #1e293b;
  margin-bottom: 2px;
}

.pref-info p {
  font-size: 12px;
  color: #64748b;
}

.field-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #475569;
  cursor: pointer;
}

/* Custom Switch Toggle */
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #3b82f6;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

@media (max-width: 992px) {
  .settings-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .profile-link-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
