<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div v-if="user" class="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-4">Welcome, {{ user.name }}</h2>
      <p class="mb-6">You are logged in as <span class="font-mono">{{ user.email }}</span>.</p>
      <button @click="onLogout" class="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700" :disabled="loading">
        <span v-if="loading">Logging out...</span>
        <span v-else>Logout</span>
      </button>
    </div>
    <div v-else class="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-4">Welcome</h2>
      <p class="mb-6">Please log in or register to continue.</p>
      <NuxtLink to="/auth/login" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2">Login</NuxtLink>
      <NuxtLink to="/auth/register" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Register</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout, loading } = useAuth()

const onLogout = async () => {
  await logout()
}
</script> 