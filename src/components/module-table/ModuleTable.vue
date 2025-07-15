<template>
    <div class="w-full h-full bg-red-300 flex flex-row">
      <div class="w-full h-8">操作栏</div>
      <div class="flex-1">表格</div>
    </div>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/moduleItemModel';
import { getIcon } from "@/utils/icon-transfer";
import type { Key } from 'ant-design-vue/es/_util/type';
import { LoadingOutlined } from '@ant-design/icons-vue';
const { t } = useI18n();

const moduleTabsStore = useModuleTabsStore();
const desktopModeule: ModuleTab = { Url: "desktop", Closable: false, MenuPath: [t("header.desktop")],Loading: false, Id: "desktop" };

onMounted(() => {
  if(!moduleTabsStore.moduleTabList.find(item => item.Id === 'desktop')){
    moduleTabsStore.addModuleTab(desktopModeule);
  }

})

const { activeModuleTab } = storeToRefs(moduleTabsStore);

const remove = (targetKey: string) => {
    moduleTabsStore.deleteModuleTab(targetKey);
};

const handleTabEdit = (e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => {
    console.log("handleTabEdit:" + e);
    remove(e as string);
}

</script>
<style lang="sass">
</style>
