<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-header">
        <div class="avatar-container" @click="triggerAvatarUpload">
          <div class="profile-avatar overflow-hidden">
            <img v-if="userProfile.avatarUrl" :src="userProfile.avatarUrl" alt="Avatar" class="avatar-img" />
            <span v-else>{{ userProfile.fullName.split(' ').map(n => n[0]).join('') }}</span>
            <div class="avatar-overlay">
              <Icon icon="ph:camera-bold" />
            </div>
          </div>
        </div>
        <div class="profile-info">
          <h2>{{ userProfile.fullName }}</h2>
          <p class="role">{{ userProfile.metrics.level }} • AGRUNI Client</p>
          <p class="location"><Icon icon="ph:map-pin" /> {{ userProfile.area.district }}, Rwanda</p>
        </div>
        <div class="profile-status"><span class="status-dot"></span> {{ userProfile.status }}</div>
      </div>
    </div>
    <div class="details-grid">
      <!-- Personal Information -->
      <BaseCard variant="elevated" padding="lg" class="detail-card">
        <div class="card-header">
          <h3><Icon icon="ph:user" /> Personal Information</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('person')">
            <Icon icon="ph:pencil-simple" />
            Edit
          </BaseButton>
        </div>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">Full Name</span><span class="d-val">{{ userProfile.fullName }}</span></div>
          <div class="d-item"><span class="d-label">Client ID</span><span class="d-val">{{ userProfile.id }}</span></div>
          <div class="d-item"><span class="d-label">Phone</span><span class="d-val">{{ userProfile.phone }}</span></div>
          <div class="d-item"><span class="d-label">Email</span><span class="d-val">{{ userProfile.email }}</span></div>
          <div class="d-item"><span class="d-label">Joined</span><span class="d-val">{{ userProfile.joinedDate }}</span></div>
          <div class="d-item"><span class="d-label">Status</span><span class="d-val green">{{ userProfile.status }}</span></div>
        </div>
      </BaseCard>

      <!-- Assigned Area -->
      <BaseCard variant="elevated" padding="lg" class="detail-card">
        <div class="card-header">
          <h3><Icon icon="ph:map-pin" /> My Location</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('area')">
            <Icon icon="ph:pencil-simple" />
            Edit
          </BaseButton>
        </div>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">District</span><span class="d-val">{{ userProfile.area.district }}</span></div>
          <div class="d-item"><span class="d-label">Sector</span><span class="d-val">{{ userProfile.area.sector }}</span></div>
          <div class="d-item"><span class="d-label">House Number</span><span class="d-val">{{ userProfile.area.houseNum }}</span></div>
          <div class="d-item"><span class="d-label">Cell</span><span class="d-val">{{ userProfile.area.cell }}</span></div>
        </div>
      </BaseCard>

      <!-- Performance Section (Editable) -->
      <BaseCard variant="elevated" padding="lg" class="detail-card">
        <div class="card-header">
          <h3><Icon icon="ph:chart-line-up" /> Service Usage</h3>
          <BaseButton variant="ghost" size="sm" @click="openEditModal('performance')">
            <Icon icon="ph:pencil-simple" />
            Edit
          </BaseButton>
        </div>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">Payment Rate</span><span class="d-val green">{{ userProfile.metrics.paymentRate }}%</span></div>
          <div class="d-item"><span class="d-label">Collections</span><span class="d-val">{{ userProfile.metrics.totalPaid }} RWF Total</span></div>
          <div class="d-item"><span class="d-label">Service Level</span><span class="d-val">{{ userProfile.metrics.level }}</span></div>
          <div class="d-item">
            <span class="d-label">Rating</span>
            <span class="d-val">
              <Icon icon="ph:star-fill" class="star-icon" />
              {{ userProfile.metrics.rating }}/5.0
            </span>
          </div>
        </div>
      </BaseCard>

      <BaseCard variant="elevated" padding="lg" class="detail-card actions-card">
        <h3><Icon icon="ph:file-pdf" /> Documents</h3>
        <BaseButton variant="outline" block iconLeft="ph:download-simple" @click="downloadPDF">
          Download Profile PDF
        </BaseButton>
        <p class="hint">Includes all your personal and service history data.</p>
      </BaseCard>
    </div>

    <!-- Modals -->
    <BaseModal v-model="modals.person" title="Edit Personal Information" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.fullName" label="Full Name" />
        <BaseInput v-model="editData.phone" label="Phone Number" />
        <BaseInput v-model="editData.email" label="Email Address" />
        <div class="modal-actions">
          <BaseButton variant="primary" block @click="saveProfile('person')">Save Changes</BaseButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="modals.area" title="Edit My Location" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.area.district" label="District" />
        <BaseInput v-model="editData.area.sector" label="Sector" />
        <BaseInput v-model="editData.area.cell" label="Cell" />
        <BaseInput v-model="editData.area.houseNum" label="House Number" />
        <div class="modal-actions">
          <BaseButton variant="primary" block @click="saveProfile('area')">Save Changes</BaseButton>
        </div>
      </div>
    </BaseModal>

    <BaseModal v-model="modals.performance" title="Edit Service Metrics" size="md">
      <div class="modal-form">
        <BaseInput v-model="editData.metrics.paymentRate" label="Payment Rate (%)" type="number" />
        <BaseInput v-model="editData.metrics.totalPaid" label="Total Paid (RWF)" type="number" />
        <BaseInput v-model="editData.metrics.rating" label="User Rating (1-5)" type="number" step="0.1" max="5" />
        <div class="modal-actions">
          <BaseButton variant="primary" block @click="saveProfile('performance')">Save Changes</BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Hidden File Input -->
    <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'
import BaseCard from '../../components/base/BaseCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const userProfile = ref({
  fullName: 'Marie Uwase',
  id: 'AGR-C-0042',
  phone: '+250 788 123 456',
  email: 'marie@agruni.rw',
  joinedDate: 'January 15, 2025',
  status: 'Active',
  avatarUrl: null as string | null,
  area: {
    district: 'Kigali',
    sector: 'Nyarugenge',
    cell: 'Kiyovu',
    houseNum: 'KV-104-B'
  },
  metrics: {
    paymentRate: 92,
    totalPaid: 352400,
    level: 'Premium Client',
    rating: 4.8
  }
})

const fileInput = ref<HTMLInputElement | null>(null)
const modals = ref({ person: false, area: false, performance: false })
const editData = ref(JSON.parse(JSON.stringify(userProfile.value)))

const openEditModal = (type: keyof typeof modals.value) => {
  editData.value = JSON.parse(JSON.stringify(userProfile.value))
  modals.value[type] = true
}

const saveProfile = (type: keyof typeof modals.value) => {
  userProfile.value = JSON.parse(JSON.stringify(editData.value))
  modals.value[type] = false
}

const triggerAvatarUpload = () => fileInput.value?.click()

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userProfile.value.avatarUrl = e.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const downloadPDF = () => {
  alert('Generating Profile PDF... Your download will start shortly.')
}
</script>

<style scoped>
.profile-page { display:flex; flex-direction:column; gap:20px; }

/* Enhanced Profile Card */
.profile-card { 
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%); 
  border-radius: 20px; 
  padding: 40px; 
  color: white; 
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.2);
  position: relative;
  overflow: hidden;
}

.profile-card::after {
  content: '';
  position: absolute;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: white;
  opacity: 0.05;
  border-radius: 50%;
}

.profile-header { display:flex; align-items:center; gap:32px; position: relative; z-index: 1; }

/* Avatar with Upload */
.avatar-container {
  cursor: pointer;
  perspective: 1000px;
}

.profile-avatar { 
  width: 96px; 
  height: 96px; 
  border-radius: 24px; 
  background: rgba(255,255,255,0.15); 
  backdrop-filter: blur(8px); 
  border: 2px solid rgba(255,255,255,0.3); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  flex-shrink: 0; 
  position: relative;
  transition: all 0.3s ease;
}

.avatar-container:hover .profile-avatar {
  transform: scale(1.05);
  border-color: white;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar span { font-size: 32px; font-weight: 800; }

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: inherit;
}

.avatar-container:hover .avatar-overlay {
  opacity: 1;
}

.avatar-overlay svg { font-size: 24px; color: white; }

.profile-info { flex:1; }
.profile-info h2 { font-size:28px; font-weight:800; margin:0 0 6px; letter-spacing: -0.02em; }
.role { font-size:15px; opacity:0.9; margin:0 0 6px; font-weight: 500; }
.location { display:flex; align-items:center; gap:6px; font-size:14px; opacity:0.8; margin:0; }
.location svg { width:16px; height:16px; }
.profile-status { display:flex; align-items:center; gap:8px; padding:8px 18px; background:rgba(255,255,255,0.2); border-radius:30px; font-size:14px; font-weight:700; }
.status-dot { width:10px; height:10px; border-radius:50%; background:#4ade80; box-shadow: 0 0 10px #4ade80; }

.details-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

/* Refined Detail Cards */
.detail-card { 
  background: white; 
  border-radius: 18px; 
  transition: transform 0.2s, box-shadow 0.2s;
}

.detail-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.detail-card h3 { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
  font-size: 17px; 
  font-weight: 700; 
  color: #0f172a; 
  margin: 0;
}

.detail-card h3 svg { width:22px; height:22px; color:#3b82f6; }

.actions-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
}

.hint {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
  margin: 0;
}

.d-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
.d-item { padding:14px 18px; background:#f8fafc; border-radius:12px; border: 1px solid transparent; transition: all 0.2s; }
.d-item:hover { background: white; border-color: #e2e8f0; box-shadow: var(--shadow-sm); }
.d-label { display:block; font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.05em; font-weight:700; margin-bottom:6px; }
.d-val { font-size:15px; font-weight:700; color:#1e293b; }
.star-icon { color: #f59e0b; vertical-align: middle; margin-right: 4px; }
.green { color:#1e3a8a; }

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

@media (max-width:900px) {
  .details-grid { grid-template-columns:1fr; }
  .profile-header { flex-direction: column; text-align: center; gap: 24px; }
  .d-grid { grid-template-columns:1fr; }
  .profile-status { align-self: center; }
}
</style>

