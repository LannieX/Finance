<script setup>
import Sidebar from './components/Sidebar.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// watch(
//   () => route.path,
//   (newPath) => {
//     if (newPath === '/Login') {
//       clearForm()
//     }
//   }
// )
</script>

<template>
  <div class="flex min-h-screen min-w-screen">
    <Sidebar v-if="route.path !== '/Login'" />
    <div class="flex-1">
      <router-view />
    </div>
  </div>
</template>

