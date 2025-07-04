<script setup lang="ts">
import axios from 'axios';
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()
const user = ref<{ username: string; role?: string; id?: number; email?: string } | null>(null)

const logout = async () => {
  if (user.value?.id) {
    try {
      await axios.patch(`http://localhost:3001/roles/${user.value.id}`, {
        online: false
      })
      localStorage.removeItem('user')
      router.push('/Login')
    } catch (err) {
      console.error('Logout error:', err)
    }
  } else {
    router.push('/Login')
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})
</script>

<template>
  <nav class="min-h-screen w-[20%] bg-gray-300 text-gray-600 p-4">
    <ul class="flex flex-col justify-start gap-2 mt-8 p-3">
      <div v-if="user" class="flex flex-col justify-center items-center gap-2 mb-10">
        <p class="font-bold text-[22px]">👤 {{ user.username }}</p>
        <p class="text-sm text-gray-600">{{ user.email || 'ไม่ระบุ' }}</p>
      </div>
      <li>
        <router-link
          to="/Finance"
          class="block w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          active-class="bg-gray-100 font-bold"
        >
          คำนวณยอดผ่อน
        </router-link>
      </li>
      <li>
        <router-link
          to="/ManageCar"
          class="block w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          active-class="bg-gray-100 font-bold"
        >
          จัดการคลังรถ
        </router-link>
      </li>
      <li v-if="user?.role === 'Admin'">
        <router-link
          to="/ManageRole"
          class="block w-full px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
          active-class="bg-gray-100 font-bold"
        >
          กำหนดสิทธิ
        </router-link>
      </li>
      <li>
        <button
          @click="logout"
          class="block w-full px-4 py-2 rounded hover:bg-red-600 cursor-pointer mt-[30%] bg-red-500 text-white text-center"
        >
          ออกจากระบบ
        </button>
      </li>
    </ul>
  </nav>
</template>
