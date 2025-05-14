import en from "./en";
import zhCN from "./zh";

import { createI18n } from "vue-i18n";
let lang = "zhCN";
export const i18n = createI18n({
  legacy: false,
  locale: lang,
  globalInjection: true,
  messages: {
    en,
    zhCN,
  },
});
