<template>
  <div class="profile-page">
    <div class="profile-card">
      <div class="profile-header">
        <div class="profile-avatar"><span>AM</span></div>
        <div class="profile-info">
          <h2>Agent Marie Uwase</h2>
          <p class="role">Field Worker • AGRUNI Company Ltd</p>
          <p class="location"><Icon icon="ph:map-pin" /> Kigali, Rwanda</p>
        </div>
        <div class="profile-status"><span class="status-dot"></span> Active</div>
      </div>
    </div>
    <div class="details-grid">
      <div class="detail-card">
        <h3><Icon icon="ph:user" /> Personal Information</h3>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">Full Name</span><span class="d-val">Marie Uwase</span></div>
          <div class="d-item"><span class="d-label">Employee ID</span><span class="d-val">AGR-W-0042</span></div>
          <div class="d-item"><span class="d-label">Phone</span><span class="d-val">+250 788 123 456</span></div>
          <div class="d-item"><span class="d-label">Email</span><span class="d-val">marie@agruni.rw</span></div>
          <div class="d-item"><span class="d-label">Joined</span><span class="d-val">January 15, 2025</span></div>
          <div class="d-item"><span class="d-label">Status</span><span class="d-val green">Active</span></div>
        </div>
      </div>
      <div class="detail-card">
        <h3><Icon icon="ph:map-trifold" /> Assigned Area</h3>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">District</span><span class="d-val">Kigali</span></div>
          <div class="d-item"><span class="d-label">Sectors</span><span class="d-val">Nyarugenge, Gasabo, Kicukiro</span></div>
          <div class="d-item"><span class="d-label">Total Customers</span><span class="d-val">120 households</span></div>
          <div class="d-item"><span class="d-label">Active Since</span><span class="d-val">January 2025</span></div>
        </div>
      </div>
      <div class="detail-card">
        <h3><Icon icon="ph:chart-line-up" /> Performance</h3>
        <div class="d-grid">
          <div class="d-item"><span class="d-label">Collection Rate</span><span class="d-val green">92%</span></div>
          <div class="d-item"><span class="d-label">This Month</span><span class="d-val">352,400 RWF collected</span></div>
          <div class="d-item"><span class="d-label">Customers Registered</span><span class="d-val">18 this quarter</span></div>
          <div class="d-item"><span class="d-label">Rating</span><span class="d-val">⭐ 4.8/5.0</span></div>
        </div>
      </div>
      <div class="detail-card">
        <h3><Icon icon="ph:globe" /> Language / Ururimi</h3>
        <div class="lang-options">
          <button v-for="lang in langs" :key="lang.code" class="lang-btn" :class="{ active: activeLang === lang.code }" @click="activeLang = lang.code">
            <span class="lang-flag">{{ lang.flag }}</span>
            <span>{{ lang.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const activeLang = ref('en')
const langs = [
  { code: 'rw', name: 'Ikinyarwanda', flag: '🇷🇼' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
]
</script>

<style scoped>
.profile-page { display:flex; flex-direction:column; gap:20px; }
.profile-card { background:linear-gradient(135deg,#1e3a8a,#2563eb,#3b82f6); border-radius:16px; padding:32px; color:white; }
.profile-header { display:flex; align-items:center; gap:20px; }
.profile-avatar { width:72px; height:72px; border-radius:16px; background:rgba(255,255,255,0.15); backdrop-filter:blur(8px); border:2px solid rgba(255,255,255,0.3); display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.profile-avatar span { font-size:24px; font-weight:800; }
.profile-info { flex:1; }
.profile-info h2 { font-size:22px; font-weight:700; margin:0 0 4px; }
.role { font-size:14px; opacity:0.8; margin:0 0 2px; }
.location { display:flex; align-items:center; gap:4px; font-size:13px; opacity:0.7; margin:0; }
.location svg { width:14px; height:14px; }
.profile-status { display:flex; align-items:center; gap:6px; padding:6px 14px; background:rgba(255,255,255,0.15); border-radius:20px; font-size:13px; font-weight:600; }
.status-dot { width:8px; height:8px; border-radius:50%; background:#4ade80; }

.details-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.detail-card { background:white; border-radius:14px; padding:24px; border:1px solid #e5e7eb; }
.detail-card h3 { display:flex; align-items:center; gap:8px; font-size:16px; font-weight:700; color:#0f172a; margin:0 0 18px; padding-bottom:14px; border-bottom:1px solid #f1f5f9; }
.detail-card h3 svg { width:20px; height:20px; color:#3b82f6; }
.d-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.d-item { padding:10px 14px; background:#f8fafc; border-radius:10px; }
.d-label { display:block; font-size:11px; color:#94a3b8; text-transform:uppercase; letter-spacing:0.3px; font-weight:600; margin-bottom:4px; }
.d-val { font-size:14px; font-weight:600; color:#1e293b; }
.green { color:#1e3a8a; }

.lang-options { display:flex; flex-wrap:wrap; gap:8px; }
.lang-btn { display:flex; align-items:center; gap:8px; padding:10px 18px; border:1.5px solid #e5e7eb; border-radius:12px; background:white; font-size:14px; font-weight:600; color:#334155; cursor:pointer; transition:all 0.2s; }
.lang-btn:hover { border-color:#3b82f6; }
.lang-btn.active { border-color:#3b82f6; background:#eff6ff; color:#2563eb; }
.lang-flag { font-size:20px; }

@media (max-width:768px) {
  .details-grid { grid-template-columns:1fr; }
  .profile-header { flex-wrap:wrap; }
  .d-grid { grid-template-columns:1fr; }
}
</style>

