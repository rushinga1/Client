export default {
  // Common
  common: {
    selectAll: 'Chagua Zote',
    clear: 'Futa',
    cancel: 'Ghairi',
    save: 'Hifadhi',
    delete: 'Futa',
    edit: 'Hariri',
    view: 'Ona',
    loading: 'Inapakia...',
    search: 'Tafuta',
    filter: 'Chuja',
    sort: 'Panga',
    next: 'Ifuatayo',
    previous: 'Iliyopita',
    close: 'Funga',
    confirm: 'Thibitisha',
    yes: 'Ndiyo',
    no: 'Hapana',
    ok: 'Sawa',
    error: 'Kosa',
    success: 'Mafanikio',
    warning: 'Onyo',
    info: 'Taarifa'
  },

  // Navigation
  nav: {
    dashboard: 'Dashibodi',
    payments: 'Malipo',
    history: 'Historia',
    profile: 'Wasifu',
    settings: 'Mipangilio',
    logout: 'Toka',
    login: 'Ingia',
    register: 'Jisajili'
  },

  // Dashboard
  dashboard: {
    title: 'Dashibodi',
    welcome: 'Karibu tena',
    quickPaymentHub: 'Kituo cha Malipo ya Haraka',
    serviceStatus: 'Hali ya Huduma',
    paymentSummary: 'Muhtasari wa Malipo',
    recentTransactions: 'Miamala ya Karibuni',
    quickActions: 'Vitendo vya Haraka',
    trackCollection: 'Fuatilia Ukusanyaji',
    viewAll: 'Ona Zote'
  },

  // Payment
  payment: {
    selectWeeks: 'Chagua Wiki za Kulipa',
    selectedWeeks: 'Wiki {count} zimechaguliwa',
    totalAmount: 'Jumla Kuu',
    weeksSelected: 'Wiki Zilizochaguliwa',
    confirmPayment: 'Thibitisha Malipo',
    paymentSummary: 'Muhtasari wa Malipo',
    enterPin: 'Ingia Nambari ya PIN',
    pinHint: 'Ingia PIN yako ya tarakimu 6 kuthibitisha malipo',
    processing: 'Inashughulikiwa...',
    confirmPay: 'Thibitisha & Lipa',
    payNow: 'Lipa Sasa',
    viewReceipt: 'Ona Risiti',
    dueOn: 'Inaendeshwa {date}',
    overdue: 'Imechelewa',
    status: {
      paid: 'Imelipwa',
      pending: 'Inasubiri',
      overdue: 'Imechelewa',
      upcoming: 'Inakuja'
    }
  },

  // Debt
  debt: {
    title: {
      default: 'Kumbukumbu ya Malipo',
      warning: 'Malipo Yamechelewa',
      danger: 'Onyo la Kusitisha Huduma'
    },
    owedFor: 'inayodaiwa kwa wiki {count}',
    serviceBanWarning: 'Huduma itasitishwa ikiwa malipo hayafanyiwiki 7 zijazo'
  },

  // User
  user: {
    profile: 'Wasifu',
    name: 'Jina',
    email: 'Barua pepe',
    phone: 'Simu',
    role: 'Jukumu',
    language: 'Lugha',
    lastLogin: 'Kuinga Mwisho',
    memberSince: 'Mwanachama Tangu'
  },

  // Roles
  roles: {
    user: 'Mtumiaji',
    admin: 'Meneja',
    worker: 'Mkusanyiko'
  },

  // Service
  service: {
    onRoute: 'Njiani',
    away: 'Nje',
    distance: 'kilomita {distance} mbali',
    estimatedTime: 'Kadir. {time}',
    collectionStatus: 'Hali ya Ukusanyaji',
    nextCollection: 'Ukusanyaji Ujao'
  },

  // Errors
  errors: {
    networkError: 'Kosa la mtandao. Tafuta muunganisho wako.',
    serverError: 'Kosa la seva. Jaribu tena baadaye.',
    invalidCredentials: 'Barua pepe au nywila sio sahihi.',
    paymentFailed: 'Malipo yameshindwa. Jaribu tena.',
    insufficientFunds: 'Kuna pesa za kutosha.',
    invalidPin: 'PIN sio sahihi. Jaribu tena.',
    sessionExpired: 'Kipindi kimeisha. Ingia tena.',
    notFound: 'Ukurasa haukupatikana.',
    accessDenied: 'Ruhusu imekataliwa.'
  },

  // Success messages
  success: {
    paymentProcessed: 'Malipo yameshindilika vizuri!',
    profileUpdated: 'Wasifu umesasishwa vizuri!',
    passwordChanged: 'Nywila imebadilishwa vizuri!',
    settingsSaved: 'Mipangilio imehifadhiwa vizuri!',
    logout: 'Umetoka vizuri!'
  },

  // Form validation
  validation: {
    required: 'Sehemu hii inahitajika',
    email: 'Tafuta anwani sahihi ya barua pepe',
    phone: 'Tafuta nambari sahihi ya simu',
    minLength: 'Lazima iwe na herufi {min} chini zaidi',
    maxLength: 'Isizidi herufi {max}',
    passwordMatch: 'Nywila lazima zilingane',
    numeric: 'Tafuta namba sahihi',
    positive: 'Tafuta namba chanya'
  },

  // Date and time
  datetime: {
    today: 'Leo',
    yesterday: 'Jana',
    tomorrow: 'Kesho',
    thisWeek: 'Wiki Hii',
    thisMonth: 'Mwezi Huu',
    thisYear: 'Mwaka Huu',
    lastWeek: 'Wiki Ilipita',
    lastMonth: 'Mwezi Uliopita',
    lastYear: 'Mwaka Uliopita',
    ago: '{time} iliyopita',
    in: 'ndani ya {time}',
    minutes: 'dakika {count}',
    hours: 'saa {count}',
    days: 'siku {count}',
    weeks: 'wiki {count}',
    months: 'miezi {count}',
    years: 'miaka {count}'
  }
}
