<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#66BFFF',
      fontSize:13
    },
  }" :locale="antdLocale">
    <a-layout class="h-full flex">
      <a-layout-header :class="['px-0 h-auto']">
        <HeaderComponent :switchAccountCallback="switchAccount"></HeaderComponent>
      </a-layout-header>
      <a-layout class="flex-1">
        <a-layout-sider v-model:collapsed="collapsed" collapsible collapsedWidth="40" width="250" class="bg-white">
          <SiderComponent :menuList="menuList">
          </SiderComponent>
          <template #trigger>
            <div class="w-full flex items-center justify-center bg-white h-12 border-t-2">
              <img class="w-5" :src="open" v-if="collapsed" />
              <img class="w-5" :src="close" v-else />
            </div>
          </template>
        </a-layout-sider>
        <a-layout-content>
          <ModuleContainer />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-config-provider>

  <a-modal v-model:open="showPrincipalModal" :closable="false" :maskClosable="false" :title="$t('principal.title')">
    <SelectPrincipal v-model:principalID="principal.selectedPrincipalId" />
    <template #footer>
      <a-button type="primary" :disabled="isVoid(principal.selectedPrincipalId)" @click="signInClick">{{
        $t('principal.signin') }}</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import zhCN from "ant-design-vue/es/locale/zh_CN";
import enUS from "ant-design-vue/es/locale/en_US";
import dayjs from "dayjs";
import { isVoid } from '../../utils/datacheck';
import { useI18n } from 'vue-i18n';
import open from "@/assets/images/menu/open.png";
import close from "@/assets/images/menu/collapsed.png";
import SelectPrincipal from '@/components/select-principal/SelectPrincial.vue'
import { message } from 'ant-design-vue';
import { Language } from "@/language";
const { t, locale } = useI18n();
const collapsed = ref<boolean>(false);
const userProfileStore = useUserProfileStore();
const menuList = ref<ModuleItem[]>([]);
const principal = reactive({
  selectedPrincipalId: '',
})
const showPrincipalModal = ref<boolean>(false);
// 根据i18n对antd做本地化
const antdLocale = computed(() => {
  dayjs.locale(locale.value === Language.ZH_CN ? 'zh-cn' : 'en');
  return locale.value === Language.ZH_CN ? zhCN : enUS;
})

watch(() => userProfileStore.activePrincipal, () => {
  loadModules();
});


onMounted(async () => {
  // 如果没有设置记住我或者设置了但是当前用户角色列表里没有之前所设置的角色就重新选择角色
  if (!userProfileStore.rememberMe || !userProfileStore.hasActivePrincipal) {
    showPrincipalModal.value = true;
  }
  else {
    // 按照设置的角色ID获取菜单信息
    loadModules();
  }
})

const moduleTabsStore = useModuleTabsStore();
const desktopModeule: ModuleTab = { Url: "desktop", Closable: false, MenuPath: [t("header.desktop")], Loading: false, Id: "desktop" };

const loadModules = async () => {
  const res = await getModulesList(moduleId);
  if (res) {
    menuList.value = res;
    if (!moduleTabsStore.moduleTabList.find(item => item.Id === 'desktop')) {
      moduleTabsStore.addModuleTab(desktopModeule);
    }
  }
}

const signInClick = () => {
  if (isVoid(principal.selectedPrincipalId)) {
    message.error(t('principal.selectTips'));
    return;
  }

  userProfileStore.setActivePrincipal(principal.selectedPrincipalId);
  showPrincipalModal.value = false;
}

const switchAccount = async () => {
  userProfileStore.clearUserProfile();
  userProfileStore.clearActivePrincipal();
  userProfileStore.setRememberMe(false);
  const res = await login(true);
  if(res){
     // 假如角色列表是空的 没有权限
    if(res.Principals.length === 0){
      router.push('/no-access');
    }
    else{
      userProfileStore.setUserProfile(res);
      i18n.global.locale.value = res.Language as Language;
      router.go(0);
    }

  }
}

</script>

<style scoped></style>
