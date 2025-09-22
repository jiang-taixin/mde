<template>
  <div class="h-full w-full">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const userProfileStore = useUserProfileStore();

// 监听语言切换
watch(locale, () => {
  document.title = t('app.title');
}, { immediate: true });

// 检查用户角色权限
onMounted(() => {
  if(userProfileStore.userProfile?.Token){
    getPrincipals().then(res => {
    if(res.length === 0){
      userProfileStore.clearUserProfile();
      userProfileStore.clearActivePrincipal();
      userProfileStore.setRememberMe(false);
      router.push("/no-access");
    }
    else{
      userProfileStore.setPrincipals(res);
    }
  }).catch(error => {})
  }

})

</script>

<style scoped></style>
