import "./assets/styles/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// persistedstate
import { createPersistedState } from "pinia-plugin-persistedstate";
// i18n
import { i18n } from "./language";
// antdesignvue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(createPersistedState());
app.use(pinia).use(router).use(i18n).use(Antd);

app.mount("#app");
