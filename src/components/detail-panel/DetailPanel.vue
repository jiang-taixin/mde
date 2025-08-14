<template>
  <div class="flex justify-end gap-2 w-full">
    <a-button class="w-28" size="small">{{ t('save') }}</a-button>
    <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const emit = defineEmits(['closeCallback']);

const close = () => {
  emit('closeCallback');
}

</script>
