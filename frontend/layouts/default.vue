<template>
  <div>
    <header class="bg-blue-700 text-white py-4 px-6 mb-8 flex items-center justify-between">
      <h1 class="text-xl font-bold">Task Management Tool</h1>
      <nav class="space-x-4">
        <NuxtLink to="/" class="hover:underline">Home</NuxtLink>
        <NuxtLink to="/tasks" class="hover:underline">Tasks</NuxtLink>
        <template v-if="!user">
          <NuxtLink to="/auth/login" class="hover:underline">Login</NuxtLink>
          <NuxtLink to="/auth/register" class="hover:underline">Register</NuxtLink>
        </template>
        <template v-else>
          <button @click="onLogout" class="hover:underline">Logout</button>
        </template>
      </nav>
    </header>
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

const { user, logout } = useAuth()

const onLogout = async () => {
  await logout()
}
</script> 