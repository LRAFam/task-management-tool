<template>
  <div class="max-w-2xl mx-auto py-8">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">My Tasks</h2>
      <button @click="showForm = true; isEditMode = false; editTask = { ...defaultTask }" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">New Task</button>
    </div>
    <div class="mb-4 flex flex-wrap gap-2">
      <input v-model="filters.category" placeholder="Filter by category" class="border rounded px-3 py-2" />
      <select v-model="filters.completed" class="border rounded px-3 py-2">
        <option :value="undefined">All</option>
        <option :value="false">Incomplete</option>
        <option :value="true">Completed</option>
      </select>
      <button @click="fetchTasks(filters)" class="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">Filter</button>
    </div>
    <TaskForm
      v-if="showForm"
      :model-value="isEditMode ? editTask : undefined"
      :loading="loading"
      :error="error"
      :submit-label="isEditMode ? 'Update Task' : 'Create Task'"
      :show-cancel="true"
      @submit="onSubmit"
      @cancel="onCancel"
      class="mb-6"
    />
    <TaskList
      :tasks="tasks"
      @edit="onEdit"
      @delete="onDelete"
      @complete="onComplete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useTasks, type Task } from '~/composables/useTasks'
import TaskForm from '~/components/TaskForm.vue'
import TaskList from '~/components/TaskList.vue'

const { tasks, fetchTasks, createTask, updateTask, deleteTask, completeTask, loading, error } = useTasks()

const showForm = ref(false)
const isEditMode = ref(false)
const defaultTask: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  title: '',
  description: '',
  deadline: '',
  category: '',
  completed: false,
}
const editTask = ref<Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({ ...defaultTask })
const filters = reactive<{ category?: string; completed?: boolean }>({ category: '', completed: undefined })

onMounted(() => {
  fetchTasks()
})

const onSubmit = async (data: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
  if (isEditMode.value) {
    await updateTask(tasks.value.find(t => t.title === editTask.value.title)?.id!, data)
  } else {
    await createTask(data)
  }
  showForm.value = false
  isEditMode.value = false
  editTask.value = { ...defaultTask }
  fetchTasks(filters)
}

const onEdit = (task: Task) => {
  editTask.value = {
    title: task.title || '',
    description: task.description || '',
    deadline: task.deadline || '',
    category: task.category || '',
    completed: task.completed,
  }
  isEditMode.value = true
  showForm.value = true
}

const onDelete = async (task: Task) => {
  if (confirm('Are you sure you want to delete this task?')) {
    await deleteTask(task.id)
    fetchTasks(filters)
  }
}

const onComplete = async (task: Task, completed: boolean) => {
  await completeTask(task.id, completed)
  fetchTasks(filters)
}

const onCancel = () => {
  showForm.value = false
  isEditMode.value = false
  editTask.value = { ...defaultTask }
}
</script> 