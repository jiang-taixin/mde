import enUS from "./en";
import zhCN from "./zh";
import { createI18n } from "vue-i18n";

export enum Language {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}

export const LanguageNames: Record<Language, string> = {
  [Language.ZH_CN]: "中文",
  [Language.EN_US]: "English",
};

let lang = Language.ZH_CN;

export const i18n = createI18n({
  legacy: false,
  locale: lang,
  globalInjection: true,
  messages: {
    "en-US": enUS,
    "zh-CN": zhCN,
  },
});

export function setupI18n(){
  const userProfileStore = useUserProfileStore();
  const {locale} = i18n.global;
  if(userProfileStore.userProfile?.Language){
    locale.value= userProfileStore.userProfile?.Language as Language;
  }
}
