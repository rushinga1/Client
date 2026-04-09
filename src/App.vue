<template>
  <div class="app-root">
    <template v-if="isPublicRoute">
      <!-- Public pages (Login) — no sidebar/header -->
      <router-view />
    </template>
    <template v-else>
      <!-- Authenticated app layout -->
      <AppLayout>
        <router-view />
      </AppLayout>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.store'
import { useUIStore } from './stores/ui.store'
import AppLayout from './components/layout/AppLayout.vue'

// Stores
const authStore = useAuthStore()
const uiStore = useUIStore()
const route = useRoute()

const isPublicRoute = computed(() => route.meta?.isPublic === true)

// Initialize app
onMounted(() => {
  // Initialize auth state
  authStore.init()
  
  // Initialize responsive behavior
  const cleanup = uiStore.initResponsive()
  
  // Cleanup on unmount
  return cleanup
})
</script>

<style>
/* Reset and base styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

html,
body {
  height: 100%;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

#root {
  isolation: isolate;
  height: 100%;
}

/* Global styles */
#app {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
  background: #f8fafc;
}

/* Scrollbar styles */
/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
}

::-webkit-scrollbar-thumb {
  background: var(--color-neutral-300);
  border-radius: var(--radius-full);
  transition: background var(--duration-fast) var(--ease-default);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-neutral-400);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  html {
    color-scheme: dark;
  }

  ::-webkit-scrollbar-track {
    background: var(--color-neutral-800);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--color-neutral-600);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--color-neutral-500);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --color-border-default: var(--color-neutral-400);
    --color-border-strong: var(--color-neutral-500);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* Print styles */
@media print {
  *,
  *::before,
  *::after {
    background: transparent !important;
    color: black !important;
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  a,
  a:visited {
    text-decoration: underline;
  }
  
  a[href]:after {
    content: " (" attr(href) ")";
  }
  
  abbr[title]:after {
    content: " (" attr(title) ")";
  }
  
  pre,
  blockquote {
    border: 1px solid #999;
    page-break-inside: avoid;
  }
  
  thead {
    display: table-header-group;
  }
  
  tr,
  img {
    page-break-inside: avoid;
  }
  
  img {
    max-width: 100% !important;
  }
  
  p,
  h2,
  h3 {
    orphans: 3;
    widows: 3;
  }
  
  h2,
  h3 {
    page-break-after: avoid;
  }
}

/* Portal-specific styles */
.portal-user {
  --portal-accent: var(--color-portal-user);
}

.portal-admin {
  --portal-accent: var(--color-portal-admin);
}

.portal-worker {
  --portal-accent: var(--color-portal-worker);
}

/* App state styles */

.app--dark {
  /* Dark mode styles */
  color-scheme: dark;
}

/* Utility classes */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary-600);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  border-radius: var(--radius-md);
  z-index: var(--z-raised);
  transition: top var(--duration-fast) var(--ease-default);
}

.skip-link:focus {
  top: 6px;
}

/* Loading states */
.loading {
  pointer-events: none;
  opacity: 0.6;
}

.loading * {
  pointer-events: none;
}

/* Error states */
.error {
  color: var(--color-danger);
  border-color: var(--color-danger);
}

/* Success states */
.success {
  color: var(--color-success);
  border-color: var(--color-success);
}

/* Warning states */
.warning {
  color: var(--color-warning);
  border-color: var(--color-warning);
}
</style>
