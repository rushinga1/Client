<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <AppSidebar :class="{ 'sidebar--mobile-open': isMobileMenuOpen }" />

    <!-- Main Content Area -->
    <div class="main-content" :class="{ 'main-content--collapsed': sidebarCollapsed }">
      <!-- Header -->
      <AppHeader @toggle-mobile="toggleMobileMenu" />

      <!-- Page Content -->
      <main class="page-content">
        <div class="content-wrapper">
          <!-- Page Header -->
          <div class="page-header">
            <div class="page-header-content">
              <div class="page-title-section">
                <h1 class="page-title">{{ pageTitle }}</h1>
                <p v-if="pageSubtitle" class="page-subtitle">{{ pageSubtitle }}</p>
              </div>
              <div class="page-actions">
                <slot name="page-actions"></slot>
              </div>
            </div>
            
            <!-- Breadcrumb -->
            <nav v-if="breadcrumbs.length > 0" class="breadcrumb-nav">
              <ol class="breadcrumb-list">
                <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
                  <router-link 
                    v-if="crumb.to" 
                    :to="crumb.to" 
                    class="breadcrumb-link"
                  >
                    {{ crumb.label }}
                  </router-link>
                  <span v-else class="breadcrumb-text">{{ crumb.label }}</span>
                  <Icon 
                    v-if="index < breadcrumbs.length - 1" 
                    icon="ph:caret-right" 
                    class="breadcrumb-separator"
                  />
                </li>
              </ol>
            </nav>
          </div>

          <!-- Page Content -->
          <div class="page-body">
            <slot></slot>
          </div>
        </div>
      </main>
    </div>

    <!-- Mobile Overlay -->
    <Transition name="fade">
      <div 
        v-if="isMobileMenuOpen" 
        class="mobile-overlay" 
        @click="closeMobileMenu"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { Icon } from '@iconify/vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

interface Breadcrumb {
  label: string
  to?: string
}

const route = useRoute()
const isMobileMenuOpen = ref(false)
const sidebarCollapsed = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Page metadata
const pageTitle = computed(() => {
  const title = route.meta?.title as string
  return title || 'Dashboard'
})

const pageSubtitle = computed(() => {
  return route.meta?.subtitle as string
})

const breadcrumbs = computed<Breadcrumb[]>(() => {
  const crumbs: Breadcrumb[] = [
    { label: 'Home', to: '/dashboard' }
  ]
  
  const pathSegments = route.path.split('/').filter(Boolean)
  let currentPath = ''
  
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const label = segment.charAt(0).toUpperCase() + segment.slice(1)
    crumbs.push({
      label,
      to: currentPath === route.path ? undefined : currentPath
    })
  })
  
  return crumbs
})

// Methods
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Lifecycle
onMounted(() => {
  // Add any initialization logic here
})

onUnmounted(() => {
  // Cleanup logic here
})
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

/* Main Content Area */
.main-content {
  flex: 1;
  margin-left: 272px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-content--collapsed {
  margin-left: 76px;
}

/* Page Content */
.page-content {
  flex: 1;
  padding-top: 72px; /* Header height */
  overflow-y: auto;
}

.content-wrapper {
  padding: 16px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Page Header */
.page-header {
  margin-bottom: 16px;
}

.page-header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.page-title-section {
  flex: 1;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* Breadcrumb */
.breadcrumb-nav {
  margin-top: 16px;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-link {
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: #3b82f6;
}

.breadcrumb-text {
  color: #1e293b;
  font-size: 14px;
  font-weight: 500;
}

.breadcrumb-separator {
  color: #cbd5e1;
  width: 16px;
  height: 16px;
}

/* Page Body */
.page-body {
  min-height: 400px;
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 24px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .page-actions {
    justify-content: flex-start;
  }
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
  
  .mobile-overlay {
    display: block;
  }
  
  .breadcrumb-list {
    flex-wrap: wrap;
  }
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-header {
    margin-bottom: 24px;
  }
  
  .page-actions {
    flex-wrap: wrap;
    gap: 8px;
  }
}
</style>
