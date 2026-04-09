<template>
  <div class="account-page">
    <div class="view-header" v-motion-fade>
      <h1 class="view-title">{{ $t('account.title') }}</h1>
      <p class="view-description">{{ $t('account.description') }}</p>
    </div>

    <!-- Hero Card -->
    <div class="profile-card" v-motion-slide-top>
      <div class="profile-header">
        <div class="avatar-container" @click="triggerAvatarUpload">
          <div class="profile-avatar overflow-hidden">
            <img v-if="user?.avatar" :src="user.avatar" alt="Avatar" class="avatar-img" />
            <span v-else>{{ userInitials }}</span>
            <div class="avatar-overlay">
              <Icon icon="ph:camera-bold" />
            </div>
          </div>
        </div>
        <div class="profile-info">
          <h2>{{ user?.name }}</h2>
          <p class="role">{{ user?.plan }} • App User</p>
          <p class="location"><Icon icon="ph:map-pin" /> {{ user?.area?.district }}, Rwanda</p>
        </div>
        <div class="header-right-column">
          <div class="profile-status"><span class="status-dot"></span> {{ user?.status }}</div>
          <BaseButton variant="outline" iconLeft="ph:download-simple" size="sm" class="hero-download-btn" @click="downloadPDF">
            {{ $t('account.downloadPdf') }}
          </BaseButton>
        </div>
      </div>
    </div>


    <div class="details-grid">
      <!-- Personal Information -->
      <BaseCard variant="elevated" padding="lg" class="detail-card" v-motion-fade>
        <div class="card-header">
          <h3><Icon icon="ph:identification-card" /> {{ $t('account.personalInfo') }}</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('person')">
            <Icon icon="ph:pencil-simple" />
            {{ $t('common.edit') }}
          </BaseButton>
        </div>

        <div class="d-grid">
          <div class="d-item"><span class="d-label">{{ $t('account.fullName') }}</span><span class="d-val">{{ user?.name }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.accountId') }}</span><span class="d-val">{{ user?.id }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.phone') }}</span><span class="d-val">{{ user?.phone }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.email') }}</span><span class="d-val">{{ user?.email }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.joined') }}</span><span class="d-val">{{ user?.joinedDate }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.status') }}</span><span class="d-val green">{{ user?.status }}</span></div>
        </div>
      </BaseCard>

      <!-- Location Area -->
      <BaseCard variant="elevated" padding="lg" class="detail-card" v-motion-fade>
        <div class="card-header">
          <h3><Icon icon="ph:house" /> {{ $t('account.myLocation') }}</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('area')">
            <Icon icon="ph:pencil-simple" />
            {{ $t('common.edit') }}
          </BaseButton>
        </div>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">{{ $t('account.district') }}</span><span class="d-val">{{ user?.area?.district }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.sector') }}</span><span class="d-val">{{ user?.area?.sector }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.houseNumber') }}</span><span class="d-val">{{ user?.area?.houseNum }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.cell') }}</span><span class="d-val">{{ user?.area?.cell }}</span></div>
        </div>
      </BaseCard>

      <!-- Service Metrics -->
      <BaseCard variant="elevated" padding="lg" class="detail-card" v-motion-fade>
        <div class="card-header">
          <h3><Icon icon="ph:chart-line-up" /> {{ $t('account.serviceUsage') }}</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('metrics')">
            <Icon icon="ph:pencil-simple" />
            {{ $t('common.edit') }}
          </BaseButton>
        </div>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">{{ $t('account.paymentRate') }}</span><span class="d-val green">{{ user?.metrics?.paymentRate }}%</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.totalPaid') }}</span><span class="d-val">RWF {{ user?.metrics?.totalPaid?.toLocaleString() }}</span></div>
          <div class="d-item"><span class="d-label">{{ $t('account.currentPlan') }}</span><span class="d-val">{{ user?.plan }}</span></div>
          <div class="d-item">
            <span class="d-label">{{ $t('account.rating') }}</span>
            <span class="d-val">
              <Icon icon="ph:star-fill" class="star-icon" />
              {{ user?.metrics?.rating }}/5.0
            </span>
          </div>
        </div>
      </BaseCard>

    </div>

    <!-- Edit Modals -->
    <BaseModal v-model="modals.person" :title="$t('account.editPersonalInfo')" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.name" :label="$t('account.fullName')" />
        <BaseInput v-model="editData.phone" :label="$t('account.phone')" />
        <BaseInput v-model="editData.email" :label="$t('account.email')" />
        <div class="modal-actions pt-4">
          <BaseButton variant="outline" @click="modals.person = false">{{ $t('common.cancel') }}</BaseButton>
          <BaseButton variant="primary" @click="saveProfile('person')">{{ $t('common.save') }}</BaseButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="modals.area" :title="$t('account.editLocation')" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.area.district" :label="$t('account.district')" />
        <BaseInput v-model="editData.area.sector" :label="$t('account.sector')" />
        <BaseInput v-model="editData.area.cell" :label="$t('account.cell')" />
        <BaseInput v-model="editData.area.houseNum" :label="$t('account.houseNumber')" />
        <div class="modal-actions pt-4">
          <BaseButton variant="outline" @click="modals.area = false">{{ $t('common.cancel') }}</BaseButton>
          <BaseButton variant="primary" @click="saveProfile('area')">{{ $t('common.save') }}</BaseButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="modals.metrics" :title="$t('account.editMetrics')" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.metrics.paymentRate" label="Payment Rate (%)" type="number" />
        <BaseInput v-model="editData.metrics.totalPaid" label="Total Paid (RWF)" type="number" />
        <BaseInput v-model="editData.metrics.rating" label="User Rating (1-5)" type="number" step="0.1" max="5" />
        <div class="modal-actions pt-4">
          <BaseButton variant="primary" block @click="saveProfile('metrics')">Save Changes</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseCard from '../components/base/BaseCard.vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseModal from '../components/base/BaseModal.vue'
import { useAuthStore } from '../stores/auth.store'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value?.name) return ''
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase()
})

const fileInput = ref<HTMLInputElement | null>(null)
const modals = ref({ person: false, area: false, metrics: false })
const editData = ref<any>(null)

const openEditModal = (type: keyof typeof modals.value) => {
  editData.value = JSON.parse(JSON.stringify(authStore.user))
  modals.value[type] = true
}

const saveProfile = async (type: keyof typeof modals.value) => {
  await authStore.updateProfile(editData.value)
  modals.value[type] = false
}

const triggerAvatarUpload = () => fileInput.value?.click()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const base64 = e.target?.result as string
      await authStore.updateProfile({ avatar: base64 })
    }
    reader.readAsDataURL(target.files[0])
  }
}

const downloadPDF = () => {
  alert('Generating Profile PDF... Your download will start shortly.')
}
</script>

<style scoped>
@import '../assets/styles/tokens.css';

.account-page { 
  padding: var(--space-6);
  max-width: 1000px;
  margin: 0 auto;
  display: flex; 
  flex-direction: column; 
  gap: var(--space-8); 
}

/* Enhanced View Header */
.view-header {
  margin-bottom: var(--space-2);
}

.view-title {
  font-size: var(--text-3xl);
  font-weight: 800;
  background: linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary-600) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.03em;
  margin-bottom: var(--space-1);
}

.view-description {
  color: var(--color-text-secondary);
  font-size: var(--text-base);
  font-weight: 500;
  opacity: 0.8;
}

/* Profile Hero Card */
.profile-card { 
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%); 
  border-radius: 24px; 
  padding: 48px; 
  color: white; 
  box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.25);
  position: relative;
  overflow: hidden;
}

.profile-card::after {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: white;
  opacity: 0.05;
  border-radius: 50%;
}

.profile-header { 
  display: flex; 
  align-items: center; 
  gap: 40px; 
  position: relative; 
  z-index: 1; 
}

/* Avatar with Upload */
.avatar-container {
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.avatar-container:hover {
  transform: scale(1.05);
}

.profile-avatar { 
  width: 120px; 
  height: 120px; 
  border-radius: 32px; 
  background: rgba(255, 255, 255, 0.15); 
  backdrop-filter: blur(12px); 
  border: 2px solid rgba(255, 255, 255, 0.4); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0; 
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar span { 
  font-size: 40px; 
  font-weight: 900; 
  letter-spacing: -0.05em;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: inherit;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay svg { 
  font-size: 32px; 
  color: white; 
}

.profile-info { flex: 1; }
.profile-info h2 { 
  font-size: 24px; 
  font-weight: 800; 
  margin: 0 0 6px; 
  letter-spacing: -0.03em; 
}

.role { 
  font-size: 14px; 
  opacity: 0.95; 
  margin: 0 0 8px; 
  font-weight: 600; 
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  display: inline-block;
}

.location { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  font-size: 13px; 
  opacity: 0.9; 
  margin: 0; 
}

.header-right-column {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}

.profile-status { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  padding: 8px 16px; 
  background: rgba(255, 255, 255, 0.2); 
  border-radius: 40px; 
  font-size: 13px; 
  font-weight: 800; 
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.hero-download-btn {
  background: rgba(255, 255, 255, 0.1) !important;
  border-color: rgba(255, 255, 255, 0.4) !important;
  color: white !important;
}

.hero-download-btn:hover {
  background: rgba(255, 255, 255, 0.2) !important;
  border-color: white !important;
}

.status-dot { 
  width: 12px; 
  height: 12px; 
  border-radius: 50%; 
  background: #4ade80; 
  box-shadow: 0 0 15px #4ade80; 
}

/* Detail Cards Grid */
.details-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: var(--space-6); 
}

.detail-card { 
  border-radius: 24px; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.detail-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl) !important;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-sunken);
}

.detail-card h3 { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 16px; 
  font-weight: 800; 
  color: var(--color-text-primary); 
  margin: 0;
  letter-spacing: -0.02em;
}

.detail-card h3 svg { 
  width: 24px; 
  height: 24px; 
  color: var(--color-primary-500); 
}

.d-grid { 
  display: grid; 
  grid-template-columns: repeat(2, 1fr); 
  gap: 16px; 
}

.d-item { 
  padding: 16px 20px; 
  background: var(--color-bg-sunken); 
  border-radius: 16px; 
  border: 1px solid transparent; 
  transition: all 0.2s; 
}

.d-item:hover { 
  background: var(--color-bg-surface); 
  border-color: var(--color-border-default); 
  box-shadow: var(--shadow-sm); 
}

.d-label { 
  display: block; 
  font-size: 10px; 
  color: var(--color-text-secondary); 
  text-transform: uppercase; 
  letter-spacing: 0.1em; 
  font-weight: 800; 
  margin-bottom: 6px; 
}

.d-val { 
  font-size: 14px; 
  font-weight: 700; 
  color: var(--color-text-primary); 
}

.star-icon { 
  color: #f59e0b; 
  vertical-align: middle; 
  margin-right: 4px; 
}

.green { color: var(--color-primary-700); }

/* Document card specifics */
.actions-card {
  background: linear-gradient(to bottom, white, var(--color-neutral-50));
}

.hint {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.mt-3 { margin-top: 12px; }
.pt-4 { padding-top: 16px; }
.text-center { text-align: center; }

/* Modal Styles */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 10px 0;
}

.modal-actions {
  margin-top: 10px;
}

.hidden-input { display: none; }
.overflow-hidden { overflow: hidden; }

@media (max-width: 900px) {
  .details-grid { grid-template-columns: 1fr; }
  .profile-header { flex-direction: column; text-align: center; gap: 32px; }
  .profile-status { align-self: center; }
  .d-grid { grid-template-columns: 1fr; }
}
</style>
