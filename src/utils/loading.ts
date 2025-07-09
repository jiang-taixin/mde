import { createApp, h, ref, type App } from "vue";
import { Spin } from "ant-design-vue";
import { debounce } from "lodash";
const { t } = i18n.global;

let loadingInstance: App<Element> | null = null;
let loadingCount = 0;
const debounceDelay = 500;
const isLoading = ref(false);

const createLoading = () => {
  if (loadingInstance) return;

  const div = document.createElement("div");
  div.id = "global-loading";
  div.style.cssText = `position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  document.body.appendChild(div);

  loadingInstance = createApp({
    render() {
      return h(Spin, {
        size: "large",
        tip: t('loading'),
        spinning: true,
      });
    },
  });
  loadingInstance.mount(div);
};

const destroyLoading = () => {
  if (loadingInstance) {
    loadingInstance.unmount();
    const div = document.getElementById("global-loading");
    if (div) document.body.removeChild(div);
    loadingInstance = null;
  }
};

const createDebouncedShowLoading = () => {
  return debounce(() => {
    loadingCount++;
    if (loadingCount === 1) {
      createLoading();
      isLoading.value = true;
    }
  }, debounceDelay);
};

let debouncedShowLoading = createDebouncedShowLoading();

export const showLoading = () => {
  debouncedShowLoading();
};

export const hideLoading = () => {
  debouncedShowLoading.cancel();

  if (loadingCount > 0) {
    loadingCount--;
  }
  if (loadingCount === 0) {
    destroyLoading();
    isLoading.value = false;
    debouncedShowLoading = createDebouncedShowLoading();
  }
};
