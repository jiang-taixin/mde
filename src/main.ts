import "./assets/styles/index.scss";

import { createApp } from "vue";
import { createPinia } from "pinia";
// i18n
import { i18n,setupI18n } from "./language";

import App from "./App.vue";
import router from "./router";

// persistedstate
import { createPersistedState } from "pinia-plugin-persistedstate";

// antdesignvue
import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
// vxe table
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import VxeUIAll from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";

const app = createApp(App);

const pinia = createPinia();
pinia.use(createPersistedState());
app.use(pinia).use(router).use(i18n).use(Antd).use(VxeUITable).use(VxeUIAll);

setupI18n();

app.mount("#app");
