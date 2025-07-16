<template>
  <div>
    <div v-if="tasks.length === 0" class="text-center text-gray-500 py-8">No tasks found.</div>
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="task in tasks" :key="task.id" class="flex flex-col md:flex-row md:items-center justify-between py-4">
        <div class="flex-1">
          <div class="flex items-center mb-2">
            <input type="checkbox" :checked="task.completed" @change="$emit('complete', task, !$event.target.checked)" class="mr-2" />
            <span :class="{'line-through text-gray-400': task.completed, 'font-semibold': !task.completed}">{{ task.title }}</span>
            <span v-if="task.deadline" class="ml-4 text-xs text-gray-500">Due: {{ task.deadline }}</span>
            <span v-if="categoryName(task.category_id)" class="ml-2 px-2 py-1 bg-gray-200 rounded text-xs">{{ categoryName(task.category_id) }}</span>
          </div>
          <div class="text-gray-600 text-sm mb-1">{{ task.description }}</div>
        </div>
        <div class="flex space-x-2 mt-2 md:mt-0">
          <button @click="$emit('edit', task)" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
          <button @click="$emit('delete', task)" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
          <button v-if="!task.completed" @click="$emit('complete', task, true)" class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Mark Complete</button>
          <button v-else @click="$emit('complete', task, false)" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Mark Incomplete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { Task } from '~/composables/useTasks'
import type { Category } from '~/composables/useCategories'

const props = defineProps<{ tasks: Task[], categories: Category[] }>()
defineEmits(['edit', 'delete', 'complete'])

function categoryName(category_id?: number) {
  const cat = props.categories.find(c => c.id === category_id)
  return cat ? cat.name : ''
}
</script> 