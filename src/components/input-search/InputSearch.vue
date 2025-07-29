<template>
  <a-input-search v-model:value="keyword" :placeholder="props.placeholder" style="width: 100%;" :enter-button="true">
  </a-input-search>
</template>

<script lang="ts" setup>
const keyword = ref<string>('');
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
    default: ''
  },
});


</script>

<style scoped></style>
