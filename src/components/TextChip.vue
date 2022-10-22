<template>
  <v-tooltip open-on-hover open-delay="500" location="top center" origin="overlap" scroll-strategy="close">
    <template #activator="{ props }">
      <v-chip
        v-bind="props"
        label
        color="success"
        class="d-inline-block text-truncate link-copy w-100"
        :text="text"
        v-copy="{
          copyText: text,
          prependText: `【 ${label} 】`
        }"
        @click="() => {}"
        :disabled="disabled"
      >
        <template #prepend>
          <v-chip label color="deep-orange" :text="label"></v-chip>
        </template>
      </v-chip>
    </template>
    <span class="word-wrap">{{ text }}</span>
  </v-tooltip>
</template>

<script setup lang="ts">
defineProps<{
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
.word-wrap {
  word-wrap: break-word;
}
</style>
