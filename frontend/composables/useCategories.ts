import { ref, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'

export interface Category {
  id: number
  name: string
  color?: string
  created_at: string
  updated_at: string
}

const categoriesState = () => useState<Category[]>('categories', () => [])
const loadingState = () => useState<boolean>('categoriesLoading', () => false)
const errorState = () => useState<string | null>('categoriesError', () => null)

export function useCategories() {
  const { token } = useAuth()
  const categories = categoriesState()
  const loading = loadingState()
  const error = errorState()

  const fetchCategories = async () => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Category[]>('http://localhost:8000/api/categories', {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      categories.value = res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to fetch categories'
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Category>('http://localhost:8000/api/categories', {
        method: 'POST',
        body: data,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      categories.value.push(res)
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to create category'
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<Category>(`http://localhost:8000/api/categories/${id}`, {
        method: 'PUT',
        body: data,
        headers: { Authorization: `Bearer ${token.value}` },
      })
      const idx = categories.value.findIndex(c => c.id === id)
      if (idx !== -1) categories.value[idx] = res
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to update category'
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    if (!token.value) {
      error.value = 'No authentication token available'
      return
    }
    
    loading.value = true
    error.value = null
    try {
      await $fetch(`http://localhost:8000/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token.value}` },
      })
      categories.value = categories.value.filter(c => c.id !== id)
    } catch (err: any) {
      error.value = err.data?.message || 'Failed to delete category'
    } finally {
      loading.value = false
    }
  }

  const getCategoryById = (id: number) => {
    return categories.value.find(c => c.id === id)
  }

  const getCategoryOptions = computed(() => {
    return categories.value.map(c => ({
      value: c.id,
      label: c.name,
      color: c.color
    }))
  })

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoryOptions,
  }
}