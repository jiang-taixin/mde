<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#66BFFF',
    },
  }">
    <a-layout class="h-full flex">
      <a-layout-header :class="['px-0 h-auto']">
        <Header :switchAccountCallback="switchAccount"></Header>
      </a-layout-header>
      <a-layout class="flex-1">
        <a-layout-sider v-model:collapsed="collapsed" collapsible
          collapsedWidth="40" width="240" :class="['bg-white']">
          <Sider :menuList="menuList" >
          </Sider>
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

  <a-modal
      v-model:open="showPrincipalModal"
      :closable="false"
      :maskClosable="false"
      :title="$t('principal.title')"
    >
      <SelectPrincipal v-model:principalID="principal.selectedPrincipalId"/>
      <template #footer>
        <a-button type="primary" :disabled="isVoid(principal.selectedPrincipalId)" @click="signInClick">{{ $t('principal.signin') }}</a-button>
      </template>
    </a-modal>
</template>

<script setup lang="ts">
import { isVoid } from '../../utils/datacheck';
import { useI18n } from 'vue-i18n';
import open from "@/assets/images/menu/open.png";
import close from "@/assets/images/menu/collapsed.png";
import SelectPrincipal from '@/components/select-principal/index.vue'
import { message } from 'ant-design-vue';
const { t } = useI18n();
const collapsed = ref<boolean>(false);
const userProfileStore = useUserProfileStore();
const menuList = ref<ModuleItem[]>([]);
const principal = reactive({
  selectedPrincipalId:'',
})
const showPrincipalModal = ref<boolean>(false);

watch(()=>userProfileStore.activePrincipal, ()=>{
  loadModules();
});


onMounted(async () => {
    // 如果没有设置记住我或者设置了但是当前用户角色列表里没有之前所设置的角色就重新选择角色
    if(!userProfileStore.rememberMe || !userProfileStore.hasActivePrincipal){
      showPrincipalModal.value = true;
    }
    else{
      // 按照设置的角色ID获取菜单信息
      loadModules();
    }
})

const loadModules = async () =>{
  console.log("-------------------load modules:"+userProfileStore.activePrincipal?.ID);
  const res = await getModulesList(moduleId,userProfileStore.activePrincipal?.ID as string);
  if(res){
    menuList.value = res;
  }
}

const signInClick = () =>{
  if(isVoid(principal.selectedPrincipalId)){
    message.error(t('principal.selectTips'));
    return;
  }

  userProfileStore.setActivePrincipal(principal.selectedPrincipalId);
  showPrincipalModal.value = false;
}

const switchAccount = ()=>{
  console.log("------switch account");
  userProfileStore.clearUserProfile();
  userProfileStore.clearActivePrincipal();
  userProfileStore.setRememberMe(false);
  router.go(0);
}

</script>

<style scoped></style>
