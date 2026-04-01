<template>
  <div class="banned-page">
    <div class="page-top">
      <div class="page-top-left">
        <h2 class="section-title">Banned Houses</h2>
        <span class="badge badge--danger">{{ bannedHouses.length }} banned</span>
      </div>
    </div>

    <div class="info-banner">
      <Icon icon="ph:info" />
      <span>Houses are banned after <strong>4+ weeks</strong> of non-payment. Only the system or admin can lift bans after full payment.</span>
    </div>

    <div class="banned-list">
      <div v-for="house in bannedHouses" :key="house.id" class="banned-card">
        <div class="banned-indicator"></div>
        <div class="banned-content">
          <div class="banned-header">
            <div class="banned-avatar">
              <Icon icon="ph:prohibit" />
            </div>
            <div class="banned-info">
              <div class="banned-name">{{ house.name }}</div>
              <div class="banned-location"><Icon icon="ph:map-pin" /> {{ house.village }}, {{ house.cell }} • House #{{ house.houseNumber }}</div>
            </div>
            <div class="banned-status">
              <span class="ban-badge">BANNED</span>
              <span class="ban-date">Since {{ house.banDate }}</span>
            </div>
          </div>
          <div class="banned-details">
            <div class="b-detail">
              <span class="b-label">Category</span>
              <span class="b-value">{{ house.category }}</span>
            </div>
            <div class="b-detail">
              <span class="b-label">Weekly Rate</span>
              <span class="b-value">{{ house.weeklyRate.toLocaleString() }} RWF</span>
            </div>
            <div class="b-detail">
              <span class="b-label">Total Debt</span>
              <span class="b-value b-value--danger">{{ house.totalDebt.toLocaleString() }} RWF</span>
            </div>
            <div class="b-detail">
              <span class="b-label">Weeks Overdue</span>
              <span class="b-value b-value--danger">{{ house.weeksOverdue }} weeks</span>
            </div>
            <div class="b-detail">
              <span class="b-label">Phone</span>
              <span class="b-value">{{ house.phone }}</span>
            </div>
            <div class="b-detail">
              <span class="b-label">Last Payment</span>
              <span class="b-value">{{ house.lastPayment }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="bannedHouses.length === 0" class="empty-state">
        <Icon icon="ph:check-circle" />
        <h3>No banned houses</h3>
        <p>All customers are in good standing</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

const bannedHouses = ref([
  { id: 1, name: 'Niyonzima Janvier', phone: '+250788111000', village: 'Gisozi', cell: 'Gisozi', houseNumber: 'KG-100', category: 'Abakene', weeklyRate: 2000, totalDebt: 16000, weeksOverdue: 8, banDate: 'Feb 10, 2026', lastPayment: 'Jan 15, 2026' },
  { id: 2, name: 'Muhorakeye Jeanne', phone: '+250722222111', village: 'Remera', cell: 'Remera', houseNumber: 'KG-201', category: 'Icyiciro cya 2', weeklyRate: 3800, totalDebt: 22800, weeksOverdue: 6, banDate: 'Feb 20, 2026', lastPayment: 'Jan 25, 2026' },
  { id: 3, name: 'Tuyisenge Olivier', phone: '+250733444555', village: 'Niboye', cell: 'Niboye', houseNumber: 'KK-050', category: 'Abakire', weeklyRate: 5700, totalDebt: 28500, weeksOverdue: 5, banDate: 'Mar 1, 2026', lastPayment: 'Feb 5, 2026' },
  { id: 4, name: 'Umutoni Claudine', phone: '+250788666777', village: 'Nyamirambo', cell: 'Biryogo', houseNumber: 'KG-410', category: 'Abakene', weeklyRate: 2000, totalDebt: 10000, weeksOverdue: 5, banDate: 'Mar 3, 2026', lastPayment: 'Feb 8, 2026' },
  { id: 5, name: 'Gasana Fred', phone: '+250722888999', village: 'Kanombe', cell: 'Kanombe', houseNumber: 'KK-199', category: 'Icyiciro cya 2', weeklyRate: 3800, totalDebt: 19000, weeksOverdue: 5, banDate: 'Mar 5, 2026', lastPayment: 'Feb 10, 2026' },
])
</script>

<style scoped>
.banned-page { display: flex; flex-direction: column; gap: 20px; }
.page-top { display: flex; align-items: center; justify-content: space-between; }
.page-top-left { display: flex; align-items: baseline; gap: 12px; }
.section-title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0; }
.badge { padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
.badge--danger { background: #fee2e2; color: #dc2626; }

.info-banner { display: flex; align-items: center; gap: 10px; padding: 14px 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; font-size: 13px; color: #991b1b; }
.info-banner svg { width: 20px; height: 20px; flex-shrink: 0; }

.banned-list { display: flex; flex-direction: column; gap: 10px; }

.banned-card { display: flex; background: white; border-radius: 14px; border: 1px solid #e5e7eb; overflow: hidden; transition: all 0.2s; }
.banned-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

.banned-indicator { width: 4px; background: #dc2626; flex-shrink: 0; }
.banned-content { flex: 1; padding: 20px; }

.banned-header { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
.banned-avatar { width: 44px; height: 44px; border-radius: 12px; background: #fee2e2; color: #dc2626; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.banned-avatar svg { width: 22px; height: 22px; }
.banned-info { flex: 1; }
.banned-name { font-size: 16px; font-weight: 700; color: #0f172a; }
.banned-location { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #94a3b8; }
.banned-location svg { width: 14px; height: 14px; }
.banned-status { text-align: right; }
.ban-badge { display: inline-block; padding: 4px 12px; background: #dc2626; color: white; border-radius: 6px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; }
.ban-date { display: block; font-size: 12px; color: #94a3b8; margin-top: 4px; }

.banned-details { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
.b-detail { padding: 10px 14px; background: #f8fafc; border-radius: 10px; }
.b-label { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 600; margin-bottom: 4px; }
.b-value { font-size: 14px; font-weight: 600; color: #1e293b; }
.b-value--danger { color: #dc2626; }

.empty-state { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; color: #94a3b8; }
.empty-state svg { width: 48px; height: 48px; margin-bottom: 16px; color: #3b82f6; }
.empty-state h3 { margin: 0 0 4px; color: #475569; }
.empty-state p { margin: 0; font-size: 14px; }

@media (max-width: 768px) {
  .banned-header { flex-wrap: wrap; }
  .banned-details { grid-template-columns: repeat(2, 1fr); }
}
</style>
