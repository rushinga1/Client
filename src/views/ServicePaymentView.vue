<template>
  <div class="service-payment-view">
    <div class="view-header" v-motion-fade>
      <div class="header-main-section">
        <div class="header-icon-box">
          <Icon icon="ph:shield-check-fill" class="header-main-icon" />
        </div>
        <div class="header-content">
          <div class="title-row">
            <h1 class="view-title">Service Payment</h1>
            <div class="secure-badge">
              <Icon icon="ph:lock-fill" />
              <span>Secure Transaction</span>
            </div>
          </div>
          <p class="view-description">Pay for waste collection and other services securely using our encrypted payment gateway.</p>
        </div>
      </div>
      
      <!-- Step Indicator -->
      <div class="payment-steps-container">
        <div class="payment-steps">
          <div 
            v-for="(s, index) in steps" 
            :key="index"
            :class="['step-item', { 'active': currentStep >= index + 1, 'completed': currentStep > index + 1 }]"
          >
            <div class="step-circle-wrapper">
              <div class="step-number">
                <Icon v-if="currentStep > index + 1" icon="ph:check-bold" />
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div v-if="index < steps.length - 1" class="step-line"></div>
            </div>
            <span class="step-label">{{ s }}</span>
          </div>
        </div>
      </div>

      <!-- Unified Step Content Area -->
      <div class="step-content">
        <!-- Step 1: Service Selection -->
        <div v-if="currentStep === 1" class="payment-card-grid" v-motion-fade>
          <div 
            v-for="service in availableServices" 
            :key="service.id" 
            class="service-card"
            :class="{ 'selected': selectedService?.id === service.id }"
            @click="selectService(service)"
          >
            <div class="service-icon" :style="{ backgroundColor: service.color + '20', color: service.color }">
              <Icon :icon="service.icon" />
            </div>
            <div class="service-info">
              <h3 class="service-name">{{ service.name }}</h3>
              <p class="service-desc">{{ service.description }}</p>
            </div>
            <div class="service-price">
              <span class="currency">RWF</span>
              <span class="amount">{{ formatNumber(service.price) }}</span>
            </div>
          </div>

          <div class="step-actions">
            <BaseButton 
              variant="primary" 
              size="lg" 
              :disabled="!selectedService"
              @click="nextStep"
            >
              Continue to Payment Method
            </BaseButton>
          </div>
        </div>

        <!-- Step 2: Payment Method -->
        <div v-if="currentStep === 2" class="payment-method-selection" v-motion-slide-right>
          <div class="section-title">Select Payment Method</div>
          <div class="method-grid">
            <div 
              v-for="method in paymentMethods" 
              :key="method.id"
              class="method-card"
              :class="{ 'selected': selectedMethod?.id === method.id }"
              @click="selectMethod(method)"
            >
              <div class="method-brand" :style="{ backgroundColor: method.brandBg }">
                <img :src="method.logo" :alt="method.name" v-if="method.logo" class="brand-logo" />
                <Icon v-else :icon="method.icon" :style="{ color: method.brandColor }" />
              </div>
              <div class="method-info">
                <span class="method-name">{{ method.name }}</span>
                <span class="method-tagline">{{ method.tagline }}</span>
              </div>
              <div class="selection-status">
                <Icon icon="ph:check-circle-fill" v-if="selectedMethod?.id === method.id" />
              </div>
            </div>
          </div>

          <!-- Specific Input for Mobile Money -->
          <div v-if="selectedMethod && (selectedMethod.id === 'mtn' || selectedMethod.id === 'airtel')" class="phone-input-section" v-motion-fade>
            <BaseInput
              label="Phone Number"
              placeholder="078X XXX XXX"
              v-model="phoneNumber"
              type="tel"
            />
            <p class="input-hint">A push notification will be sent to this number to authorize the payment.</p>
          </div>

          <!-- Specific Input for Cards -->
          <div v-if="selectedMethod && selectedMethod.id === 'visa'" class="card-input-section" v-motion-fade>
            <BaseInput label="Card Number" placeholder="0000 0000 0000 0000" />
            <div class="card-sub-row">
              <BaseInput label="Expiry Date" placeholder="MM/YY" />
              <BaseInput label="CVV" placeholder="123" />
            </div>
          </div>

          <div class="step-actions">
            <BaseButton variant="ghost" @click="prevStep">Back</BaseButton>
            <BaseButton 
              variant="primary" 
              size="lg" 
              :loading="isProcessing" 
              :disabled="!isReadyToPay"
              @click="processPayment"
            >
              Complete Payment
            </BaseButton>
          </div>
        </div>

        <!-- Step 3: Success State -->
        <div v-if="currentStep === 3" class="payment-success-state" v-motion-scale>
          <div class="success-icon-wrapper">
            <Icon icon="ph:check-circle-fill" class="success-icon" />
          </div>
          <h2 class="success-title">Payment Successful!</h2>
          <p class="success-message">Your payment has been processed successfully. You can now download your receipt.</p>
          
          <div class="receipt-summary">
            <div class="summary-item">
              <span class="label">Reference:</span>
              <span class="value">#{{ Math.random().toString(36).substring(7).toUpperCase() }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Amount Paid:</span>
              <span class="value">RWF {{ formatNumber(selectedService?.price || 0) }}</span>
            </div>
            <div class="summary-item">
              <span class="label">Method:</span>
              <span class="value">{{ selectedMethod?.name }}</span>
            </div>
          </div>

          <div class="success-actions">
            <BaseButton variant="primary" size="lg" iconLeft="ph:download-simple-bold" @click="downloadReceipt">
              Download Receipt
            </BaseButton>
            <BaseButton variant="primary" size="lg" @click="resetPayment">Return to Dashboard</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import BaseButton from '../components/base/BaseButton.vue'
import BaseInput from '../components/base/BaseInput.vue'
import { usePaymentStore } from '../stores/payment.store'

const router = useRouter()
const paymentStore = usePaymentStore()

// Steps logic
const steps = ['Selection', 'Method', 'Confirmation']
const currentStep = ref(1)

// Service Selection
const availableServices = [
  { id: '1', name: 'Monthly Waste Collection', description: 'Regular weekly waste collection service', price: 5000, icon: 'ph:trash', color: '#10b981' },
  { id: '2', name: 'Special Large Waste', description: 'One-time collection for oversized items/rubble', price: 15000, icon: 'ph:truck', color: '#3b82f6' },
  { id: '3', name: 'Service Debt Settlement', description: 'Clear your outstanding balance', price: 12000, icon: 'ph:receipt', color: '#f59e0b' }
]
const selectedService = ref<any>(null)

// Payment Methods
const paymentMethods = [
  { 
    id: 'mtn', 
    name: 'MTN MoMo', 
    tagline: 'Fast and convenient', 
    brandBg: '#FFCC00', 
    brandColor: '#000', 
    icon: 'ph:phone-fill',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/MTN_Logo.svg/1024px-MTN_Logo.svg.png'
  },
  { 
    id: 'airtel', 
    name: 'Airtel Money', 
    tagline: 'Secure payments', 
    brandBg: '#ED1C24', 
    brandColor: '#FFF', 
    icon: 'ph:phone-fill',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Airtel_logo.svg/1200px-Airtel_logo.svg.png'
  },
  { 
    id: 'card', 
    name: 'Visa', 
    tagline: 'Visa, Mastercard', 
    brandBg: '#1A1F71', 
    brandColor: '#FFF', 
    icon: 'ph:credit-card',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png'
  }
]
const selectedMethod = ref<any>(null)

// Form State
const phoneNumber = ref('')
const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvc = ref('')
const isProcessing = ref(false)
const transactionId = ref('')

// Helpers
const formatNumber = (num: number) => new Intl.NumberFormat().format(num)

const selectService = (service: any) => {
  selectedService.value = service
}

const selectMethod = (method: any) => {
  selectedMethod.value = method
}

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const isReadyToPay = computed(() => {
  if (!selectedMethod.value) return false
  if (selectedMethod.value.id === 'mtn' || selectedMethod.value.id === 'airtel') {
    return phoneNumber.value.length >= 10
  }
  if (selectedMethod.value.id === 'card') {
    return cardName.value && cardNumber.value.length >= 16
  }
  return true
})

const processPayment = async () => {
  isProcessing.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  transactionId.value = 'TXN' + Math.floor(Math.random() * 100000000).toString()
  
  // Add to store
  paymentStore.addPayment({
    date: new Date().toISOString().split('T')[0],
    amount: selectedService.value.price,
    service: selectedService.value.name,
    method: selectedMethod.value.name as any,
    transactionId: transactionId.value
  })

  isProcessing.value = false
  currentStep.value = 3
}

const goToHistory = () => {
  router.push('/history')
}

const downloadReceipt = () => {
  alert('Receipt downloading as PDF...')
}

const resetPayment = () => {
  currentStep.value = 1
  selectedService.value = null
  selectedMethod.value = null
  phoneNumber.value = ''
  cardName.value = ''
  cardNumber.value = ''
  cardExpiry.value = ''
  cardCvc.value = ''
}
</script>

<style scoped>
.service-payment-view {
  min-height: 100%;
}

.view-header {
  margin-bottom: 40px;
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.view-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.header-main-section {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.header-icon-box {
  width: 64px;
  height: 64px;
  background: #eff6ff;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-main-icon {
  font-size: 32px;
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

.secure-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #059669;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid #d1fae5;
}

.view-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  max-width: 600px;
}

.payment-steps-container {
  padding-top: 32px;
  border-top: 1px solid #f1f5f9;
}

.payment-steps {
  display: flex;
  justify-content: space-between;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

.step-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}

.step-circle-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: #94a3b8;
  position: relative;
  z-index: 2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-label {
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  transition: color 0.3s ease;
}

.step-content {
  padding-top: 40px;
}

.step-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  transform: translateY(-50%);
  z-index: 1;
}

.step-item.active .step-number {
  border-color: #3b82f6;
  background: #3b82f6;
  color: white;
  box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.15);
}

.step-item.active .step-label {
  color: #1e293b;
  font-weight: 700;
}

.step-item.completed .step-number {
  border-color: #10b981;
  background: #10b981;
  color: white;
}

.step-item.completed .step-line {
  background: #10b981;
}

.step-item.active .step-line {
  background: linear-gradient(90deg, #3b82f6 0%, #e2e8f0 100%);
}

/* Service Cards */
.payment-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.service-card {
  background: white;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  border-color: #3b82f6;
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.05);
}

.service-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.service-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 20px;
}

.service-name {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.service-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 24px;
  flex: 1;
}

.service-price {
  border-top: 1px solid #f1f5f9;
  padding-top: 16px;
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
}

.amount {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.step-actions {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
}

/* Payment Methods */
.payment-method-selection {
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 24px;
}

.method-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.method-card:hover {
  background: #f8fafc;
  border-color: #3b82f6;
}

.method-card.selected {
  border-color: #3b82f6;
  background: #eff6ff;
}

.method-brand {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  overflow: hidden;
}

.brand-logo {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.method-info {
  flex: 1;
}

.method-name {
  display: block;
  font-weight: 700;
  color: #1e293b;
}

.method-tagline {
  font-size: 12px;
  color: #64748b;
}

.selection-status {
  color: #3b82f6;
  font-size: 20px;
}

.phone-input-section, .card-input-section {
  background: #f8fafc;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 32px;
}

.card-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.card-sub-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.input-hint {
  font-size: 12px;
  color: #64748b;
  margin-top: 8px;
}

/* Success State */
.payment-success-state {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 40px 0;
}

.success-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 24px;
}

.success-icon {
  font-size: 80px;
  color: #10b981;
}

.success-title {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 12px;
}

.success-message {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 32px;
}

.receipt-summary {
  background: #f8fafc;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #e2e8f0;
}

.summary-item:last-child {
  border-bottom: none;
}

.summary-item .label {
  color: #64748b;
  font-weight: 500;
}

.summary-item .value {
  color: #1e293b;
  font-weight: 700;
}

.success-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 768px) {
  .payment-card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
