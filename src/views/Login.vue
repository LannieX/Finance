<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import router from '../router'

const username = ref('')
const password = ref('')
const passwordConfirm = ref('')
const errorMessage = ref('')
const showPassword = ref(false)
const isResetMode = ref(false)

const login = async () => {
  errorMessage.value = ''
  if (!username.value || !password.value) {
    errorMessage.value = 'กรุณากรอก username และ password'
    return
  }
  try {
    const res = await axios.get('http://localhost:3001/roles', {
      params: {
        username: username.value,
        password: password.value
      }
    })
    if (res.data.length > 0) {
      const user = res.data[0]
      localStorage.setItem('user', JSON.stringify(user))
      alert(`ยินดีต้อนรับ, ${username.value}!`)
      try {
        await axios.patch(`http://localhost:3001/roles/${user.id}`, { online: true })
        router.push('/')
      } catch {
        errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
      }
    } else {
      errorMessage.value = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
    }
  } catch (error) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
    console.error(error)
  }
}

const resetPassword = async () => {
  errorMessage.value = ''
  if (!username.value || !password.value || !passwordConfirm.value) {
    errorMessage.value = 'กรุณากรอกข้อมูลให้ครบ'
    return
  }
  if (password.value !== passwordConfirm.value) {
    errorMessage.value = 'รหัสผ่านทั้งสองช่องไม่ตรงกัน'
    return
  }
  try {

    const res = await axios.get('http://localhost:3001/roles', {
      params: { username: username.value }
    })
    if (res.data.length === 0) {
      errorMessage.value = 'ไม่พบชื่อผู้ใช้ในระบบ'
      return
    }
    const user = res.data[0]

    await axios.patch(`http://localhost:3001/roles/${user.id}`, { password: password.value })
    alert('รีเซ็ตรหัสผ่านสำเร็จ กรุณาเข้าสู่ระบบใหม่')

    clearForm()
    isResetMode.value = false
  } catch (error) {
    errorMessage.value = 'เกิดข้อผิดพลาดในการเชื่อมต่อ'
    console.error(error)
  }
}

const clearForm = () => {
  username.value = ''
  password.value = ''
  passwordConfirm.value = ''
  errorMessage.value = ''
  showPassword.value = false
}

const toggleMode = () => {
  clearForm()
  isResetMode.value = !isResetMode.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[url('/pg2.jpg')] bg-cover bg-center">
    <div class="bg-white/20 backdrop-blur-md p-10 rounded-[10px] shadow-md w-[35%] border border-white">
      <h2 class="text-2xl font-bold mb-6 text-center">
        {{ isResetMode ? 'รีเซ็ตรหัสผ่าน' : 'เข้าสู่ระบบ' }}
      </h2>

      <form
        @submit.prevent="isResetMode ? resetPassword() : login()"
        class="space-y-4"
      >
        <div>
          <label class="block mb-1 font-medium">ชื่อผู้ใช้ (Username)</label>
          <input
            v-model="username"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="กรอกชื่อผู้ใช้"
          />
        </div>

        <div class="relative" v-if="!isResetMode || isResetMode">
          <label class="block mb-1 font-medium">
            รหัสผ่าน {{ isResetMode ? '(ใหม่)' : '' }}
          </label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            class="w-full p-2 pr-10 border rounded"
            placeholder="กรอกรหัสผ่าน"
          />
          <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-2 top-[36px] text-gray-500 hover:text-gray-700"
          >
            <span v-if="showPassword">👁️</span>
            <span v-else>🙈</span>
          </button>
        </div>

        <div class="relative" v-if="isResetMode">
          <label class="block mb-1 font-medium">ยืนยันรหัสผ่าน (อีกครั้ง)</label>
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="passwordConfirm"
            class="w-full p-2 pr-10 border rounded"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
          />
        </div>

        <p v-if="errorMessage" class="text-red-600">{{ errorMessage }}</p>

        <button
          type="submit"
          class="w-full bg-green-500 text-gray-100 py-2 rounded hover:bg-green-700 cursor-pointer"
        >
          {{ isResetMode ? 'รีเซ็ตรหัสผ่าน' : 'เข้าสู่ระบบ' }}
        </button>
      </form>

      <div
        class="text-[14px] text-gray-700 flex justify-center mt-4 cursor-pointer hover:underline"
        @click="toggleMode"
      >
        <p>
          {{ isResetMode ? 'กลับไปยังหน้าเข้าสู่ระบบ' : 'ลืมรหัสผ่าน?' }}
        </p>
      </div>
    </div>
  </div>
</template>
