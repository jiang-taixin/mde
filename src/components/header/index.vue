<template>
  <div class="h-auto flex flex-col">
    <img :class="['w-full h-24', expand ? 'block' : 'hidden']" :src="banner" />
    <div class="w-full h-9 px-3 flex items-center justify-between">
      <div class="w-20 h-full flex items-center">
        <a-button type="primary" @click="desktopClick" class="flex items-center justify-center">
          <template #icon>
            <img :src="getIcon(null)" class="w-3 h-3 mr-2" />
          </template>
          {{
            $t("header.desktop")
          }}
        </a-button>
      </div>
      <div class="h-full flex flex-row items-center gap-2">
        <a-dropdown-button class="flex items-center justify-center" type="primary" trigger="click">
          <div class="flex items-center cursor-pointer">
            <img :src="getIcon(null)" class="w-3 h-3 mr-2" />
            <span>{{ loginUser }}</span>
          </div>
          <template #icon>
            <img :src="getIcon(null)" class="w-3 h-3" />
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
        <a-button class="flex items-center justify-center" type="primary" shape="circle" @click="toggleExpand">
          <template #icon>
            <img :src="expand ? getIcon(null) : getIcon(null)" class="w-4 h-4" />
          </template>
        </a-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import banner from "@/assets/images/header/banner.png";
import { getIcon } from "@/utils/icon-transfer";
import { Language, LanguageNames } from "@/language";
import { useI18n } from 'vue-i18n'
import type { DefaultOptionType, SelectValue } from "ant-design-vue/es/select";
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


const desktopClick = () => {
  console.log("click desktop");
  activeModuleTab.value = "desktop";
}
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
