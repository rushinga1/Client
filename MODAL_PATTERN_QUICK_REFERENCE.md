# Modal Pattern - Quick Reference

## 🎯 What Changed

**Before:** Detail views required scrolling through long pages of information
**After:** Compact cards + modal popups with zero page scrolling

---

## 4 New Modal Components

| Component | Purpose | Color | File |
|-----------|---------|-------|------|
| **PaymentEvidenceModal** | Verified payment proof | 🟢 Green | `PaymentEvidenceModal.vue` |
| **DeliveryProofModal** | Waste collection proof | 🟢 Green/🟡 Orange | `DeliveryProofModal.vue` |
| **DisputeRecordModal** | Issue tracking | 🔴 Red/🟡 Amber | `DisputeRecordModal.vue` |
| **RefundHistoryModal** | Refund tracking | 🔴 Red/🟡 Amber | `RefundHistoryModal.vue` |

---

## 📦 Import & Use

### Payment Evidence
```vue
<script setup>
import PaymentEvidenceModal from '@/components/domain/payment/PaymentEvidenceModal.vue'
</script>

<template>
  <PaymentEvidenceModal
    :amount="5700"
    payment-date="2026-03-31"
    payment-time="10:30 AM"
    transaction-id="TXN-001"
    reference-code="REF-001"
    method="MTN MoMo"
    phone="0788123456"
    customer-name="Uwimana Jean"
    house-location="Kiyovu"
    customer-category="Household"
  />
</template>
```

### Delivery Proof
```vue
<template>
  <DeliveryProofModal
    location="Kiyovu"
    address="House #123, Kiyovu"
    :weight="42"
    collection-method="Scheduled"
    delivery-time="10:30 AM"
    proof-id="PROOF-001"
    :photo-count="3"
    gps-coords="1.9536°S, 30.0605°E"
    worker-name="Jean Claude"
    worker-status="On Duty"
    customer-name="Uwimana Jean"
    verified-date="2026-03-31"
    verified-time="10:45 AM"
  />
</template>
```

### Dispute Record
```vue
<template>
  <DisputeRecordModal
    issue-type="Payment Not Received"
    description="Customer claims payment was deducted..."
    status="Open"
    priority="High"
    dispute-id="DISP-001"
    related-transaction-id="TXN-001"
    :affected-amount="5700"
    reporter-name="Uwimana Jean"
    reporter-role="Customer"
    filed-time="10:30 AM"
    filed-date="2026-03-30"
    last-updated="1 hour ago"
    expected-resolution="Within 24 hours"
  />
</template>
```

### Refund History
```vue
<template>
  <RefundHistoryModal
    :refund-amount="2850"
    :original-amount="5700"
    reason="Partial refund - customer dispute"
    type="Partial Refund"
    status="Processed"
    refund-id="REF-001"
    original-transaction-id="TXN-001"
    refund-date="2026-03-29"
    initiated-date="2026-03-29"
    initiated-time="2:00 PM"
    processed-date="2026-03-29"
    processed-time="2:30 PM"
    refund-method="MTN MoMo"
    refund-phone="0788123456"
  />
</template>
```

---

## 🎨 Color Reference

### PaymentEvidenceModal
- **Status Badge:** Green (#16a34a)
- **Amount:** Green (#16a34a)
- **Background:** Light green gradient

### DeliveryProofModal
- **Completed:** Green (#16a34a)
- **Pending:** Orange (#ea580c)
- **Failed:** Red (#dc2626)

### DisputeRecordModal
| Priority | Color | Hex |
|----------|-------|-----|
| Critical | 🔴 Red | #dc2626 |
| High | 🟠 Orange | #d97706 |
| Medium | 🟡 Amber | #ea580c |
| Low | 🔵 Blue | #3b82f6 |

### RefundHistoryModal
| Type | Color | Hex |
|------|-------|-----|
| Full Reversal | 🔴 Red | #dc2626 |
| Partial Refund | 🟠 Orange | #ea580c |
| Dispute Adjustment | 🟡 Amber | #d97706 |

---

## ⌨️ Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Close Modal | ESC |
| Close Modal | Click outside |
| Open Modal | Click card |
| Close Modal | Click × button |

---

## 📱 Responsive Breakpoints

- **Mobile** (< 640px): Full width - 16px margin
- **Tablet** (640px - 1024px): Max 500px, centered
- **Desktop** (> 1024px): Max 500px, centered, full spacing

---

## 🔧 Props by Component

### PaymentEvidenceModal Props
```typescript
amount: number
paymentDate: string
paymentTime: string
transactionId: string
referenceCode: string
method: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
phone: string
customerName: string
houseLocation: string
customerCategory: string
weekCount?: number (default: 1)
verifyTime?: string (default: '2 min ago')
```

### DeliveryProofModal Props
```typescript
location: string
address: string
weight: number
collectionMethod: string
deliveryTime: string
proofId: string
photoCount: number
gpsCoords: string
workerName: string
workerStatus: 'On Duty' | 'Off Duty'
customerName: string
verifiedDate: string
verifiedTime: string
status?: 'Completed' | 'Pending' | 'Failed' (default: 'Completed')
deliveryConfirmedTime?: string (default: 'Verified 2 min ago')
```

### DisputeRecordModal Props
```typescript
issueType: string
description: string
status: 'Open' | 'In Review' | 'Resolved' | 'Closed'
priority: 'Critical' | 'High' | 'Medium' | 'Low'
disputeId: string
relatedTransactionId: string
affectedAmount: number
reporterName: string
reporterRole: string
filedTime: string
filedDate: string
lastUpdated: string
expectedResolution: string
resolutionNotes?: string
```

### RefundHistoryModal Props
```typescript
refundAmount: number
originalAmount: number
reason: string
type: 'Full Reversal' | 'Partial Refund' | 'Dispute Adjustment'
status: 'Processed' | 'Pending' | 'Failed'
refundId: string
originalTransactionId: string
refundDate: string
initiatedDate: string
initiatedTime: string
processedDate: string
processedTime: string
completedDate?: string
refundMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
refundPhone: string
notes?: string
```

---

## 🎬 What Happens When You Click

1. **User clicks compact card**
   - Card fades to 50% opacity
   - Modal slides up with fade animation
   - Focus moves to modal

2. **User views details in modal**
   - Can scroll if content is > 90vh
   - All key info visible without scrolling main page
   - Action buttons (Download, Dispute, etc.) available

3. **User closes modal**
   - Click × button, click outside, or press ESC
   - Modal fades out (0.25s)
   - Card returns to full opacity

---

## 📋 Modal Sections

Every modal includes:

| Section | Contains |
|---------|----------|
| **Status Badge** | Status + verification timestamp |
| **Hero Section** | Large display (amount/location) |
| **Details Grid** | All transaction/proof details |
| **Context Box** | Customer/worker info |
| **Timeline** (Refunds only) | Process timeline |
| **Action Buttons** | Download, View, Dispute, Report |

---

## 🚀 Integration Checklist

- [ ] Import component from `@/components/domain/payment/`
- [ ] Pass all required props
- [ ] Use v-for for lists
- [ ] Test on mobile (< 640px)
- [ ] Test keyboard (ESC key)
- [ ] Test click-outside close
- [ ] Verify colors match mockups
- [ ] Check monospace IDs are readable
- [ ] Verify phone masking works

---

## ✅ Testing Scenarios

### Desktop
- [ ] Click card opens modal
- [ ] Modal centered on screen
- [ ] Can scroll modal if needed
- [ ] Click × closes modal
- [ ] Click outside closes modal
- [ ] ESC key closes modal

### Mobile
- [ ] Card takes full width - 16px
- [ ] Modal takes 90vw width
- [ ] Action buttons stack in 2 columns
- [ ] Touch outside closes modal
- [ ] ESC key closes modal (if keyboard present)

### Accessibility
- [ ] Focus visible on buttons
- [ ] Tab order logical
- [ ] Screen reader announces modal
- [ ] Color contrast WCAG AA
- [ ] Keyboard navigation works

---

## 📚 Documentation Files

- **Full Guide:** `MODAL_PATTERN_IMPLEMENTATION_GUIDE.md`
- **This Sheet:** `MODAL_PATTERN_QUICK_REFERENCE.md`
- **Components:** `src/components/domain/payment/`

---

## 🔄 Component Loop Example

```vue
<template>
  <div class="payment-list">
    <PaymentEvidenceModal
      v-for="payment in payments"
      :key="payment.id"
      :amount="payment.amount"
      :payment-date="payment.date"
      :payment-time="payment.time"
      :transaction-id="payment.txnId"
      :reference-code="payment.refCode"
      method="MTN MoMo"
      :phone="payment.phone"
      :customer-name="payment.customerName"
      :house-location="payment.location"
      customer-category="Household"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaymentEvidenceModal from '@/components/domain/payment/PaymentEvidenceModal.vue'

const payments = ref([
  {
    id: 1,
    amount: 5700,
    date: '2026-03-31',
    time: '10:30 AM',
    txnId: 'TXN-001',
    refCode: 'REF-001',
    phone: '0788123456',
    customerName: 'Uwimana Jean',
    location: 'Kiyovu'
  }
  // ... more payments
])
</script>
```

---

**Last Updated:** March 31, 2026
**Version:** 1.0
