<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#66BFFF',
    },
  }">
    <a-layout class="h-full flex">
      <a-layout-header class="px-0 h-auto">
        <Header />
      </a-layout-header>
      <a-layout class="flex-1">
        <a-layout-sider v-model:collapsed="collapsed" collapsible collapsedWidth="40" width="240" class="bg-white">
          <Sider :collapsed="collapsed">
          </Sider>
          <template #trigger>
            <div class="w-full flex items-center justify-center bg-white h-12 border-t-2">
              <img class="w-5" :src="open" v-if="collapsed" />
              <img class="w-5" :src="close" v-else />
            </div>
          </template>
        </a-layout-sider>
        <a-layout-content>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component v-if="$route.meta.keepAlive" :is="Component" :key="route.path" />
            </keep-alive>
            <component v-if="!$route.meta.keepAlive" :is="Component" :key="route.path" />
          </router-view>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getDateMessage, getEnglishDate } from './utils/datetime';
import { Language } from './language';
import open from "@/assets/images/menu/open.png";
import close from "@/assets/images/menu/collapsed.png";
const { t, locale } = useI18n();
const dateMessage = ref<string>();
const collapsed = ref<boolean>(false);
const route = useRoute();
// 监听语言切换
watch(locale, () => {
  document.title = t('app.title');
  if (locale.value === Language.ZH_CN) {
    dateMessage.value = getDateMessage();
  } else {
    dateMessage.value = getEnglishDate();

  }
}, { immediate: true });

</script>

<style scoped></style>
