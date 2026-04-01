export default {
  // Common
  common: {
    selectAll: 'Select All',
    clear: 'Clear',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    loading: 'Loading...',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    payments: 'Payments',
    history: 'History',
    profile: 'Profile',
    settings: 'Settings',
    logout: 'Logout',
    login: 'Login',
    register: 'Register'
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    welcomeGreeting: 'Muraho, {name}',
    overviewToday: "Here's your overview for today — {date}",
    quickPaymentHub: 'Quick Payment Hub',
    serviceStatus: 'Service Status',
    paymentSummary: 'Payment Summary',
    recentTransactions: 'Recent Transactions',
    recentPayments: 'Recent Payments',
    quickActions: 'Quick Actions',
    trackCollection: 'Track Collection',
    viewAll: 'View All',
    totalCustomers: 'Total Customers',
    paidThisWeek: 'Paid This Week',
    unpaidThisWeek: 'Unpaid This Week',
    bannedHouses: 'Banned Houses',
    paid: 'Paid',
    unpaid: 'Unpaid',
    allTime: 'All time',
    thisWeek: 'This Week',
    thisMonth: 'This month',
    vsLastWeek: 'vs last week',
    warningZone: '{count} customers are in the warning zone and approaching ban status.',
    weeksUnpaid: '{count} weeks unpaid',
    sendReminder: 'Remind',
    viewAllCustomers: 'View all {count} customers',
    registerCustomer: 'Register Customer',
    addNewHousehold: 'Add new household',
    viewHouses: 'View Houses',
    checkPaymentStatus: 'Check payment status',
    viewReminders: 'View Reminders',
    pendingWarnings: '{count} pending warnings',
    sendAnnouncement: 'Send Announcement',
    notifyCustomers: 'Notify customers',
    paymentByCategory: 'Payment by Category',
    weeklyCollections: "This Week's Collections",
    noCashNotice: 'All payments are processed digitally via MoMo or bank transfer.',
    noCashStrong: 'Do not accept cash payments.',
    syncedJustNow: 'Synced just now',
    syncedAgo: 'Synced {minutes} min ago',
    syncing: 'Syncing...',
    syncFailed: 'Sync failed — tap to retry'
  },

  // Payment
  payment: {
    selectWeeks: 'Select Weeks to Pay',
    selectedWeeks: '{count} weeks selected',
    totalAmount: 'Total Amount',
    weeksSelected: 'Weeks Selected',
    confirmPayment: 'Confirm Payment',
    paymentSummary: 'Payment Summary',
    enterPin: 'Enter PIN Code',
    pinHint: 'Enter your 6-digit PIN to confirm payment',
    processing: 'Processing...',
    confirmPay: 'Confirm & Pay',
    payNow: 'Pay Now',
    viewReceipt: 'View Receipt',
    dueOn: 'Due on {date}',
    overdue: 'Overdue',
    status: {
      paid: 'Paid',
      pending: 'Pending',
      overdue: 'Overdue',
      upcoming: 'Upcoming'
    }
  },

  // Debt
  debt: {
    title: {
      default: 'Payment Reminder',
      warning: 'Payment Overdue',
      danger: 'Service Suspension Warning'
    },
    owedFor: 'owed for {count} week(s)',
    serviceBanWarning: 'Service will be suspended if payment is not made within 7 days'
  },

  // User
  user: {
    profile: 'Profile',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    language: 'Language',
    lastLogin: 'Last Login',
    memberSince: 'Member Since'
  },

  // Roles
  roles: {
    user: 'User',
    admin: 'Administrator',
    worker: 'Collection Agent'
  },

  // Service
  service: {
    onRoute: 'On Route',
    away: 'Away',
    distance: '{distance} km away',
    estimatedTime: 'Est. {time}',
    collectionStatus: 'Collection Status',
    nextCollection: 'Next Collection'
  },

  // Errors
  errors: {
    networkError: 'Network error. Please check your connection.',
    serverError: 'Server error. Please try again later.',
    invalidCredentials: 'Invalid email or password.',
    paymentFailed: 'Payment failed. Please try again.',
    insufficientFunds: 'Insufficient funds.',
    invalidPin: 'Invalid PIN. Please try again.',
    sessionExpired: 'Session expired. Please login again.',
    notFound: 'Page not found.',
    accessDenied: 'Access denied.'
  },

  // Success messages
  success: {
    paymentProcessed: 'Payment processed successfully!',
    profileUpdated: 'Profile updated successfully!',
    passwordChanged: 'Password changed successfully!',
    settingsSaved: 'Settings saved successfully!',
    logout: 'Logged out successfully.'
  },

  // Form validation
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
    passwordMatch: 'Passwords must match',
    numeric: 'Please enter a valid number',
    positive: 'Please enter a positive number'
  },

  // Date and time
  datetime: {
    today: 'Today',
    yesterday: 'Yesterday',
    tomorrow: 'Tomorrow',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    thisYear: 'This Year',
    lastWeek: 'Last Week',
    lastMonth: 'Last Month',
    lastYear: 'Last Year',
    ago: '{time} ago',
    in: 'in {time}',
    minutes: '{count} minute',
    hours: '{count} hour',
    days: '{count} day',
    weeks: '{count} week',
    months: '{count} month',
    years: '{count} year'
  }
}
