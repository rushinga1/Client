# Receipt-Style Proof & Evidence Card System

A modern, receipt-inspired component system for displaying financial proof, delivery confirmation, disputes, and refunds across the AGRUNI platform.

## Design Philosophy

Instead of traditional data tables, these components use a **receipt-style layout** that:
- ✅ Prioritizes verification status upfront
- ✅ Makes amount/key info the hero element (large, centered)
- ✅ Provides privacy (masked phone numbers)
- ✅ Uses semantic colors (green=success, amber=warning, red=error)
- ✅ Shows monospace transaction IDs for official appearance
- ✅ Includes verification timestamps
- ✅ Provides actionable buttons (download, dispute, resolve)
- ✅ Maintains context boxes for customer info

---

## Components Overview

### 1. **PaymentEvidenceCard**
**Purpose:** Display payment proof with full verification details

**Location:** `src/components/domain/payment/PaymentEvidenceCard.vue`

**Usage:**
```vue
<PaymentEvidenceCard
  :amount="5700"
  payment-date="March 28, 2026"
  payment-time="10:23 AM"
  transaction-id="TXN-2026-00412"
  reference-code="REF-1-March282026"
  method="MTN MoMo"
  phone="+250788123456"
  customer-name="Uwimana Jean Pierre"
  house-location="Kiyovu, Biryogo • House #KG-234"
  customer-category="Rich (Abakire)"
  :week-count="1"
  verify-time="2 min ago"
/>
```

**Key Features:**
- Green checkmark + "PAYMENT VERIFIED" status
- Large centered amount in monospace font
- Masked phone numbers: `+250 788 *** 3456`
- Payment method with icon
- Transaction ID in monospace (easier to copy/reference)
- Customer context boxed separately
- Download, View Original, Report Issue buttons
- Responsive grid layout

**Colors:**
- Primary: Green (`#16a34a`)
- Background: `linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)`
- Border: `#dcfce7`

---

### 2. **DeliveryProofCard**
**Purpose:** Confirm waste collection with weight, GPS, photos, and agent info

**Location:** `src/components/domain/payment/DeliveryProofCard.vue`

**Usage:**
```vue
<DeliveryProofCard
  :weight="45"
  category="General Waste"
  location="Kiyovu Sector"
  route="Route 3 - Downtown"
  collection-date="March 29, 2026"
  collection-time="2:45 PM"
  agent-name="Agent Marie"
  agent-id="AGENT-001"
  waste-type="Mixed Recyclables"
  condition="Good"
  verify-time="5 min ago"
/>
```

**Key Features:**
- Blue theme for delivery operations
- Weight as hero element (kg)
- GPS coordinates, photo proof, agent confirmation checkmarks
- Agent info box with ID
- Evidence items list (photo, GPS, signature)
- Responsive 2-column grid

**Colors:**
- Primary: Blue (`#3b82f6`)
- Background: `linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)`
- Border: `#bfdbfe`

---

### 3. **DisputeRecordCard**
**Purpose:** Log and track payment disputes with severity levels

**Location:** `src/components/domain/payment/DisputeRecordCard.vue`

**Usage:**
```vue
<DisputeRecordCard
  issue-type="Duplicate Payment"
  description="Customer was charged twice for the same week on March 27"
  :amount="5700"
  transaction-id="TXN-2026-00412"
  original-date="March 27, 2026"
  reported-by="Uwimana Jean Pierre"
  customer-role="Customer • Kiyovu"
  reported-date="March 27 at 11:30 AM"
  severity="error"
  last-update="March 28 at 9:15 AM"
  resolution="Payment being processed back to MTN account"
  resolution-status="in-progress"
  resolution-details="System detected duplicate charge. Refund initiated via MTN MoMo"
  created-time="2 hours ago"
/>
```

**Key Features:**
- Dynamic severity levels: warning, error, critical, resolved
- Issue type with contextual icon
- Affected payment details
- Customer context
- Timeline showing report → status update → resolution
- Semantic colors:
  - **Warning** (amber): `#d97706`
  - **Error** (red): `#dc2626`
  - **Critical** (dark red): `#991b1b`
  - **Resolved** (green): `#16a34a`
- Edit, comment, mark resolved buttons

---

### 4. **RefundHistoryCard**
**Purpose:** Track refunds with processing status and destination info

**Location:** `src/components/domain/payment/RefundHistoryCard.vue`

**Usage:**
```vue
<RefundHistoryCard
  :amount="5700"
  reason="Duplicate Payment"
  reason-description="Charged twice for week 13"
  original-tx-id="TXN-2026-00412"
  :original-amount="5700"
  original-date="March 27, 2026"
  payment-method="MTN MoMo"
  phone="+250788123456"
  requested-date="March 27 at 11:45 AM"
  processed-date="March 28 at 3:20 PM"
  status="completed"
  refund-code="REF-RFD-2026-00087"
  weeks-affected="Week 13"
  processed-by="Support Admin - Marie"
  notes="Refund successfully returned to original MTN MoMo account"
  processed-time="1 hour ago"
/>
```

**Key Features:**
- Minus badge (−) showing refund reversal
- Refund reason with icon
- Original transaction details
- Refund processing timeline
- Destination (payment method + phone)
- Status indicators: pending, processing, completed, failed
- Semantic colors:
  - **Pending** (amber): `#d97706`
  - **Processing** (blue): `#3b82f6`
  - **Completed** (green): `#16a34a`
  - **Failed** (red): `#dc2626`
- Download proof, view details, approve buttons

---

## Implementation Across Views

### PaymentsView (Customer)
Replace simple transaction list with `PaymentEvidenceCard` in expandable sections:

```vue
<div v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item">
  <div class="transaction-summary" @click="toggleExpand(transaction.id)">
    <!-- Summary row: date, amount, status -->
  </div>
  <transition>
    <PaymentEvidenceCard
      v-if="expandedId === transaction.id"
      :amount="transaction.amount"
      :payment-date="formatDate(transaction.createdAt)"
      :payment-time="formatTime(transaction.createdAt)"
      :transaction-id="transaction.id"
      :reference-code="transaction.referenceCode"
      :method="transaction.method"
      :phone="transaction.phone"
      :customer-name="currentUser.name"
      :house-location="`${currentUser.sector}, ${currentUser.cell}`"
      :customer-category="currentUser.category"
      :week-count="transaction.weekIds.length"
      :verify-time="getRelativeTime(transaction.createdAt)"
    />
  </transition>
</div>
```

### WorkerDashboard (Delivery Proof)
Show waste collection proof in houses list:

```vue
<DeliveryProofCard
  v-if="selectedHouse.delivered"
  :weight="selectedHouse.weightCollected"
  :category="selectedHouse.wasteCategory"
  :location="selectedHouse.location"
  :route="selectedHouse.assignedRoute"
  :collection-date="formatDate(selectedHouse.collectionDate)"
  :collection-time="formatTime(selectedHouse.collectionTime)"
  :agent-name="currentUser.name"
  :agent-id="currentUser.id"
  :waste-type="selectedHouse.wasteType"
  :condition="selectedHouse.wasteCondition"
/>
```

### DisputeView (Admin)
List all disputes with severity filtering:

```vue
<div v-for="dispute in disputes" :key="dispute.id" class="dispute-item">
  <DisputeRecordCard
    :issue-type="dispute.type"
    :description="dispute.description"
    :amount="dispute.affectedAmount"
    :transaction-id="dispute.transactionId"
    :original-date="formatDate(dispute.transactionDate)"
    :reported-by="dispute.reportedBy"
    :customer-role="dispute.customerRole"
    :reported-date="formatDate(dispute.reportedAt)"
    :severity="dispute.severity"
    :last-update="formatDate(dispute.lastUpdated)"
    :resolution="dispute.resolution"
    :resolution-status="dispute.status"
    :resolution-details="dispute.resolutionDetails"
  />
</div>
```

### RefundHistoryView
Display all refunds with status timeline:

```vue
<div v-for="refund in refunds" :key="refund.id" class="refund-item">
  <RefundHistoryCard
    :amount="refund.amount"
    :reason="refund.reason"
    :reason-description="refund.reasonDescription"
    :original-tx-id="refund.originalTransactionId"
    :original-amount="refund.originalAmount"
    :original-date="formatDate(refund.originalDate)"
    :payment-method="refund.method"
    :phone="refund.phone"
    :requested-date="formatDate(refund.requestedAt)"
    :processed-date="formatDate(refund.processedAt)"
    :status="refund.status"
    :refund-code="refund.refundCode"
    :weeks-affected="getWeeksAffected(refund.weekIds)"
    :processed-by="refund.processedByAdmin"
    :notes="refund.notes"
  />
</div>
```

---

## Styling Architecture

All components use the design tokens system:

```css
@import '../../../assets/styles/tokens.css';
```

Key tokens utilized:
- **Colors**: `--color-text-primary`, `--color-text-secondary`, `--color-bg-surface`
- **Typography**: `--font-display`, `--font-body`, `--font-mono`
- **Spacing**: `--space-1` through `--space-16` (8px base grid)
- **Radius**: `--radius-md`, `--radius-lg`
- **Duration**: `--duration-fast` for transitions

---

## Responsive Behavior

### Tablet (768px - 1024px)
- Hero amount reduces to 36px
- Grids reflow to single column on certain items
- Buttons remain full width on smaller grids

### Mobile (< 768px)
- All grids: single column
- Padding reduces from 24px to 16px
- Hero amounts: 32-28px font size
- Footer buttons: vertical stack
- Header status: flex column layout

---

## Color Semantics

### Payment Evidence
- **Background**: Green gradient
- **Hero Amount**: Green
- **Accent**: Medium green

### Delivery Proof
- **Background**: Blue gradient
- **Hero Amount**: Blue
- **Accent**: Sky blue

### Dispute Record
- **Warning**: Amber/Gold
- **Error**: Red
- **Critical**: Dark red
- **Resolved**: Green

### Refund History
- **Pending**: Amber
- **Processing**: Blue
- **Completed**: Green
- **Failed**: Red

---

## Accessibility

All components include:
- ✅ Semantic HTML structure
- ✅ ARIA labels on buttons
- ✅ High contrast text (WCAG AA compliant)
- ✅ Keyboard navigation support
- ✅ Icon + text combination (not icon-only)
- ✅ Descriptive button titles

---

## Integration Checklist

- [ ] Import component in view
- [ ] Prepare data from API
- [ ] Format dates/times correctly
- [ ] Mask sensitive phone numbers
- [ ] Add translation keys for labels
- [ ] Implement action button handlers
- [ ] Test responsive layouts
- [ ] Verify color contrast
- [ ] Add error states
- [ ] Document custom props

---

## Future Enhancements

1. **Export to PDF** - Download receipts as PDFs
2. **Print styling** - Optimize for printing
3. **Email sharing** - Send proof via email
4. **Multi-language** - Integrate i18n
5. **Accessibility audit** - WCAG AAA compliance
6. **Animation library** - Micro-interactions on state changes
7. **Dark mode** - Automatic theme switching
8. **Analytics** - Track user interactions
