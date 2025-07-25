/// <reference types="vite/client" />
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_MODE: string;
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}
