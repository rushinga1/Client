import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { MotionPlugin } from '@vueuse/motion'
import i18n from './i18n'
import App from './App.vue'
import './assets/styles/tokens.css'

// Import views
import WorkerDashboard from './views/worker/WorkerDashboard.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/LoginView.vue'),
      meta: {
        title: 'Sign In',
        requiresAuth: false,
        isPublic: true
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: WorkerDashboard,
      meta: {
        title: 'Dashboard',
        requiresAuth: false
      }
    },
    {
      path: '/houses',
      name: 'houses',
      component: () => import('./views/worker/HousesListView.vue'),
      meta: {
        title: 'Houses',
        requiresAuth: false
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('./views/worker/RegisterCustomerView.vue'),
      meta: {
        title: 'Register Customer',
        requiresAuth: false
      }
    },
    {
      path: '/reminders',
      name: 'reminders',
      component: () => import('./views/RemindersView.vue'),
      meta: {
        title: 'Reminders',
        requiresAuth: false
      }
    },
    {
      path: '/banned',
      name: 'banned',
      component: () => import('./views/worker/BannedHousesView.vue'),
      meta: {
        title: 'Banned Houses',
        requiresAuth: false
      }
    },
    {
      path: '/messages',
      name: 'messages',
      component: () => import('./views/worker/MessagesView.vue'),
      meta: {
        title: 'Messages',
        requiresAuth: false
      }
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('./views/worker/NotificationsView.vue'),
      meta: {
        title: 'Notifications',
        requiresAuth: false
      }
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: () => import('./views/worker/AnnouncementsView.vue'),
      meta: {
        title: 'Announcements',
        requiresAuth: false
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('./views/worker/ProfileView.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: false
      }
    },
    {
      path: '/pay',
      name: 'payment',
      component: () => import('./views/ServicePaymentView.vue'),
      meta: {
        title: 'Service Payment',
        requiresAuth: false
      }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('./views/HistoryView.vue'),
      meta: {
        title: 'Payment History',
        requiresAuth: false
      }
    },
    {
      path: '/debts',
      name: 'debts',
      component: () => import('./views/DebtsView.vue'),
      meta: {
        title: 'My Debts',
        requiresAuth: false
      }
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/SettingsView.vue'),
      meta: {
        title: 'Settings',
        requiresAuth: false
      }
    },
    {
      path: '/account',
      name: 'account',
      component: () => import('./views/AccountView.vue'),
      meta: {
        title: 'Account',
        requiresAuth: false
      }
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('./views/HelpCenterView.vue'),
      meta: {
        title: 'Help Center',
        requiresAuth: false
      }
    },
    {
      path: '/receipt',
      name: 'receipt',
      component: () => import('./views/ReceiptView.vue'),
      meta: {
        title: 'Receipt',
        requiresAuth: false
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('./views/NotFoundView.vue'),
      meta: {
        title: 'Page Not Found'
      }
    }
  ]
})

// Navigation guards
router.beforeEach(async (to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - AGRUNI Client Portal`
  }

  // Import store lazily to avoid Pinia not ready error
  const { useAuthStore } = await import('./stores/auth.store')
  const authStore = useAuthStore()

  const isPublic = to.meta.isPublic === true
  const loggedIn = authStore.isLoggedIn

  if (!isPublic && !loggedIn) {
    // Not authenticated — redirect to login
    return next({ name: 'login' })
  }

  if (isPublic && loggedIn && to.name === 'login') {
    // Already logged in — redirect away from login
    return next({ name: 'dashboard' })
  }

  next()
})

// Create app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(MotionPlugin)

// Global properties
app.config.globalProperties.$t = i18n.global.t

// Mount app
app.mount('#app')
