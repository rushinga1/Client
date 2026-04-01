<template>
  <div class="receipt-view">
    <div class="receipt-toolbar">
      <button class="receipt-btn receipt-btn--back" @click="goBack">← Back</button>
      <button class="receipt-btn receipt-btn--print" @click="printReceipt">🖨 Print</button>
    </div>

    <div class="receipt-paper" ref="receiptRef">
      <!-- Receipt Paper -->
      <div class="receipt-wrapper">
        <!-- Header -->
        <div class="receipt-header">
          <div class="receipt-logo">AGRUNI</div>
          <div class="receipt-subtitle">Waste Management</div>
          <div class="receipt-divider-thick"></div>
        </div>

        <!-- Receipt Number -->
        <div class="receipt-meta">
          <div class="meta-row">
            <span>Receipt #:</span>
            <span class="mono">{{ receiptData.transactionId }}</span>
          </div>
          <div class="meta-row">
            <span>Date:</span>
            <span>{{ receiptData.paymentDate }}</span>
          </div>
          <div class="meta-row">
            <span>Time:</span>
            <span>{{ receiptData.paymentTime }}</span>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Amount (Main) -->
        <div class="receipt-amount-section">
          <div class="amount-label">AMOUNT PAID</div>
          <div class="amount-display">
            <span class="amount-value">{{ formatCurrency(receiptData.amount) }}</span>
            <span class="amount-currency">RWF</span>
          </div>
          <div class="amount-status">✓ PAYMENT CONFIRMED</div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Payment Details -->
        <div class="receipt-section">
          <div class="section-header">PAYMENT METHOD</div>
          <div class="detail-row-wide">
            <div class="detail-left">{{ receiptData.method }}</div>
            <div class="detail-right mono">{{ formatPhone(receiptData.phone) }}</div>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Transaction Details -->
        <div class="receipt-section">
          <div class="section-header">TRANSACTION DETAILS</div>
          <div class="detail-row-wide">
            <div class="detail-label">Transaction ID:</div>
            <div class="detail-value mono">{{ receiptData.transactionId }}</div>
          </div>
          <div class="detail-row-wide">
            <div class="detail-label">Reference Code:</div>
            <div class="detail-value mono">{{ receiptData.referenceCode }}</div>
          </div>
          <div class="detail-row-wide">
            <div class="detail-label">Category:</div>
            <div class="detail-value">{{ receiptData.customerCategory }}</div>
          </div>
          <div class="detail-row-wide">
            <div class="detail-label">Weeks Covered:</div>
            <div class="detail-value">{{ receiptData.weekCount }}</div>
          </div>
        </div>

        <div class="receipt-divider"></div>

        <!-- Customer Info -->
        <div class="receipt-section">
          <div class="section-header">CUSTOMER INFORMATION</div>
          <div class="customer-name">{{ receiptData.customerName }}</div>
          <div class="customer-location">📍 {{ receiptData.houseLocation }}</div>
        </div>

        <div class="receipt-divider-thick"></div>

        <!-- Footer -->
        <div class="receipt-footer">
          <div class="footer-text">Thank you for your payment</div>
          <div class="footer-text small">Keep this receipt for your records</div>
          <div class="footer-divider"></div>
          <div class="footer-text tiny">AGRUNI Waste Management Portal</div>
          <div class="footer-text tiny">{{ new Date().toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const receiptRef = ref<HTMLElement>()

const receiptData = ref({
  amount: 0,
  paymentDate: '',
  paymentTime: '',
  transactionId: '',
  referenceCode: '',
  method: '',
  phone: '',
  customerName: '',
  houseLocation: '',
  customerCategory: '',
  weekCount: 1
})

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `+250 788 *** ${last4}`
}

const goBack = () => {
  router.back()
}

const printReceipt = () => {
  window.print()
}

onMounted(() => {
  // Get data from route params
  if (route.query) {
    try {
      receiptData.value = {
        amount: parseInt(route.query.amount as string) || 0,
        paymentDate: (route.query.paymentDate as string) || '',
        paymentTime: (route.query.paymentTime as string) || '',
        transactionId: (route.query.transactionId as string) || '',
        referenceCode: (route.query.referenceCode as string) || '',
        method: (route.query.method as string) || '',
        phone: (route.query.phone as string) || '',
        customerName: (route.query.customerName as string) || '',
        houseLocation: (route.query.houseLocation as string) || '',
        customerCategory: (route.query.customerCategory as string) || '',
        weekCount: parseInt(route.query.weekCount as string) || 1
      }
    } catch (e) {
      console.error('Failed to parse receipt data', e)
    }
  }
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #e5e5e5;
}

.receipt-view {
  min-height: 100vh;
  background: #e5e5e5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Courier New', monospace;
}

.receipt-toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  z-index: 10;
}

.receipt-btn {
  padding: 10px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.2s;
}

.receipt-btn:hover {
  background: #f5f5f5;
  border-color: #999;
}

.receipt-btn--print {
  background: #1e3a8a;
  color: white;
  border-color: #1e3a8a;
}

.receipt-btn--print:hover {
  background: #1e293b;
  border-color: #1e293b;
}

/* Paper Container */
.receipt-paper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  padding: 20px;
}

.receipt-wrapper {
  width: 310px;
  background: white;
  padding: 20px;
  box-shadow: 0 0 20px rgba(30, 58, 138, 0.2);
  font-size: 11px;
  line-height: 1.6;
  color: #1e293b;
}

/* Receipt Header */
.receipt-header {
  text-align: center;
  margin-bottom: 12px;
}

.receipt-logo {
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 4px;
  color: #1e3a8a;
}

.receipt-subtitle {
  font-size: 10px;
  color: #475569;
  margin-bottom: 8px;
}

.receipt-divider {
  border-bottom: 1px dotted #94a3b8;
  margin: 8px 0;
}

.receipt-divider-thick {
  border-bottom: 2px solid #1e3a8a;
  margin: 12px 0;
}

/* Meta Information */
.receipt-meta {
  margin-bottom: 8px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  font-size: 10px;
}

/* Amount Section */
.receipt-amount-section {
  text-align: center;
  padding: 12px 0;
  margin: 12px 0;
  background: #f9fafb;
  border-radius: 2px;
}

.amount-label {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #666;
  margin-bottom: 6px;
}

.amount-display {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
  margin-bottom: 6px;
}

.amount-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e3a8a;
}

.amount-currency {
  font-size: 11px;
  font-weight: 600;
  color: #1e3a8a;
}

.amount-status {
  font-size: 9px;
  font-weight: 700;
  color: #1e3a8a;
  letter-spacing: 0.5px;
}

/* Sections */
.receipt-section {
  margin: 8px 0;
}

.section-header {
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  color: #1f2937;
  margin-bottom: 6px;
  text-transform: uppercase;
}

/* Detail Rows */
.detail-row-wide {
  display: flex;
  justify-content: space-between;
  margin: 4px 0;
  font-size: 10px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 4px;
}

.detail-row-wide:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #475569;
}

.detail-value {
  text-align: right;
  color: #1e293b;
}

.detail-left {
  font-weight: 600;
}

.detail-right {
  text-align: right;
}

.mono {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  letter-spacing: 0.5px;
}

/* Customer Info */
.customer-name {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 4px;
}

.customer-location {
  font-size: 10px;
  color: #666;
}

/* Footer */
.receipt-footer {
  text-align: center;
  margin-top: 12px;
}

.footer-text {
  font-size: 10px;
  margin: 4px 0;
}

.footer-text.small {
  font-size: 9px;
  color: #666;
}

.footer-text.tiny {
  font-size: 8px;
  color: #999;
}

.footer-divider {
  border-bottom: 1px dotted #999;
  margin: 8px 0;
}

/* Print Styles */
@media print {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background: white;
    margin: 0;
    padding: 0;
    width: 80mm;
    height: auto;
  }

  .receipt-view {
    background: white;
    padding: 0;
    min-height: 0;
    width: 80mm;
    margin: 0;
  }

  .receipt-toolbar {
    display: none !important;
  }

  .receipt-paper {
    box-shadow: none;
    padding: 0;
    background: white;
    width: 80mm;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  .receipt-wrapper {
    box-shadow: none;
    width: 80mm;
    padding: 0;
    background: white;
    page-break-inside: avoid;
  }

  @page {
    size: 80mm auto;
    margin: 0;
    padding: 0;
  }
}

/* Responsive */
@media (max-width: 640px) {
  .receipt-view {
    padding: 10px;
  }

  .receipt-wrapper {
    width: 95vw;
    max-width: 320px;
  }
}
</style>
