<template>
  <div class="login-page">
    <!-- Background Effects -->
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="login-container">
      <!-- Brand Section -->
      <div class="login-brand">
        <div class="brand-icon">
          <Icon icon="ph:recycle" />
        </div>
        <div class="brand-text">
          <span class="brand-name">AGRUNI</span>
          <span class="brand-tagline">Keeping Rwanda Clean & Green</span>
        </div>
      </div>

      <!-- Login Card -->
      <div class="login-card">
        <!-- Step 1: Phone Number -->
        <Transition name="slide-fade" mode="out-in">
          <div v-if="step === 'phone'" key="phone" class="form-step">
            <div class="form-header">
              <div class="form-icon">
                <Icon icon="ph:device-mobile" />
              </div>
              <h2>Welcome Back</h2>
              <p>Enter your registered phone number to receive a verification code.</p>
            </div>

            <div class="form-body">
              <div class="input-group">
                <label class="input-label">Phone Number</label>
                <div class="phone-input-wrapper" :class="{ 'error': phoneError }">
                  <div class="phone-prefix">
                    <Icon icon="twemoji:flag-rwanda" />
                    <span>+250</span>
                  </div>
                  <input
                    ref="phoneInputRef"
                    v-model="phoneNumber"
                    type="tel"
                    placeholder="78X XXX XXX"
                    class="phone-input"
                    maxlength="9"
                    @input="handlePhoneInput"
                    @keydown.enter="sendOTP"
                    :disabled="isSending"
                  />
                </div>
                <p v-if="phoneError" class="error-text">
                  <Icon icon="ph:warning-circle" />
                  {{ phoneError }}
                </p>
              </div>

              <button
                class="primary-btn"
                @click="sendOTP"
                :disabled="!isPhoneValid || isSending"
              >
                <span v-if="!isSending">
                  <Icon icon="ph:paper-plane-tilt" />
                  Send Verification Code
                </span>
                <span v-else class="btn-loading">
                  <Icon icon="ph:circle-notch" class="spin" />
                  Sending...
                </span>
              </button>
            </div>

            <p class="form-footer">
              By continuing, you agree to Agruni's
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </p>
          </div>

          <!-- Step 2: OTP Verification -->
          <div v-else key="otp" class="form-step">
            <div class="form-header">
              <div class="form-icon success">
                <Icon icon="ph:chat-circle-dots" />
              </div>
              <h2>Verify Your Identity</h2>
              <p>
                We sent a 6-digit code to
                <strong>+250 {{ formattedPhone }}</strong>.
                Please enter it below.
              </p>
            </div>

            <div class="form-body">
              <!-- OTP Boxes -->
              <div class="otp-boxes">
                <input
                  v-for="(_, i) in otp"
                  :key="i"
                  :ref="el => setOtpRef(el, i)"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  class="otp-box"
                  :class="{ 'otp-box--filled': otp[i], 'otp-box--error': otpError }"
                  :value="otp[i]"
                  @input="handleOtpInput($event, i)"
                  @keydown="handleOtpKeydown($event, i)"
                  @paste="handleOtpPaste"
                />
              </div>

              <p v-if="otpError" class="error-text center">
                <Icon icon="ph:warning-circle" />
                {{ otpError }}
              </p>

              <p v-if="otpSuccess" class="success-text center">
                <Icon icon="ph:check-circle" />
                Code verified! Signing you in...
              </p>

              <button
                class="primary-btn"
                @click="verifyOTP"
                :disabled="!isOtpComplete || isVerifying || otpSuccess"
              >
                <span v-if="!isVerifying && !otpSuccess">
                  <Icon icon="ph:shield-check-bold" />
                  Verify & Sign In
                </span>
                <span v-else-if="otpSuccess" class="btn-loading">
                  <Icon icon="ph:check" />
                  Verified!
                </span>
                <span v-else class="btn-loading">
                  <Icon icon="ph:circle-notch" class="spin" />
                  Verifying...
                </span>
              </button>

              <!-- Resend & Back -->
              <div class="otp-actions">
                <button class="text-btn" @click="goBack">
                  <Icon icon="ph:arrow-left" />
                  Change number
                </button>
                <button
                  class="text-btn"
                  @click="resendOTP"
                  :disabled="resendCooldown > 0"
                >
                  <Icon icon="ph:arrows-clockwise" />
                  Resend {{ resendCooldown > 0 ? `(${resendCooldown}s)` : '' }}
                </button>
              </div>

              <!-- Demo hint -->
              <div class="demo-hint">
                <Icon icon="ph:info" />
                <span>Demo mode: use code <strong>123456</strong></span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuthStore } from '../stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// State
const step = ref<'phone' | 'otp'>('phone')
const phoneNumber = ref('')
const phoneError = ref('')
const isSending = ref(false)

const otp = ref(['', '', '', '', '', ''])
const otpRefs = ref<(HTMLInputElement | null)[]>([])
const otpError = ref('')
const otpSuccess = ref(false)
const isVerifying = ref(false)

const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

// The simulated OTP sent (in a real app this lives server-side only)
const sentOtp = ref('')

// Computed
const isPhoneValid = computed(() => {
  const digits = phoneNumber.value.replace(/\s/g, '')
  return /^(07[0-9])[0-9]{7}$/.test(digits) || /^[0-9]{9}$/.test(digits)
})

const formattedPhone = computed(() => {
  const d = phoneNumber.value.replace(/\s/g, '')
  return d.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
})

const isOtpComplete = computed(() => otp.value.every(d => d !== ''))

const handlePhoneInput = () => {
  phoneError.value = ''
  // Keep only numeric characters
  phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '')
}

// OTP input refs
const setOtpRef = (el: any, index: number) => {
  otpRefs.value[index] = el
}

// Send OTP
const sendOTP = async () => {
  if (!isPhoneValid.value) {
    phoneError.value = 'Please enter a valid Rwandan phone number (07X XXX XXX).'
    return
  }
  isSending.value = true
  phoneError.value = ''

  // Simulate network delay
  await new Promise(r => setTimeout(r, 1500))

  // Generate mock 6-digit OTP (in production, this is sent via SMS gateway)
  sentOtp.value = '123456' // Fixed for demo; real: Math.floor(100000 + Math.random() * 900000).toString()
  console.info(`[DEMO] OTP sent to +250${phoneNumber.value}: ${sentOtp.value}`)

  isSending.value = false
  step.value = 'otp'
  startResendCooldown()

  // Focus first OTP box
  await nextTick()
  otpRefs.value[0]?.focus()
}

// OTP Input Handlers
const handleOtpInput = (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  const val = input.value.replace(/[^0-9]/g, '').slice(0, 1)
  otp.value[index] = val
  otpError.value = ''

  if (val && index < 5) {
    otpRefs.value[index + 1]?.focus()
  }

  // Auto-verify when complete
  if (otp.value.every(d => d !== '')) {
    verifyOTP()
  }
}

const handleOtpKeydown = (event: KeyboardEvent, index: number) => {
  if (event.key === 'Backspace' && !otp.value[index] && index > 0) {
    otp.value[index - 1] = ''
    otpRefs.value[index - 1]?.focus()
  }
}

const handleOtpPaste = (event: ClipboardEvent) => {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text').replace(/[^0-9]/g, '') || ''
  pasted.split('').slice(0, 6).forEach((char, i) => {
    otp.value[i] = char
  })
  otpRefs.value[Math.min(pasted.length, 5)]?.focus()

  if (otp.value.every(d => d !== '')) {
    verifyOTP()
  }
}

// Verify OTP
const verifyOTP = async () => {
  if (isVerifying.value || otpSuccess.value) return
  const entered = otp.value.join('')
  if (entered.length !== 6) return

  isVerifying.value = true
  otpError.value = ''

  await new Promise(r => setTimeout(r, 1200))

  if (entered === sentOtp.value) {
    otpSuccess.value = true
    // Log the user in via auth store
    authStore.loginWithPhone('+250' + phoneNumber.value)
    await new Promise(r => setTimeout(r, 800))
    router.push('/dashboard')
  } else {
    otpError.value = 'Incorrect code. Please try again.'
    otp.value = ['', '', '', '', '', '']
    otpRefs.value[0]?.focus()
    isVerifying.value = false
  }
}

// Resend OTP
const resendOTP = async () => {
  if (resendCooldown.value > 0) return
  otp.value = ['', '', '', '', '', '']
  otpError.value = ''
  await sendOTP()
  step.value = 'otp'
  startResendCooldown()
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
    }
  }, 1000)
}

const goBack = () => {
  step.value = 'phone'
  otp.value = ['', '', '', '', '', '']
  otpError.value = ''
  if (cooldownTimer) clearInterval(cooldownTimer)
  resendCooldown.value = 0
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f1d3d 0%, #162a5c 50%, #1a3570 100%);
  position: relative;
  overflow: hidden;
  padding: 24px;
}

/* Background blobs */
.bg-blobs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.2;
  animation: float 8s ease-in-out infinite;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: #3b82f6;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #22c55e;
  bottom: -100px;
  right: -100px;
  animation-delay: 3s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: #a855f7;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: 5s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -20px); }
  50% { transform: translate(-10px, 15px); }
  75% { transform: translate(15px, 5px); }
}

/* Container */
.login-container {
  width: 100%;
  max-width: 440px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Brand */
.login-brand {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-icon {
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 28px;
  font-weight: 800;
  color: white;
  letter-spacing: -0.04em;
  line-height: 1;
}

.brand-tagline {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 400;
  margin-top: 4px;
}

/* Login Card */
.login-card {
  width: 100%;
  background: rgba(255, 255, 255, 0.97);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255,255,255,0.1);
  overflow: hidden;
}

/* Form Header */
.form-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #3b82f6;
  margin-bottom: 20px;
}

.form-icon.success {
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  color: #22c55e;
}

.form-header h2 {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.form-header p {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 28px 0;
}

.form-header strong {
  color: #1e293b;
  font-weight: 700;
}

/* Phone Input */
.input-group {
  margin-bottom: 24px;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.phone-input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  overflow: hidden;
  background: white;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.phone-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.phone-input-wrapper.error {
  border-color: #ef4444;
}

.phone-prefix {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: #f8fafc;
  border-right: 2px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  white-space: nowrap;
  height: 52px;
}

.phone-input {
  flex: 1;
  border: none;
  padding: 0 16px;
  font-size: 18px;
  font-weight: 500;
  color: #0f172a;
  letter-spacing: 0.05em;
  background: transparent;
  outline: none;
  height: 52px;
}

.phone-input::placeholder {
  color: #cbd5e1;
  font-weight: 400;
}

.phone-input:disabled {
  opacity: 0.6;
}

/* Errors & Success */
.error-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
}

.error-text.center, .success-text.center {
  justify-content: center;
}

.success-text {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #22c55e;
  font-size: 13px;
  margin-top: 8px;
}

/* Primary Button */
.primary-btn {
  width: 100%;
  height: 52px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.5);
}

.primary-btn:active:not(:disabled) {
  transform: translateY(0);
}

.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* OTP Boxes */
.otp-boxes {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.otp-box {
  width: 52px;
  height: 60px;
  border: 2px solid #e5e7eb;
  border-radius: 14px;
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  background: white;
  outline: none;
  transition: all 0.2s ease;
}

.otp-box:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

.otp-box--filled {
  border-color: #3b82f6;
  background: #eff6ff;
}

.otp-box--error {
  border-color: #ef4444 !important;
  background: #fef2f2;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-5px); }
  40%, 80% { transform: translateX(5px); }
}

/* OTP Actions */
.otp-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.text-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  transition: opacity 0.2s ease;
}

.text-btn:hover:not(:disabled) {
  opacity: 0.75;
}

.text-btn:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

/* Demo Hint */
.demo-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fefce8;
  border: 1px solid #fde047;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 13px;
  color: #92400e;
  margin-top: 20px;
}

.demo-hint strong {
  font-family: monospace;
  color: #1e293b;
}

/* Footer */
.form-footer {
  text-align: center;
  font-size: 12px;
  color: #94a3b8;
  margin-top: 20px;
  line-height: 1.5;
}

.form-footer a {
  color: #3b82f6;
  text-decoration: none;
}

/* Spinner */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Transitions */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

@media (max-width: 480px) {
  .login-card {
    padding: 28px 24px;
    border-radius: 20px;
  }

  .otp-box {
    width: 44px;
    height: 52px;
    font-size: 20px;
  }
}
</style>
