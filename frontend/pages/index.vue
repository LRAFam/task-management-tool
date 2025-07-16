<template>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
      <h2 class="text-2xl font-bold mb-4">Welcome to the Task Management Tool</h2>
      <p class="mb-4">This application allows you to manage your tasks efficiently. Register or log in to get started.</p>
      <div v-if="user">
        <p class="mb-4">You are logged in as <span class="font-mono">{{ user.email }}</span>.</p>
        <NuxtLink to="/tasks" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Go to Tasks</NuxtLink>
      </div>
      <div v-else>
        <NuxtLink to="/auth/login" class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2">Login</NuxtLink>
        <NuxtLink to="/auth/register" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">Register</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user } = useAuth()
</script> 