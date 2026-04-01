<template>
  <div class="houses-page">
    <!-- Page Header -->
    <div class="page-top">
      <div class="page-top-left">
        <h2 class="section-title">All Houses</h2>
        <span class="house-count">{{ filteredHouses.length }} customers</span>
      </div>
      <div class="page-top-right">
        <div class="search-box">
          <Icon icon="ph:magnifying-glass" class="search-icon" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search by name, house #, village..."
            class="search-input"
          />
          <button v-if="searchQuery" class="search-clear" @click="searchQuery = ''">
            <Icon icon="ph:x" />
          </button>
        </div>
        <div class="filter-group">
          <select v-model="filterStatus" class="filter-select">
            <option value="all">All Status</option>
            <option value="paid">Paid ✅</option>
            <option value="unpaid">Unpaid ❌</option>
          </select>
          <select v-model="filterCategory" class="filter-select">
            <option value="all">All Categories</option>
            <option value="rich">Abakire (Rich)</option>
            <option value="medium">Icyiciro cya 2</option>
            <option value="poor">Abakene (Poor)</option>
            <option value="business">Business</option>
          </select>
          <select v-model="filterSector" class="filter-select">
            <option value="all">All Sectors</option>
            <option v-for="s in uniqueSectors" :key="s" :value="s">{{ s }}</option>
          </select>
          <select v-model="filterCell" class="filter-select" :disabled="filterSector === 'all'">
            <option value="all">All Cells</option>
            <option v-for="c in cellsInSector" :key="c" :value="c">{{ c }}</option>
          </select>
          <select v-model="filterVillage" class="filter-select" :disabled="filterCell === 'all'">
            <option value="all">All Villages</option>
            <option v-for="v in villagesInCell" :key="v" :value="v">{{ v }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Houses List -->
    <div class="houses-list">
      <div
        v-for="house in filteredHouses"
        :key="house.id"
        class="house-card"
        :class="{ 'house-card--expanded': expandedId === house.id }"
        @click="toggleExpand(house.id)"
      >
        <div class="house-row">
          <!-- Status Indicator -->
          <div class="house-status" :class="house.paid ? 'house-status--paid' : 'house-status--unpaid'">
            <Icon :icon="house.paid ? 'ph:check-circle-fill' : 'ph:x-circle-fill'" />
          </div>

          <!-- Customer Info -->
          <div class="house-info">
            <div class="house-name">
              <Icon icon="ph:map-pin" />
              {{ house.village }}, {{ house.cell }} • House #{{ house.houseNumber }}
            </div>
            <div class="house-location">{{ house.fullName }}</div>
          </div>

          <!-- Category Badge -->
          <div class="category-badge" :class="`category-badge--${house.category}`">
            {{ getCategoryLabel(house.category) }}
          </div>

          <!-- Amount -->
          <div class="house-amount">
            <span class="house-amount-value">{{ getAmountByCategory(house.category).toLocaleString() }}</span>
            <span class="house-amount-label">RWF/week</span>
          </div>

          <!-- Action -->
          <div class="house-actions" @click.stop>
            <button
              v-if="!house.paid"
              class="call-btn"
              @click.stop="callCustomer(house)"
              title="Call customer"
            >
              <Icon icon="ph:phone-call" />
              <span>Call</span>
            </button>
            <button v-else class="detail-btn" @click.stop="toggleExpand(house.id)">
              <Icon icon="ph:eye" />
              <span>Details</span>
            </button>
          </div>

          <!-- Expand Arrow -->
          <div class="house-expand">
            <Icon :icon="expandedId === house.id ? 'ph:caret-up' : 'ph:caret-down'" />
          </div>
        </div>

        <!-- Expanded Details -->
        <transition name="expand">
          <div v-if="expandedId === house.id" class="house-details">
            <template v-if="house.paid">
              <PaymentEvidenceModal
                :amount="getAmountByCategory(house.category)"
                :payment-date="house.paymentDate || ''"
                :payment-time="house.paymentTime || ''"
                :transaction-id="house.transactionId || ''"
                :reference-code="`REF-${house.id}-${house.paymentDate?.replace(/\s/g, '')}`"
                :method="house.paymentMethod || 'MTN MoMo'"
                :phone="house.phone"
                :customer-name="house.fullName"
                :house-location="`${house.village}, ${house.cell} • House #${house.houseNumber}`"
                :customer-category="getCategoryLabel(house.category)"
                :week-count="1"
                verify-time="2 min ago"
              />
            </template>
            <template v-else>
              <div class="details-title details-title--warning">
                <Icon icon="ph:warning-circle" />
                Unpaid — {{ house.daysOverdue }} days overdue
              </div>
              <div class="details-grid">
                <div class="detail-item">
                  <span class="detail-label">Full Name</span>
                  <span class="detail-value">{{ house.fullName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Phone</span>
                  <span class="detail-value">{{ house.phone }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">District</span>
                  <span class="detail-value">{{ house.district }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Sector</span>
                  <span class="detail-value">{{ house.sector }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Cell</span>
                  <span class="detail-value">{{ house.cell }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Village</span>
                  <span class="detail-value">{{ house.village }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Last Payment</span>
                  <span class="detail-value">{{ house.lastPaymentDate || 'Never' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Category</span>
                  <span class="detail-value">{{ getCategoryLabel(house.category) }} — {{ getAmountByCategory(house.category).toLocaleString() }} RWF</span>
                </div>
              </div>
              <div class="details-actions">
                <button class="call-btn-large" @click.stop="callCustomer(house)">
                  <Icon icon="ph:phone-call" />
                  Call {{ house.fullName.split(' ')[0] }}
                </button>
              </div>
            </template>
          </div>
        </transition>
      </div>

      <!-- Empty State -->
      <div v-if="filteredHouses.length === 0" class="empty-state">
        <Icon icon="ph:magnifying-glass" />
        <h3>No customers found</h3>
        <p>Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Call Modal -->
    <teleport to="body">
      <div v-if="showCallModal" class="modal-overlay" @click="showCallModal = false">
        <div class="modal-card" @click.stop>
          <div class="modal-icon modal-icon--call">
            <Icon icon="ph:phone-call" />
          </div>
          <h3>Calling {{ callingCustomer?.fullName }}</h3>
          <p class="modal-phone">{{ callingCustomer?.phone }}</p>
          <p class="modal-subtitle">Remind them about their weekly payment</p>
          <div class="modal-actions">
            <button class="modal-btn modal-btn--secondary" @click="showCallModal = false">Cancel</button>
            <a :href="`tel:${callingCustomer?.phone}`" class="modal-btn modal-btn--primary">
              <Icon icon="ph:phone-call" /> Call Now
            </a>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import PaymentEvidenceModal from '../../components/domain/payment/PaymentEvidenceModal.vue'

interface House {
  id: number
  fullName: string
  phone: string
  district: string
  sector: string
  cell: string
  village: string
  houseNumber: string
  category: 'rich' | 'medium' | 'poor' | 'business'
  paid: boolean
  paymentDate?: string
  paymentTime?: string
  transactionId?: string
  paymentMethod?: string
  lastPaymentDate?: string
  daysOverdue?: number
}

const searchQuery = ref('')
const filterStatus = ref('all')
const filterCategory = ref('all')
const filterSector = ref('all')
const filterCell = ref('all')
const filterVillage = ref('all')
const expandedId = ref<number | null>(null)
const showCallModal = ref(false)
const callingCustomer = ref<House | null>(null)

const houses = ref<House[]>([
  { id: 1, fullName: 'Uwimana Jean Pierre', phone: '+250788123456', district: 'Kigali', sector: 'Nyarugenge', cell: 'Biryogo', village: 'Kiyovu', houseNumber: 'KG-234', category: 'rich', paid: true, paymentDate: 'March 28, 2026', paymentTime: '10:23 AM', transactionId: 'TXN-2026-00412', paymentMethod: 'MTN MoMo' },
  { id: 2, fullName: 'Mukeshimana Alice', phone: '+250722456789', district: 'Kigali', sector: 'Nyarugenge', cell: 'Biryogo', village: 'Nyamirambo', houseNumber: 'KG-112', category: 'poor', paid: true, paymentDate: 'March 27, 2026', paymentTime: '2:15 PM', transactionId: 'TXN-2026-00398', paymentMethod: 'Airtel Money' },
  { id: 3, fullName: 'Habimana Patrick', phone: '+250733567890', district: 'Kigali', sector: 'Gasabo', cell: 'Kimihurura', village: 'Kimihurura', houseNumber: 'KG-078', category: 'medium', paid: false, lastPaymentDate: 'March 15, 2026', daysOverdue: 13 },
  { id: 4, fullName: 'Ingabire Diane', phone: '+250788901234', district: 'Kigali', sector: 'Gasabo', cell: 'Gisozi', village: 'Gisozi', houseNumber: 'KG-456', category: 'poor', paid: false, lastPaymentDate: 'March 20, 2026', daysOverdue: 8 },
  { id: 5, fullName: 'Nzeyimana Claude', phone: '+250722234567', district: 'Kigali', sector: 'Kicukiro', cell: 'Gatenga', village: 'Remera', houseNumber: 'KK-089', category: 'rich', paid: true, paymentDate: 'March 29, 2026', paymentTime: '8:50 AM', transactionId: 'TXN-2026-00425', paymentMethod: 'Bank Transfer' },
  { id: 6, fullName: 'Kamana Emmanuel', phone: '+250788345678', district: 'Kigali', sector: 'Nyarugenge', cell: 'Rwezamenyo', village: 'Rwezamenyo', houseNumber: 'KG-321', category: 'medium', paid: true, paymentDate: 'March 26, 2026', paymentTime: '4:30 PM', transactionId: 'TXN-2026-00380', paymentMethod: 'MTN MoMo' },
  { id: 7, fullName: 'Uwase Grace', phone: '+250733678901', district: 'Kigali', sector: 'Gasabo', cell: 'Remera', village: 'Remera', houseNumber: 'KG-567', category: 'poor', paid: false, lastPaymentDate: 'March 10, 2026', daysOverdue: 18 },
  { id: 8, fullName: 'Bizimana Fabrice', phone: '+250788789012', district: 'Kigali', sector: 'Kicukiro', cell: 'Niboye', village: 'Niboye', houseNumber: 'KK-145', category: 'rich', paid: false, lastPaymentDate: 'March 22, 2026', daysOverdue: 6 },
  { id: 9, fullName: 'Supermarket Kigali SARL', phone: '+250788111222', district: 'Kigali', sector: 'Nyarugenge', cell: 'Nyarugenge', village: 'CBD', houseNumber: 'KG-001', category: 'business', paid: true, paymentDate: 'March 25, 2026', paymentTime: '11:00 AM', transactionId: 'TXN-2026-00370', paymentMethod: 'Bank Transfer' },
  { id: 10, fullName: 'Mukamusoni Esperance', phone: '+250722890123', district: 'Kigali', sector: 'Gasabo', cell: 'Kacyiru', village: 'Kacyiru', houseNumber: 'KG-890', category: 'medium', paid: false, lastPaymentDate: 'March 18, 2026', daysOverdue: 10 },
  { id: 11, fullName: 'Ndayisaba Theophile', phone: '+250788432100', district: 'Kigali', sector: 'Kicukiro', cell: 'Kanombe', village: 'Kanombe', houseNumber: 'KK-302', category: 'poor', paid: true, paymentDate: 'March 30, 2026', paymentTime: '9:10 AM', transactionId: 'TXN-2026-00440', paymentMethod: 'MTN MoMo' },
  { id: 12, fullName: 'Ishimwe Providence', phone: '+250733112233', district: 'Kigali', sector: 'Nyarugenge', cell: 'Mageragere', village: 'Mageragere', houseNumber: 'KG-555', category: 'rich', paid: true, paymentDate: 'March 29, 2026', paymentTime: '3:45 PM', transactionId: 'TXN-2026-00430', paymentMethod: 'Airtel Money' },
])

const uniqueSectors = computed(() => {
  const sectors = new Set(houses.value.map(h => h.sector))
  return Array.from(sectors).sort()
})

const cellsInSector = computed(() => {
  if (filterSector.value === 'all') return []
  const cells = new Set(
    houses.value
      .filter(h => h.sector === filterSector.value)
      .map(h => h.cell)
  )
  return Array.from(cells).sort()
})

const villagesInCell = computed(() => {
  if (filterCell.value === 'all') return []
  const villages = new Set(
    houses.value
      .filter(h => h.cell === filterCell.value && (filterSector.value === 'all' || h.sector === filterSector.value))
      .map(h => h.village)
  )
  return Array.from(villages).sort()
})

const filteredHouses = computed(() => {
  let result = houses.value.filter(h => {
    const matchSearch = searchQuery.value === '' ||
      h.fullName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      h.houseNumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      h.village.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      h.cell.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchStatus =
      filterStatus.value === 'all' ||
      (filterStatus.value === 'paid' && h.paid) ||
      (filterStatus.value === 'unpaid' && !h.paid)

    const matchCategory =
      filterCategory.value === 'all' ||
      h.category === filterCategory.value

    const matchSector = filterSector.value === 'all' || h.sector === filterSector.value
    const matchCell = filterCell.value === 'all' || h.cell === filterCell.value
    const matchVillage = filterVillage.value === 'all' || h.village === filterVillage.value

    return matchSearch && matchStatus && matchCategory && matchSector && matchCell && matchVillage
  })

  // Sort by location (village then cell)
  result.sort((a, b) => {
    const locA = `${a.village}${a.cell}`.toLowerCase()
    const locB = `${b.village}${b.cell}`.toLowerCase()
    return locA.localeCompare(locB)
  })

  return result
})

const getCategoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    rich: 'Abakire',
    medium: 'Icyiciro cya 2',
    poor: 'Abakene',
    business: 'Business'
  }
  return labels[cat] || cat
}

const getAmountByCategory = (cat: string) => {
  const amounts: Record<string, number> = {
    rich: 5700,
    medium: 3800,
    poor: 2000,
    business: 0
  }
  return amounts[cat] || 0
}

const toggleExpand = (id: number) => {
  expandedId.value = expandedId.value === id ? null : id
}

const callCustomer = (house: House) => {
  callingCustomer.value = house
  showCallModal.value = true
}
</script>

<style scoped>
.houses-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Page Top */
.page-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.page-top-left {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

.house-count {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
}

.page-top-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  color: #94a3b8;
  width: 18px;
  height: 18px;
  pointer-events: none;
}

.search-input {
  width: 300px;
  height: 42px;
  padding: 0 38px 0 42px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 14px;
  color: #1e293b;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-clear {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  padding: 4px;
  border-radius: 4px;
}

.search-clear:hover { color: #475569; }

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-select {
  height: 42px;
  padding: 0 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  font-size: 13px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

/* House Card */
.houses-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.house-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: pointer;
}

.house-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.house-card--expanded {
  border-color: #3b82f6;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.12);
}

.house-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
}

.house-status {
  flex-shrink: 0;
}

.house-status svg {
  width: 28px;
  height: 28px;
}

.house-status--paid { color: #3b82f6; }
.house-status--unpaid { color: #ef4444; }

.house-info {
  flex: 1;
  min-width: 0;
}

.house-name {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 15px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 2px;
}

.house-name svg {
  width: 14px;
  height: 14px;
}

.house-location {
  font-size: 13px;
  color: #94a3b8;
}

.category-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.category-badge--rich { background: #f3e8ff; color: #7c3aed; }
.category-badge--medium { background: #dbeafe; color: #2563eb; }
.category-badge--poor { background: #dbeafe; color: #1e3a8a; }
.category-badge--business { background: #fef3c7; color: #d97706; }

.house-amount {
  text-align: right;
  min-width: 80px;
}

.house-amount-value {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.house-amount-label {
  font-size: 11px;
  color: #94a3b8;
}

.house-actions {
  min-width: 90px;
  display: flex;
  justify-content: flex-end;
}

.call-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.call-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.4);
}

.call-btn svg { width: 16px; height: 16px; }

.detail-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  color: #475569;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.detail-btn:hover {
  background: #f8fafc;
  border-color: #3b82f6;
  color: #3b82f6;
}

.detail-btn svg { width: 16px; height: 16px; }

.house-expand {
  color: #94a3b8;
  flex-shrink: 0;
}

.house-expand svg { width: 18px; height: 18px; }

/* Details Panel */
.house-details {
  padding: 0 20px 20px;
  border-top: 1px solid #f1f5f9;
}

.details-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 700;
  color: #1e3a8a;
  padding: 16px 0 12px;
}

.details-title svg { width: 20px; height: 20px; }

.details-title--warning { color: #d97706; }

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.detail-item {
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.detail-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  margin-bottom: 4px;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.detail-value--success { color: #1e3a8a; }
.detail-value--mono { font-family: 'DM Mono', monospace; font-size: 13px; }

.details-actions {
  margin-top: 16px;
}

.call-btn-large {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}

.call-btn-large:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.call-btn-large svg { width: 20px; height: 20px; }

/* Expand Animation */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.25s ease;
  max-height: 400px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state svg { width: 48px; height: 48px; margin-bottom: 16px; }
.empty-state h3 { margin: 0 0 4px; color: #475569; font-size: 18px; }
.empty-state p { margin: 0; font-size: 14px; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  border-radius: 20px;
  padding: 36px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}

.modal-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.modal-icon svg { width: 28px; height: 28px; }

.modal-icon--call {
  background: #dbeafe;
  color: #1e3a8a;
}

.modal-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.modal-phone {
  font-size: 20px;
  font-weight: 700;
  color: #3b82f6;
  margin: 8px 0;
  font-family: 'DM Mono', monospace;
}

.modal-subtitle {
  font-size: 14px;
  color: #94a3b8;
  margin: 0 0 24px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.modal-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;
}

.modal-btn--secondary {
  background: #f1f5f9;
  color: #475569;
}

.modal-btn--secondary:hover { background: #e2e8f0; }

.modal-btn--primary {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}

.modal-btn--primary:hover {
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.modal-btn svg { width: 16px; height: 16px; }

/* Responsive */
@media (max-width: 1024px) {
  .house-row { flex-wrap: wrap; gap: 10px; }
  .house-amount { min-width: auto; }
  .house-actions { min-width: auto; }
  .search-input { width: 220px; }
}

@media (max-width: 768px) {
  .page-top { flex-direction: column; }
  .page-top-right { width: 100%; }
  .search-input { width: 100%; }
  .filter-group { width: 100%; }
  .filter-select { flex: 1; }
  .house-row { padding: 12px 14px; }
  .category-badge { display: none; }
  .details-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 480px) {
  .details-grid { grid-template-columns: 1fr; }
}
</style>

