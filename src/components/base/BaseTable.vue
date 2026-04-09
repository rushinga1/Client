<template>
  <div class="base-table">
    <div v-if="loading" class="base-table__loading">
      <div class="table-skeleton">
        <div v-for="i in skeletonRows" :key="i" class="skeleton-row">
          <div v-for="j in columns.length" :key="j" class="skeleton-cell">
            <BaseSkeleton variant="text" :width="getSkeletonWidth(j)" />
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="rows.length === 0" class="base-table__empty">
      <div class="empty-state">
        <div class="empty-state__icon">
          <Icon :icon="emptyIcon" />
        </div>
        <h3 class="empty-state__title">{{ emptyTitle }}</h3>
        <p class="empty-state__description">{{ emptyDescription }}</p>
        <BaseButton
          v-if="emptyAction"
          :variant="emptyAction.variant"
          @click="emptyAction.handler"
        >
          {{ emptyAction.label }}
        </BaseButton>
      </div>
    </div>
    
    <div v-else class="base-table__container">
      <table class="table">
        <thead class="table__header">
          <tr class="table__header-row">
            <th
              v-for="column in columns"
              :key="column.key"
              :class="['table__header-cell', { 'table__header-cell--sortable': column.sortable }]"
              @click="handleSort(column)"
            >
              <div class="header-cell-content">
                <span class="header-label">{{ column.label }}</span>
                <div v-if="column.sortable" class="sort-indicator">
                  <Icon
                    :icon="getSortIcon(column.key)"
                    :class="['sort-icon', { 'sort-icon--active': sortKey === column.key }]"
                  />
                </div>
              </div>
            </th>
          </tr>
        </thead>
        
        <tbody class="table__body">
          <tr
            v-for="(row, index) in paginatedRows"
            :key="getRowKey(row, index)"
            :class="[
              'table__row', 
              { 'table__row--clickable': clickable },
              { 'table__row--striped': striped && index % 2 !== 0 }
            ]"
            @click="handleRowClick(row, index)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['table__cell', `table__cell--${column.align || 'left'}`]"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="getCellValue(row, column)"
              >
                <span class="cell-content">
                  {{ formatCellValue(getCellValue(row, column), column) }}
                </span>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div v-if="showPagination && totalPages > 1" class="table__pagination">
        <div class="pagination-info">
          <span class="pagination-text">
            Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, rows.length) }} of {{ rows.length }} items
          </span>
        </div>
        
        <div class="pagination-controls">
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            <Icon icon="ph:caret-left" />
          </BaseButton>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              :class="['page-number', { 'page-number--active': page === currentPage }]"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>
          
          <BaseButton
            variant="ghost"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <Icon icon="ph:caret-right" />
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'
import BaseButton from './BaseButton.vue'
import BaseSkeleton from './BaseSkeleton.vue'

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  formatter?: (value: any) => string
  width?: string
}

interface EmptyAction {
  label: string
  variant?: 'primary' | 'secondary' | 'ghost'
  handler: () => void
}

interface Props {
  columns: TableColumn[]
  rows: any[]
  loading?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: string
  emptyAction?: EmptyAction
  clickable?: boolean
  showPagination?: boolean
  pageSize?: number
  rowKey?: string | ((row: any) => string | number)
  striped?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyTitle: 'No data available',
  emptyDescription: 'There are no items to display',
  emptyIcon: 'ph:inbox',
  clickable: false,
  showPagination: false,
  pageSize: 10,
  rowKey: 'id',
  striped: false
})

const emit = defineEmits<{
  'row-click': [row: any, index: number]
  'sort': [column: TableColumn, direction: 'asc' | 'desc']
}>()

// State
const sortKey = ref<string>('')
const sortDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)

// Computed
const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows
  
  return [...props.rows].sort((a, b) => {
    const aValue = getCellValue(a, { key: sortKey.value } as TableColumn)
    const bValue = getCellValue(b, { key: sortKey.value } as TableColumn)
    
    let comparison = 0
    if (aValue < bValue) comparison = -1
    if (aValue > bValue) comparison = 1
    
    return sortDirection.value === 'desc' ? -comparison : comparison
  })
})

const totalPages = computed(() => Math.ceil(sortedRows.value.length / props.pageSize))

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedRows.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const skeletonRows = computed(() => Math.min(props.pageSize, 5))

// Methods
const getCellValue = (row: any, column: TableColumn) => {
  const keys = column.key.split('.')
  let value = row
  
  for (const key of keys) {
    value = value?.[key]
    if (value === undefined) break
  }
  
  return value
}

const formatCellValue = (value: any, column: TableColumn) => {
  if (column.formatter) {
    return column.formatter(value)
  }
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  return String(value)
}

const getRowKey = (row: any, index: number) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  
  return row[props.rowKey] || index
}

const handleSort = (column: TableColumn) => {
  if (!column.sortable) return
  
  if (sortKey.value === column.key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = column.key
    sortDirection.value = 'asc'
  }
  
  emit('sort', column, sortDirection.value)
}

const getSortIcon = (columnKey: string) => {
  if (sortKey.value !== columnKey) {
    return 'ph:caret-up-down'
  }
  
  return sortDirection.value === 'asc' ? 'ph:caret-up' : 'ph:caret-down'
}

const handleRowClick = (row: any, index: number) => {
  if (props.clickable) {
    emit('row-click', row, index)
  }
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const getSkeletonWidth = (columnIndex: number) => {
  const widths = ['80%', '60%', '40%', '70%', '50%']
  return widths[columnIndex % widths.length]
}
</script>

<style scoped>
@import '../../assets/styles/tokens.css';

.base-table {
  width: 100%;
  background-color: var(--color-bg-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border-default);
  overflow: hidden;
}

.base-table__container {
  width: 100%;
}

.table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-bg-surface);
}

.table__header {
  background-color: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-border-default);
}

.table__header-row {
  height: 48px;
}

.table__header-cell {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  line-height: var(--leading-snug);
  position: relative;
}

.table__header-cell--sortable {
  cursor: pointer;
  user-select: none;
  transition: color var(--duration-fast) var(--ease-default);
}

.table__header-cell--sortable:hover {
  color: var(--color-text-primary);
}

.header-cell-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.sort-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
}

.sort-icon {
  width: 12px;
  height: 12px;
  color: var(--color-text-disabled);
  transition: color var(--duration-fast) var(--ease-default);
}

.sort-icon--active {
  color: var(--color-primary-600);
}

.table__body {
  background-color: var(--color-bg-surface);
}

.table__row {
  border-bottom: 1px solid var(--color-border-default);
  transition: background-color var(--duration-fast) var(--ease-default);
}

.table__row:last-child {
  border-bottom: none;
}

.table__row:hover {
  background-color: var(--color-neutral-50);
}

.table__row--striped {
  background-color: var(--color-neutral-50);
}

.table__row--clickable {
  cursor: pointer;
}

.table__row--clickable:hover {
  background-color: var(--color-primary-50);
}

.table__cell {
  padding: var(--space-4);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  line-height: var(--leading-snug);
}

.table__cell--left {
  text-align: left;
}

.table__cell--center {
  text-align: center;
}

.table__cell--right {
  text-align: right;
}

.cell-content {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Loading State */
.base-table__loading {
  padding: var(--space-4);
}

.table-skeleton {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.skeleton-row {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-3) 0;
}

.skeleton-cell {
  flex: 1;
}

/* Empty State */
.base-table__empty {
  padding: var(--space-12) var(--space-6);
  text-align: center;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  max-width: 400px;
  margin: 0 auto;
}

.empty-state__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-16);
  height: var(--space-16);
  border-radius: var(--radius-full);
  background-color: var(--color-neutral-100);
  color: var(--color-text-disabled);
}

.empty-state__icon svg {
  width: 32px;
  height: 32px;
}

.empty-state__title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
}

.empty-state__description {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-normal);
}

/* Pagination */
.table__pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-border-default);
  background-color: var(--color-neutral-50);
}

.pagination-info {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  line-height: var(--leading-snug);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.page-numbers {
  display: flex;
  gap: var(--space-1);
}

.page-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--space-8);
  height: var(--space-8);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  background-color: var(--color-bg-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-default);
}

.page-number:hover {
  background-color: var(--color-neutral-50);
  color: var(--color-text-primary);
}

.page-number--active {
  background-color: var(--color-primary-500);
  color: var(--color-text-inverse);
  border-color: var(--color-primary-500);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .table__header-cell,
  .table__cell {
    padding: var(--space-2) var(--space-3);
  }
  
  .table__pagination {
    flex-direction: column;
    gap: var(--space-3);
    text-align: center;
  }
  
  .pagination-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .table__header-cell,
  .table__cell {
    padding: var(--space-2);
    font-size: var(--text-xs);
  }
  
  .empty-state {
    padding: var(--space-6) var(--space-4);
  }
  
  .empty-state__icon {
    width: var(--space-12);
    height: var(--space-12);
  }
  
  .empty-state__icon svg {
    width: 24px;
    height: 24px;
  }
  
  .empty-state__title {
    font-size: var(--text-base);
  }
}
</style>
