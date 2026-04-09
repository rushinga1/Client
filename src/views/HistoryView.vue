<template>
  <div class="history-view">
    <div class="view-header" v-motion-fade>
      <div class="header-main-card">
        <div class="header-info-section">
          <div class="header-icon-box">
            <Icon icon="ph:clock-counter-clockwise-fill" class="header-main-icon" />
          </div>
          <div class="header-content">
            <div class="title-row">
              <h1 class="view-title">Payment History</h1>
              <div class="history-badge">
                <Icon icon="ph:file-text-fill" />
                <span>Transaction Record</span>
              </div>
            </div>
            <p class="view-description">View and export your waste collection service payments securely from your digital ledger.</p>
          </div>
        </div>

        <div class="header-actions-section">
          <div class="filter-controls">
            <div class="date-range-picker">
              <div class="picker-input">
                <Icon icon="ph:calendar-blank" class="picker-icon" />
                <input type="date" v-model="startDate" class="date-field" />
              </div>
              <span class="range-separator">to</span>
              <div class="picker-input">
                <Icon icon="ph:calendar-blank" class="picker-icon" />
                <input type="date" v-model="endDate" class="date-field" />
              </div>
            </div>
            <BaseButton variant="ghost" size="sm" @click="resetFilters" class="reset-btn">
              <Icon icon="ph:arrow-counter-clockwise" />
              Reset
            </BaseButton>
          </div>

          <div class="action-divider"></div>

          <div class="export-controls">
            <BaseButton variant="secondary" size="sm" iconLeft="ph:file-csv" @click="exportCSV">
              Export CSV
            </BaseButton>
            <BaseButton variant="secondary" size="sm" iconLeft="ph:file-pdf" @click="exportPDF">
              Export PDF
            </BaseButton>
          </div>
        </div>

        <div class="table-section" v-motion-slide-up>
          <BaseTable
            :columns="columns"
            :rows="filteredHistory"
            :loading="isLoading"
            show-pagination
            :page-size="5"
            empty-title="No payments found"
            empty-description="Try adjusting your filters or date range."
          >
            <!-- Custom Status Column -->
            <template #cell-status="{ value }">
              <BaseBadge :variant="value === 'completed' ? 'success' : 'warning'">
                {{ value.charAt(0).toUpperCase() + value.slice(1) }}
              </BaseBadge>
            </template>

            <!-- Custom Amount Column -->
            <template #cell-amount="{ value }">
              <span class="amount-cell">{{ formatNumber(value) }} RWF</span>
            </template>

            <!-- Custom Method Column -->
            <template #cell-method="{ value }">
              <div class="method-cell">
                <Icon :icon="getMethodIcon(value)" :class="['method-icon', value.toLowerCase().replace(' ', '-')] " />
                <span>{{ value }}</span>
              </div>
            </template>
          </BaseTable>
        </div>
      </div>
    </div>

    <!-- Trends Visualization -->
    <div class="trends-section" v-motion-fade>
      <div class="section-card">
        <div class="card-header">
          <h3 class="card-title">Payment Trends</h3>
          <span class="card-subtitle">Spending over the last 7 months</span>
        </div>
        <div class="trend-chart-container">
          <!-- Custom SVG Bar Chart -->
          <svg viewBox="0 0 800 200" class="trend-chart">
            <!-- Grid Lines -->
            <line x1="50" y1="20" x2="750" y2="20" class="grid-line" />
            <line x1="50" y1="80" x2="750" y2="80" class="grid-line" />
            <line x1="50" y1="140" x2="750" y2="140" class="grid-line" />
            <line x1="50" y1="170" x2="750" y2="170" class="grid-line-main" />

            <!-- Bars -->
            <g v-for="(item, index) in paymentStore.trends" :key="index">
              <rect 
                :x="70 + index * 100" 
                :y="170 - (item.amount / maxTrendAmount) * 150" 
                width="40" 
                :height="(item.amount / maxTrendAmount) * 150" 
                class="chart-bar"
              >
                <title>{{ item.month }}: {{ item.amount }} RWF</title>
              </rect>
              <text 
                :x="90 + index * 100" 
                y="190" 
                class="chart-label"
              >{{ item.month.split(' ')[0] }}</text>
              <text 
                :x="90 + index * 100" 
                :y="160 - (item.amount / maxTrendAmount) * 150" 
                class="chart-value"
              >{{ (item.amount / 1000).toFixed(1) }}k</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseTable, { type TableColumn } from '../components/base/BaseTable.vue'
import BaseBadge from '../components/base/BaseBadge.vue'
import { usePaymentStore } from '../stores/payment.store'

const paymentStore = usePaymentStore()
const isLoading = ref(true)

// Filters
const startDate = ref('')
const endDate = ref('')

// Table Configuration
const columns: TableColumn[] = [
  { key: 'date', label: 'Date', sortable: true, width: '15%' },
  { key: 'id', label: 'Reference', width: '20%' },
  { key: 'service', label: 'Service Description', width: '30%' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right', width: '15%' },
  { key: 'method', label: 'Method', width: '10%' },
  { key: 'status', label: 'Status', align: 'center', width: '10%' }
]

const filteredHistory = computed(() => {
  let result = [...paymentStore.history]
  
  if (startDate.value) {
    result = result.filter(p => p.date >= startDate.value)
  }
  if (endDate.value) {
    result = result.filter(p => p.date <= endDate.value)
  }
  
  return result
})

const maxTrendAmount = computed(() => {
  const max = Math.max(...paymentStore.trends.map(t => t.amount))
  return max > 0 ? max : 20000
})

// Helpers
const formatNumber = (num: number) => new Intl.NumberFormat().format(num)

const getMethodIcon = (method: string) => {
  if (method.includes('MTN')) return 'ph:phone-fill'
  if (method.includes('Airtel')) return 'ph:phone-fill'
  return 'ph:credit-card'
}

const resetFilters = () => {
  startDate.value = ''
  endDate.value = ''
}

const exportCSV = () => {
  const headers = ['Date', 'Reference', 'Service', 'Amount', 'Method', 'Status']
  const rows = filteredHistory.value.map(p => [
    p.date,
    p.id,
    p.service,
    p.amount,
    p.method,
    p.status
  ])
  
  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'Agruni_Payments_Export.csv'
  link.click()
}

const exportPDF = () => {
  window.print()
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.history-view {
  min-height: 100%;
}

.view-header {
  margin-bottom: 40px;
}

.header-main-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.header-main-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.header-info-section {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.header-icon-box {
  width: 60px;
  height: 60px;
  background: #eff6ff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-main-icon {
  font-size: 30px;
  color: #3b82f6;
}

.header-content {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.view-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.history-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #16a34a;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid #dcfce7;
}

.view-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  max-width: 600px;
}

.header-actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.date-range-picker {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 6px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  gap: 12px;
}

.picker-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.picker-icon {
  color: #94a3b8;
  font-size: 16px;
}

.date-field {
  border: none;
  background: transparent;
  font-size: 13px;
  color: #1e293b;
  font-family: inherit;
  font-weight: 500;
  outline: none;
}

.range-separator {
  color: #cbd5e1;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.reset-btn {
  font-weight: 600;
  color: #64748b;
}

.action-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
}

.export-controls {
  display: flex;
  gap: 12px;
}

/* Trends Section */
.trends-section {
  margin-bottom: 32px;
}

.section-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #e2e8f0;
}

.card-header {
  margin-bottom: 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.card-subtitle {
  font-size: 13px;
  color: #64748b;
}

.trend-chart-container {
  height: 220px;
  width: 100%;
}

.trend-chart {
  width: 100%;
  height: 100%;
}

.grid-line {
  stroke: #f1f5f9;
  stroke-width: 1px;
}

.grid-line-main {
  stroke: #e2e8f0;
  stroke-width: 2px;
}

.chart-bar {
  fill: #3b82f6;
  rx: 6;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  fill: #2563eb;
  filter: brightness(1.1);
}

.chart-label {
  fill: #94a3b8;
  font-size: 12px;
  text-anchor: middle;
  font-weight: 500;
}

.chart-value {
  fill: #1e293b;
  font-size: 11px;
  font-weight: 700;
  text-anchor: middle;
}

/* Table Styling */
.table-section {
  margin-top: 32px;
}

.amount-cell {
  font-weight: 700;
  color: #1e293b;
}

.method-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.method-icon {
  width: 16px;
  height: 16px;
}

.method-icon.mtn-momo { color: #ccaa00; }
.method-icon.airtel-money { color: #ed1c24; }
.method-icon.visa { color: #1a1f71; }

@media (max-width: 1024px) {
  .view-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-actions {
    align-items: flex-start;
  }
  
  .filter-group {
    width: 100%;
    overflow-x: auto;
  }
}

@media (max-width: 768px) {
  .trend-chart-container {
    overflow-x: auto;
  }
  .trend-chart {
    min-width: 600px;
  }
}
</style>
