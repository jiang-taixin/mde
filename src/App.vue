<template>
  <div class="h-full w-full">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

// 监听语言切换
watch(locale, () => {
  document.title = t('app.title');
}, { immediate: true });

</script>

<style scoped></style>
