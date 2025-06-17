import { createRouter, createWebHistory } from "vue-router";
import Demo from "@/views/demo/index.vue";
import Home from "@/views/home/index.vue";

import { i18n } from "@/language/index";
const { t } = i18n.global;

enum OperationType {
  NoAccess = 1, // 无访问权限
  NotFound = 2, // 页面不存在
}
const getNode = (type: OperationType): VNode => {
  const commonClass = {
    class: "w-full h-full flex items-center justify-center bg-primary-300 text-white text-2xl",
  };
  const typeToTranslationKey: Record<OperationType, string> = {
    [OperationType.NoAccess]: "noAccess",
    [OperationType.NotFound]: "notFound",
  };
  const translationKey = typeToTranslationKey[type];
  return h("div", commonClass, t(translationKey));
};

const hideHeader = () => {
  return { hideHeader: true };
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      alias: "/",
    },
    {
      path: "/demo",
      name: "demo",
      component: Demo,
    },
    {
      path: "/no-access",
      name: "no-access",
      component: getNode(OperationType.NoAccess),
      meta: hideHeader(),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: getNode(OperationType.NotFound),
      meta: hideHeader(),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  next();
});

export default router;
