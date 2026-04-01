# Modal Pattern - Visual Design Reference

## 🎨 Color Semantics

### Success / Verified (Green)
```
Primary: #16a34a (bright green)
Light BG: #f0fdf4 (very light green)
Light Border: #dcfce7 (pale green)
Text Dark: #0f172a

Used in:
- PaymentEvidenceModal (verified payments)
- DeliveryProofModal (completed delivery)
```

### Warning / Pending (Orange)
```
Primary: #ea580c (bright orange)
Dark: #d97706 (darker orange)
Light BG: #fed7aa (light orange)
Border: #fdba74 (medium orange)
Text: #0f172a

Used in:
- DeliveryProofModal (pending delivery)
- RefundHistoryModal (processing)
- DisputeRecordModal (medium priority)
```

### Critical / Error (Red)
```
Primary: #dc2626 (bright red)
Light BG: #fef2f2 (very light red)
Border: #fecaca (pale red)
Text: #0f172a

Used in:
- DisputeRecordModal (critical/high priority)
- DeliveryProofModal (failed delivery)
- RefundHistoryModal (full reversal)
```

### Amber (Dispute)
```
Primary: #f59e0b (bright amber)
Light BG: #fef3c7 (light amber)
Border: #fcd34d (pale amber)
Text: #0f172a

Used in:
- RefundHistoryModal (dispute adjustment)
- DisputeRecordModal (low priority badge)
```

### Blue (Info / Secondary)
```
Primary: #3b82f6 (bright blue)
Light BG: #f0f9ff (very light blue)
Border: #dbeafe (pale blue)
Text: #0f172a

Used in:
- Action buttons (secondary actions)
- Icons for methods/info
- DisputeRecordModal (low priority)
```

---

## 📐 Typography Hierarchy

### Modal Header
```
Font: Display Bold
Size: 16px (0.75rem / --text-sm)
Weight: Bold (700)
Case: UPPERCASE
Tracking: 0.5px (--tracking-wide)
Color: Text Primary (#0f172a)
```

### Hero Amount
```
Font: Monospace Bold
Size: 48px (3rem / --text-4xl)
Weight: Extra Bold (800)
Family: Monospace (var(--font-mono))
Color: Status Color (Green/Red/etc)
```

### Hero Label
```
Font: Body
Size: 12px (0.75rem / --text-xs)
Weight: Semibold (600)
Case: UPPERCASE
Tracking: var(--tracking-wide)
Color: Text Secondary (#64748b)
```

### Section Titles
```
Font: Display Bold
Size: 14px (0.875rem / --text-sm)
Weight: Bold (700)
Case: UPPERCASE
Tracking: 0.5px
Color: Text Primary (#0f172a)
Margin-bottom: 16px (var(--space-4))
```

### Detail Labels
```
Font: Body
Size: 12px (0.75rem / --text-xs)
Weight: Semibold (600)
Case: UPPERCASE
Tracking: 0.5px
Color: Text Secondary (#64748b)
```

### Detail Values
```
Font: Body
Size: 14px (0.875rem / --text-sm)
Weight: Medium (500)
Color: Text Primary (#0f172a)
```

### Monospace IDs
```
Font: Monospace
Size: 12px (0.75rem / --text-xs)
Weight: Regular (400)
Family: Monospace (var(--font-mono))
Tracking: 0.5px
Background: #f1f5f9 (light gray)
Padding: 8px 12px (var(--space-2) var(--space-3))
Border-radius: 8px (var(--radius-md))
```

---

## 🎯 Compact Card Layout

### Visual Structure
```
┌─────────────────────────────────────┐
│ [✓] VERIFIED  ← Status badge       │
│                                     │
│ RWF 5,700     ← Large amount       │
│                                     │
│ METHOD     │ TIME                   │ ← Metadata grid
│ MTN MoMo   │ 10:30 AM              │
│                                     │
│ → View Details                      │ ← CTA
└─────────────────────────────────────┘
```

### Spacing
- **Container Padding:** 16px 20px (var(--space-4) var(--space-5))
- **Gap Between Sections:** 16px (var(--space-4))
- **Section Gap (metadata):** 12px (var(--space-3))

### Hover State
```
- Transform: translateY(-2px)
- Box-shadow: 0 8px 24px rgba(0,0,0,0.12)
- Border brightens by 1 shade
- Overlay opacity: 0 → 1 (0.3s)
```

### Mobile Compact Card
```
- Padding: 12px 16px (var(--space-3) var(--space-4))
- Font sizes reduced by 1 step
- Metadata grid: 1 column
```

---

## 📦 Modal Layout

### Visual Structure
```
╔════════════════════════════════════════╗
║ [✓] VERIFIED 2 min ago        [×]     ║ ← Header
║════════════════════════════════════════║
║                                        ║
║   AMOUNT PAID                          ║
║                                        ║
║   RWF                                  ║
║   5,700                                ║ ← Hero Section
║                                        ║
║   Payment Confirmed                    ║
║                                        ║
║════════════════════════════════════════║
║                                        ║
║ TRANSACTION DETAILS                    ║
│                                        │
│ PAYMENT METHOD                         │
│ MTN MoMo (+250 788 *** 3456)          │ ← Details Grid
│                                        │
│ TRANSACTION ID                         │
│ TXN-2024-001234                       │
│                                        │
║ CUSTOMER INFORMATION                   ║
║                                        ║
║ [👤] Paid by                          ║
║     Uwimana Jean Pierre               ║ ← Customer Box
║     📍 Kiyovu Sector                  ║
║                                        ║
║════════════════════════════════════════║
║                                        ║
║ [📥] [🔗] [🚩]                        ║ ← Action Buttons
║════════════════════════════════════════║
╚════════════════════════════════════════╝
```

### Modal Spacing
- **Outer Padding:** 32px (var(--space-8))
- **Gap Between Sections:** 24px (var(--space-6))
- **Inner Padding (sections):** 16px (var(--space-4))
- **Max Width:** 500px
- **Max Height:** 90vh (overflow-y: auto)

### Mobile Modal
```
- Max Width: calc(100% - 32px)
- Padding: 24px (var(--space-6))
- Gap Between Sections: 24px (var(--space-6))
```

---

## 🎬 Animation Timing

### Entrance Animation
```
Name: slideUp
Duration: 250ms
Easing: cubic-bezier(0.19, 1, 0.22, 1) [bounce]
From: translateY(20px) + opacity 0
To: translateY(0) + opacity 1
```

### Fade Overlay
```
Name: fadeIn
Duration: 250ms
Easing: cubic-bezier(0.19, 1, 0.22, 1)
From: opacity 0
To: opacity 1
```

### Exit Animation
```
Name: modal-fade-leave
Duration: 250ms
Easing: cubic-bezier(0.19, 1, 0.22, 1)
From: opacity 1
To: opacity 0
```

### Hover Transitions
```
Duration: 200ms (0.2s)
Easing: ease
Properties: transform, background, border, box-shadow
```

---

## 🔘 Button Styling

### Primary Action (Danger)
```
Background: #fef2f2 (light red)
Border: 1px solid #fecaca
Text Color: #dc2626
Hover: background #fee2e2, border #fca5a5
Icon: 16px, same color as text
```

### Secondary Action (Info)
```
Background: #f0f9ff (light blue)
Border: 1px solid #dbeafe
Text Color: #3b82f6
Hover: background #e0f2fe, border #7dd3fc
Icon: 16px, same color as text
```

### Warning Action
```
Background: #fef3c7 (light amber)
Border: 1px solid #fcd34d
Text Color: #d97706
Hover: background #fef08a, border #f59e0b
Icon: 16px, same color as text
```

### All Buttons
```
Padding: 12px 16px (var(--space-3) var(--space-4))
Border-radius: 8px (var(--radius-lg))
Font: Body Semibold 14px (var(--text-sm))
Cursor: pointer
Transition: all 0.2s ease
On Hover: transform translateY(-1px)
Icon Gap: 8px (var(--space-2))
Icon Size: 16px
```

---

## 📊 Grid Layouts

### Details Grid
```
1 Column on all sizes
Gap: 16px (var(--space-4))

Example:
┌─────────────────────┐
│ LABEL               │
│ Value               │
├─────────────────────┤
│ LABEL               │
│ Value               │
├─────────────────────┤
│ LABEL               │
│ Value               │
└─────────────────────┘
```

### Metadata Grid (Compact Card)
```
2 Columns on desktop
1 Column on mobile
Gap: 12px (var(--space-3))

Example:
┌──────────────┬──────────────┐
│ Label  │     │ Label  │     │
│ Value  │     │ Value  │     │
└──────────────┴──────────────┘
```

### Action Buttons Grid
```
Default: 2 columns
Danger button: spans 2 columns

Example:
┌─────────────────┬──────────────────┐
│  Button 1       │  Button 2        │
├─────────────────┼──────────────────┤
│  Button 3 (danger, full width)     │
└─────────────────┴──────────────────┘
```

---

## 🎨 Contrast & Accessibility

### Text on Light Backgrounds
```
Primary Text (#0f172a) on White: 19:1 ratio ✓✓✓ (AAA)
Primary Text (#0f172a) on Light Gray (#f8fafc): 18:1 ratio ✓✓✓ (AAA)
Secondary Text (#64748b) on White: 6.5:1 ratio ✓✓ (AA)
```

### Text on Colored Backgrounds
```
White text on Green (#16a34a): 7.2:1 ratio ✓✓ (AA)
White text on Red (#dc2626): 6.3:1 ratio ✓✓ (AA)
White text on Orange (#d97706): 5.8:1 ratio ✓ (AA)
White text on Blue (#3b82f6): 5.9:1 ratio ✓ (AA)
```

---

## 📐 Spacing System

All spacing is based on 8px base grid:

```
4px   = 0.25rem = var(--space-1)
8px   = 0.5rem  = var(--space-2)
12px  = 0.75rem = var(--space-3)
16px  = 1rem    = var(--space-4)
20px  = 1.25rem = var(--space-5)
24px  = 1.5rem  = var(--space-6)
32px  = 2rem    = var(--space-8)
40px  = 2.5rem  = var(--space-10)
48px  = 3rem    = var(--space-12)
64px  = 4rem    = var(--space-16)
```

---

## 🖼️ Border Radius System

```
4px   = var(--radius-sm)   (small buttons)
6px   = var(--radius-md)   (input fields, small boxes)
8px   = var(--radius-lg)   (cards, sections)
12px  = var(--radius-xl)   (modal)
9999px = var(--radius-full) (avatars, pills)
```

---

## 🌈 Component Variants

### PaymentEvidenceModal (Green Theme)
```
Badge: Green (#16a34a)
Background: #f0fdf4
Border: #dcfce7
Amount: Green (#16a34a)
```

### DeliveryProofModal (Status Colors)
```
Completed: Green (#16a34a)
Pending: Orange (#ea580c)
Failed: Red (#dc2626)
```

### DisputeRecordModal (Priority Colors)
```
Critical: Red (#dc2626)
High: Orange (#d97706)
Medium: Orange (#ea580c)
Low: Blue (#3b82f6)
```

### RefundHistoryModal (Type Colors)
```
Full Reversal: Red (#dc2626)
Partial Refund: Orange (#ea580c)
Dispute Adjustment: Amber (#d97706)
```

---

## ⚡ Performance Notes

### CSS Optimization
- Scoped styles (no global pollution)
- GPU-accelerated animations (transform, opacity)
- Efficient selectors (class-based, no deep nesting)
- Minimal repaints (proper z-index, containment)

### Animation Performance
```css
/* ✓ Use these for performance */
transform: translateY(-2px);
opacity: 0 → 1;

/* ✗ Avoid for animations */
top, left, width, height (cause reflows)
box-shadow changes (causes repaints)
```

---

## 📋 Design Checklist

When implementing a new modal variant:

- [ ] Choose semantic color (green/red/orange/blue)
- [ ] Create compact card with that color theme
- [ ] Design hero section with large display
- [ ] Arrange details in logical grid
- [ ] Add status badge with icon
- [ ] Include relevant action buttons
- [ ] Test contrast ratios (min AA, target AAA)
- [ ] Verify spacing follows 8px grid
- [ ] Add proper animations (slideUp + fadeIn)
- [ ] Test on mobile (90vw width)
- [ ] Verify keyboard navigation (ESC, Tab)

---

**Last Updated:** March 31, 2026
**Version:** 1.0
