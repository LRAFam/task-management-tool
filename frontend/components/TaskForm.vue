<template>
  <form @submit.prevent="onSubmit" class="space-y-4">
    <div>
      <label class="block mb-1" for="title">Title</label>
      <input v-model="form.title" id="title" type="text" class="w-full border rounded px-3 py-2" required />
    </div>
    <div>
      <label class="block mb-1" for="description">Description</label>
      <textarea v-model="form.description" id="description" class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label class="block mb-1" for="deadline">Deadline</label>
      <input v-model="form.deadline" id="deadline" type="date" class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label class="block mb-1" for="category">Category</label>
      <select v-model="form.category_id" id="category" class="w-full border rounded px-3 py-2">
        <option :value="undefined">No Category</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <button type="submit" class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" :disabled="loading">
      <span v-if="loading">Saving...</span>
      <span v-else>{{ submitLabel }}</span>
    </button>
    <button v-if="showCancel" type="button" @click="$emit('cancel')" class="ml-2 bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500">Cancel</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted } from 'vue'
import type { Task } from '~/composables/useTasks'
import { useCategories } from '~/composables/useCategories'

const props = defineProps<{
  modelValue?: Partial<Task>
  loading?: boolean
  error?: string | null
  submitLabel?: string
  showCancel?: boolean
}>()
const emit = defineEmits(['submit', 'cancel'])

const { categories, fetchCategories } = useCategories()

const form = reactive<Partial<Task>>({
  title: '',
  description: '',
  deadline: '',
  category_id: undefined,
})

onMounted(() => {
  fetchCategories()
})

watch(() => props.modelValue, (val) => {
  if (val) Object.assign(form, val)
}, { immediate: true })

const onSubmit = () => {
  emit('submit', { ...form })
}
</script> 