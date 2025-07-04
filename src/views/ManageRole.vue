<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

interface User {
  id: string
  username: string
  password: string
  role: string
  name: string
  email: string
  online: boolean
}

const users = ref<User[]>([])
const isEditing = ref(false)

const generateUID = (): string => {
  return Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2)
}
const form = reactive({
  id: generateUID(),
  username: '',
  password: '',
  role: 'User',
  name: '',
  email: '',
  activeFlag: true,
  online: false
})

const loadUsers = async () => {
  const res = await axios.get('http://localhost:3001/roles')
  users.value = res.data
}


const clearForm = () => {
  form.username = ''
  form.password = ''
  form.role = 'User'
  form.name = ''
  form.email = ''
  isEditing.value = false
}

const addUser = async () => {
  if (!form.username || !form.password) {
    alert('กรุณากรอกข้อมูลให้ครบ')
    return
  }
  const res = await axios.post('http://localhost:3001/roles', { ...form })
  console.log('Create user',res)
  await loadUsers()
  clearForm()
}

const editUser = (user: User) => {
  form.id = user.id
  form.username = user.username
  form.password = user.password
  form.role = user.role
  form.name = user.name
  form.email = user.email
  isEditing.value = true
}

const updateUser = async () => {
  if (!form.id) return
  await axios.put(`http://localhost:3001/roles/${form.id}`, { ...form })
  await loadUsers()
  clearForm()
}

const deleteUser = async (id: string) => {
  if (!confirm('คุณต้องการลบผู้ใช้นี้หรือไม่?')) return
  try {
    const res = await axios.delete(`http://localhost:3001/roles/${id}`)
    console.log('res delete',res)
    await loadUsers()
  } catch (err) {
    console.error('Logout error:', err)
  }
}

const BlockUser = async (id: string) => {
  await axios.patch(`http://localhost:3001/roles/${id}`, { online: false })
  await loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-4">จัดการผู้ใช้งาน</h1>
    <div class="bg-white p-4 rounded shadow mb-6">
      <form @submit.prevent="isEditing ? updateUser() : addUser()" class="w-full">
        <div class="flex flex-row justify-between w-full gap-5">
        <div class="w-[33%]">
          <label class="block font-medium mb-1">Username</label>
          <input v-model="form.username" type="text" class="w-full border p-2 rounded" />
        </div>
        <div class="w-[33%]">
          <label class="block font-medium mb-1">Password</label>
          <input v-model="form.password" type="password" class="w-full border p-2 rounded" />
        </div>
        <div class="w-[33%]">
          <label class="block font-medium mb-1">Role</label>
          <select v-model="form.role" class="w-full border p-2 rounded">
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>
      <div class="flex flex-row justify-between w-full gap-5">
        <div class="w-[33%]">
          <label class="block font-medium mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full border p-2 rounded" />
        </div>
        <div class="w-[33%]">
          <label class="block font-medium mb-1">Email</label>
          <input v-model="form.email" type="text" class="w-full border p-2 rounded" />
        </div>
        <div class="w-[33%]"/>
        </div>
        <div class="col-span-3 flex justify-end gap-4 mt-2">
          <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {{ isEditing ? 'อัปเดต' : 'เพิ่มผู้ใช้' }}
          </button>
          <button type="button" @click="clearForm" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            ล้างค่า
          </button>
        </div>
        
      </form>
    </div>

    <div class="bg-white p-4 rounded shadow">
      <table class="w-full border border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-2 text-left">Name</th>
            <th class="border p-2 text-left">Username</th>
            <th class="border p-2 text-left">User</th>
            <th class="border p-2 text-left">Role</th>
            <th class="border p-2 text-left">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users.filter(u => u.role === 'User')" :key="user.id" class="hover:bg-gray-50">
            <td class="border p-2">{{ user.name }}</td>
            <td class="border p-2">{{ user.username }}</td>
            <td class="border p-2">{{ user.email }}</td>
            <td class="border p-2">{{ user.role }}</td>
            <td class="border p-2">
              <button v-if="user.online" @click="BlockUser(user.id)" class="text-green-600 hover:underline mr-2 cursor-pointer">ปิดกั้นการใช้งาน</button>
              <button v-else class="text-gray-600 mr-2">ไม่ได้ใช้งาน</button>
              <button @click="editUser(user)" class="text-sky-600 hover:underline mr-2">แก้ไข</button>
              <button @click="deleteUser(user.id)" class="text-red-600 hover:underline">ลบ</button>
            </td>
          </tr>
          <tr v-if="users.length === 0">
            <td colspan="4" class="text-center text-gray-500 py-4">ไม่พบข้อมูลผู้ใช้</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
