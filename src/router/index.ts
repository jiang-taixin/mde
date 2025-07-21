import { createRouter, createWebHistory } from "vue-router";
import Demo from "@/views/demo/DemoPage.vue";
import Home from "@/views/home/HomePage.vue";

import { i18n, Language } from "@/language/index";
import { useUserProfileStore } from "@/stores/userProfile";
import { message } from "ant-design-vue";
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

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/home",
      name: "home",
      component: Home,
      alias: "/",
      meta: {requireAuth: true},
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
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: getNode(OperationType.NotFound),
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requireAuth) {
    const userProfileStore = useUserProfileStore();
    if (!userProfileStore.isAuthenticated) {
      const userData = await login();
      if (userData) {
        // 登录成功保存用户信息并设置语言环境
        userProfileStore.setUserProfile(userData);
        i18n.global.locale.value = userData.Language as Language;
        next();
      } else {
        message.error(t("loginError"));
        next(false);
      }
    }
    else{
      next();
    }
  } else {
    next();
  }
});

export default router;
