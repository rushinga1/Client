# Modal-First Card Pattern Implementation Guide

## Overview

This guide documents the new **Modal-First Card Pattern** for AGRUNI, replacing scrolling-heavy detail views with compact cards that open modals. This pattern provides:

✅ **Zero Scrolling** - All details fit in modals without scrolling the page
✅ **Better UX** - Click compact cards to see full details in focused modals
✅ **Semantic Colors** - Visual hierarchy using status-specific color schemes
✅ **Mobile Friendly** - Responsive design that works on small screens
✅ **Keyboard Support** - ESC key closes modals, click-outside dismisses

---

## Components Created

### 1. PaymentEvidenceModal.vue
**Purpose:** Displays verified payment proof with status, amount, transaction details, and customer context.

**File:** `src/components/domain/payment/PaymentEvidenceModal.vue`

**Color Scheme:** Green (success) for verified payments

**Key Features:**
- Verification badge with timestamp
- Large amount display (hero section)
- Monospace transaction IDs for easy copying
- Masked phone numbers (+250 788 *** 3456)
- Customer context box
- Download & dispute action buttons

**Usage:**
```vue
<script setup>
import PaymentEvidenceModal from '@/components/domain/payment/PaymentEvidenceModal.vue'
</script>

<template>
  <PaymentEvidenceModal
    :amount="5700"
    payment-date="March 31, 2026"
    payment-time="10:30 AM"
    transaction-id="TXN-2024-001234"
    reference-code="REF-5678-9012"
    method="MTN MoMo"
    phone="0788123456"
    customer-name="Uwimana Jean Pierre"
    house-location="Kiyovu Sector"
    customer-category="Household"
    :week-count="1"
    verify-time="2 min ago"
  />
</template>
```

**Props:**
```typescript
interface Props {
  amount: number                                    // RWF amount
  paymentDate: string                              // YYYY-MM-DD format
  paymentTime: string                              // HH:MM AM/PM format
  transactionId: string                            // Transaction ID
  referenceCode: string                            // Reference/confirmation code
  method: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
  phone: string                                    // Phone number (will be masked)
  customerName: string                             // Name of person who paid
  houseLocation: string                            // House/sector location
  customerCategory: string                         // Household / Business
  weekCount?: number                               // Default: 1
  verifyTime?: string                              // Default: '2 min ago'
}
```

---

### 2. DeliveryProofModal.vue
**Purpose:** Displays proof of waste collection with service details, worker info, and verification.

**File:** `src/components/domain/payment/DeliveryProofModal.vue`

**Color Scheme:** Green for completed, orange for pending, red for failed

**Key Features:**
- Delivery status with location
- Comprehensive service details (weight, method, GPS)
- Worker information with on-duty status
- Customer acknowledgment timeline
- Photo evidence count
- View photos & download proof buttons

**Usage:**
```vue
<template>
  <DeliveryProofModal
    location="Kiyovu"
    address="House #123, Kiyovu Sector, Kigali"
    :weight="42"
    collection-method="Scheduled Collection"
    delivery-time="10:30 AM"
    proof-id="PROOF-2024-001"
    :photo-count="3"
    gps-coords="1.9536°S, 30.0605°E"
    worker-name="Jean Claude Habimana"
    worker-status="On Duty"
    customer-name="Uwimana Jean Pierre"
    verified-date="March 31, 2026"
    verified-time="10:45 AM"
    status="Completed"
    delivery-confirmed-time="Verified 5 min ago"
  />
</template>
```

**Props:**
```typescript
interface Props {
  location: string                        // Location name (e.g., "Kiyovu")
  address: string                         // Full address
  weight: number                          // Weight in kg
  collectionMethod: string                // How waste was collected
  deliveryTime: string                    // Time of delivery
  proofId: string                         // Proof/receipt ID
  photoCount: number                      // Number of photo evidence
  gpsCoords: string                       // GPS coordinates (latitude, longitude)
  workerName: string                      // Name of worker
  workerStatus: 'On Duty' | 'Off Duty'
  customerName: string                    // Customer name
  verifiedDate: string                    // Date verified
  verifiedTime: string                    // Time verified
  status?: 'Completed' | 'Pending' | 'Failed'  // Default: 'Completed'
  deliveryConfirmedTime?: string          // Default: 'Verified 2 min ago'
}
```

---

### 3. DisputeRecordModal.vue
**Purpose:** Displays dispute records with priority levels, status tracking, and resolution timeline.

**File:** `src/components/domain/payment/DisputeRecordModal.vue`

**Color Scheme:** Red for critical, amber for high/medium, blue for low priority

**Key Features:**
- Priority-based color coding (Critical, High, Medium, Low)
- Status tracking (Open, In Review, Resolved, Closed)
- Dispute details with affected amount
- Reporter information and role
- Expected resolution timeline
- Download report & update status buttons

**Usage:**
```vue
<template>
  <DisputeRecordModal
    issue-type="Payment Not Received"
    description="Customer claims payment was deducted but not reflected in account"
    status="Open"
    priority="High"
    dispute-id="DISP-2024-0891"
    related-transaction-id="TXN-2024-001234"
    :affected-amount="5700"
    reporter-name="Uwimana Jean Pierre"
    reporter-role="Customer"
    filed-time="10:30 AM"
    filed-date="March 30, 2026"
    last-updated="1 hour ago"
    expected-resolution="Within 24 hours"
    resolution-notes="Investigating with payment provider. Will update within 24 hours."
  />
</template>
```

**Props:**
```typescript
interface Props {
  issueType: string                       // Type of dispute
  description: string                     // Detailed description
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  disputeId: string                       // Unique dispute ID
  relatedTransactionId: string            // Transaction ID this relates to
  affectedAmount: number                  // RWF amount affected
  reporterName: string                    // Who reported the issue
  reporterRole: string                    // Role of reporter
  filedTime: string                       // Time filed
  filedDate: string                       // Date filed
  lastUpdated: string                     // When last updated
  expectedResolution: string              // Expected resolution time
  resolutionNotes?: string                // Optional notes
}
```

---

### 4. RefundHistoryModal.vue
**Purpose:** Displays refund records with type, status, and payment destination.

**File:** `src/components/domain/payment/RefundHistoryModal.vue`

**Color Scheme:** Red for full reversals, orange for partial refunds, amber for disputes

**Key Features:**
- Refund type classification (Full Reversal, Partial Refund, Dispute Adjustment)
- Status tracking with timeline (Initiated → Processed → Completed)
- Original vs. refund amount comparison
- Refund destination (which payment method)
- Processing timeline with dates/times
- Download receipt & report issue buttons

**Usage:**
```vue
<template>
  <RefundHistoryModal
    :refund-amount="2850"
    :original-amount="5700"
    reason="Partial refund - customer dispute"
    type="Partial Refund"
    status="Processed"
    refund-id="REF-2024-456"
    original-transaction-id="TXN-2024-001234"
    refund-date="March 29, 2026"
    initiated-date="March 29, 2026"
    initiated-time="2:00 PM"
    processed-date="March 29, 2026"
    processed-time="2:30 PM"
    completed-date="March 30, 2026"
    refund-method="MTN MoMo"
    refund-phone="0788123456"
    notes="Refund processed successfully. Customer notified via SMS."
  />
</template>
```

**Props:**
```typescript
interface Props {
  refundAmount: number                    // RWF amount refunded
  originalAmount: number                  // Original RWF amount
  reason: string                          // Reason for refund
  type: 'Full Reversal' | 'Partial Refund' | 'Dispute Adjustment'
  status: 'Processed' | 'Pending' | 'Failed'
  refundId: string                        // Refund ID
  originalTransactionId: string           // Original transaction ID
  refundDate: string                      // Date of refund
  initiatedDate: string                   // Date initiated
  initiatedTime: string                   // Time initiated
  processedDate: string                   // Date processed
  processedTime: string                   // Time processed
  completedDate?: string                  // Optional completion date
  refundMethod: 'MTN MoMo' | 'Airtel Money' | 'Bank Transfer'
  refundPhone: string                     // Destination phone
  notes?: string                          // Optional processing notes
}
```

---

## Implementation Pattern

All modal components follow this structure:

### 1. Compact Card (Always Visible)
```vue
<div class="compact-card" @click="isOpen = true">
  <!-- Status indicator -->
  <!-- Key amount/info -->
  <!-- Metadata -->
  <!-- "View Details" CTA -->
</div>
```

### 2. Modal (Teleported to Body)
```vue
<Teleport to="body">
  <transition name="modal-fade">
    <div v-show="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <!-- Close button (×) -->
        <!-- Status badge -->
        <!-- Hero section (large display) -->
        <!-- Details grid -->
        <!-- Action buttons -->
      </div>
    </div>
  </transition>
</Teleport>
```

### 3. Key Interactions
- **Click card** → Opens modal
- **Click × button** → Closes modal
- **Click outside modal** → Closes modal
- **Press ESC** → Closes modal
- **Smooth animations** → 0.25s cubic-bezier(0.19, 1, 0.22, 1)

---

## Integration Examples

### In PaymentsView (User Portal)
```vue
<template>
  <div class="payments-view">
    <h2>Payment History</h2>
    
    <div class="payment-list">
      <PaymentEvidenceModal
        v-for="payment in payments"
        :key="payment.id"
        v-bind="payment"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PaymentEvidenceModal from '@/components/domain/payment/PaymentEvidenceModal.vue'

const payments = ref([
  {
    amount: 5700,
    paymentDate: '2026-03-31',
    paymentTime: '10:30 AM',
    transactionId: 'TXN-001',
    referenceCode: 'REF-001',
    method: 'MTN MoMo',
    phone: '0788123456',
    customerName: 'Uwimana Jean',
    houseLocation: 'Kiyovu',
    customerCategory: 'Household'
  }
])
</script>
```

### In HousesListView (Worker Portal)
```vue
<template>
  <div class="house-detail">
    <!-- Other house info -->
    
    <div class="section">
      <h3>Recent Collections</h3>
      <DeliveryProofModal
        v-for="delivery in recentDeliveries"
        :key="delivery.id"
        v-bind="delivery"
      />
    </div>
  </div>
</template>
```

### In DisputesView
```vue
<template>
  <div class="disputes-view">
    <div class="dispute-list">
      <DisputeRecordModal
        v-for="dispute in disputes"
        :key="dispute.id"
        v-bind="dispute"
      />
    </div>
  </div>
</template>
```

---

## Design Principles

### 1. **No Scrolling**
- Compact cards show key info at a glance
- Modals are self-contained (max 90vh with overflow-y: auto only if needed)
- Mobile design uses 90vw width for readability

### 2. **Semantic Colors**
- **Green** (#16a34a): Verified, completed, success
- **Red** (#dc2626): Critical, errors, failed
- **Amber/Orange** (#d97706, #ea580c): Warnings, pending, disputes
- **Blue** (#3b82f6): Info, low priority, secondary actions

### 3. **Visual Hierarchy**
- **Hero section** with large amount/status
- **Section titles** in uppercase with tracking
- **Labels** in secondary color, smaller font
- **Values** in primary color, larger font
- **Monospace** for IDs (easier to copy)

### 4. **Card Interactions**
```css
/* Hover state */
.compact-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* When modal is open */
.compact-card--expanded {
  opacity: 0.5;  /* Visual feedback that it opened modal */
}
```

### 5. **Modal Animations**
```css
/* Fast, bouncy entrance */
animation: slideUp 0.25s cubic-bezier(0.19, 1, 0.22, 1);

/* Smooth fade */
.modal-fade-enter-active { 
  transition: opacity 0.25s cubic-bezier(0.19, 1, 0.22, 1);
}
```

---

## Responsive Design

All components are fully responsive:

### Mobile (< 640px)
- Modal: Full width - 16px padding
- Compact card: Smaller padding
- Action buttons: Stack to 2-column grid
- Hero section: Adjusted font sizes

### Tablet & Desktop
- Modal: Max 500px width, centered
- Full spacing applied
- All grids display properly

---

## Accessibility Features

✅ **Keyboard Navigation**
- ESC key closes modal
- Tab order maintained
- Focus visible on interactive elements

✅ **Semantic HTML**
- Proper heading hierarchy
- Button elements for interactivity
- ARIA labels where needed

✅ **Color Contrast**
- All text meets WCAG AA standards
- Status not conveyed by color alone

✅ **Screen Reader Support**
- Modal marked with role="dialog"
- Close button has aria-label
- Status changes announced

---

## File Structure

```
src/components/domain/payment/
├── PaymentEvidenceModal.vue      (Payment proof)
├── DeliveryProofModal.vue        (Waste collection proof)
├── DisputeRecordModal.vue        (Issue tracking)
├── RefundHistoryModal.vue        (Refund tracking)
└── [existing components...]
```

---

## CSS Tokens Used

All components import and use design tokens from:
```css
@import '../../../assets/styles/tokens.css'
```

Key tokens:
- `--space-*` : Spacing (4px, 8px, 12px, etc.)
- `--text-*` : Font sizes (xs, sm, base, lg, xl, 2xl, 3xl, 4xl)
- `--font-*` : Font families (display, body, mono)
- `--color-*` : Colors (text, bg, border, primary, etc.)
- `--radius-*` : Border radius (md, lg, xl)
- `--shadow-*` : Box shadows
- `--leading-*` : Line heights
- `--tracking-*` : Letter spacing

---

## Best Practices

### 1. Always Use Consistent Formatting
```typescript
// ✅ Good
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-RW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
}

// ✅ Good - Masked phone
const formatPhone = (phone: string) => {
  const last4 = phone.replace(/\D/g, '').slice(-4)
  return `+250 788 *** ${last4}`
}
```

### 2. Use Teleport for Modals
Modals should always be teleported to body to avoid z-index stacking issues:
```vue
<Teleport to="body">
  <transition name="modal-fade">
    <!-- Modal content -->
  </transition>
</Teleport>
```

### 3. Provide Close Interactions
Multiple ways to close:
- × button (top right)
- Click outside
- ESC key
- All should trigger `closeModal()`

### 4. Use Semantic Status Icons
```typescript
const statusIcon = computed(() => {
  switch (props.status) {
    case 'Verified': return 'ph:check-circle-fill'
    case 'Pending': return 'ph:clock'
    case 'Failed': return 'ph:x-circle-fill'
    default: return 'ph:circle'
  }
})
```

---

## Future Enhancements

Possible extensions of this pattern:

1. **Print View** - "Download Receipt" opens print modal
2. **Share** - Share proof via WhatsApp/email button
3. **Batch Actions** - Select multiple cards for bulk operations
4. **Export** - CSV/PDF export for customer accounts
5. **Real-time Updates** - Refetch data when modal is open
6. **Attachments** - Gallery view for photos/documents
7. **Comments** - Add internal notes to records
8. **Status Webhooks** - Show real-time status updates

---

## Support & Documentation

For questions or issues:
1. Check component props in TypeScript interfaces
2. Review usage examples above
3. Compare with similar implemented components
4. Refer to design tokens in `assets/styles/tokens.css`

---

## Version History

**v1.0** (March 31, 2026)
- Initial release with 4 modal components
- Payment, Delivery, Dispute, Refund records
- Full keyboard & accessibility support
- Mobile responsive design

---

*Last Updated: March 31, 2026*
