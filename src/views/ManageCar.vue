<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'

interface Vehicle {
  id: number
  VIN: string
  brand: string
  model: string
  year: number
  price?: number
  decs?: string
}

const dataCar = ref<Vehicle[]>([])

const loadData = async () => {
  try {
    const res = await axios.get('http://localhost:3001/cars')
    dataCar.value = res.data
  } catch (error) {
    console.error('Load data error:', error)
  }
}

onMounted(() => {
  loadData()
})

// ฟอร์มสำหรับเพิ่ม/แก้ไข
const form = reactive({
  id: null as number | null,
  VIN: '',
  brand: '',
  model: '',
  year: null as number | null,
  price: null as number | null,
  decs: ''
})

const isEditing = ref(false)

const clearForm = () => {
  form.id = null
  form.VIN = ''
  form.brand = ''
  form.model = ''
  form.year = null
  form.price = null
  form.decs = ''
  isEditing.value = false
}

// เพิ่มข้อมูลใหม่
const addVehicle = async () => {
  if (!form.brand || !form.model || !form.year) {
    alert('กรุณากรอกข้อมูลให้ครบ')
    return
  }
  try {
    await axios.post('http://localhost:3001/cars', { ...form })
    await loadData()
    clearForm()
  } catch (error) {
    console.error('Add vehicle error:', error)
  }
}

// กดแก้ไข: โหลดข้อมูลใส่ฟอร์ม
const editVehicle = (vehicle: Vehicle) => {
  form.id = vehicle.id
  form.VIN = vehicle.VIN
  form.brand = vehicle.brand
  form.model = vehicle.model
  form.year = vehicle.year
  form.price = vehicle.price || null
  form.decs = vehicle.decs || ''
  isEditing.value = true
}

// อัพเดตข้อมูลที่แก้ไข
const updateVehicle = async () => {
  if (!form.id || !form.brand || !form.model || !form.year) {
    alert('กรุณากรอกข้อมูลให้ครบ')
    return
  }
  try {
    await axios.put(`http://localhost:3001/cars/${form.id}`, { ...form })
    await loadData()
    clearForm()
  } catch (error) {
    console.error('Update vehicle error:', error)
  }
}

// ลบข้อมูล
const deleteVehicle = async (id: number) => {
  if (!confirm('คุณต้องการลบรายการนี้หรือไม่?')) return
  try {
    await axios.delete(`http://localhost:3001/cars/${id}`)
    await loadData()
  } catch (error) {
    console.error('Delete vehicle error:', error)
  }
}
</script>

<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">จัดการคลังรถ</h1>
    <div class="bg-white p-6 rounded shadow mb-8 w-full">
      <h2 class="text-xl font-semibold mb-4">
        {{ isEditing ? 'แก้ไขข้อมูลรถ' : 'เพิ่มรถใหม่' }}
      </h2>
      <form
        @submit.prevent="isEditing ? updateVehicle() : addVehicle()"
        class="space-y-4"
      >
        <div>
          <label class="block mb-1 font-medium">VIN</label>
          <input
            v-model="form.VIN"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="เช่น 1HGCM82633A004352"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">ยี่ห้อ (Brand)</label>
          <input
            v-model="form.brand"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="เช่น Toyota"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">รุ่น (Model)</label>
          <input
            v-model="form.model"
            type="text"
            class="w-full p-2 border rounded"
            placeholder="เช่น Camry"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">ปี (Year)</label>
          <input
            v-model.number="form.year"
            type="number"
            min="1900"
            max="2100"
            class="w-full p-2 border rounded"
            placeholder="เช่น 2019"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">ราคา (Price)</label>
          <input
            v-model.number="form.price"
            type="number"
            min="0"
            class="w-full p-2 border rounded"
            placeholder="เช่น 500000"
          />
        </div>
        <div>
          <label class="block mb-1 font-medium">รายละเอียด (Description)</label>
          <textarea
            v-model="form.decs"
            class="w-full p-2 border rounded"
            placeholder="รายละเอียดเพิ่มเติม"
          ></textarea>
        </div>

        <div class="flex gap-4">
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {{ isEditing ? 'อัพเดต' : 'เพิ่ม' }}
          </button>
          <button
            type="button"
            @click="clearForm"
            class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            ล้างค่า
          </button>
        </div>
      </form>
    </div>
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full border-collapse border border-gray-300">
        <thead class="bg-gray-100">
          <tr>
            <th align="center" class="border border-gray-300 p-2">VIN</th>
            <th align="center" class="border border-gray-300 p-2 ">ยี่ห้อ</th>
            <th align="center" class="border border-gray-300 p-2 ">รุ่น</th>
            <th align="center" class="border border-gray-300 p-2 ">ปี</th>
            <th align="center" class="border border-gray-300 p-2 ">ราคา</th>
            <th align="center" class="border border-gray-300 p-2 ">รายละเอียด</th>
            <th align="center" class="border border-gray-300 p-2 ">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="vehicle in dataCar"
            :key="vehicle.id"
            class="hover:bg-gray-50"
          >
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.VIN }}</td>
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.brand }}</td>
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.model }}</td>
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.year }}</td>
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.price }}</td>
            <td align="center" class="border border-gray-300 p-2">{{ vehicle.decs }}</td>
            <td align="center" class="border border-gray-300 p-2 space-x-2">
              <div class="flex flex-row justify-center items-center">
              <button
                @click="editVehicle(vehicle)"
                class="px-2 py-1 text-sky-500 rounded hover:text-sky-600 cursor-pointer"
              >
                แก้ไข
              </button>
              <button
                @click="deleteVehicle(vehicle.id)"
                class="px-2 py-1 text-red-500 rounded hover:text-red-600 cursor-pointer"
              >
                ลบ
              </button>
              </div>
            </td>
          </tr>
          <tr v-if="dataCar.length === 0">
            <td colspan="7" class="p-4 text-center text-gray-500">
              ไม่มีข้อมูลรถ
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
