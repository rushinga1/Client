export default {
  // Common
  common: {
    selectAll: 'Hitamo Byose',
    clear: 'Siba',
    cancel: 'Kureka',
    save: 'Bika',
    delete: 'Siba',
    edit: 'Hindura',
    view: 'Reba',
    loading: 'Irimo...',
    search: 'Shakisha',
    filter: 'Muyunguruzi',
    sort: 'Itonderanya',
    next: 'Ikurikira',
    previous: 'Ibanjirije',
    close: 'Gufunga',
    confirm: 'Emeza',
    yes: 'Yego',
    no: 'Oya',
    ok: 'Nibyo',
    error: 'Ikosa',
    success: 'Byatsindiye',
    warning: 'Iburira',
    info: 'Amakuru'
  },

  // Navigation
  nav: {
    dashboard: 'Paji Nkuru',
    payments: 'Amahurizo',
    history: 'Amateka',
    profile: 'Ibyinshi',
    settings: 'Igenamigambi',
    logout: 'Sohoka',
    login: 'Injira',
    register: 'Iyandikishe'
  },

  // Dashboard
  dashboard: {
    title: 'Paji Nkuru',
    welcome: 'Murakaza neza',
    quickPaymentHub: 'Ahantu ho Guhaha Amahurizo',
    serviceStatus: 'Imimerere Yihariye',
    paymentSummary: 'Incamake Y\'amahurizo',
    recentTransactions: 'Amahurizo Ashize',
    quickActions: 'ibikorwa byihuse',
    trackCollection: 'kubika ibikomoka',
    viewAll: 'Reba Byose'
  },

  // Payment
  payment: {
    selectWeeks: 'Hitamo Ibyumweru Uzahahuriza',
    selectedWeeks: 'Ibyumweru {count} byahisemo',
    totalAmount: 'Igiteranyo Cyose',
    weeksSelected: 'Ibyumweru Byahisemo',
    confirmPayment: 'Emeza Ihurizo',
    paymentSummary: 'Incamake Y\'ihurizo',
    enterPin: 'Injira PIN Code',
    pinHint: 'Injira PIN ya 6-ibimenyetso kugirango ukemere ihurizo',
    processing: 'Irimo...',
    confirmPay: 'Emeza & Hahurize',
    payNow: 'Hahurize Nonaha',
    viewReceipt: 'Reba Ahererekanyabwanga',
    dueOn: 'Bigaragaza {date}',
    overdue: 'Bigeze Igihe',
    status: {
      paid: 'Byahishuriwe',
      pending: 'Biteganyijwe',
      overdue: 'Bigeze Igihe',
      upcoming: 'Bizaza'
    }
  },

  // Debt
  debt: {
    title: {
      default: 'Uburumbuze Bw\'ihurizo',
      warning: 'Ihurizo Rigeze Igihe',
      danger: 'Iburira Ryo Guhera Serivisi'
    },
    owedFor: 'ibyari igihe cy\'ibyumweru {count}',
    serviceBanWarning: 'Serivisi izahagarikwa niba ihurizo ritakorwa muri make 7'
  },

  // User
  user: {
    profile: 'Ibyinshi',
    name: 'Izina',
    email: 'Imeri',
    phone: 'Telefoni',
    role: 'Inshingano',
    language: 'Ururimi',
    lastLogin: 'Injira Ya Nyuma',
    memberSince: 'Uwitwa Kuva'
  },

  // Roles
  roles: {
    user: 'Ukoresha',
    admin: 'Umuyobozi',
    worker: 'Umukozi Wa Kureka'
  },

  // Service
  service: {
    onRoute: 'Mu Murongo',
    away: 'Hanze',
    distance: 'kilometero {distance} hanze',
    estimatedTime: 'Est. {time}',
    collectionStatus: 'Imimerere Y\'ikurikiranya',
    nextCollection: 'Ikurikiranya Rizaza'
  },

  // Errors
  errors: {
    networkError: 'Ikosa ry\'urubuga. Reba koneksiyon yawe.',
    serverError: 'Ikosa rya seriveri. Ongera ugerageze.',
    invalidCredentials: 'Imeri cyangwa ijambu idahinduye.',
    paymentFailed: 'Ihurizo ryanzitse. Ongera ugerageze.',
    insufficientFunds: 'Habaye amafaranga meza.',
    invalidPin: 'PIN idahinduye. Ongera ugerageze.',
    sessionExpired: 'Igihe cy\'injira cyarangiye. Ongera winjire.',
    notFound: 'Paji ntibabonetse.',
    accessDenied: 'Ukuri kwinjira kwakennye.'
  },

  // Success messages
  success: {
    paymentProcessed: 'Ihurizo ryakozwe neza!',
    profileUpdated: 'Ibyinshi byahinduwe neza!',
    passwordChanged: 'Ijambu ryahinduwe neza!',
    settingsSaved: 'Igenamigambi byabitswe neza!',
    logout: 'Wasohotse neza.'
  },

  // Form validation
  validation: {
    required: 'Ibi ari ngombwa',
    email: 'Shakamo imeri idahinduye',
    phone: 'Shakamo numero ya telefoni idahinduye',
    minLength: 'Gira kuba ingufu zingana na {min} inyuguti',
    maxLength: 'Bitarengeje {max} inyuguti',
    passwordMatch: 'Amagambo y\'ijambu agomba kugeranya',
    numeric: 'Shakamo umubare uhagije',
    positive: 'Shakamo umubare w\'imbuto'
  },

  // Date and time
  datetime: {
    today: 'Uyu munsi',
    yesterday: 'Ejo',
    tomorrow: 'Ejebra',
    thisWeek: 'Uyu kumwe',
    thisMonth: 'Ukwezi',
    thisYear: 'Umwaka',
    lastWeek: 'Kumwe washize',
    lastMonth: 'Ukwezi washize',
    lastYear: 'Umwaka washize',
    ago: '{time} washize',
    in: 'mu {time}',
    minutes: 'iminota {count}',
    hours: 'amasaha {count}',
    days: 'iminsi {count}',
    weeks: 'ibyumweru {count}',
    months: 'amezi {count}',
    years: 'imyaka {count}'
  }
}
