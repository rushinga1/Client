<template>
  <div class="notif-page">
    <div class="page-top">
      <div><h2>Notifications</h2><span class="count-badge">{{ unread }} unread</span></div>
      <div class="top-actions">
        <button class="mark-btn" @click="markAllRead" v-if="unread > 0"><Icon icon="ph:checks" /> Mark all read</button>
        <select v-model="filter" class="sel"><option value="all">All</option><option value="payment">Payments</option><option value="warning">Warnings</option><option value="system">System</option></select>
      </div>
    </div>
    <div class="list">
      <div v-for="n in filtered" :key="n.id" class="item" :class="{ unread: !n.read }" @click="n.read = true">
        <div class="ico" :class="n.type"><Icon :icon="icons[n.type]" /></div>
        <div class="body"><div class="ttl">{{ n.title }}</div><div class="msg">{{ n.message }}</div><div class="tm"><Icon icon="ph:clock" />{{ n.time }}</div></div>
        <button class="x" @click.stop="dismiss(n.id)"><Icon icon="ph:x" /></button>
      </div>
      <div v-if="filtered.length===0" class="empty"><Icon icon="ph:bell-slash" /><h3>No notifications</h3><p>You're all caught up!</p></div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
const filter = ref('all')
const icons: Record<string,string> = { payment:'ph:money', warning:'ph:warning-circle-fill', system:'ph:gear-six', info:'ph:info-fill' }
const notifs = ref([
  { id:1, type:'payment', title:'Payment Received', message:'Uwimana Jean Pierre paid 5,700 RWF via MTN MoMo.', time:'10 min ago', read:false },
  { id:2, type:'payment', title:'Payment Received', message:'Mukeshimana Alice paid 2,000 RWF via Airtel Money.', time:'25 min ago', read:false },
  { id:3, type:'warning', title:'Customer Warning', message:'Uwase Grace has been overdue for 28 days. Approaching ban.', time:'1 hour ago', read:false },
  { id:4, type:'warning', title:'Ban Alert', message:'Habimana Patrick will be banned in 5 days without payment.', time:'2 hours ago', read:false },
  { id:5, type:'system', title:'Weekly Report', message:'Your weekly report has been generated and sent to admin.', time:'3 hours ago', read:true },
  { id:6, type:'system', title:'Schedule Update', message:'Tomorrow schedule for Gasabo sector updated.', time:'5 hours ago', read:true },
  { id:7, type:'payment', title:'Payment Received', message:'Nzeyimana Claude paid 5,700 RWF via Bank Transfer.', time:'Yesterday', read:true },
  { id:8, type:'system', title:'New Customer', message:'Ndayisaba Theophile registered successfully.', time:'Yesterday', read:true },
  { id:9, type:'warning', title:'Customer Warning', message:'Mukamusoni Esperance is 10 days overdue (3,800 RWF).', time:'2 days ago', read:true },
  { id:10, type:'info', title:'Company Notice', message:'AGRUNI: Collection paused April 7th (holiday).', time:'3 days ago', read:true },
])
const unread = computed(() => notifs.value.filter(n => !n.read).length)
const filtered = computed(() => filter.value === 'all' ? notifs.value : notifs.value.filter(n => n.type === filter.value))
const markAllRead = () => notifs.value.forEach(n => n.read = true)
const dismiss = (id: number) => { notifs.value = notifs.value.filter(n => n.id !== id) }
</script>
<style scoped>
.notif-page { display:flex; flex-direction:column; gap:20px; }
.page-top { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; }
.page-top h2 { font-size:22px; font-weight:700; color:#0f172a; margin:0; display:inline; }
.count-badge { margin-left:12px; padding:4px 12px; border-radius:20px; font-size:13px; font-weight:600; background:#dbeafe; color:#2563eb; }
.top-actions { display:flex; gap:10px; align-items:center; }
.mark-btn { display:inline-flex; align-items:center; gap:6px; padding:8px 16px; border:1px solid #e5e7eb; border-radius:10px; background:white; color:#475569; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.2s; }
.mark-btn:hover { border-color:#3b82f6; color:#3b82f6; }
.mark-btn svg { width:16px; height:16px; }
.sel { height:38px; padding:0 12px; border:1px solid #e2e8f0; border-radius:10px; background:white; font-size:13px; color:#334155; cursor:pointer; }
.list { display:flex; flex-direction:column; gap:6px; }
.item { display:flex; align-items:flex-start; gap:14px; padding:18px 20px; background:white; border-radius:14px; border:1px solid #e5e7eb; transition:all 0.2s; cursor:pointer; }
.item:hover { border-color:#cbd5e1; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
.item.unread { background:#f8faff; border-left:3px solid #3b82f6; }
.ico { width:42px; height:42px; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.ico svg { width:20px; height:20px; }
.ico.payment { background:#dbeafe; color:#1e3a8a; }
.ico.warning { background:#fef3c7; color:#d97706; }
.ico.system { background:#f1f5f9; color:#475569; }
.ico.info { background:#dbeafe; color:#2563eb; }
.body { flex:1; min-width:0; }
.ttl { font-size:14px; font-weight:700; color:#0f172a; margin-bottom:4px; }
.msg { font-size:13px; color:#64748b; line-height:1.5; margin-bottom:6px; }
.tm { display:flex; align-items:center; gap:4px; font-size:12px; color:#94a3b8; }
.tm svg { width:14px; height:14px; }
.x { width:28px; height:28px; border-radius:8px; border:none; background:transparent; color:#cbd5e1; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; flex-shrink:0; }
.x:hover { background:#fee2e2; color:#ef4444; }
.x svg { width:14px; height:14px; }
.empty { display:flex; flex-direction:column; align-items:center; padding:60px 20px; color:#94a3b8; }
.empty svg { width:48px; height:48px; margin-bottom:16px; }
.empty h3 { margin:0 0 4px; color:#475569; font-size:18px; }
.empty p { margin:0; font-size:14px; }
</style>

