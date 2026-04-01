export default {
  // Common
  common: {
    selectAll: 'Tout sélectionner',
    clear: 'Effacer',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    edit: 'Modifier',
    view: 'Voir',
    loading: 'Chargement...',
    search: 'Rechercher',
    filter: 'Filtrer',
    sort: 'Trier',
    next: 'Suivant',
    previous: 'Précédent',
    close: 'Fermer',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    ok: 'OK',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Avertissement',
    info: 'Information'
  },

  // Navigation
  nav: {
    dashboard: 'Tableau de bord',
    payments: 'Paiements',
    history: 'Historique',
    profile: 'Profil',
    settings: 'Paramètres',
    logout: 'Déconnexion',
    login: 'Connexion',
    register: "S'inscrire"
  },

  // Dashboard
  dashboard: {
    title: 'Tableau de bord',
    welcome: 'Bon retour',
    quickPaymentHub: 'Centre de Paiement Rapide',
    serviceStatus: 'Statut du Service',
    paymentSummary: 'Résumé des Paiements',
    recentTransactions: 'Transactions Récentes',
    quickActions: 'Actions Rapides',
    trackCollection: 'Suivre la Collecte',
    viewAll: 'Voir Tout'
  },

  // Payment
  payment: {
    selectWeeks: 'Sélectionner les Semaines à Payer',
    selectedWeeks: '{count} semaine(s) sélectionnée(s)',
    totalAmount: 'Montant Total',
    weeksSelected: 'Semaines Sélectionnées',
    confirmPayment: 'Confirmer le Paiement',
    paymentSummary: 'Résumé du Paiement',
    enterPin: 'Entrer le Code PIN',
    pinHint: 'Entrez votre PIN à 6 chiffres pour confirmer le paiement',
    processing: 'Traitement...',
    confirmPay: 'Confirmer & Payer',
    payNow: 'Payer Maintenant',
    viewReceipt: 'Voir le Reçu',
    dueOn: 'Due le {date}',
    overdue: 'En retard',
    status: {
      paid: 'Payé',
      pending: 'En attente',
      overdue: 'En retard',
      upcoming: 'À venir'
    }
  },

  // Debt
  debt: {
    title: {
      default: 'Rappel de Paiement',
      warning: 'Paiement en Retard',
      danger: 'Avertissement de Suspension de Service'
    },
    owedFor: 'dû pour {count} semaine(s)',
    serviceBanWarning: 'Le service sera suspendu si le paiement n\'est pas effectué dans 7 jours'
  },

  // User
  user: {
    profile: 'Profil',
    name: 'Nom',
    email: 'Email',
    phone: 'Téléphone',
    role: 'Rôle',
    language: 'Langue',
    lastLogin: 'Dernière Connexion',
    memberSince: 'Membre Depuis'
  },

  // Roles
  roles: {
    user: 'Utilisateur',
    admin: 'Administrateur',
    worker: 'Agent de Collecte'
  },

  // Service
  service: {
    onRoute: 'En Route',
    away: 'Absent',
    distance: '{distance} km de distance',
    estimatedTime: 'Est. {time}',
    collectionStatus: 'Statut de Collecte',
    nextCollection: 'Prochaine Collecte'
  },

  // Errors
  errors: {
    networkError: 'Erreur réseau. Vérifiez votre connexion.',
    serverError: 'Erreur serveur. Réessayez plus tard.',
    invalidCredentials: 'Email ou mot de passe invalide.',
    paymentFailed: 'Paiement échoué. Réessayez.',
    insufficientFunds: 'Fonds insuffisants.',
    invalidPin: 'PIN invalide. Réessayez.',
    sessionExpired: 'Session expirée. Reconnectez-vous.',
    notFound: 'Page non trouvée.',
    accessDenied: 'Accès refusé.'
  },

  // Success messages
  success: {
    paymentProcessed: 'Paiement traité avec succès!',
    profileUpdated: 'Profil mis à jour avec succès!',
    passwordChanged: 'Mot de passe changé avec succès!',
    settingsSaved: 'Paramètres enregistrés avec succès!',
    logout: 'Déconnecté avec succès.'
  },

  // Form validation
  validation: {
    required: 'Ce champ est requis',
    email: 'Veuillez entrer une adresse email valide',
    phone: 'Veuillez entrer un numéro de téléphone valide',
    minLength: 'Doit contenir au moins {min} caractères',
    maxLength: 'Ne doit pas dépasser {max} caractères',
    passwordMatch: 'Les mots de passe doivent correspondre',
    numeric: 'Veuillez entrer un nombre valide',
    positive: 'Veuillez entrer un nombre positif'
  },

  // Date and time
  datetime: {
    today: 'Aujourd\'hui',
    yesterday: 'Hier',
    tomorrow: 'Demain',
    thisWeek: 'Cette Semaine',
    thisMonth: 'Ce Mois',
    thisYear: 'Cette Année',
    lastWeek: 'La Semaine Dernière',
    lastMonth: 'Le Mois Dernier',
    lastYear: 'L\'Année Dernière',
    ago: 'il y a {time}',
    in: 'dans {time}',
    minutes: '{count} minute',
    hours: '{count} heure',
    days: '{count} jour',
    weeks: '{count} semaine',
    months: '{count} mois',
    years: '{count} an'
  }
}
