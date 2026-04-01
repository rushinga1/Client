# WasteWise — Design System & Frontend Architecture
### Vue 3 · Multi-Portal · Multi-Lingual

---

## 0. Aesthetic Direction

**Concept: "Civic Clarity"**
Clean, trustworthy, and authoritative — like a modern fintech app built for public good.
Blue is the primary force; white gives breathing room; charcoal provides structure.
Typography is bold and legible at all sizes (accessibility-first). Motion is purposeful, never decorative.

**Tone:** Utility-refined. Not corporate-cold, not playful — dependable and clear.

---

## 1. Design Tokens

All tokens live in `src/assets/styles/tokens.css` and are consumed via CSS custom properties.
**Zero hardcoded values anywhere in components.**

### 1.1 Color Palette

```css
/* src/assets/styles/tokens.css */
:root {

  /* ── Brand ── */
  --color-primary-50:  #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;   
  --color-primary-600: #2563eb;   
  --color-primary-700: #1d4ed8;

  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* ── Neutral / Surface ── */
  --color-neutral-0:   #ffffff;
  --color-neutral-50:  #f8fafc;
  --color-neutral-100: #f1f5f9;
  --color-neutral-200: #e2e8f0;
  --color-neutral-300: #cbd5e1;
  --color-neutral-400: #94a3b8;
  --color-neutral-500: #64748b;
  --color-neutral-600: #475569;
  --color-neutral-700: #334155;
  --color-neutral-800: #1e293b;
  --color-neutral-900: #0f172a;

  /* ── Semantic ── */
  --color-success:        #22c55e;
  --color-success-light:  #dcfce7;
  --color-success-dark:   #15803d;

  --color-danger:         #ef4444;
  --color-danger-light:   #fee2e2;
  --color-danger-dark:    #b91c1c;

  --color-warning:        #f59e0b;
  --color-warning-light:  #fef3c7;
  --color-warning-dark:   #b45309;

  --color-info:           #3b82f6;
  --color-info-light:     #dbeafe;
  --color-info-dark:      #1d4ed8;

  /* ── Portal Identity ── */
  --color-portal-user:    var(--color-primary-500);   /* blue   */
  --color-portal-admin:   #7c3aed;                    /* violet */
  --color-portal-worker:  #f59e0b;                    /* amber  */

  /* ── UI Surfaces ── */
  --color-bg-base:        var(--color-neutral-50);
  --color-bg-surface:     var(--color-neutral-0);
  --color-bg-sunken:      var(--color-neutral-100);
  --color-bg-overlay:     rgba(15, 23, 42, 0.55);

  /* ── Text ── */
  --color-text-primary:   var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-disabled:  var(--color-neutral-400);
  --color-text-inverse:   var(--color-neutral-0);
  --color-text-link:      var(--color-primary-600);

  /* ── Border ── */
  --color-border-default: var(--color-neutral-200);
  --color-border-strong:  var(--color-neutral-300);
  --color-border-focus:   var(--color-primary-500);
  --color-border-danger:  var(--color-danger);
}
```

---

### 1.2 Typography

**Font Stack:**
- Display / Headings → `"Sora"` (Google Fonts) — geometric, modern, civic authority
- Body / UI → `"DM Sans"` (Google Fonts) — clean, highly legible, neutral
- Monospace / Amounts → `"DM Mono"` — for currency, payment codes, IDs

```css
:root {
  /* ── Families ── */
  --font-display: 'Sora', sans-serif;
  --font-body:    'DM Sans', sans-serif;
  --font-mono:    'DM Mono', monospace;

  /* ── Scale (Major Third, base 16px) ── */
  --text-xs:   0.75rem;    /* 12px */
  --text-sm:   0.875rem;   /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg:   1.125rem;   /* 18px */
  --text-xl:   1.25rem;    /* 20px */
  --text-2xl:  1.5rem;     /* 24px */
  --text-3xl:  1.875rem;   /* 30px */
  --text-4xl:  2.25rem;    /* 36px */
  --text-5xl:  3rem;       /* 48px */

  /* ── Weights ── */
  --font-regular:   400;
  --font-medium:    500;
  --font-semibold:  600;
  --font-bold:      700;
  --font-extrabold: 800;

  /* ── Line Heights ── */
  --leading-tight:  1.25;
  --leading-snug:   1.375;
  --leading-normal: 1.5;
  --leading-relaxed:1.625;

  /* ── Letter Spacing ── */
  --tracking-tight:  -0.02em;
  --tracking-normal:  0em;
  --tracking-wide:    0.05em;
  --tracking-widest:  0.1em;
}
```

---

### 1.3 Spacing System

8px base grid. All spacing is a multiple of 4px.

```css
:root {
  --space-1:  0.25rem;   /*  4px */
  --space-2:  0.5rem;    /*  8px */
  --space-3:  0.75rem;   /* 12px */
  --space-4:  1rem;      /* 16px */
  --space-5:  1.25rem;   /* 20px */
  --space-6:  1.5rem;    /* 24px */
  --space-8:  2rem;      /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */
}
```

---

### 1.4 Border Radius

```css
:root {
  --radius-sm:   0.25rem;    /*  4px — tags, badges */
  --radius-md:   0.5rem;     /*  8px — inputs, buttons */
  --radius-lg:   0.75rem;    /* 12px — cards */
  --radius-xl:   1rem;       /* 16px — modals, sheets */
  --radius-2xl:  1.5rem;     /* 24px — large panels */
  --radius-full: 9999px;     /* pills, avatars */
}
```

---

### 1.5 Shadows

```css
:root {
  --shadow-xs:  0 1px 2px 0 rgba(0,0,0,0.05);
  --shadow-sm:  0 1px 3px 0 rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10);
  --shadow-md:  0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10);
  --shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10);
  --shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.10);
  --shadow-inner: inset 0 2px 4px 0 rgba(0,0,0,0.06);
  --shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.35);   /* blue glow */
  --shadow-focus-danger: 0 0 0 3px rgba(239, 68, 68, 0.35);
}
```

---

### 1.6 Transitions & Animation

```css
:root {
  --duration-fast:   150ms;
  --duration-normal: 250ms;
  --duration-slow:   400ms;
  --ease-default:    cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in:         cubic-bezier(0.4, 0, 1, 1);
  --ease-out:        cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

### 1.7 Z-Index Scale

```css
:root {
  --z-below:    -1;
  --z-base:      0;
  --z-raised:   10;
  --z-dropdown: 100;
  --z-sticky:   200;
  --z-overlay:  300;
  --z-modal:    400;
  --z-toast:    500;
}
```

---

## 2. Global Typography Rules

```css
/* src/assets/styles/typography.css */
body {
  font-family: var(--font-body);
  font-size:   var(--text-base);
  color:       var(--color-text-primary);
  line-height: var(--leading-normal);
}

h1, h2, h3, h4, h5, h6 {
  font-family:    var(--font-display);
  font-weight:    var(--font-bold);
  line-height:    var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  color:          var(--color-text-primary);
}

h1 { font-size: var(--text-4xl); }
h2 { font-size: var(--text-3xl); }
h3 { font-size: var(--text-2xl); }
h4 { font-size: var(--text-xl);  }
h5 { font-size: var(--text-lg);  }
h6 { font-size: var(--text-base);}

.amount, .code, .id {
  font-family: var(--font-mono);
  font-weight: var(--font-semibold);
}
```

---

## 3. Reusable Vue Base Components

### Component Inventory

| Component | Purpose | Key Props |
|---|---|---|
| `BaseButton` | All CTA actions | `variant`, `size`, `loading`, `disabled`, `icon` |
| `BaseInput` | Text / number inputs | `type`, `label`, `error`, `prefix`, `suffix` |
| `BaseSelect` | Dropdown selection | `options`, `label`, `error`, `multiple` |
| `BaseCard` | Content container | `variant`, `padding`, `hoverable` |
| `BaseModal` | Dialog overlay | `modelValue`, `title`, `size`, `persistent` |
| `BaseTable` | Data display | `columns`, `rows`, `loading`, `empty-state` |
| `BaseBadge` | Status labels | `variant`, `size`, `dot` |
| `BaseAlert` | Feedback banners | `variant`, `dismissible`, `icon` |
| `BaseToast` | Push notifications | `variant`, `duration`, `action` |
| `BaseAvatar` | User identity | `src`, `name`, `size`, `status` |
| `BaseSkeleton` | Loading states | `variant`, `width`, `height`, `lines` |
| `BasePaymentCard` | Payment display | `amount`, `status`, `week`, `currency` |
| `BaseWeekSelector` | Week multi-picker | `modelValue`, `minWeeks`, `maxWeeks` |
| `BaseDebtBanner` | Debt alert strip | `amount`, `weeks`, `currency`, `banned` |
| `BaseLanguageSwitcher` | i18n toggle | `locales`, `compact` |
| `BasePortalTag` | Portal identifier | `portal` (`user`\|`admin`\|`worker`) |
| `BaseStatusDot` | Live status pip | `status` (`active`\|`pending`\|`banned`) |
| `BasePinInput` | PIN / OTP entry | `length`, `mask`, `error` |
| `BaseBottomSheet` | Mobile panel | `modelValue`, `snapPoints`, `title` |
| `BaseProgressBar` | Payment progress | `value`, `max`, `variant`, `label` |

---

### 3.1 BaseButton Spec

```vue
<!-- Props -->
variant:  'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
size:     'sm' | 'md' | 'lg' | 'xl'
loading:  Boolean
disabled: Boolean
iconLeft: String (icon name)
iconRight: String (icon name)
block:    Boolean  (full width)
```

**Visual States:**
- Default → primary blue fill, white label
- Hover → `--color-primary-600`, translate-Y -1px, shadow-md
- Active → `--color-primary-700`, no translate
- Loading → spinner replaces left icon, pointer-events: none
- Disabled → `--color-neutral-200` bg, `--color-text-disabled`, cursor: not-allowed

---

### 3.2 BaseInput Spec

```vue
<!-- Props -->
type:        'text' | 'number' | 'password' | 'email' | 'tel'
label:       String
placeholder: String
error:       String   (triggers danger border + message)
hint:        String   (secondary helper text)
prefix:      String   (e.g. 'RWF', '+250')
suffix:      String   (e.g. icon or unit)
disabled:    Boolean
readonly:    Boolean
```

**States:**
- Default → `--color-border-default` border, `--color-bg-surface` bg
- Focus → `--color-border-focus` border, `--shadow-focus` ring (blue glow)
- Error → `--color-border-danger` border, `--shadow-focus-danger` ring
- Disabled → `--color-bg-sunken` bg, `--color-text-disabled`

---

### 3.3 BasePaymentCard Spec

_Purpose-built for this app's core feature._

```vue
<!-- Props -->
week:     String  (e.g. "Week 12, Apr 2025")
amount:   Number
currency: String  (default 'RWF')
status:   'paid' | 'pending' | 'overdue' | 'upcoming'
dueDate:  String
```

---

### 3.4 BaseDebtBanner Spec

_Prominent banner shown when user has unpaid balance._

```vue
<!-- Props -->
totalDebt:    Number
weeksOwed:    Number
currency:     String
monthsBehind: Number   (≥2 shows ban warning)
onPayNow:     Function
```
- Variant changes by `monthsBehind`: 1 = warning, 2+ = danger with ban alert

---

### 3.5 BaseWeekSelector Spec

_Lets users pay multiple weeks in a single transaction._

```vue
<!-- Props -->
modelValue: Array<Number>  (selected week IDs)
weeks:      Array<{ id, label, amount, status }>
maxWeeks:   Number (default: 52)
```

---

## 4. Project Folder Structure

```
wastewise-app/
├── public/
│   └── locales/                        # i18n JSON files (flat, outside src)
│       ├── en.json
│       ├── fr.json
│       ├── rw.json                     # Kinyarwanda
│       └── sw.json                     # Swahili
│
├── src/
│   ├── main.ts
│   ├── App.vue
│   │
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── tokens.css              # ALL design tokens
│   │   │   ├── typography.css          # Global type rules
│   │   │   ├── reset.css               # CSS reset
│   │   │   ├── animations.css          # Keyframes
│   │   │   └── utilities.css           # Minimal utility classes
│   │   ├── fonts/                      # Self-hosted font files
│   │   └── images/
│   │
│   ├── components/
│   │   ├── base/                       # Dumb, reusable atoms
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseTable.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseAlert.vue
│   │   │   ├── BaseToast.vue
│   │   │   ├── BaseAvatar.vue
│   │   │   ├── BaseSkeleton.vue
│   │   │   ├── BaseProgressBar.vue
│   │   │   ├── BasePinInput.vue
│   │   │   ├── BaseBottomSheet.vue
│   │   │   ├── BaseLanguageSwitcher.vue
│   │   │   ├── BasePortalTag.vue
│   │   │   └── BaseStatusDot.vue
│   │   │
│   │   ├── domain/                     # Smart, app-specific molecules
│   │   │   ├── payment/
│   │   │   │   ├── PaymentCard.vue
│   │   │   │   ├── PaymentHistoryTable.vue
│   │   │   │   ├── WeekSelector.vue
│   │   │   │   ├── PaymentSummarySheet.vue
│   │   │   │   └── PaymentConfirmModal.vue
│   │   │   ├── debt/
│   │   │   │   ├── DebtBanner.vue
│   │   │   │   ├── DebtBreakdown.vue
│   │   │   │   └── BanWarningCard.vue
│   │   │   ├── notifications/
│   │   │   │   ├── NotificationItem.vue
│   │   │   │   ├── NotificationDrawer.vue
│   │   │   │   └── ServiceReminder.vue
│   │   │   ├── user/
│   │   │   │   ├── UserProfileCard.vue
│   │   │   │   └── UserStatusBadge.vue
│   │   │   ├── admin/
│   │   │   │   ├── ClientListTable.vue
│   │   │   │   ├── WorkerAssignCard.vue
│   │   │   │   └── RevenueStatCard.vue
│   │   │   └── worker/
│   │   │       ├── RouteCard.vue
│   │   │       ├── CollectionStatusCard.vue
│   │   │       └── ClientChecklistItem.vue
│   │   │
│   │   └── layout/                     # Structural wrappers
│   │       ├── AppHeader.vue
│   │       ├── AppSidebar.vue
│   │       ├── AppBottomNav.vue        # Mobile nav
│   │       ├── PortalLayout.vue        # Wraps each portal
│   │       ├── PageHeader.vue
│   │       └── SectionDivider.vue
│   │
│   ├── composables/                    # Reusable logic (Vue 3 Composition API)
│   │   ├── usePayment.ts
│   │   ├── useNotifications.ts
│   │   ├── useDebt.ts
│   │   ├── useAuth.ts
│   │   ├── useLocale.ts
│   │   ├── useToast.ts
│   │   └── useModal.ts
│   │
│   ├── stores/                         # Pinia state management
│   │   ├── auth.store.ts
│   │   ├── payment.store.ts
│   │   ├── notification.store.ts
│   │   ├── user.store.ts
│   │   └── ui.store.ts
│   │
│   ├── views/
│   │   ├── user/
│   │   │   ├── UserDashboard.vue
│   │   │   ├── UserPayments.vue
│   │   │   ├── UserHistory.vue
│   │   │   └── UserProfile.vue
│   │   ├── admin/
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── AdminClients.vue
│   │   │   ├── AdminWorkers.vue
│   │   │   └── AdminReports.vue
│   │   ├── worker/
│   │   │   ├── WorkerDashboard.vue
│   │   │   ├── WorkerRoutes.vue
│   │   │   └── WorkerCollection.vue
│   │   └── auth/
│   │       ├── LoginView.vue
│   │       ├── RegisterView.vue
│   │       └── ForgotPassword.vue
│   │
│   ├── router/
│   │   ├── index.ts
│   │   ├── user.routes.ts
│   │   ├── admin.routes.ts
│   │   ├── worker.routes.ts
│   │   └── guards.ts                   # Auth & portal guards
│   │
│   ├── i18n/
│   │   ├── index.ts                    # vue-i18n setup
│   │   └── locales/
│   │       ├── en.ts
│   │       ├── fr.ts
│   │       ├── rw.ts
│   │       └── sw.ts
│   │
│   ├── api/
│   │   ├── client.ts                   # Axios instance + interceptors
│   │   ├── payment.api.ts
│   │   ├── user.api.ts
│   │   ├── notification.api.ts
│   │   └── admin.api.ts
│   │
│   ├── types/
│   │   ├── payment.types.ts
│   │   ├── user.types.ts
│   │   ├── notification.types.ts
│   │   └── portal.types.ts
│   │
│   └── utils/
│       ├── currency.ts                 # Format RWF amounts
│       ├── date.ts                     # Week/date helpers
│       ├── validation.ts               # Zod schemas
│       └── ban-check.ts               # Ban logic util
│
├── .env
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. CSS Strategy: CSS Custom Properties (No Framework)

**Decision: Vanilla CSS variables + scoped Vue `<style>` blocks**

**Rationale:**
- No build-time dependency on Tailwind compiler
- Full token control — every value meaningful, nothing generated
- Vue's `<style scoped>` prevents leakage natively
- Works perfectly with SSR if added later
- Easier for multilingual/RTL support later

**Rules:**

```css
/* ✅ Correct */
.my-button {
  background-color: var(--color-primary-500);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  transition: background-color var(--duration-fast) var(--ease-default);
}

/* ❌ Never do this */
.my-button {
  background-color: #22c55e;   /* hardcoded */
  padding: 12px 24px;          /* magic numbers */
  border-radius: 8px;          /* not a token */
}
```

---

## 6. Consistency Rules (Enforced Team Standards)

### Rule 1: No Inline Styles
```vue
<!-- ✅ -->
<BaseButton variant="primary" size="lg" />

<!-- ❌ -->
<button style="background: green; padding: 12px">Pay</button>
```

### Rule 2: No Hardcoded Colors
All colors via `var(--color-*)` tokens only.

### Rule 3: Component Variants Only
Components expose a `variant` prop. Never override internals from parent.
```vue
<!-- ✅ -->
<BaseBadge variant="danger">Banned</BaseBadge>

<!-- ❌ -->
<BaseBadge class="red-override">Banned</BaseBadge>
```

### Rule 4: Spacing Tokens Only
```css
/* ✅ */ margin-top: var(--space-4);
/* ❌ */ margin-top: 16px;
```

### Rule 5: i18n for All Visible Text
```vue
<!-- ✅ -->
<p>{{ $t('dashboard.debtMessage') }}</p>

<!-- ❌ -->
<p>You owe RWF 5,000</p>
```

### Rule 6: Currency Through Utility
```ts
// ✅ utils/currency.ts
formatCurrency(5000, 'RWF') // → "RWF 5,000"

// ❌ Never inline
`RWF ${amount}`
```

### Rule 7: All Amounts in Monospace
```vue
<span class="amount">{{ formatCurrency(debt) }}</span>
```
`.amount` uses `--font-mono` globally.

### Rule 8: Portal-Scoped Root Class
Each portal wraps in a portal root class to allow easy portal-specific overrides:
```html
<div class="portal-user">...</div>
<div class="portal-admin">...</div>
<div class="portal-worker">...</div>
```

---

## 7. UI States Matrix

| Component | Default | Hover | Focus | Active | Loading | Disabled | Error |
|---|---|---|---|---|---|---|---|
| Button | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| Input | ✅ | — | ✅ | — | — | ✅ | ✅ |
| Card | ✅ | optional | — | — | ✅ | — | — |
| Table Row | ✅ | ✅ | — | ✅ | ✅ | — | — |
| PaymentCard | ✅ | — | — | — | — | — | ✅ |
| DebtBanner | warning | — | — | — | — | — | danger |

---

## 8. Portal Color Branding

Each portal gets a CSS class on `<body>` or portal wrapper, allowing accent overrides:

```css
.portal-user   { --portal-accent: var(--color-primary-500); }   /* Blue   */
.portal-admin  { --portal-accent: #7c3aed; }                     /* Violet */
.portal-worker { --portal-accent: #f59e0b; }                     /* Amber  */
```

Sidebar active states, button primaries, and header strips use `var(--portal-accent)` so each portal feels visually distinct while sharing the same base component library.

---

## 9. Responsive Breakpoints

```css
:root {
  --bp-sm:  480px;
  --bp-md:  768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}

/* Usage in components */
@media (max-width: 768px) {
  /* Mobile: bottom nav replaces sidebar */
}
```

**Layout Strategy:**
- Mobile (< 768px): Bottom tab navigation, bottom sheets for modals, full-width cards
- Tablet (768–1024px): Collapsible sidebar, 2-column grids
- Desktop (> 1024px): Fixed sidebar, 3-column dashboard grids

---

## 10. Key Domain Logic — Design Implications

| Business Rule | UI Component Needed |
|---|---|
| Weekly payment cycle | `BaseWeekSelector` + calendar indicator |
| Upcoming payment notification | `ServiceReminder` banner / push badge |
| In-app payment | `PaymentConfirmModal` + `BasePinInput` |
| Debt display | `DebtBanner` always visible on dashboard |
| Multi-week payment | `WeekSelector` with checkboxes + total summary |
| Multi-lingual | `BaseLanguageSwitcher` in header + `vue-i18n` |
| 10-payment history | `PaymentHistoryTable` (paginated, max 10 rows) |
| Ban at 2 months unpaid | `BanWarningCard` (danger state with countdown) |

---

## 11. Recommended Libraries

| Purpose | Library |
|---|---|
| State Management | `pinia` |
| Routing | `vue-router` |
| Internationalization | `vue-i18n` |
| HTTP Client | `axios` |
| Form Validation | `vee-validate` + `zod` |
| Icons | `@iconify/vue` (Phosphor set) |
| Date Handling | `date-fns` |
| Animations | `@vueuse/motion` |
| Notifications/Toast | Custom `useToast()` composable |
| Testing | `vitest` + `@vue/test-utils` |

---

## 12. File Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Vue Components | PascalCase | `BaseButton.vue` |
| Composables | camelCase + `use` prefix | `usePayment.ts` |
| Stores | camelCase + `.store` | `payment.store.ts` |
| API modules | camelCase + `.api` | `payment.api.ts` |
| Type files | camelCase + `.types` | `payment.types.ts` |
| CSS files | kebab-case | `tokens.css` |
| i18n locale | lowercase ISO code | `rw.ts` |

---

*End of WasteWise Design System v1.1 — Blue & White*
*Ready for developer handoff — proceed to component implementation.*
