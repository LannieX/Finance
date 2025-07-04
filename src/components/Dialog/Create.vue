<script setup lang="ts">
import { ref } from 'vue'

const isActive = ref(false)

defineExpose({ isActive })
</script>

<template>
  <v-dialog v-model="isActive" max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <slot name="activator" v-bind="activatorProps" />
    </template>

    <template v-slot:default>
      <v-card>
        <v-card-title>Dialog</v-card-title>
        <v-card-text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isActive = false">Close Dialog</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
