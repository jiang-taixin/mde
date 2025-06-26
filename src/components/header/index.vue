<template>
  <div :class="['flex items-center bg-header_bg px-5 justify-between bg-cover', expand ? 'h-16' : 'h-9']">
    <img :src="expand ? logo : logo_simple" :class="[expand ? 'h-[45%]' : 'h-1/2']" />
    <div class="h-9 px-3 flex items-center justify-between">
      <div class="h-full flex flex-row items-center gap-2">
        <a-dropdown-button class="flex items-center justify-center " type="text" trigger="click">
          <div class="flex items-center cursor-pointer text-white">
            <img :src="avatar" class="w-5 mr-2" />
            <span>{{ loginUser }}</span>
          </div>
          <template #icon>
            <img :src="down_circle" class="w-6" />
          </template>
          <template #overlay>
            <a-menu>
              <a-menu-item key="1" class="w-36">
                <a-row>
                  <a-col :span="5"></a-col>
                  <a-col :span="19">
                    <div @click="switchAccount">
                      {{ $t('header.switchAccount') }}
                    </div>
                  </a-col>
                </a-row>
              </a-menu-item>
              <a-menu-item key="1">
                <a-row>
                  <a-col :span="5">
                    <a-checkbox v-model:checked="checked" @change="rememberMe"></a-checkbox>
                  </a-col>
                  <a-col :span="19">
                    <div @click="rememberMe">
                      {{ $t('header.rememberMe') }}
                    </div>

                  </a-col>
                </a-row>
              </a-menu-item>

            </a-menu>
          </template>
        </a-dropdown-button>
        <a-select v-model:value="language" class="w-24" @change="changeLanguage">
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
import { useI18n } from 'vue-i18n'
import type { DefaultOptionType, SelectValue } from "ant-design-vue/es/select";
import logo from "@/assets/images/header/logo.png";
import logo_simple from "@/assets/images/header/logo-simple.png";
import avatar from "@/assets/images/header/avatar.png";
import down_circle from "@/assets/images/header/down-circle.png";
import down from "@/assets/images/header/down.png";
import up from "@/assets/images/header/up.png";
const { locale } = useI18n()
const checked = ref(false);
const language = ref<Language>(Language.ZH_CN);
const loginUser = ref<string>("");
const moduleTabsStore = useModuleTabsStore();
const { activeModuleTab } = storeToRefs(moduleTabsStore);
const languageOptions = computed(() => {
  return Object.values(Language).map(lang => ({
    value: lang,
    label: LanguageNames[lang],
  }));
});
const expand = ref<boolean>(true);
onMounted(() => {
  loginUser.value = "APAC\\JIANGT28[Development]";
})

const switchAccount = () => {
  console.log("click switchAccount");
}
const rememberMe = () => {
  console.log("click rememberMe:" + checked.value);
}
const changeLanguage = (value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => {
  console.log("click menu:" + value);
  locale.value = value as string;
}
const toggleExpand = () => {
  expand.value = !expand.value;
};
</script>
<style scoped></style>
