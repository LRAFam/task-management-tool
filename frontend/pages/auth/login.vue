<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <form @submit.prevent="onLogin" class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <div class="mb-4">
        <label class="block mb-1" for="email">Email</label>
        <input v-model="email" id="email" type="email" class="w-full border rounded px-3 py-2" required />
      </div>
      <div class="mb-6">
        <label class="block mb-1" for="password">Password</label>
        <input v-model="password" id="password" type="password" class="w-full border rounded px-3 py-2" required />
      </div>
      <div v-if="error" class="mb-4 text-red-600">{{ error }}</div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" :disabled="loading">
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
      <div class="mt-4 text-center">
        <NuxtLink to="/auth/register" class="text-blue-600 hover:underline">Don't have an account? Register</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'

const email = ref('')
const password = ref('')
const router = useRouter()
const { login, loading, error, user } = useAuth()

const onLogin = async () => {
  await login(email.value, password.value)
  if (user.value) {
    router.push('/')
  }
}
</script> 