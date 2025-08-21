<template>
  <a-select v-bind="selectProps" @dropdownVisibleChange="handleDropdown">
    <template v-if="loading">
      <a-select-option :value="null" disabled>
        <a-spin size="small" />
      </a-select-option>
    </template>
    <template v-else>
      <a-select-option v-for="option in options" :key="(option as any).value" :value="(option as any).value" :disabled="(option as any).disabled">
        {{ (option as any).label }}
      </a-select-option>
    </template>

    <slot />
  </a-select>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { useField } from '@formily/vue';
const field = useField();

const emit = defineEmits(['dropdownVisibleChange']);
const attrs = useAttrs();
const loading = computed(() => attrs.loading ?? false);
const options = computed(() => attrs.dataSource || attrs.options || []);
const selectProps = computed(() => {
  return {
    ...attrs,
    options:[]
  }
})

function handleDropdown(open:boolean) {
  emit('dropdownVisibleChange', open);
}
onMounted(() => {
  if(attrs.isStatus){
    // 如果是状态下拉框   默认是Active   Active的value=0
    (field.value as any).setValue(0);
  }
})
</script>
