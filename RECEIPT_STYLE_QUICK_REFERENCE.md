# Receipt-Style Components - Quick Reference Card

## 🚀 Quick Start

### Import Component
```vue
import PaymentEvidenceCard from '@/components/domain/payment/PaymentEvidenceCard.vue'
```

### Basic Usage
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
/>
```

---

## 📋 Component List

| Component | File | Use Case | Color |
|-----------|------|----------|-------|
| **PaymentEvidenceCard** | `PaymentEvidenceCard.vue` | Verified payments | Green ✅ |
| **DeliveryProofCard** | `DeliveryProofCard.vue` | Collection proof | Blue ℹ️ |
| **DisputeRecordCard** | `DisputeRecordCard.vue` | Payment disputes | Red ❌ |
| **RefundHistoryCard** | `RefundHistoryCard.vue` | Refund tracking | Multi 🔄 |
| **CustomerStatementTable** | `CustomerStatementTable.vue` | Full statement | Multi 📊 |

---

## 🎨 Colors Quick Reference

| Component | Color | Hex | Usage |
|-----------|-------|-----|-------|
| Payment | Green | `#16a34a` | Success, verified |
| Delivery | Blue | `#3b82f6` | Info, collection |
| Dispute Warning | Amber | `#d97706` | Warning state |
| Dispute Error | Red | `#dc2626` | Error state |
| Dispute Critical | Dark Red | `#991b1b` | Critical state |
| Refund Completed | Green | `#16a34a` | Completed |
| Refund Failed | Red | `#dc2626` | Failed |

---

## ✅ Common Props Reference

### PaymentEvidenceCard
```typescript
amount: number                    // Required
paymentDate: string              // "March 28, 2026"
paymentTime: string              // "10:23 AM"
transactionId: string            // "TXN-2026-00412"
referenceCode: string            // "REF-1-March282026"
method: 'MTN MoMo'              // Required
phone: string                    // "+250788123456"
customerName: string             // "Uwimana Jean Pierre"
houseLocation: string            // "Kiyovu, Biryogo"
customerCategory: string         // "Rich (Abakire)"
weekCount: number                // Default: 1
verifyTime: string              // Default: "2 min ago"
```

### DeliveryProofCard
```typescript
weight: number                   // 45 (kg)
category: string                 // "General Waste"
location: string                 // "Kiyovu Sector"
route: string                    // "Route 3"
collectionDate: string           // "March 29, 2026"
collectionTime: string           // "2:45 PM"
agentName: string               // "Agent Marie"
agentId: string                 // "AGENT-001"
wasteType: string               // "Mixed Recyclables"
condition: string               // "Good"
verifyTime: string              // Default: "5 min ago"
```

### DisputeRecordCard
```typescript
issueType: string               // "Duplicate Payment"
description: string             // Full description
amount: number                  // 5700
transactionId: string           // "TXN-2026-00412"
originalDate: string            // "March 27, 2026"
reportedBy: string              // "Uwimana Jean Pierre"
customerRole: string            // "Customer • Kiyovu"
reportedDate: string            // "March 27 at 11:30 AM"
severity: 'warning'|'error'...  // Required enum
lastUpdate: string              // Optional
resolution: string              // Optional
resolutionStatus: enum          // Optional
resolutionDetails: string       // Optional
createdTime: string             // Default: "2 hours ago"
```

### RefundHistoryCard
```typescript
amount: number                  // 5700
reason: string                  // "Duplicate Payment"
reasonDescription: string       // "Charged twice for week 13"
originalTxId: string           // "TXN-2026-00412"
originalAmount: number          // 5700
originalDate: string            // "March 27, 2026"
paymentMethod: enum             // "MTN MoMo"
phone: string                   // "+250788123456"
requestedDate: string           // "March 27 at 11:45 AM"
processedDate: string           // "March 28 at 3:20 PM"
status: enum                    // "pending"|"processing"|"completed"|"failed"
refundCode: string              // "REF-RFD-2026-00087"
weeksAffected: string           // "Week 13"
processedBy: string             // "Support Admin - Marie"
notes: string                   // Optional
processedTime: string           // Default: "1 hour ago"
```

### CustomerStatementTable
```typescript
payments: Payment[]             // Array of verified payments
outstandingWeeks: Outstanding[] // Array of unpaid weeks
disputes: Dispute[]             // Array of disputes
periodStart: string             // "March 1, 2026"
periodEnd: string               // "March 31, 2026"
```

---

## 🔄 Props Enum Values

### Dispute Severity
```
'warning'   // Yellow/amber
'error'     // Red
'critical'  // Dark red
'resolved'  // Green
```

### Refund Status
```
'pending'      // Amber - waiting
'processing'   // Blue - in progress
'completed'    // Green - done
'failed'       // Red - error
```

### Payment Methods
```
'MTN MoMo'
'Airtel Money'
'Bank Transfer'
```

---

## 📱 Responsive Behavior

| Breakpoint | Grid | Font Size | Padding |
|-----------|------|-----------|---------|
| Desktop (>1024px) | Multi-col | 48px | 24px |
| Tablet (768-1024px) | 2-col | 36px | 16px |
| Mobile (<768px) | 1-col | 28-32px | 12px |

---

## 🎯 Integration Locations

### Worker Portal
- **HousesListView**: `PaymentEvidenceCard` in house details
- **Dashboard**: `DeliveryProofCard` for collections
- **RemindersView**: `DisputeRecordCard` for issues

### Customer Portal
- **PaymentsView**: `PaymentEvidenceCard` for receipt
- **HistoryView**: `CustomerStatementTable` for statement
- **ProfileView**: `RefundHistoryCard` for refunds

### Admin Portal
- **DisputePanel**: `DisputeRecordCard` list
- **RefundPanel**: `RefundHistoryCard` list
- **CustomerPanel**: `CustomerStatementTable` view

---

## 🛠️ Formatting Helpers

### Format Currency
```javascript
const formatCurrency = (amount: number) => {
  return `${amount.toLocaleString('en-RW')} RWF`
}
// Output: "5,700 RWF"
```

### Format Date
```javascript
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
// Output: "Mar 28, 2026"
```

### Format Phone (Privacy)
```javascript
const formatPhone = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '')
  const last4 = cleaned.slice(-4)
  return `+250 788 *** ${last4}`
}
// Output: "+250 788 *** 3456"
```

### Format Time (Relative)
```javascript
const getRelativeTime = (date: Date) => {
  const now = Date.now()
  const diff = now - date.getTime()
  const minutes = Math.floor(diff / 60000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  if (minutes < 1440) return `${Math.floor(minutes/60)} hours ago`
  return `${Math.floor(minutes/1440)} days ago`
}
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `RECEIPT_STYLE_COMPONENTS.md` | Detailed component docs |
| `RECEIPT_STYLE_VISUAL_DESIGN.md` | Design system reference |
| `RECEIPT_STYLE_IMPLEMENTATION_SUMMARY.md` | Integration guide |
| `QUICK_REFERENCE.md` | This file |

---

## 🔍 Icon Reference

### Icons Used
```
✅ Check Circle  → ph:check-circle-fill (success)
ℹ️  Info Circle   → ph:info-circle (info)
⚠️  Warning Circle → ph:warning-circle-fill (warning)
❌ X Circle      → ph:x-circle-fill (error)
🚫 Prohibit      → ph:prohibit-fill (critical)
💵 Payment       → ph:phone, ph:bank (methods)
📦 Delivery      → ph:package-check (delivery)
📊 Chart         → ph:chart-line (analytics)
🔗 Link          → ph:link (external)
⬇️ Download       → ph:download (export)
🖼️  Images        → ph:image (photos)
👤 User          → ph:user-circle (customer)
📍 Location      → ph:map-pin (location)
⏰ Clock         → ph:clock (time)
💾 Database      → ph:database (backup)
```

---

## ❌ Common Mistakes to Avoid

1. **❌ Wrong phone format**
   ```javascript
   // Wrong
   phone="+250788123456"
   
   // Right - let component format it
   phone="+250788123456" // Will become "+250 788 *** 3456"
   ```

2. **❌ Passing raw amounts**
   ```javascript
   // Wrong - component doesn't format
   :amount="5700"
   
   // Right - pass number, component formats to currency
   :amount="5700" // Becomes "5,700 RWF"
   ```

3. **❌ Using old grid structure**
   ```vue
   <!-- Wrong -->
   <div class="details-grid">
     <div class="detail-item">...</div>
   </div>
   
   <!-- Right -->
   <PaymentEvidenceCard v-bind="props" />
   ```

4. **❌ Forgetting responsive classes**
   ```css
   /* Wrong - not responsive */
   .my-card { padding: 24px; }
   
   /* Right - uses tokens */
   .my-card { padding: var(--space-6); }
   ```

5. **❌ Hardcoding colors**
   ```css
   /* Wrong */
   .success { color: #16a34a; }
   
   /* Right - already semantic */
   /* Components handle colors automatically */
   ```

---

## ✨ Tips & Tricks

### Tip 1: Expandable Rows
```vue
<template v-for="payment in payments" :key="payment.id">
  <div class="summary" @click="toggle(payment.id)">{{ payment.date }}</div>
  <PaymentEvidenceCard v-if="expandedId === payment.id" v-bind="payment" />
</template>
```

### Tip 2: Status Filtering
```javascript
const verified = payments.filter(p => p.status === 'verified')
const pending = payments.filter(p => p.status === 'pending')
```

### Tip 3: Batch Formatting
```javascript
const formatted = payments.map(p => ({
  ...p,
  formattedAmount: formatCurrency(p.amount),
  formattedDate: formatDate(p.date)
}))
```

### Tip 4: Computed Properties
```javascript
const totalPaid = computed(() => {
  return payments.value.reduce((sum, p) => sum + p.amount, 0)
})
```

### Tip 5: Accessibility
```vue
<button :title="getStatusLabel(severity)">
  <Icon :icon="getStatusIcon(severity)" />
</button>
```

---

## 🚨 Troubleshooting

### Component Not Rendering
```javascript
// Check:
1. Import statement correct?
2. All required props passed?
3. Props types match interface?
4. Data fetched from API?
```

### Styling Issues
```css
/* Check:
1. tokens.css imported?
2. Color vars available?
3. Responsive breakpoints working?
4. No conflicting CSS?
*/
```

### Responsive Not Working
```css
/* Check media queries in component */
@media (max-width: 768px) {
  /* tablet/mobile styles */
}
```

---

## 📞 Support

- **Component Docs**: See `RECEIPT_STYLE_COMPONENTS.md`
- **Design Specs**: See `RECEIPT_STYLE_VISUAL_DESIGN.md`
- **Implementation**: See `RECEIPT_STYLE_IMPLEMENTATION_SUMMARY.md`
- **Codebase**: `src/components/domain/payment/`

---

**Quick Stats**
- ✅ 5 components created
- ✅ 100% responsive
- ✅ WCAG AA accessible
- ✅ Full TypeScript support
- ✅ Production ready

**Version**: 1.0  
**Last Updated**: March 31, 2026
