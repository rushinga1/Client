import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export function useToast() {
  const toasts = ref<Toast[]>([])

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString()
    const newToast: Toast = {
      id,
      duration: 5000,
      persistent: false,
      ...toast
    }

    toasts.value.push(newToast)

    // Auto-remove after duration (unless persistent)
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const clearAllToasts = () => {
    toasts.value = []
  }

  const success = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'success', ...options })
  }

  const error = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'error', duration: 8000, ...options })
  }

  const warning = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'warning', ...options })
  }

  const info = (message: string, options?: Partial<Omit<Toast, 'id' | 'message' | 'type'>>) => {
    return addToast({ message, type: 'info', ...options })
  }

  const persistent = (message: string, type: Toast['type'], options?: Partial<Omit<Toast, 'id' | 'message' | 'type' | 'persistent'>>) => {
    return addToast({ message, type, persistent: true, ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
    persistent
  }
}
