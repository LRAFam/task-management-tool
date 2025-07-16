<template>
  <div>
    <div v-if="tasks.length === 0" class="text-center text-gray-500 py-8">No tasks found.</div>
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="task in tasks" :key="task.id" class="flex flex-col md:flex-row md:items-center justify-between py-4">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <input type="checkbox" :checked="task.completed" @change="$emit('complete', task, !task.completed)" class="mr-2" />
            <span :class="{'line-through text-gray-400': task.completed, 'font-semibold': !task.completed}">{{ task.title }}</span>
            <span v-if="task.deadline" class="ml-4 text-xs text-gray-500">Due: {{ task.deadline }}</span>
            <span v-if="task.category" class="ml-2 px-2 py-1 rounded text-xs text-white" :style="{ backgroundColor: task.category.color || '#6B7280' }">{{ task.category.name }}</span>
          </div>
          <div class="text-gray-600 text-sm mb-1">{{ task.description }}</div>
        </div>
        <div class="flex space-x-2 mt-2 md:mt-0">
          <button @click="$emit('edit', task)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
          <button @click="$emit('delete', task)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/composables/useTasks'

defineProps<{ tasks: Task[] }>()
defineEmits(['edit', 'delete', 'complete'])
</script> 