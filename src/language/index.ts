import enUS from "./en";
import zhCN from "./zh";
import { createI18n } from "vue-i18n";
let lang = "zh-CN";

export enum Language {
  ZH_CN = "zh-CN",
  EN_US = "en-US",
}

export const LanguageNames: Record<Language, string> = {
  [Language.ZH_CN]: "中文",
  [Language.EN_US]: "English",
};

export const i18n = createI18n({
  legacy: false,
  locale: lang,
  globalInjection: true,
  messages: {
    "en-US": enUS,
    "zh-CN": zhCN,
  },
});
