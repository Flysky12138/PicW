<template>
  <prism-editor
    v-model="editorCode"
    :highlight="highlighter"
    line-numbers
    class="my-code rounded-lg elevation-3"
    @blur="onBlur"
  ></prism-editor>
</template>

<script setup lang="ts">
import beautify from 'js-beautify'
import { highlight, languages } from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { computed } from 'vue'
import { PrismEditor } from 'vue-prism-editor'
import 'vue-prism-editor/dist/prismeditor.min.css'

const props = defineProps<{
  modelValue: string
}>()
const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

// 定义组件 v-model
const editorCode = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value)
  }
})

// 代码内容处理
const highlighter = (code: string) => highlight(code, languages.js, 'js')

// 替换代码中相似的中文字符
const replaceCharacter = (code: string) =>
  [
    ['（', '('],
    ['）', ')'],
    ['，', ','],
    ['：', ':'],
    ['‘', "'"],
    ['”', '"'],
    ['？', '?']
  ].reduce((pre, cur) => pre.replaceAll(cur[0], cur[1]), code)

// 格式化代码
const onBlur = () => {
  editorCode.value = beautify(replaceCharacter(editorCode.value), {
    indent_size: 2
  })
}
</script>

<style scoped lang="scss">
.my-code {
  background: #3b3b3b;
  color: #ccc;
  font-family: Fira code, Fira Mono, Consolas, Menlo, Courier, monospace;
  font-size: 1.1em;
  line-height: 1.4em;
  padding: 5px;
}
:deep() {
  .prism-editor__editor,
  .prism-editor__textarea {
    padding: 0.2em 0.5em;
  }
  .prism-editor__textarea:focus {
    outline: none;
  }
}
</style>
