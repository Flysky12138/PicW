<template>
  <v-chip
    label
    color="success"
    class="d-inline-block text-truncate link-copy w-100"
    :text="props.text"
    v-copy="{
      copyText: props.text,
      prependText: `【 ${props.label} 】`
    }"
    @click="() => {}"
    :disabled="props.disabled"
  >
    <template #prepend>
      <v-chip label color="deep-orange" :text="props.label"></v-chip>
    </template>
  </v-chip>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  text: string
  disabled?: boolean
}>()
</script>

<style scoped lang="scss">
.link-copy:not(:last-child) {
  margin-bottom: 12px;
}
:deep() {
  user-select: none;
  .v-chip__prepend {
    margin-inline-start: -12px !important;
    .v-chip--label {
      border-end-end-radius: 0;
      border-start-end-radius: 0;
    }
  }
}
</style>
