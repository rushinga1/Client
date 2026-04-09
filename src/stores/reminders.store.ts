import { defineStore } from 'pinia'

export interface Reminder {
  id: string
  title: string
  description: string
  date: string
  type: 'payment' | 'collection'
  recurring?: boolean
  priority?: 'low' | 'medium' | 'high'
}

export const useRemindersStore = defineStore('reminders', {
  state: () => {
    const savedReminders = localStorage.getItem('agruni_reminders')
    return {
      reminders: savedReminders ? JSON.parse(savedReminders) : [
        {
          id: '1',
          title: 'Monthly Waste Fee',
          description: 'Payment for April 2026 waste collection services.',
          date: '2026-04-10',
          type: 'payment',
          recurring: true,
          priority: 'high'
        },
        {
          id: '2',
          title: 'Waste Collection Day',
          description: 'AGRUNI team will be in your area for collection.',
          date: '2026-04-12',
          type: 'collection',
          recurring: true,
          priority: 'medium'
        }
      ] as Reminder[],
      isLoading: false
    }
  },

  actions: {
    saveToStorage() {
      localStorage.setItem('agruni_reminders', JSON.stringify(this.reminders))
    },

    addReminder(reminder: Omit<Reminder, 'id'>) {
      const id = Math.random().toString(36).substr(2, 9)
      this.reminders.push({ ...reminder, id })
      this.saveToStorage()
    },

    updateReminder(id: string, updates: Partial<Reminder>) {
      const index = this.reminders.findIndex((r: Reminder) => r.id === id)
      if (index !== -1) {
        this.reminders[index] = { ...this.reminders[index], ...updates }
        this.saveToStorage()
      }
    },

    deleteReminder(id: string) {
      this.reminders = this.reminders.filter((r: Reminder) => r.id !== id)
      this.saveToStorage()
    },

    snoozeReminder(id: string, days: number = 1) {
      const reminder = this.reminders.find((r: Reminder) => r.id === id)
      if (reminder) {
        const date = new Date(reminder.date)
        date.setDate(date.getDate() + days)
        reminder.date = date.toISOString().split('T')[0]
        this.saveToStorage()
      }
    }
  }
})
