import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarCollapsed = ref(false)
  const isMobile = ref(false)
  const toasts = ref<Array<{
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    persistent?: boolean
  }>>([])
  const isLoading = ref(false)
  const currentPage = ref('dashboard')
  const theme = ref<'light' | 'dark'>('light')

  // Actions
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
  }

  const setMobile = (mobile: boolean) => {
    isMobile.value = mobile
  }

  const addToast = (toast: {
    id: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    persistent?: boolean
  }) => {
    toasts.value.push(toast)
    
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)
    }
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearToasts = () => {
    toasts.value = []
  }

  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  const setCurrentPage = (page: string) => {
    currentPage.value = page
  }

  const setTheme = (newTheme: 'light' | 'dark') => {
    theme.value = newTheme
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  // Initialize responsive behavior
  const initResponsive = () => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setMobile(mobile)
      
      if (mobile) {
        setSidebarCollapsed(true)
      }
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  return {
    // State
    sidebarCollapsed,
    isMobile,
    toasts,
    isLoading,
    currentPage,
    theme,
    
    // Actions
    toggleSidebar,
    setSidebarCollapsed,
    setMobile,
    addToast,
    removeToast,
    clearToasts,
    setLoading,
    setCurrentPage,
    setTheme,
    toggleTheme,
    initResponsive
  }
})
