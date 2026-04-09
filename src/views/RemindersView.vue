<template>
  <div class="reminders-view">
    <div class="view-header">
      <div class="header-main-card">
        <div class="header-info-section">
          <div class="header-icon-box">
            <Icon icon="ph:bell-ringing-bold" class="header-main-icon" />
          </div>
          <div class="header-content">
            <div class="title-row">
              <h1 class="view-title">Upcoming Reminders</h1>
              <div class="reminders-badge">
                <Icon icon="ph:calendar-check" />
                <span>Active Schedule</span>
              </div>
            </div>
            <p class="view-description">
              Manage your upcoming waste collection days and service payment deadlines. 
              Snooze or reschedule tasks to stay on track.
            </p>
          </div>
        </div>

        <div class="header-actions-section">
          <div class="filter-controls">
            <div class="filter-pills">
              <button 
                v-for="type in filterTypes" 
                :key="type.id"
                :class="['filter-pill', { active: currentFilter === type.id }]"
                @click="currentFilter = type.id"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="action-divider"></div>
          <div class="view-actions">
            <BaseButton variant="primary" size="sm" iconLeft="ph:plus-bold" @click="openAddReminder">
              Add Reminder
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content List -->
    <div class="reminders-container">
      <div v-if="filteredReminders.length > 0" class="reminders-grid">
        <div 
          v-for="reminder in filteredReminders" 
          :key="reminder.id" 
          :class="['reminder-card', { editing: isEditing && editingId === reminder.id && showFormModal }]"
          v-motion-slide-up
        >
          <div class="card-left">
            <div :class="['date-pill', reminder.type]">
              <span class="date-day">{{ formatDate(reminder.date, 'D') }}</span>
              <span class="date-month">{{ formatDate(reminder.date, 'MMM') }}</span>
            </div>
          </div>
          
          <div class="card-main">
            <div class="card-header">
              <div :class="['category-tag', reminder.type]">
                <Icon :icon="getCategoryIcon(reminder.type)" />
                <span>{{ reminder.type }}</span>
              </div>
              <div v-if="reminder.recurring" class="recurring-tag">
                <Icon icon="ph:arrows-clockwise" />
              </div>
            </div>
            
            <h3 class="reminder-title">{{ reminder.title }}</h3>
            <p class="reminder-desc">{{ reminder.description }}</p>
            
            <div class="reminder-actions">
              <button class="action-btn" title="Edit" @click="handleEdit(reminder)">
                <Icon icon="ph:pencil-simple" />
              </button>
              <button class="action-btn" title="Snooze" @click="handleSnooze(reminder)">
                <Icon icon="ph:clock-afternoon" />
              </button>
              <div class="action-spacer"></div>
              <button class="action-btn action-btn--danger" title="Delete" @click="confirmDelete(reminder)">
                <Icon icon="ph:trash" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state-card" v-motion-fade>
        <div class="empty-illustration">
          <div class="illustration-circle">
            <Icon icon="ph:shooting-star" class="star-icon" />
            <Icon icon="ph:bell-slash-light" class="bell-icon" />
          </div>
        </div>
        <h2 class="empty-title">All caught up!</h2>
        <p class="empty-desc">You don't have any upcoming reminders. We'll notify you when something needs your attention.</p>
        <BaseButton variant="outline" size="md" @click="currentFilter = 'all'">
          Clear Filters
        </BaseButton>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Delete Reminder"
      size="sm"
    >
      <div class="delete-confirm-body">
        <div class="warning-icon-box">
          <Icon icon="ph:warning-circle-bold" />
        </div>
        <h3>Are you sure?</h3>
        <p>This will permanently remove the <strong>{{ reminderToDelete?.title }}</strong> reminder. You cannot undo this action.</p>
      </div>
      
      <template #footer>
        <div class="modal-footer-actions">
          <BaseButton variant="ghost" @click="showDeleteModal = false">Cancel</BaseButton>
          <BaseButton variant="danger" @click="executeDelete">Delete Reminder</BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Add/Edit Reminder Modal -->
    <BaseModal
      v-model="showFormModal"
      :title="isEditing ? 'Edit Reminder' : 'Add New Reminder'"
      size="md"
    >
      <form class="reminder-form" @submit.prevent="handleSave">
        <div class="form-grid">
          <BaseInput
            v-model="form.title"
            label="Title"
            placeholder="e.g. Monthly Waste Fee"
            required
            :error="formErrors.title"
          />
          
          <div class="form-row">
            <BaseInput
              v-model="form.date"
              label="Schedule Date"
              type="date"
              required
              :error="formErrors.date"
            />
            
            <div class="base-select-wrapper">
              <label class="select-label">Category</label>
              <div class="select-container">
                <select v-model="form.type" class="premium-select">
                  <option value="payment">Payment</option>
                  <option value="collection">Collection</option>
                </select>
                <Icon icon="ph:caret-down" class="select-chevron" />
              </div>
            </div>
          </div>

          <BaseInput
            v-model="form.description"
            label="Description (Optional)"
            placeholder="Additional details about this reminder..."
          />

          <div class="checkbox-wrapper" @click="form.recurring = !form.recurring">
            <div :class="['custom-checkbox', { checked: form.recurring }]">
              <Icon v-if="form.recurring" icon="ph:check-bold" />
            </div>
            <span>Recurring every month</span>
          </div>
        </div>
      </form>
      
      <template #footer>
        <div class="modal-footer-actions">
          <BaseButton variant="ghost" @click="showFormModal = false">Cancel</BaseButton>
          <BaseButton variant="primary" @click="handleSave">
            {{ isEditing ? 'Save Changes' : 'Create Reminder' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Icon } from '@iconify/vue'
import { useRemindersStore, type Reminder } from '../stores/reminders.store'
import BaseButton from '../components/base/BaseButton.vue'
import BaseModal from '../components/base/BaseModal.vue'
import BaseInput from '../components/base/BaseInput.vue'

const reminderStore = useRemindersStore()

// State
const currentFilter = ref('all')
const showDeleteModal = ref(false)
const showFormModal = ref(false)
const isEditing = ref(false)
const editingId = ref<string | null>(null)
const reminderToDelete = ref<Reminder | null>(null)

// Form State
const form = reactive({
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  type: 'payment' as 'payment' | 'collection',
  recurring: false
})

const formErrors = reactive({
  title: '',
  date: ''
})

const filterTypes = [
  { id: 'all', label: 'All' },
  { id: 'payment', label: 'Payments' },
  { id: 'collection', label: 'Collections' }
]

// Computed
const filteredReminders = computed(() => {
  if (currentFilter.value === 'all') return reminderStore.reminders
  return (reminderStore.reminders as Reminder[]).filter((r: Reminder) => r.type === currentFilter.value)
})

// Methods
const formatDate = (dateStr: string, format: 'D' | 'MMM') => {
  const date = new Date(dateStr)
  if (format === 'D') return date.getDate()
  return date.toLocaleString('default', { month: 'short' }).toUpperCase()
}

const getCategoryIcon = (type: string) => {
  return type === 'payment' ? 'ph:wallet' : 'ph:truck'
}

const resetForm = () => {
  form.title = ''
  form.description = ''
  form.date = new Date().toISOString().split('T')[0]
  form.type = 'payment'
  form.recurring = false
  formErrors.title = ''
  formErrors.date = ''
}

const openAddReminder = () => {
  isEditing.value = false
  editingId.value = null
  resetForm()
  showFormModal.value = true
}

const handleEdit = (reminder: Reminder) => {
  isEditing.value = true
  editingId.value = reminder.id
  form.title = reminder.title
  form.description = reminder.description
  form.date = reminder.date
  form.type = reminder.type
  form.recurring = !!reminder.recurring
  showFormModal.value = true
}

const handleSave = () => {
  // Simple validation
  let hasError = false
  if (!form.title) {
    formErrors.title = 'Title is required'
    hasError = true
  } else {
    formErrors.title = ''
  }

  if (!form.date) {
    formErrors.date = 'Date is required'
    hasError = true
  } else {
    formErrors.date = ''
  }

  if (hasError) return

  if (isEditing.value && editingId.value) {
    reminderStore.updateReminder(editingId.value, { ...form })
  } else {
    reminderStore.addReminder({ ...form })
  }
  
  showFormModal.value = false
}

const handleSnooze = (reminder: Reminder) => {
  reminderStore.snoozeReminder(reminder.id, 1)
}

const confirmDelete = (reminder: Reminder) => {
  reminderToDelete.value = reminder
  showDeleteModal.value = true
}

const executeDelete = () => {
  if (reminderToDelete.value) {
    reminderStore.deleteReminder(reminderToDelete.value.id)
    showDeleteModal.value = false
    reminderToDelete.value = null
  }
}
</script>

<style scoped>
.reminders-view {
  min-height: 100%;
}

.view-header {
  margin-bottom: 40px;
}

.header-main-card {
  background: white;
  border-radius: 24px;
  padding: 32px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.header-main-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.header-info-section {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.header-icon-box {
  width: 60px;
  height: 60px;
  background: #eff6ff;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-main-icon {
  font-size: 30px;
  color: #3b82f6;
}

.header-content {
  flex: 1;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.view-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.025em;
}

.reminders-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #16a34a;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid #dcfce7;
}

.view-description {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  max-width: 600px;
}

.header-actions-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
  gap: 24px;
  flex-wrap: wrap;
}

.filter-controls {
  display: flex;
  align-items: center;
}

.filter-pills {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
}

.filter-pill {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-pill:hover {
  color: #1e293b;
}

.filter-pill.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.action-divider {
  width: 1px;
  height: 24px;
  background: #e2e8f0;
}

.view-actions {
  display: flex;
  gap: 12px;
}

/* Grid Layout */
.reminders-container {
  padding-bottom: 40px;
}

.reminders-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reminder-card {
  display: flex;
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.reminder-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  border-color: #3b82f6;
}

.card-left {
  padding: 24px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f1f5f9;
  min-width: 100px;
}

.date-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: white;
  border: 1px solid #e2e8f0;
  color: #64748b;
}

.date-pill.payment {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #dcfce7;
}

.date-pill.collection {
  background: #eff6ff;
  color: #3b82f6;
  border-color: #dbeafe;
}

.date-day {
  font-size: 20px;
  font-weight: 800;
  line-height: 1;
}

.date-month {
  font-size: 10px;
  font-weight: 700;
  margin-top: 2px;
}

.card-main {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-tag.payment {
  background: #f0fdf4;
  color: #16a34a;
}

.category-tag.collection {
  background: #eff6ff;
  color: #3b82f6;
}

.recurring-tag {
  color: #94a3b8;
  font-size: 14px;
}

.reminder-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 6px;
}

.reminder-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.5;
}

.reminder-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  background: white;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8fafc;
  color: #3b82f6;
  border-color: #3b82f6;
}

.action-btn--danger:hover {
  background: #fef2f2;
  color: #ef4444;
  border-color: #ef4444;
}

.action-spacer {
  flex: 1;
}

/* Empty State */
.empty-state-card {
  background: white;
  border-radius: 24px;
  padding: 60px 20px;
  text-align: center;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-illustration {
  margin-bottom: 24px;
}

.illustration-circle {
  width: 120px;
  height: 120px;
  background: #f8fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.star-icon {
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 24px;
  color: #fbbf24;
  animation: float 3s ease-in-out infinite;
}

.bell-icon {
  font-size: 56px;
  color: #cbd5e1;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 8px;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
  max-width: 300px;
  line-height: 1.6;
  margin-bottom: 24px;
}

/* Modal Styling */
.delete-confirm-body {
  text-align: center;
  padding: 10px 0;
}

.warning-icon-box {
  width: 64px;
  height: 64px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #ef4444;
  font-size: 32px;
}

.delete-confirm-body h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.delete-confirm-body p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-10px) scale(1.1); }
}

@media (max-width: 768px) {
  .header-actions-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .action-divider {
    display: none;
  }
  
  .reminder-card {
    flex-direction: column;
  }
  
  .card-left {
    padding: 16px;
    border-right: none;
    border-bottom: 1px solid #f1f5f9;
    justify-content: flex-start;
  }
  
  .date-pill {
    flex-direction: row;
    width: auto;
    height: auto;
    padding: 8px 16px;
    gap: 8px;
  }
  
  .date-month {
    margin-top: 0;
  }
}

/* Reminder Form Styles */
.reminder-form {
  margin-top: 8px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.base-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.select-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-text-primary);
}

.select-container {
  position: relative;
  display: flex;
  align-items: center;
}

.premium-select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  color: var(--color-text-primary);
  font-size: var(--text-base);
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: all 0.2s;
}

.premium-select:focus {
  border-color: var(--color-border-focus);
  box-shadow: var(--shadow-focus);
}

.select-chevron {
  position: absolute;
  right: 12px;
  pointer-events: none;
  color: #94a3b8;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  padding: 8px 0;
}

.custom-checkbox {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: white;
}

.custom-checkbox.checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.custom-checkbox svg {
  font-size: 12px;
}

.checkbox-wrapper span {
  font-size: 14px;
  font-weight: 500;
  color: #475569;
}

.reminder-card.editing {
  border-color: #3b82f6;
  border-width: 2px;
  background: #f0f7ff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 20px 25px -5px rgba(59, 130, 246, 0.2);
  transform: scale(1.02);
  z-index: 10;
  animation: editing-glow 2s infinite;
}

.reminder-card.editing .card-left {
  background: #eff6ff;
  border-right-color: #dbeafe;
}

@keyframes editing-glow {
  0%, 100% { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1), 0 20px 25px -5px rgba(59, 130, 246, 0.2); }
  50% { box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.15), 0 25px 30px -5px rgba(59, 130, 246, 0.25); }
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
