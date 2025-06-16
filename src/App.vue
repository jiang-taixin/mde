<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#66BFFF',
    },
  }" component-size="small">
    <a-layout class="h-full flex">
      <a-layout-header class="px-0 bg-white h-auto">
        <Header />
      </a-layout-header>
      <a-layout class="flex-1">
        <a-layout-sider class="bg-primary-300 " v-model:collapsed="collapsed" collapsible collapsedWidth="50">
          <Sider :collapsed="collapsed">
          </Sider>
          <template #trigger>
            <div style="background: #1890ff; color: white; text-align: center;">
              {{ collapsed ? '>' : '<' }} </div>
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
      <a-layout-footer
        :class="['h-6 w-full bg-primary-100 flex items-center justify-end', $route.meta.hideHeader && 'hidden']">
        {{ $t('footer.dateMessage', { week: getWeekNo(), date: dateMessage }) }}
      </a-layout-footer>
    </a-layout>
    <!-- <el-container class="h-screen flex flex-col">
      <el-header v-if="!$route.meta.hideHeader" class="h-auto px-0 bg-primary-100 shadow-sm">
        <Header />
      </el-header>
      <el-container class="flex flex-1 overflow-hidden">
        <el-aside v-if="!$route.meta.hideSidebar" class="btransition-all duration-300 flex flex-col"
          :style="{ width: collapsed ? '60px' : '240px' }">
          <Sider :collapsed="collapsed">
          </Sider>

          <div class="flex justify-center cursor-pointer hover:bg-primary-50 mb-0" @click="toggleCollapse">
            <el-icon :size="20">
              <component :is="collapsed ? 'expand' : 'fold'" class="text-primary-300 mb-3" />
            </el-icon>
          </div>
        </el-aside>
        <el-main class=" bg-white h-full p-0">
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component v-if="$route.meta.keepAlive" :is="Component" :key="route.path" />
            </keep-alive>
            <component v-if="!$route.meta.keepAlive" :is="Component" :key="route.path" />
          </router-view>
        </el-main>

      </el-container>
      <el-footer
        :class="['h-8 w-full bg-primary-100 flex items-center justify-end mb-0', $route.meta.hideHeader && 'hidden']">
        {{ $t('footer.dateMessage', { week: getWeekNo(), date: dateMessage }) }}
      </el-footer>
    </el-container> -->

  </a-config-provider>
</template>

<script setup lang="ts">
const collapsed = ref<boolean>(false);
const route = useRoute();
import { useI18n } from 'vue-i18n';
import { getWeekNo, getDateMessage, getEnglishDate } from './utils/datetime';
import { Language } from './language';
const { t, locale } = useI18n();
const dateMessage = ref<string>();
// 监听语言切换
watch(locale, () => {
  document.title = t('app.title');
  if (locale.value === Language.ZH_CN) {
    dateMessage.value = getDateMessage();
  } else {
    dateMessage.value = getEnglishDate();

  }
}, { immediate: true });

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

</script>

<style scoped></style>
