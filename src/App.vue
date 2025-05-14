<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#0095FF',
    },
  }">
    <a-layout class="h-full">
      <a-layout-header class="h-auto px-0 px">
        <Header />
      </a-layout-header>
      <a-layout>
        <a-layout-sider class="bg-primary-100" v-model:collapsed="collapsed" collapsible>
          <Sider />
          <template #trigger>
            <div class="bg-primary-200 flex items-center justify-center h-full">
              <a-button type="primary" shape="circle" size="large"
                class="bg-primary-300 flex items-center justify-center">
                <template #icon>
                  <MenuUnfoldOutlined v-if="collapsed" />
                  <MenuFoldOutlined v-else />
                </template>
              </a-button>
            </div>
          </template>
        </a-layout-sider>
        <a-layout-content class=" bg-white">
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>
</template>

<script setup lang="ts">
const collapsed = ref<boolean>(false);
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons-vue';


</script>

<style scoped></style>
