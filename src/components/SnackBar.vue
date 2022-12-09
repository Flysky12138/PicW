<template>
  <v-snackbar v-model="show" v-bind="options">
    {{ content }}
    <template #actions>
      <v-btn color="blue" variant="text" @click="handleClick.event">{{ handleClick.text }}</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { storeToRefs } from 'pinia'

const { show, content, options, handleClick } = storeToRefs(useSnackBarStore())
</script>
