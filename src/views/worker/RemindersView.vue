<template>
  <div class="reminders-page">
    <div class="page-top">
      <div class="page-top-left">
        <h2 class="section-title">Reminders</h2>
        <span class="badge badge--warning">{{ customers.length }} customers at risk</span>
      </div>
      <div class="page-top-right">
        <select v-model="filterSeverity" class="filter-select">
          <option value="all">All Severity</option>
          <option value="critical">Critical (4+ weeks)</option>
          <option value="high">High (3 weeks)</option>
          <option value="medium">Medium (2 weeks)</option>
          <option value="low">Low (1 week)</option>
        </select>
      </div>
    </div>

    <div class="severity-summary">
      <div class="severity-card severity-card--critical" @click="filterSeverity = 'critical'">
        <Icon icon="ph:warning-octagon-fill" />
        <span class="severity-count">{{ criticalCount }}</span>
        <span class="severity-label">Critical</span>
      </div>
      <div class="severity-card severity-card--high" @click="filterSeverity = 'high'">
        <Icon icon="ph:warning-fill" />
        <span class="severity-count">{{ highCount }}</span>
        <span class="severity-label">High</span>
      </div>
      <div class="severity-card severity-card--medium" @click="filterSeverity = 'medium'">
        <Icon icon="ph:warning-circle-fill" />
        <span class="severity-count">{{ mediumCount }}</span>
        <span class="severity-label">Medium</span>
      </div>
      <div class="severity-card severity-card--low" @click="filterSeverity = 'low'">
        <Icon icon="ph:info-fill" />
        <span class="severity-count">{{ lowCount }}</span>
        <span class="severity-label">Low</span>
      </div>
    </div>

    <div class="reminders-list">
      <div
        v-for="c in filteredCustomers"
        :key="c.id"
        class="reminder-card"
        :class="`reminder-card--${c.severity}`"
      >
        <div class="reminder-severity-bar"></div>
        <div class="reminder-content">
          <div class="reminder-header">
            <div class="reminder-avatar">{{ getInitials(c.name) }}</div>
            <div class="reminder-info">
              <div class="reminder-name">{{ c.name }}</div>
              <div class="reminder-location">
                <Icon icon="ph:map-pin" /> {{ c.village }}, {{ c.cell }} • House #{{ c.houseNumber }}
              </div>
            </div>
            <div class="reminder-overdue">
              <span class="overdue-value">{{ c.daysOverdue }}</span>
              <span class="overdue-label">days overdue</span>
            </div>
          </div>
          <div class="reminder-details">
            <div class="reminder-detail">
              <span class="detail-label">Last Payment</span>
              <span class="detail-value">{{ c.lastPayment }}</span>
            </div>
            <div class="reminder-detail">
              <span class="detail-label">Category</span>
              <span class="detail-value">{{ c.category }} — {{ c.amount.toLocaleString() }} RWF</span>
            </div>
            <div class="reminder-detail">
              <span class="detail-label">Total Debt</span>
              <span class="detail-value detail-value--danger">{{ c.totalDebt.toLocaleString() }} RWF</span>
            </div>
          </div>
          <div class="reminder-actions">
            <button class="call-btn" @click="callCustomer(c)">
              <Icon icon="ph:phone-call" /> Call Now
            </button>
            <span class="severity-badge" :class="`severity-badge--${c.severity}`">
              {{ c.severity === 'critical' ? 'About to be banned' : c.severity.charAt(0).toUpperCase() + c.severity.slice(1) + ' risk' }}
            </span>
          </div>
        </div>
      </div>

      <div v-if="filteredCustomers.length === 0" class="empty-state">
        <Icon icon="ph:check-circle" />
        <h3>No reminders in this category</h3>
        <p>All customers are up to date</p>
      </div>
    </div>

    <!-- Call Modal -->
    <teleport to="body">
      <div v-if="showCallModal" class="modal-overlay" @click="showCallModal = false">
        <div class="modal-card" @click.stop>
          <div class="modal-icon"><Icon icon="ph:phone-call" /></div>
          <h3>Call {{ callingCustomer?.name }}</h3>
          <p class="modal-phone">{{ callingCustomer?.phone }}</p>
          <p class="modal-sub">Remind about overdue payment of {{ callingCustomer?.totalDebt.toLocaleString() }} RWF</p>
          <div class="modal-actions">
            <button class="m-btn m-btn--secondary" @click="showCallModal = false">Cancel</button>
            <a :href="`tel:${callingCustomer?.phone}`" class="m-btn m-btn--primary"><Icon icon="ph:phone-call" /> Call Now</a>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const filterSeverity = ref('all')
const showCallModal = ref(false)
const callingCustomer = ref<any>(null)

const customers = ref([
  { id: 1, name: 'Uwase Grace', phone: '+250733678901', village: 'Remera', cell: 'Remera', houseNumber: 'KG-567', category: 'Abakene', amount: 2000, lastPayment: 'Feb 28, 2026', daysOverdue: 28, totalDebt: 8000, severity: 'critical' },
  { id: 2, name: 'Habimana Patrick', phone: '+250733567890', village: 'Kimihurura', cell: 'Kimihurura', houseNumber: 'KG-078', category: 'Icyiciro cya 2', amount: 3800, lastPayment: 'Mar 5, 2026', daysOverdue: 23, totalDebt: 11400, severity: 'critical' },
  { id: 3, name: 'Mukamusoni Esperance', phone: '+250722890123', village: 'Kacyiru', cell: 'Kacyiru', houseNumber: 'KG-890', category: 'Icyiciro cya 2', amount: 3800, lastPayment: 'Mar 10, 2026', daysOverdue: 18, totalDebt: 7600, severity: 'high' },
  { id: 4, name: 'Nsengiyumva Bosco', phone: '+250788555666', village: 'Gisozi', cell: 'Gisozi', houseNumber: 'KG-333', category: 'Abakire', amount: 5700, lastPayment: 'Mar 12, 2026', daysOverdue: 16, totalDebt: 11400, severity: 'high' },
  { id: 5, name: 'Ingabire Diane', phone: '+250788901234', village: 'Gisozi', cell: 'Gisozi', houseNumber: 'KG-456', category: 'Abakene', amount: 2000, lastPayment: 'Mar 15, 2026', daysOverdue: 13, totalDebt: 4000, severity: 'medium' },
  { id: 6, name: 'Bizimana Fabrice', phone: '+250788789012', village: 'Niboye', cell: 'Niboye', houseNumber: 'KK-145', category: 'Abakire', amount: 5700, lastPayment: 'Mar 18, 2026', daysOverdue: 10, totalDebt: 5700, severity: 'medium' },
  { id: 7, name: 'Kayitesi Aline', phone: '+250722333444', village: 'Nyamirambo', cell: 'Biryogo', houseNumber: 'KG-211', category: 'Abakene', amount: 2000, lastPayment: 'Mar 22, 2026', daysOverdue: 6, totalDebt: 2000, severity: 'low' },
  { id: 8, name: 'Mugisha Eric', phone: '+250788777888', village: 'Kanombe', cell: 'Kanombe', houseNumber: 'KK-099', category: 'Icyiciro cya 2', amount: 3800, lastPayment: 'Mar 23, 2026', daysOverdue: 5, totalDebt: 3800, severity: 'low' },
])

const criticalCount = computed(() => customers.value.filter(c => c.severity === 'critical').length)
const highCount = computed(() => customers.value.filter(c => c.severity === 'high').length)
const mediumCount = computed(() => customers.value.filter(c => c.severity === 'medium').length)
const lowCount = computed(() => customers.value.filter(c => c.severity === 'low').length)

const filteredCustomers = computed(() => {
  if (filterSeverity.value === 'all') return customers.value
  return customers.value.filter(c => c.severity === filterSeverity.value)
})

const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2)

const callCustomer = (c: any) => {
  callingCustomer.value = c
  showCallModal.value = true
}
</script>

<style scoped>
.reminders-page { display: flex; flex-direction: column; gap: 20px; }

.page-top { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.page-top-left { display: flex; align-items: baseline; gap: 12px; }
.section-title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0; }

.badge { padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.badge--warning { background: #fef3c7; color: #b45309; }

.filter-select { height: 42px; padding: 0 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: white; font-size: 13px; color: #334155; cursor: pointer; }
.filter-select:focus { outline: none; border-color: #3b82f6; }

/* Severity Summary */
.severity-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }

.severity-card {
  display: flex; align-items: center; gap: 12px; padding: 16px 18px; border-radius: 14px;
  border: 1px solid #e5e7eb; background: white; cursor: pointer; transition: all 0.2s;
}
.severity-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.severity-card svg { width: 24px; height: 24px; }
.severity-count { font-size: 24px; font-weight: 800; color: #0f172a; }
.severity-label { font-size: 13px; color: #64748b; font-weight: 500; }

.severity-card--critical svg { color: #dc2626; }
.severity-card--high svg { color: #ea580c; }
.severity-card--medium svg { color: #d97706; }
.severity-card--low svg { color: #2563eb; }

/* Reminder Cards */
.reminders-list { display: flex; flex-direction: column; gap: 8px; }

.reminder-card {
  display: flex; background: white; border-radius: 14px; border: 1px solid #e5e7eb;
  overflow: hidden; transition: all 0.2s;
}
.reminder-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); border-color: #cbd5e1; }

.reminder-severity-bar { width: 4px; flex-shrink: 0; }
.reminder-card--critical .reminder-severity-bar { background: #dc2626; }
.reminder-card--high .reminder-severity-bar { background: #ea580c; }
.reminder-card--medium .reminder-severity-bar { background: #d97706; }
.reminder-card--low .reminder-severity-bar { background: #2563eb; }

.reminder-content { flex: 1; padding: 18px 20px; }

.reminder-header { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }

.reminder-avatar {
  width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center;
  justify-content: center; font-size: 14px; font-weight: 700; color: white; flex-shrink: 0;
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.reminder-info { flex: 1; }
.reminder-name { font-size: 15px; font-weight: 700; color: #0f172a; }
.reminder-location { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #94a3b8; }
.reminder-location svg { width: 14px; height: 14px; }

.reminder-overdue { text-align: center; }
.overdue-value { display: block; font-size: 28px; font-weight: 800; color: #dc2626; line-height: 1; }
.overdue-label { font-size: 11px; color: #94a3b8; }

.reminder-details { display: flex; gap: 24px; margin-bottom: 14px; flex-wrap: wrap; }
/* .reminder-detail { }
 */
.detail-label { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 600; margin-bottom: 2px; }
.detail-value { font-size: 14px; font-weight: 600; color: #1e293b; }
.detail-value--danger { color: #dc2626; }

.reminder-actions { display: flex; align-items: center; justify-content: space-between; gap: 12px; }

.call-btn {
  display: inline-flex; align-items: center; gap: 6px; padding: 10px 20px; border: none;
  border-radius: 10px; background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: white;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(34,197,94,0.3);
}
.call-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(34,197,94,0.4); }
.call-btn svg { width: 16px; height: 16px; }

.severity-badge {
  padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 700;
}
.severity-badge--critical { background: #fee2e2; color: #dc2626; }
.severity-badge--high { background: #ffedd5; color: #ea580c; }
.severity-badge--medium { background: #fef3c7; color: #d97706; }
.severity-badge--low { background: #dbeafe; color: #2563eb; }

/* Empty State */
.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; }
.empty-state svg { width: 48px; height: 48px; margin-bottom: 16px; color: #3b82f6; }
.empty-state h3 { margin: 0 0 4px; color: #475569; font-size: 18px; }
.empty-state p { margin: 0; font-size: 14px; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 9999; }
.modal-card { background: white; border-radius: 20px; padding: 36px; text-align: center; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
.modal-icon { width: 64px; height: 64px; border-radius: 50%; background: #dbeafe; color: #1e3a8a; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
.modal-icon svg { width: 28px; height: 28px; }
.modal-card h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
.modal-phone { font-size: 20px; font-weight: 700; color: #3b82f6; margin: 8px 0; font-family: monospace; }
.modal-sub { font-size: 14px; color: #94a3b8; margin: 0 0 24px; }
.modal-actions { display: flex; gap: 10px; justify-content: center; }
.m-btn { display: inline-flex; align-items: center; gap: 6px; padding: 12px 24px; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; text-decoration: none; transition: all 0.2s; }
.m-btn--secondary { background: #f1f5f9; color: #475569; }
.m-btn--primary { background: linear-gradient(135deg, #3b82f6, #1e3a8a); color: white; }
.m-btn svg { width: 16px; height: 16px; }

@media (max-width: 768px) {
  .severity-summary { grid-template-columns: repeat(2, 1fr); }
  .reminder-header { flex-wrap: wrap; }
  .reminder-details { gap: 12px; }
  .reminder-actions { flex-direction: column; align-items: flex-start; }
}
</style>

