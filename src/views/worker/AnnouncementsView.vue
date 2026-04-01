<template>
  <div class="announce-page">
    <div class="page-top">
      <div><h2>Announcements</h2><span class="sub">Send notices to your customers</span></div>
      <button class="new-btn" @click="showForm = true" v-if="!showForm"><Icon icon="ph:plus" /> New Announcement</button>
    </div>

    <!-- Compose Form -->
    <div v-if="showForm" class="compose-card">
      <div class="compose-header"><Icon icon="ph:megaphone-simple" /><h3>Compose Announcement</h3></div>
      <div class="field">
        <label>Template (optional)</label>
        <select v-model="selectedTemplate" @change="applyTemplate" class="sel">
          <option value="">Custom message</option>
          <option value="interruption">Service Interruption</option>
          <option value="schedule">Schedule Change</option>
          <option value="weather">Weather Delay</option>
          <option value="holiday">Holiday Notice</option>
        </select>
      </div>
      <div class="field">
        <label>Subject <span class="req">*</span></label>
        <input v-model="form.subject" class="inp" placeholder="e.g. Service interruption notice" />
      </div>
      <div class="field">
        <label>Message <span class="req">*</span></label>
        <textarea v-model="form.message" class="ta" rows="4" placeholder="Write your announcement..."></textarea>
      </div>
      <div class="field">
        <label>Recipients</label>
        <div class="recipients">
          <label class="radio-opt" v-for="r in recipientOptions" :key="r.value">
            <input type="radio" v-model="form.recipients" :value="r.value" />
            <span class="radio-circle"></span>
            <span>{{ r.label }}</span>
          </label>
        </div>
      </div>
      <div class="compose-actions">
        <button class="btn btn--secondary" @click="showForm = false">Cancel</button>
        <button class="btn btn--primary" @click="sendAnnouncement" :disabled="!form.subject || !form.message">
          <Icon icon="ph:paper-plane-tilt" /> Send
        </button>
      </div>
    </div>

    <!-- Success Toast -->
    <div v-if="showSuccess" class="toast"><Icon icon="ph:check-circle-fill" /> Announcement sent to {{ lastRecipients }}!</div>

    <!-- History -->
    <div class="history-section">
      <h3>Sent Announcements</h3>
      <div class="history-list">
        <div v-for="a in announcements" :key="a.id" class="history-card">
          <div class="h-icon"><Icon icon="ph:megaphone-simple" /></div>
          <div class="h-body">
            <div class="h-subject">{{ a.subject }}</div>
            <div class="h-message">{{ a.message }}</div>
            <div class="h-meta"><Icon icon="ph:users" /> {{ a.recipients }} • <Icon icon="ph:clock" /> {{ a.date }}</div>
          </div>
        </div>
        <div v-if="announcements.length === 0" class="empty"><p>No announcements sent yet</p></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const showForm = ref(false)
const showSuccess = ref(false)
const lastRecipients = ref('')
const selectedTemplate = ref('')

const form = ref({ subject: '', message: '', recipients: 'all' })

const recipientOptions = [
  { value: 'all', label: 'All Customers' },
  { value: 'unpaid', label: 'Unpaid Only' },
  { value: 'village', label: 'By Village' },
]

const templates: Record<string, { subject: string; message: string }> = {
  interruption: { subject: 'Ihagarikwa ry\'ibikorwa / Service Interruption', message: 'Bakunzi ba AGRUNI, turabamenyesha ko serivisi yo gukusanya imyanda izahagarara ku itariki... kubera... Tuzobasubiza amakuru. Murakoze.' },
  schedule: { subject: 'Ihinduka ry\'gahunda / Schedule Change', message: 'Bakunzi ba AGRUNI, gahunda yo gukusanya imyanda yahinduwe. Gahunda nshya ni... Murakoze kwihangana.' },
  weather: { subject: 'Gutinda kubera ikirere / Weather Delay', message: 'Kubera imvura nyinshi, gukusanya imyanda bizatinda uyu munsi. Tuzabamenyesha igihe gishya. Murakoze.' },
  holiday: { subject: 'Ikiruhuko / Holiday Notice', message: 'AGRUNI irabamenyesha ko ku itariki... hatazaba gukusanya imyanda kubera ikiruhuko. Tuzosubira ku munsi ukurikira.' },
}

const applyTemplate = () => {
  if (selectedTemplate.value && templates[selectedTemplate.value]) {
    form.value.subject = templates[selectedTemplate.value].subject
    form.value.message = templates[selectedTemplate.value].message
  }
}

const announcements = ref([
  { id: 1, subject: 'Ihagarikwa ry\'ibikorwa - March 25', message: 'Due to road maintenance in Nyarugenge sector, waste collection will be delayed by one day.', recipients: 'All Customers (120)', date: 'Mar 25, 2026' },
  { id: 2, subject: 'Holiday Notice - Umuganura', message: 'No collection services on Umuganura day. Services resume the following day.', recipients: 'All Customers (120)', date: 'Mar 20, 2026' },
  { id: 3, subject: 'Weather Delay', message: 'Heavy rain expected today. Collection may be delayed in Gasabo area.', recipients: 'By Village - Gasabo (45)', date: 'Mar 18, 2026' },
])

const sendAnnouncement = () => {
  const recLabel = recipientOptions.find(r => r.value === form.value.recipients)?.label || 'All'
  announcements.value.unshift({
    id: Date.now(), subject: form.value.subject, message: form.value.message,
    recipients: recLabel, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  })
  lastRecipients.value = recLabel
  form.value = { subject: '', message: '', recipients: 'all' }
  selectedTemplate.value = ''
  showForm.value = false
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 3000)
}
</script>

<style scoped>
.announce-page { display:flex; flex-direction:column; gap:20px; }
.page-top { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.page-top h2 { font-size:22px; font-weight:700; color:#0f172a; margin:0; }
.sub { display:block; font-size:14px; color:#94a3b8; }
.new-btn { display:inline-flex; align-items:center; gap:6px; padding:10px 20px; border:none; border-radius:12px; background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; box-shadow:0 4px 14px rgba(59,130,246,0.3); }
.new-btn:hover { box-shadow:0 6px 20px rgba(59,130,246,0.4); transform:translateY(-1px); }
.new-btn svg { width:16px; height:16px; }

.compose-card { background:white; border-radius:16px; padding:28px; border:1px solid #e5e7eb; }
.compose-header { display:flex; align-items:center; gap:10px; margin-bottom:24px; padding-bottom:16px; border-bottom:1px solid #f1f5f9; }
.compose-header svg { width:24px; height:24px; color:#3b82f6; }
.compose-header h3 { font-size:18px; font-weight:700; color:#0f172a; margin:0; }
.field { margin-bottom:18px; }
.field label { display:block; font-size:13px; font-weight:600; color:#334155; margin-bottom:6px; }
.req { color:#ef4444; }
.inp,.sel,.ta { width:100%; padding:10px 14px; border:1.5px solid #e2e8f0; border-radius:12px; font-size:14px; color:#1e293b; background:white; transition:all 0.2s; }
.inp:focus,.sel:focus,.ta:focus { outline:none; border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,0.1); }
.ta { resize:vertical; min-height:100px; font-family:inherit; }
.sel { height:46px; cursor:pointer; }

.recipients { display:flex; gap:16px; flex-wrap:wrap; margin-top:4px; }
.radio-opt { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:14px; color:#334155; }
.radio-opt input { display:none; }
.radio-circle { width:20px; height:20px; border:2px solid #d1d5db; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.radio-opt input:checked + .radio-circle { border-color:#3b82f6; }
.radio-opt input:checked + .radio-circle::after { content:''; width:10px; height:10px; border-radius:50%; background:#3b82f6; }

.compose-actions { display:flex; gap:10px; justify-content:flex-end; margin-top:8px; }
.btn { display:inline-flex; align-items:center; gap:6px; padding:12px 24px; border:none; border-radius:12px; font-size:14px; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn:disabled { opacity:0.5; cursor:not-allowed; }
.btn svg { width:16px; height:16px; }
.btn--secondary { background:#f1f5f9; color:#475569; }
.btn--primary { background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; box-shadow:0 4px 14px rgba(59,130,246,0.3); }

.toast { display:flex; align-items:center; gap:8px; padding:14px 20px; background:#dbeafe; border:1px solid #86efac; border-radius:12px; color:#1e293b; font-size:14px; font-weight:600; animation:slideIn 0.3s ease; }
.toast svg { width:20px; height:20px; }
@keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }

.history-section h3 { font-size:16px; font-weight:700; color:#0f172a; margin:0 0 14px; }
.history-list { display:flex; flex-direction:column; gap:8px; }
.history-card { display:flex; gap:14px; padding:18px 20px; background:white; border-radius:14px; border:1px solid #e5e7eb; transition:all 0.2s; }
.history-card:hover { border-color:#cbd5e1; }
.h-icon { width:42px; height:42px; border-radius:12px; background:#eff6ff; color:#3b82f6; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.h-icon svg { width:20px; height:20px; }
.h-body { flex:1; }
.h-subject { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:4px; }
.h-message { font-size:13px; color:#64748b; line-height:1.5; margin-bottom:6px; }
.h-meta { display:flex; align-items:center; gap:4px; font-size:12px; color:#94a3b8; }
.h-meta svg { width:14px; height:14px; }
.empty { padding:40px; text-align:center; color:#94a3b8; }
</style>

