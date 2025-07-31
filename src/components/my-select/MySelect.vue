<template>
  <a-select v-bind="selectProps" @dropdownVisibleChange="handleDropdown">
    <!-- 显示 loading 占位项 -->
    <template v-if="loading">
      <a-select-option :value="null" disabled>
        <a-spin size="small" />
      </a-select-option>
    </template>

    <!-- 显示正常选项 -->
    <template v-else>
      <a-select-option v-for="option in options" :key="option.value" :value="option.value" :disabled="option.disabled">
        {{ option.label }}
      </a-select-option>
    </template>

    <slot />
  </a-select>
</template>

<script setup>
import { computed, useAttrs } from 'vue';

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

function handleDropdown(open) {
  emit('dropdownVisibleChange', open);
}
</script>
