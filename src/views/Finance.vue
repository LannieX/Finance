<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const amount = ref<number | null>(null)
const interest = ref<number | null>(null)
const selectedInstallment = ref<number | null>(null)

const installmentOptions = Array.from({ length: 73 }, (_, i) => i + 12)

const clearFields = () => {
  amount.value = null
  interest.value = null
  selectedInstallment.value = null
}

const calculatePayment = (months: number): number => {
  if (!amount.value || !interest.value) return 0
  const totalInterest = (amount.value * (interest.value / 100)) * (months / 12)
  const total = amount.value + totalInterest
  return total / months
}

const monthlyPayment = computed(() => {
  if (!amount.value || !interest.value || !selectedInstallment.value) return 0
  return calculatePayment(selectedInstallment.value)
})
</script>

<template>
  <div class="min-h-screen flex flex-col w-full p-5 bg-gray-100">
    <div class="flex justify-start items-center w-full p-12 h-[70px]">
    <h1 class="text-[24px] font-bold">คำนวณยอดผ่อน</h1>
    </div>
    <div class="flex flex-row justify-start gap-4 mb-6">
      <div class="w-[20%]">
        <label class="block font-medium mb-1">ยอดจัด (บาท)</label>
        <input
          v-model.number="amount"
          type="number"
          min="0"
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="w-[20%]">
        <label class="block font-medium mb-1">ดอกเบี้ยต่อปี (%)</label>
        <input
          v-model.number="interest"
          type="number"
          min="0"
          step="0.01"
          class="w-full p-2 border rounded"
        />
      </div>
      <div class="w-[20%]">
        <label class="block font-medium mb-1">จำนวนงวด (เดือน)</label>
        <select
          v-model.number="selectedInstallment"
          class="w-full p-2 border rounded"
        >
          <option value="" disabled>-- เลือกงวด --</option>
          <option
            v-for="months in installmentOptions"
            :key="months"
            :value="months"
          >
            {{ months }} งวด
          </option>
        </select>
      </div>
      <div class="flex items-end">
        <button
          @click="clearFields"
          class="w-full px-4 py-2 bg-red-400 !important text-black rounded hover:bg-red-600 cursor-pointer"
        >
          เคลียร์ค่า
          <i class="tabler-refresh" />
        </button>
      </div>
    </div>
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full border">
        <thead>
          <tr class="bg-gray-200 text-left">
            <th class="p-2 border">งวด (เดือน)</th>
            <th class="p-2 border">ยอดผ่อนต่อเดือน (บาท)</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="months in installmentOptions"
            :key="months"
            @click="selectedInstallment = months"
            :class="[
              'cursor-pointer hover:bg-gray-100',
              selectedInstallment === months ? 'bg-orange-300 font-semibold' : ''
            ]"
          >
            <td class="p-2 border">{{ months }}</td>
            <td
              class="p-2 border"
              :class="calculatePayment(months) > 5000 ? 'text-red-600 font-bold' : ''"
            >
              {{ calculatePayment(months).toFixed(2) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="selectedInstallment" class="mt-6 bg-white p-4 rounded shadow">
      <p class="text-lg font-semibold">
        ยอดผ่อนต่อเดือนสำหรับ {{ selectedInstallment }} งวด: 
        {{ monthlyPayment.toFixed(2) }} บาท
      </p>
    </div>
  </div>
</template>
