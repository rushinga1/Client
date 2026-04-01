import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'user' | 'admin' | 'worker'
  avatar?: string
  memberSince: string
  lastLogin?: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref('')

  // Mock user data
  const mockUsers: Record<string, User> = {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+250 788 123 456',
      role: 'user',
      memberSince: '2024-01-15'
    },
    admin: {
      id: '2',
      name: 'Admin User',
      email: 'admin@agruni.rw',
      phone: '+250 788 999 888',
      role: 'admin',
      memberSince: '2023-06-01'
    },
    worker: {
      id: '3',
      name: 'Agent Marie',
      email: 'marie@agruni.rw',
      phone: '+250 788 555 333',
      role: 'worker',
      memberSince: '2023-03-20'
    }
  }

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = ''

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock authentication (accept any email/password for demo)
      let role: 'user' | 'admin' | 'worker' = 'user'
      if (email.includes('admin')) role = 'admin'
      else if (email.includes('worker')) role = 'worker'

      const userData = mockUsers[role]
      
      user.value = {
        ...userData,
        lastLogin: new Date().toISOString()
      }

      // Persist to localStorage
      localStorage.setItem('agruni_user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = 'Login failed'
      console.error('Login error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      user.value = null
      localStorage.removeItem('agruni_user')

      return true
    } catch (err) {
      error.value = 'Logout failed'
      console.error('Logout error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!user.value) return false

    isLoading.value = true
    error.value = ''

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      user.value = { ...user.value, ...updates }
      localStorage.setItem('agruni_user', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = 'Profile update failed'
      console.error('Profile update error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = () => {
    try {
      const stored = localStorage.getItem('agruni_user')
      if (stored) {
        user.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Auth check error:', err)
      localStorage.removeItem('agruni_user')
    }
  }

  const isAuthenticated = () => {
    return !!user.value
  }

  const hasRole = (role: 'user' | 'admin' | 'worker') => {
    return user.value?.role === role
  }

  const hasPermission = (permission: string) => {
    if (!user.value) return false

    const permissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_system'],
      worker: ['read', 'write', 'manage_collections'],
      user: ['read', 'write']
    }

    return permissions[user.value.role]?.includes(permission) || false
  }

  // Initialize
  const init = () => {
    checkAuth()
  }

  return {
    // State
    user,
    isLoading,
    error,
    
    // Actions
    login,
    logout,
    updateProfile,
    checkAuth,
    init,
    
    // Getters
    isAuthenticated,
    hasRole,
    hasPermission
  }
})
