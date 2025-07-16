import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface Task {
  id: number
  user_id: number
  title: string
  description?: string
  deadline?: string
  category?: string
  completed: boolean
  created_at: string
  updated_at: string
}

const tasksState = () => useState<Task[]>('tasks', () => [])
const loadingState = () => useState<boolean>('tasksLoading', () => false)
const errorState = () => useState<string | null>('tasksError', () => null)

export function useTasks() {
  const { token } = useAuth()
  const tasks = tasksState()
  const loading = loadingState()
  const error = errorState()

  const fetchTasks = async (filters: { category?: string; completed?: boolean } = {}) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.completed !== undefined) params.append('completed', String(filters.completed))
      const res = await $fetch<Task[]>(`http://localhost:8000/api/tasks?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      tasks.value = res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch tasks'
      // If unauthorized, clear the token
      if (err.status === 401) {
        const { logout } = useAuth()
        logout()
      }
    } finally {
      loading.value = false
    }
  }

  const createTask = async (data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Task>('http://localhost:8000/api/tasks', {
        method: 'POST',
        body: data,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      tasks.value.unshift(res)
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to create task'
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: number, data: Partial<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Task>(`http://localhost:8000/api/tasks/${id}`, {
        method: 'PUT',
        body: data,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const idx = tasks.value.findIndex(t => t.id === id)
      if (idx !== -1) tasks.value[idx] = res
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update task'
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: number) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      await $fetch(`http://localhost:8000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token.value}` },
      })
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to delete task'
    } finally {
      loading.value = false
    }
  }

  const completeTask = async (id: number, completed: boolean) => {
    return updateTask(id, { completed })
  }

  const filteredTasks = computed(() => tasks.value)

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    completeTask,
    filteredTasks,
  }
} 