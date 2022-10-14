<template>
  <v-snackbar v-model="show" v-bind="options">
    {{ content }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="show = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useSnackBarStore } from '@/plugins/stores/snackbar'
import { storeToRefs } from 'pinia'

const { show, content, options } = storeToRefs(useSnackBarStore())
</script>
