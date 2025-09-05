<template>
    <div class="w-full h-full">
        <a-menu mode="inline" class="overflow-y-auto h-full hide-scrollbar" :inlineIndent="8" :items="menuItems"
            @openChange="onOpenChange" v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import type { ModuleItem, ModuleTab } from '@/models/moduleItemModel';
import { useModuleTabsStore } from '@/stores/moduleTabs';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';
import { getIcon } from "@/utils/icon-transfer";
import { Modal, type MenuProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
const { t } = useI18n();

const moduleTabsStore = useModuleTabsStore();
const { activeModuleTab } = storeToRefs(moduleTabsStore);
const rootSubmenuKeys = ref<Key[]>([]);
const openKeys = ref<Key[]>([]);
const selectedKeys = ref<string[]>([]);
let lastOpenKeys: Key[] = [];
const props = defineProps({
  menuList:{
    type:Array<ModuleItem>,
    required:true,
    default:[]
  }
})
const menuItems = computed(() => convertToMenuItems(props.menuList));
// 初始化菜单展开状态
watch(() => props.menuList, (newList) => {
  rootSubmenuKeys.value = newList.map(item => item.Id as string);
  if (newList.length > 0 && openKeys.value.length === 0) {
    openKeys.value = [newList[0].Id as string];
    lastOpenKeys = [...openKeys.value]; // 同步初始化
  }
}, { immediate: true });
watch(activeModuleTab, (newVal) => {
    selectedKeys.value = [newVal];
});

const convertToMenuItems = (
    items: ModuleItem[],
    parentNames: string[] = []
): MenuProps['items'] => {
    return items.map(item => ({
        key: item.Id,
        label: item.DisplayName,
        icon: () => h('img', { src: getIcon(item.Icon), style: "width: 16px" }),
        children: item.SubModulesList?.length !== 0
            ? convertToMenuItems(item.SubModulesList as ModuleItem[], [...parentNames, item.DisplayName])
            : undefined,
        // 如果是三级菜单（没有子菜单），添加点击事件
        ...(!item.SubModulesList || item.SubModulesList.length === 0 ? {
            onClick: () => handleItemClick(item, parentNames)
        } : {})
    }));
};

const handleItemClick = (item: ModuleItem, parentNames: string[]) => {
    const selectedModule: ModuleTab = {
        Url: item.Url as string,
        Closable: true,
        MenuPath: [...parentNames, item.DisplayName],
        Loading:true,
        Id: item.Id
    };

    const index = moduleTabsStore.moduleTabList.findIndex(
        module => module.Id === item.Id
    );

    if (index === -1) {
      // 这里打开激活的菜单
      if(moduleTabsStore.moduleTabList.length > 10){
        Modal.confirm({
          title:t('warning'),
          content:t('module.moreWarningTips'),
          okText:t('confirm'),
          cancelText:t('cancel'),
          onOk:()=>{
            moduleTabsStore.addModuleTab(selectedModule);
          }
        })
      }
      else{
        moduleTabsStore.addModuleTab(selectedModule);
      }

    } else {
        moduleTabsStore.setActiveModuleTab(moduleTabsStore.moduleTabList[index].Id);
    }
};

const onOpenChange = (keys: Key[]) => {
    // 找到新增的key（可能是最新点击的）
    const latestOpenKey = keys.find(key => !lastOpenKeys.includes(key));
    // 如果操作的是二级/三级菜单，不做限制
    if (!latestOpenKey || !rootSubmenuKeys.value.includes(String(latestOpenKey))) {
        lastOpenKeys = [...keys];
        openKeys.value = keys;
        return;
    }
    // 如果操作的是一级菜单，强制只展开当前项
    openKeys.value = latestOpenKey ? [latestOpenKey] : [];
    lastOpenKeys = latestOpenKey ? [latestOpenKey] : [];
};


</script>

<style scoped>
</style>
