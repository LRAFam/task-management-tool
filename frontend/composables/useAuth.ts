import { ref } from 'vue'
import { useState } from '#app'

interface User {
  id: number
  name: string
  email: string
}

interface AuthResponse {
  message: string
  token?: string
  user?: User
}

const userState = () => useState<User | null>('user', () => null)
const tokenState = () => useState<string | null>('token', () => null)

export function useAuth() {
  const user = userState()
  const token = tokenState()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const register = async (name: string, email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<AuthResponse>('http://localhost:8000/api/register', {
        method: 'POST',
        body: { name, email, password },
      })
      // Optionally auto-login after registration
      await login(email, password)
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Registration failed'
    } finally {
      loading.value = false
    }
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<AuthResponse>('http://localhost:8000/api/login', {
        method: 'POST',
        body: { email, password },
      })
      if (res.token && res.user) {
        token.value = res.token
        user.value = res.user
      }
      return res
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    error.value = null
    try {
      await $fetch('http://localhost:8000/api/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = null
      token.value = null
    } catch (err: any) {
      error.value = err.data?.message || 'Logout failed'
    } finally {
      loading.value = false
    }
  }

  return { user, token, loading, error, register, login, logout }
} 