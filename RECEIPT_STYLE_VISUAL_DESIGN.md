# Receipt-Style Components - Visual Design Reference

## Design System Overview

A modern receipt-inspired design for financial proof, delivery confirmation, disputes, and refunds that prioritizes:
- **Trust** through verification status upfront
- **Clarity** via hero elements and clear hierarchy  
- **Privacy** with masked sensitive data
- **Action** with prominent CTAs

---

## Color Palette

### Primary Colors
```
✅ Success Green:     #16a34a  (RGB: 22, 163, 74)
ℹ️  Info Blue:        #3b82f6  (RGB: 59, 130, 246)
⚠️  Warning Amber:    #d97706  (RGB: 217, 119, 6)
❌ Error Red:        #dc2626  (RGB: 220, 38, 38)
🚫 Critical Dark Red: #991b1b  (RGB: 153, 27, 27)
```

### Background Gradients
```
Payment (Green):
  linear-gradient(135deg, #f0fdf4 0%, #f8fafc 100%)
  
Delivery (Blue):
  linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%)
  
Dispute (Red):
  linear-gradient(135deg, #fee2e2 0%, #f8fafc 100%)
  
Refund (Amber):
  linear-gradient(135deg, #fef3c7 0%, #f8fafc 100%)
```

### Neutral Colors
```
Text Primary:    #0f172a  (Very Dark Blue)
Text Secondary:  #64748b  (Slate Gray)
Border:          #e2e8f0  (Light Gray)
Background:      #f8fafc  (Off White)
White:           #ffffff
```

---

## Typography

### Font Stack
```
Display (Headings):
  font-family: var(--font-display)
  Examples: "Inter Display", "Segoe UI", sans-serif
  
Body (Text):
  font-family: var(--font-body)
  Examples: "Inter", "Segoe UI", sans-serif
  
Monospace (IDs/Amounts):
  font-family: var(--font-mono)
  Examples: "DM Mono", "Fira Code", monospace
```

### Font Sizes
```
Hero Amount:      48px (desktop) → 36px (tablet) → 32px (mobile)
Section Title:    18px (bold)
Body Text:        14px (regular)
Labels:           12px (uppercase, semibold)
Details:          13px (regular)
```

### Font Weights
```
Extrabold:  800 - Labels, amounts
Bold:       700 - Headings
Semibold:   600 - Subheadings
Medium:     500 - Timestamps, secondary
Regular:    400 - Body copy
```

---

## Component Layouts

### Payment Evidence Card

```
┌─────────────────────────────────────────────┐
│  ✅ PAYMENT VERIFIED • Verified 2 min ago   │  [⬇️] [🔗] [🚩]
├─────────────────────────────────────────────┤
│                                             │
│                  RWF                        │
│                 5,700                       │
│            PAYMENT CONFIRMED                │
│                                             │
├─────────────────────────────────────────────┤
│  PAYMENT METHOD                             │
│  [💵 Icon] MTN MoMo                         │
│            +250 788 *** 3456                │
├─────────────────────────────────────────────┤
│  TRANSACTION DETAILS                        │
│  [Transaction ID] [Reference Code]         │
├─────────────────────────────────────────────┤
│  TRANSACTION TIME                           │
│  [Date] [Time] [Verified]                  │
├─────────────────────────────────────────────┤
│  PAID BY                                    │
│  👤 Uwimana Jean Pierre                     │
│     📍 Kiyovu, Biryogo • House #KG-234      │
├─────────────────────────────────────────────┤
│  ADDITIONAL INFORMATION                     │
│  Weeks Paid: 1 week | Category: Rich       │
├─────────────────────────────────────────────┤
│ [⬇️ Download Receipt] [🔗 View Original]   │
│ [🚩 Report Issue]                          │
└─────────────────────────────────────────────┘
```

### Delivery Proof Card

```
┌─────────────────────────────────────────────┐
│  ✅ DELIVERY CONFIRMED • Verified 5 min ago │  [⬇️] [🖼️]
├─────────────────────────────────────────────┤
│  [📦 Icon] WASTE COLLECTED                  │
│           45 kg                             │
│          General Waste                      │
├─────────────────────────────────────────────┤
│  COLLECTION DETAILS                         │
│  [Location] [Route] [Date] [Time]          │
├─────────────────────────────────────────────┤
│  COLLECTED BY                               │
│  👤 Agent Marie (AGENT-001)                 │
├─────────────────────────────────────────────┤
│  EVIDENCE                                   │
│  ✅ Photo proof attached                    │
│  ✅ GPS coordinates recorded                │
│  ✅ Agent confirmed                         │
├─────────────────────────────────────────────┤
│  ADDITIONAL INFORMATION                     │
│  Waste Type: Mixed | Condition: Good       │
├─────────────────────────────────────────────┤
│ [⬇️ Download Proof] [🖼️ View Photos]       │
└─────────────────────────────────────────────┘
```

### Dispute Record Card

```
┌─────────────────────────────────────────────┐
│  ⚠️ DISPUTE FILED • Created 2 hours ago      │  [✏️] [💬]
├─────────────────────────────────────────────┤
│  [⚠️ Icon] ISSUE TYPE                       │
│           Duplicate Payment                 │
│           ERROR                             │
├─────────────────────────────────────────────┤
│  ISSUE DETAILS                              │
│  "Customer was charged twice for the        │
│   same week on March 27"                    │
├─────────────────────────────────────────────┤
│  AFFECTED PAYMENT                           │
│  [Amount: 5,700 RWF] [TX-ID] [Original Date]│
├─────────────────────────────────────────────┤
│  REPORTED BY                                │
│  👤 Uwimana Jean Pierre                     │
│     Customer • Kiyovu                       │
├─────────────────────────────────────────────┤
│  TIMELINE                                   │
│  🔵 Mar 27 11:30 AM - Issue submitted      │
│  🔵 Mar 28 9:15 AM  - Status updated       │
├─────────────────────────────────────────────┤
│  RESOLUTION                                 │
│  ✅ Refund being processed back to MTN      │
├─────────────────────────────────────────────┤
│ [✏️ Edit Details] [💬 Add Comment]         │
│ [✅ Mark Resolved]                         │
└─────────────────────────────────────────────┘
```

### Refund History Card

```
┌─────────────────────────────────────────────┐
│  ✅ REFUNDED • Processed 1 hour ago          │  [⬇️] [👁️]
├─────────────────────────────────────────────┤
│  −    RWF                                    │
│       5,700                                 │
│      REFUNDED                               │
├─────────────────────────────────────────────┤
│  REFUND REASON                              │
│  [💾 Icon] Duplicate Payment                │
│           "Charged twice for week 13"       │
├─────────────────────────────────────────────┤
│  ORIGINAL TRANSACTION                       │
│  [TX-ID] [Amount] [Date] [Method]          │
├─────────────────────────────────────────────┤
│  REFUND PROCESSING                          │
│  🔵 Mar 27 11:45 AM - Refund requested    │
│  🟢 Mar 28 3:20 PM  - Refunded             │
├─────────────────────────────────────────────┤
│  REFUND DESTINATION                         │
│  [💵 Icon] MTN MoMo                         │
│           +250 788 *** 3456                │
│           Refund Code: REF-RFD-2026-00087   │
├─────────────────────────────────────────────┤
│ [⬇️ Download Proof] [👁️ View Details]     │
└─────────────────────────────────────────────┘
```

### Customer Statement Table

```
┌──────────────────────────────────────────────────────────────────┐
│ 📋 PAYMENT ACCOUNT STATEMENT                          [⬇️ PDF] [🖨️]│
│ Statement from March 1, 2026 to March 31, 2026                 │
├──────────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐              │
│ │ ✅ PAID      │ │ ⏳ OUTSTANDING│ │ 📊 AVERAGE   │              │
│ │ 268,400 RWF  │ │ 23,000 RWF   │ │ 5,700 RWF    │              │
│ │ 47 payments  │ │ 4 weeks      │ │ Per tx       │              │
│ └──────────────┘ └──────────────┘ └──────────────┘              │
├──────────────────────────────────────────────────────────────────┤
│ ✅ VERIFIED PAYMENTS                                 (47 verified)│
├────────────┬──────────┬─────────────┬──────────┬──────────────────┤
│ Date       │ Weeks    │ Method      │ Amount   │ Transaction ID   │
├────────────┼──────────┼─────────────┼──────────┼──────────────────┤
│ Mar 28     │ 1 week   │ MTN MoMo    │ 5,700    │ TXN-2026-00... ✅│
│ 10:23 AM   │          │             │ RWF     │ VERIFIED         │
├────────────┼──────────┼─────────────┼──────────┼──────────────────┤
│ Mar 27     │ 1 week   │ Bank Transfer│ 5,700   │ TXN-2026-00... ✅│
│ 2:15 PM    │          │             │ RWF     │ VERIFIED         │
├────────────┴──────────┴─────────────┴──────────┴──────────────────┤
│ ⏳ OUTSTANDING PAYMENTS                              (4 due)      │
├────────────┬──────────┬──────────────┬──────────┬─────────────────┤
│ Week       │ Amount   │ Due Date     │ Status   │ Action          │
├────────────┼──────────┼──────────────┼──────────┼─────────────────┤
│ Week 13    │ 5,700    │ Mar 22 🔴   │ OVERDUE  │ → Pay Now       │
│ Week 14    │ 5,700    │ Mar 29 🟡   │ DUE SOON │ → Pay Now       │
├────────────┴──────────┴──────────────┴──────────┴─────────────────┤
│ 🚩 DISPUTE HISTORY                                   (1 on record)│
├────────────────────────────────────────────────────────────────────┤
│ 🔴 Duplicate Payment - Mar 27    OPEN → View Details             │
└────────────────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Desktop (>1024px)
- Full width layouts
- 48px hero amounts
- 3-column grids on statements
- Side-by-side sections

### Tablet (768px-1024px)
- 85% width with margin
- 36px hero amounts
- 2-column grids
- Single column on smaller sections
- Buttons: side-by-side with wrapping

### Mobile (<768px)
- Full width minus 12px padding
- 28-32px hero amounts
- Single column grids
- Stack all buttons vertically
- Full-width action buttons

---

## Spacing System

**Base Grid**: 8px (4px increments)

```
--space-1:  4px    (minimal spacing)
--space-2:  8px    (default gap)
--space-3:  12px   (comfortable)
--space-4:  16px   (standard padding)
--space-5:  20px   (generous)
--space-6:  24px   (section padding)
--space-8:  32px   (large sections)
```

### Typical Spacing
- Container padding: 24px desktop / 16px tablet / 12px mobile
- Section gaps: 20-24px
- Element gaps: 8-12px
- Hero padding: 20-24px

---

## Shadow & Elevation

```css
/* Subtle shadows for depth */
box-shadow: 0 1px 2px rgba(0,0,0,0.05);      /* sm - borders, subtle */
box-shadow: 0 4px 6px rgba(0,0,0,0.1);       /* md - cards hover */
box-shadow: 0 10px 15px rgba(0,0,0,0.1);     /* lg - modals, expanded */
box-shadow: 0 20px 25px rgba(0,0,0,0.15);    /* xl - emphasis */
```

---

## Borders & Corners

```css
Border radius:
  --radius-sm:  6px    (buttons, small elements)
  --radius-md:  8px    (inputs, cards)
  --radius-lg:  12px   (large sections)
  --radius-xl:  16px   (containers)
  --radius-full: 9999px (badges, avatars)

Border width:
  1px - Standard borders
  2px - Emphasis (context boxes, hero elements)
```

---

## Interactive States

### Buttons
```
Default:  
  background: white
  border: 1px solid #e2e8f0
  color: #64748b
  
Hover:
  border-color: (semantic color)
  color: (semantic color)
  background: (color light - e.g., #eff6ff for blue)
  
Active:
  transform: translateY(-1px)
  box-shadow: 0 4px 12px rgba(color, 0.2)
  
Disabled:
  opacity: 0.5
  cursor: not-allowed
```

### Cards
```
Default:
  border: 1px solid #e2e8f0
  background: white
  
Hover:
  cursor: pointer
  border-color: (semantic color)
  box-shadow: 0 2px 8px rgba(0,0,0,0.06)
  
Active/Expanded:
  border: 2px solid (semantic color)
  box-shadow: 0 4px 16px rgba(color, 0.12)
```

---

## Accessibility Features

### Color Contrast
```
All text:    ≥ 4.5:1 WCAG AA
Large text:  ≥ 3:1 WCAG AA
Icons:       ≥ 3:1 against background
```

### Focus States
```css
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Animation & Transitions

```css
Duration:
  --duration-fast:   150ms  (hovers, micro-interactions)
  --duration-normal: 300ms  (standard transitions)
  --duration-slow:   500ms  (modals, major changes)

Timing Function:
  ease-in-out       (default smooth)
  cubic-bezier(0.4, 0, 0.2, 1)  (iOS-like)
```

### Common Animations
```
Expand/Collapse:
  transition: max-height 250ms ease, opacity 250ms ease
  
Fade In:
  transition: opacity 200ms ease-in-out
  
Slide In:
  transition: transform 200ms ease-out
  
Scale:
  transition: transform 150ms ease-in-out
```

---

## Icon Usage

### Icon Sizes
```
16px  - Inline with text, small UI
18px  - Standard inline icons
20px  - Button icons, header actions
24px  - Hero/emphasis icons
28px  - Large section icons
```

### Icon Colors
```
Primary:    Inherit from parent
Success:    #16a34a
Info:       #3b82f6
Warning:    #d97706
Error:      #dc2626
Neutral:    #64748b
```

---

## Dark Mode Considerations (Future)

```css
/* Light Mode */
--bg-primary: #ffffff
--text-primary: #0f172a
--border: #e2e8f0

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  --bg-primary: #1e293b
  --text-primary: #f1f5f9
  --border: #334155
}
```

---

## Print Styles

```css
@media print {
  background-color: white !important;
  color: black !important;
  box-shadow: none !important;
  border: 1px solid #000 !important;
  page-break-inside: avoid;
}
```

---

## Design Tokens File

All values referenced from: `src/assets/styles/tokens.css`

```css
:root {
  /* Colors */
  --color-success-light: #f0fdf4;
  --color-success: #16a34a;
  --color-success-dark: #15803d;
  
  --color-info-light: #eff6ff;
  --color-info: #3b82f6;
  --color-info-dark: #1e40af;
  
  /* Typography */
  --font-display: 'Inter Display', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'DM Mono', monospace;
  
  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  
  /* Radius */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Duration */
  --duration-fast: 150ms;
}
```

---

**Version**: 1.0
**Last Updated**: March 31, 2026
**Design Lead**: AGRUNI UX Team
