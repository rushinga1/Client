<template>
  <div class="register-page">
    <div class="register-container">
      <!-- Progress Steps -->
      <div class="steps-bar">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ 'step--active': currentStep === index, 'step--done': currentStep > index }"
        >
          <div class="step-circle">
            <Icon v-if="currentStep > index" icon="ph:check-bold" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="step-label">{{ step }}</span>
          <div v-if="index < steps.length - 1" class="step-line" :class="{ 'step-line--done': currentStep > index }"></div>
        </div>
      </div>

      <!-- Step 1: Personal Info -->
      <div v-if="currentStep === 0" class="form-section">
        <div class="form-header">
          <Icon icon="ph:user-circle" />
          <div>
            <h3>Personal Information</h3>
            <p>Enter the customer's full name and contact details</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">First Name <span class="required">*</span></label>
            <input v-model="form.firstName" type="text" class="form-input" placeholder="e.g. Jean Pierre" />
          </div>
          <div class="form-group">
            <label class="form-label">Last Name <span class="required">*</span></label>
            <input v-model="form.lastName" type="text" class="form-input" placeholder="e.g. Uwimana" />
          </div>
          <div class="form-group form-group--full">
            <label class="form-label">Phone Number <span class="required">*</span></label>
            <div class="phone-input-wrapper">
              <span class="phone-prefix">+250</span>
              <input v-model="form.phone" type="tel" class="form-input form-input--phone" placeholder="788 123 456" maxlength="12" />
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Location -->
      <div v-if="currentStep === 1" class="form-section">
        <div class="form-header">
          <Icon icon="ph:map-pin" />
          <div>
            <h3>Location Details</h3>
            <p>Provide exact location info so anyone can find this home</p>
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">District <span class="required">*</span></label>
            <select v-model="form.district" class="form-select" @change="onDistrictChange">
              <option value="">Select District</option>
              <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Sector <span class="required">*</span></label>
            <select v-model="form.sector" class="form-select" @change="onSectorChange" :disabled="!form.district">
              <option value="">Select Sector</option>
              <option v-for="s in availableSectors" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Cell <span class="required">*</span></label>
            <select v-model="form.cell" class="form-select" @change="onCellChange" :disabled="!form.sector">
              <option value="">Select Cell</option>
              <option v-for="c in availableCells" :key="c" :value="c">{{ c }}</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Village <span class="required">*</span></label>
            <select v-model="form.village" class="form-select" :disabled="!form.cell">
              <option value="">Select Village</option>
              <option v-for="v in availableVillages" :key="v" :value="v">{{ v }}</option>
            </select>
          </div>
          <div class="form-group form-group--full">
            <label class="form-label">House Number <span class="required">*</span></label>
            <input v-model="form.houseNumber" type="text" class="form-input" placeholder="e.g. KG-234 or KK-089" />
          </div>
        </div>
      </div>

      <!-- Step 3: Category -->
      <div v-if="currentStep === 2" class="form-section">
        <div class="form-header">
          <Icon icon="ph:scales" />
          <div>
            <h3>Ubudehe Category</h3>
            <p>Select the customer's social category (Ikiciro cy'Ubudehe)</p>
          </div>
        </div>
        <div class="category-cards">
          <div
            v-for="cat in categories"
            :key="cat.value"
            class="cat-card"
            :class="{ 'cat-card--selected': form.category === cat.value, [`cat-card--${cat.value}`]: true }"
            @click="form.category = cat.value"
          >
            <div class="cat-card-radio">
              <div class="radio-dot" v-if="form.category === cat.value"></div>
            </div>
            <div class="cat-card-content">
              <div class="cat-card-title">{{ cat.label }}</div>
              <div class="cat-card-subtitle">{{ cat.sublabel }}</div>
            </div>
            <div class="cat-card-amount">
              <span v-if="cat.amount">{{ cat.amount.toLocaleString() }} <small>RWF/week</small></span>
              <span v-else class="cat-card-tbd">TBD</span>
            </div>
          </div>
        </div>
        <div class="info-box">
          <Icon icon="ph:info" />
          <span>This classification is mandatory by law. Waste collection is not optional — every household must participate.</span>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div v-if="currentStep === 3" class="form-section">
        <div class="form-header">
          <Icon icon="ph:clipboard-text" />
          <div>
            <h3>Review & Submit</h3>
            <p>Verify all information before registering this customer</p>
          </div>
        </div>
        <div class="review-card">
          <div class="review-section">
            <h4>Personal Information</h4>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Full Name</span>
                <span class="review-value">{{ form.firstName }} {{ form.lastName }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Phone</span>
                <span class="review-value">+250 {{ form.phone }}</span>
              </div>
            </div>
          </div>
          <div class="review-section">
            <h4>Location</h4>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">District</span>
                <span class="review-value">{{ form.district }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Sector</span>
                <span class="review-value">{{ form.sector }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Cell</span>
                <span class="review-value">{{ form.cell }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Village</span>
                <span class="review-value">{{ form.village }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">House Number</span>
                <span class="review-value">{{ form.houseNumber }}</span>
              </div>
            </div>
          </div>
          <div class="review-section">
            <h4>Category & Payment</h4>
            <div class="review-grid">
              <div class="review-item">
                <span class="review-label">Ubudehe Category</span>
                <span class="review-value">{{ getCategoryLabel(form.category) }}</span>
              </div>
              <div class="review-item">
                <span class="review-label">Weekly Payment</span>
                <span class="review-value review-value--highlight">{{ getAmount(form.category) }} RWF</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success State -->
      <div v-if="showSuccess" class="success-state">
        <div class="success-icon">
          <Icon icon="ph:check-circle-fill" />
        </div>
        <h3>Customer Registered Successfully!</h3>
        <p>{{ form.firstName }} {{ form.lastName }} has been added to your customer list.</p>
        <div class="success-actions">
          <button class="btn btn--secondary" @click="registerAnother">Register Another</button>
          <button class="btn btn--primary" @click="$router.push('/houses')">View Houses</button>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div v-if="!showSuccess" class="form-nav">
        <button v-if="currentStep > 0" class="btn btn--secondary" @click="currentStep--">
          <Icon icon="ph:arrow-left" /> Back
        </button>
        <div class="form-nav-spacer"></div>
        <button v-if="currentStep < 3" class="btn btn--primary" @click="nextStep" :disabled="!canProceed">
          Next <Icon icon="ph:arrow-right" />
        </button>
        <button v-if="currentStep === 3" class="btn btn--success" @click="submitForm">
          <Icon icon="ph:check" /> Register Customer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

const steps = ['Personal Info', 'Location', 'Category', 'Review']
const currentStep = ref(0)
const showSuccess = ref(false)

const form = ref({
  firstName: '',
  lastName: '',
  phone: '',
  district: '',
  sector: '',
  cell: '',
  village: '',
  houseNumber: '',
  category: ''
})

// Demo data for cascading dropdowns - Rwanda administrative hierarchy
// For Kigali City: District → Sector → Cell → Village
const districts = ['Gasabo', 'Kicukiro', 'Nyarugenge']

const sectorMap: Record<string, string[]> = {
  'Gasabo': ['Gacuriro', 'Jali', 'Kacyiru', 'Kimihurura', 'Kinyinya', 'Remera'],
  'Kicukiro': ['Cyombo', 'Gatenga', 'Kagarama', 'Kanombe', 'Kicukiro', 'Kigarama', 'Niboye'],
  'Nyarugenge': ['Biryogo', 'Gitega', 'Kanyosha', 'Kigali', 'Magalibin', 'Mageragere', 'Muhima', 'Nyamirambo', 'Rwezamenyo']
}

const cellMap: Record<string, string[]> = {
  // Gasabo sectors
  'Gacuriro': ['Gacuriro', 'Rugando'],
  'Jali': ['Jali', 'Kabeho'],
  'Kacyiru': ['Kamatamu', 'Kacyiru II', 'Kacyiru I'],
  'Kimihurura': ['Kibagabaga', 'Kimihurura', 'Nyarutarama'],
  'Kinyinya': ['Gisozi', 'Kinyinya', 'Ndera'],
  'Remera': ['Nyabugogo', 'Remera', 'Gishushu'],
  // Kicukiro sectors
  'Cyombo': ['Cyombo', 'Rwandex'],
  'Gatenga': ['Gatenga', 'Karembure', 'Nyanza'],
  'Kagarama': ['Kagarama', 'Muyange'],
  'Kanombe': ['Busanza', 'Kanombe'],
  'Kicukiro': ['Kimironko', 'Kicukiro'],
  'Kigarama': ['Kigarama', 'Gituro'],
  'Niboye': ['Munanira', 'Niboye'],
  // Nyarugenge sectors
  'Biryogo': ['Biryogo I', 'Biryogo II', 'Kiyovu', 'Nyamirambo'],
  'Gitega': ['Gitega', 'Gitwa'],
  'Kanyosha': ['Kanyosha', 'Kamatamu'],
  'Kigali': ['CBD', 'Muhima', 'Rugenge'],
  'Magalibin': ['Magalibin', 'Kamatamu'],
  'Mageragere': ['Akabahizi', 'Mageragere'],
  'Muhima': ['Kigobe', 'Muhima'],
  'Nyamirambo': ['Nyamirambo', 'Cibwenge'],
  'Rwezamenyo': ['Imena', 'Kabeza', 'Rwezamenyo']
}

const villageMap: Record<string, string[]> = {
  // Gasabo - Gacuriro
  'Gacuriro': ['Gacuriro', 'Kigali Heights', 'Rugandabanga'],
  'Rugando': ['Kicukiro South', 'Rugando', 'Nyarutarama'],
  // Gasabo - Jali
  'Jali': ['Jali Center', 'Jali North'],
  'Kabeho': ['Kabeho', 'Minihiza'],
  // Gasabo - Kacyiru
  'Kamatamu': ['Kamatamu', 'Kacyiru III'],
  'Kacyiru II': ['Kacyiru II East', 'Kacyiru II West'],
  'Kacyiru I': ['Kacyiru I North', 'Kacyiru I South'],
  // Gasabo - Kimihurura
  'Kibagabaga': ['Kibagabaga North', 'Kibagabaga South'],
  'Kimihurura': ['Kimihurura East', 'Kimihurura West'],
  'Nyarutarama': ['Nyarutarama', 'Urugwiro'],
  // Gasabo - Kinyinya
  'Gisozi': ['Gisozi East', 'Gisozi West', 'Musezero'],
  'Kinyinya': ['Kinyinya Center', 'Kinyinya North'],
  'Ndera': ['Ndera', 'Rwamagana'],
  // Gasabo - Remera
  'Nyabugogo': ['Nyabugogo', 'Remera South'],
  'Remera': ['Remera Center', 'Remera East'],
  'Gishushu': ['Gishushu', 'Kimweri'],
  // Kicukiro sectors...
  'Cyombo': ['Cyombo Center', 'Cyombo East'],
  'Rwandex': ['Rwandex', 'Cyombo Industrial'],
  'Gatenga': ['Gatenga Center', 'Gatenga North'],
  'Karembure': ['Karembure', 'Nyamagabe'],
  'Nyanza': ['Nyanza', 'Nyanza North'],
  'Kagarama': ['Kagarama Center', 'Kagarama East'],
  'Muyange': ['Muyange', 'Muyange North'],
  'Kanombe': ['Busanza', 'Kanombe Center'],
  'Busanza': ['Busanza East', 'Busanza West'],
  'Kimironko': ['Kimironko', 'Goma'],
  'Kicukiro': ['Kicukiro Central', 'Kicukiro South'],
  'Kigarama': ['Kigarama North', 'Kigarama South'],
  'Gituro': ['Gituro', 'Kamatamu'],
  'Munanira': ['Munanira East', 'Munanira West'],
  'Niboye': ['Niboye Center', 'Niboye South'],
  // Nyarugenge sectors...
  'Biryogo I': ['Biryogo I North', 'Biryogo I South'],
  'Biryogo II': ['Biryogo II East', 'Biryogo II West'],
  'Kiyovu': ['Kiyovu North', 'Kiyovu South', 'Kiyovu Center'],
  'Nyamirambo': ['Nyamirambo Center', 'Nyamirambo East'],
  'Gitega': ['Gitega Center', 'Gitega East'],
  'Gitwa': ['Gitwa', 'Gitwa East'],
  'Kanyosha': ['Kanyosha Center', 'Kanyosha North'],
  'CBD': ['Downtown', 'Parliament'],
  'Muhima': ['Muhima Center', 'Muhima East'],
  'Rugenge': ['Rugenge', 'Kigali Central'],
  'Magalibin': ['Magalibin Center', 'Magalibin East'],
  'Akabahizi': ['Akabahizi', 'Mageragere North'],
  'Mageragere': ['Mageragere Center', 'Mageragere South'],
  'Kigobe': ['Kigobe', 'Muhima South'],
  'Cibwenge': ['Cibwenge', 'Nyamirambo West'],
  'Imena': ['Imena', 'Rwezamenyo North'],
  'Kabeza': ['Kabeza', 'Kabeza North'],
  'Rwezamenyo': ['Rwezamenyo Center', 'Rwezamenyo East']
}

const availableSectors = computed(() => sectorMap[form.value.district] || [])
const availableCells = computed(() => cellMap[form.value.sector] || [])
const availableVillages = computed(() => villageMap[form.value.cell] || [])

const onDistrictChange = () => {
  form.value.sector = ''
  form.value.cell = ''
  form.value.village = ''
}

const onSectorChange = () => {
  form.value.cell = ''
  form.value.village = ''
}

const onCellChange = () => {
  form.value.village = ''
}

const categories = [
  { value: 'rich', label: 'Abakire', sublabel: 'Rich — Category 1', amount: 5700 },
  { value: 'medium', label: 'Icyiciro cya 2', sublabel: 'Medium — Category 2', amount: 3800 },
  { value: 'poor', label: 'Abakene', sublabel: 'Poor — Category 3', amount: 2000 },
  { value: 'business', label: 'Business Organization', sublabel: 'Companies & Organizations', amount: 0 },
]

const getCategoryLabel = (cat: string) => {
  return categories.find(c => c.value === cat)?.label || ''
}

const getAmount = (cat: string) => {
  const amount = categories.find(c => c.value === cat)?.amount || 0
  return amount ? amount.toLocaleString() : 'TBD'
}

const canProceed = computed(() => {
  if (currentStep.value === 0) return form.value.firstName && form.value.lastName && form.value.phone
  if (currentStep.value === 1) return form.value.district && form.value.sector && form.value.cell && form.value.village && form.value.houseNumber
  if (currentStep.value === 2) return form.value.category
  return true
})

const nextStep = () => {
  if (canProceed.value && currentStep.value < 3) currentStep.value++
}

const submitForm = () => {
  showSuccess.value = true
}

const registerAnother = () => {
  form.value = { firstName: '', lastName: '', phone: '', district: '', sector: '', cell: '', village: '', houseNumber: '', category: '' }
  currentStep.value = 0
  showSuccess.value = false
}
</script>

<style scoped>
.register-page { max-width: 720px; margin: 0 auto; }

.register-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Steps Bar */
.steps-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: 24px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.step {
  display: flex;
  align-items: center;
  gap: 8px;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  background: #f1f5f9;
  color: #94a3b8;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-circle svg { width: 16px; height: 16px; }

.step--active .step-circle {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.step--done .step-circle {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.step-label {
  font-size: 13px;
  font-weight: 600;
  color: #94a3b8;
  white-space: nowrap;
}

.step--active .step-label { color: #1e293b; }
.step--done .step-label { color: #1e3a8a; }

.step-line {
  width: 48px;
  height: 2px;
  background: #e2e8f0;
  margin: 0 8px;
  border-radius: 2px;
  transition: background 0.3s;
}

.step-line--done { background: #3b82f6; }

/* Form Section */
.form-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  border: 1px solid #e5e7eb;
}

.form-header {
  display: flex;
  gap: 14px;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.form-header > svg {
  width: 28px;
  height: 28px;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 2px;
}

.form-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px;
}

.form-header p {
  font-size: 14px;
  color: #94a3b8;
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-group--full { grid-column: span 2; }

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px;
}

.required { color: #ef4444; }

.form-input,
.form-select {
  width: 100%;
  height: 46px;
  padding: 0 14px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  color: #1e293b;
  background: white;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-select:disabled {
  background: #f8fafc;
  color: #94a3b8;
  cursor: not-allowed;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;
}

.phone-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.phone-prefix {
  padding: 0 14px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  background: #f8fafc;
  height: 46px;
  display: flex;
  align-items: center;
  border-right: 1px solid #e2e8f0;
}

.form-input--phone {
  border: none;
  border-radius: 0;
}

.form-input--phone:focus {
  box-shadow: none;
}

/* Category Cards */
.category-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cat-card:hover { border-color: #cbd5e1; background: #fafbfc; }

.cat-card--selected.cat-card--rich { border-color: #7c3aed; background: #faf5ff; }
.cat-card--selected.cat-card--medium { border-color: #3b82f6; background: #eff6ff; }
.cat-card--selected.cat-card--poor { border-color: #3b82f6; background: #f0f9ff; }
.cat-card--selected.cat-card--business { border-color: #f59e0b; background: #fffbeb; }

.cat-card-radio {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.cat-card--selected .cat-card-radio { border-color: #3b82f6; }

.radio-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
}

.cat-card--selected.cat-card--rich .radio-dot { background: #7c3aed; }
.cat-card--selected.cat-card--poor .radio-dot { background: #3b82f6; }
.cat-card--selected.cat-card--business .radio-dot { background: #f59e0b; }

.cat-card-content { flex: 1; }

.cat-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.cat-card-subtitle {
  font-size: 12px;
  color: #94a3b8;
}

.cat-card-amount {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.cat-card-amount small {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 500;
}

.cat-card-tbd {
  color: #d97706;
  font-size: 14px;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 18px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  margin-top: 20px;
  font-size: 13px;
  color: #1e40af;
  line-height: 1.5;
}

.info-box svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Review Card */
.review-card {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.review-section {
  padding: 18px 0;
  border-bottom: 1px solid #f1f5f9;
}

.review-section:last-child { border-bottom: none; }

.review-section h4 {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 12px;
}

.review-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.review-item {
  padding: 10px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.review-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
}

.review-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.review-value--highlight {
  color: #1e3a8a;
  font-size: 16px;
}

/* Success State */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.success-icon {
  color: #3b82f6;
  margin-bottom: 20px;
}

.success-icon svg { width: 64px; height: 64px; }

.success-state h3 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 8px;
}

.success-state p {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 28px;
}

.success-actions {
  display: flex;
  gap: 10px;
}

/* Buttons */
.form-nav {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-nav-spacer { flex: 1; }

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn svg { width: 16px; height: 16px; }

.btn--primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);
}

.btn--primary:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  transform: translateY(-1px);
}

.btn--secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn--secondary:hover { background: #e2e8f0; }

.btn--success {
  background: linear-gradient(135deg, #3b82f6, #1e3a8a);
  color: white;
  box-shadow: 0 4px 14px rgba(34, 197, 94, 0.3);
}

.btn--success:hover {
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
  transform: translateY(-1px);
}

/* Responsive */
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .form-group--full { grid-column: span 1; }
  .review-grid { grid-template-columns: 1fr; }
  .steps-bar { flex-wrap: wrap; gap: 8px; justify-content: flex-start; }
  .step-line { width: 24px; }
  .step-label { display: none; }
}
</style>

