<template>
  <div :class="['flex items-center bg-header_bg px-5 justify-between bg-cover', expand ? 'h-16' : 'h-9']">
    <img :src="expand ? logo : logo_simple" :class="[expand ? 'h-[45%]' : 'h-1/2']" />
    <div class="h-9 px-3 flex items-center justify-between">
      <div class="h-full flex flex-row items-center gap-2">
        <a-dropdown-button class="flex items-center justify-center " type="text" trigger="click">
          <div class="flex items-center cursor-pointer text-white">
            <img :src="avatar" class="w-5 mr-2" />
            <span>{{ `${userProfile?.LogonName}[${activePrincipal?.Name}]` }}</span>
          </div>
          <template #icon>
            <img :src="down_circle" class="w-6" />
          </template>
          <template #overlay>
            <a-menu>
              <a-menu-item key="switch" class="w-[200px]">
                <a-row>
                  <a-col :span="3"></a-col>
                  <a-col :span="21">
                    <div @click="switchAccount">
                      {{ $t('header.switchAccount') }}
                    </div>
                  </a-col>
                </a-row>
              </a-menu-item>
              <template v-for="principal in userProfile?.Principals">
              <a-menu-item v-if="principal.ID !== activePrincipal?.ID"  :key="principal.ID" >
                <a-row >
                  <a-col :span="3"></a-col>
                  <a-col :span="21">
                    <div @click="switchPrincipal(principal.ID)">
                      {{ principal.Name }}
                    </div>
                  </a-col>
                </a-row>
              </a-menu-item>
              </template>
              <a-menu-item key="remember">
                <a-row>
                  <a-col :span="3">
                    <a-checkbox v-model:checked="rememberMe"></a-checkbox>
                  </a-col>
                  <a-col :span="21">
                    <div @click="switchRememberMe">
                      {{ $t('header.rememberMe') }}
                    </div>
                  </a-col>
                </a-row>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown-button>
        <a-select v-model:value="language" class="w-28" size="small" @change="changeLanguage">
          <a-select-option v-for="item in languageOptions" :value="item.value">{{ item.label }}</a-select-option>
        </a-select>
        <a-button class="flex items-center justify-center" type="text" shape="circle" @click="toggleExpand">
          <template #icon>
            <img :src="expand ? down : up" class="w-6" />
          </template>
        </a-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import { Language, LanguageNames } from "@/language";
import { useI18n } from 'vue-i18n';
import type { DefaultOptionType, SelectValue } from "ant-design-vue/es/select";
import logo from "@/assets/images/header/logo.png";
import logo_simple from "@/assets/images/header/logo-simple.png";
import avatar from "@/assets/images/header/avatar.png";
import down_circle from "@/assets/images/header/down-circle.png";
import down from "@/assets/images/header/down.png";
import up from "@/assets/images/header/up.png";
const { locale } = useI18n();

const userProfileStore = useUserProfileStore();
const language = ref<Language>(userProfileStore.userProfile?.Language as Language);
const {rememberMe, userProfile, activePrincipal } = storeToRefs(userProfileStore);
const languageOptions = computed(() => {
  return Object.values(Language).map(lang => ({
    value: lang,
    label: LanguageNames[lang],
  }));
});

const props = defineProps({
  switchAccountCallback:{
    type:Function,
    require:true,
  },
})
const expand = ref<boolean>(true);

const switchAccount = () => {
  props.switchAccountCallback!();
}

const switchPrincipal = (principalID:string) => {
  userProfileStore.setActivePrincipal(principalID);
}

const changeLanguage = (value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => {
  // 切换语言
  locale.value = value as string;
  userProfileStore.setLanguage(value as string);
  router.go(0);
}
const toggleExpand = () => {
  expand.value = !expand.value;
};

const switchRememberMe = () =>{
  rememberMe.value = !rememberMe.value;
}
</script>
<style scoped></style>
