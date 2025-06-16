<template>
    <div class="w-full h-auto">
        <div class="transition-all duration-300 ease-in-out transform origin-center flex items-center bg-primary-200 px-5 h-7"
            :class="[!props.collapsed && 'scale-100 opacity-100', props.collapsed && 'scale-0 opacity-0 h-0 overflow-hidden']">
            Navigate Explorer
        </div>
        <a-menu mode="inline" class="bg-primary-200" :items="menuItems" @openChange="onOpenChange"
            v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import type { ModuleItem, ModuleTab } from '@/models/ModuleItem';
import { getModulesList } from '@/services/module-service';
import { useModuleTabsStore } from '@/stores/moduleTabs';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import { getIcon } from "@/utils/icon-transfer";
import type { MenuProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';

const moduleTabsStore = useModuleTabsStore();
const { activeModuleTab } = storeToRefs(moduleTabsStore);
const menuList = ref<ModuleItem[]>([]);
const rootSubmenuKeys = ref<Key[]>([]);
const openKeys = ref<Key[]>([]);
const selectedKeys = ref<string[]>([]);
let lastOpenKeys: Key[] = [];
const menuItems = computed(() => convertToMenuItems(menuList.value));
onMounted(async () => {
    const res = await getModulesList("ssss");
    menuList.value = res;
    // 提取所有一级菜单的 ID
    rootSubmenuKeys.value = menuList.value.map(item => item.ID as string);
    // 默认展开第一个一级菜单
    if (menuList.value.length > 0) {
        openKeys.value = [menuList.value[0].ID as string];
    }
});

const props = defineProps({
    collapsed: {
        type: Boolean,
        required: true,
        default: false
    },
});

watch(activeModuleTab, (newVal) => {
    selectedKeys.value = [newVal];
});


const itemClick = (moduleItem: ModuleItem, rootModuleName: string, moduleModuleName: string) => {
    const selectedModule: ModuleTab = {
        DisplayName: moduleItem.DisplayName,
        Url: moduleItem.ID as string,
        closable: true,
        loading: true,
        menuPath: [
            rootModuleName,
            moduleModuleName,
            moduleItem.DisplayName
        ],
        ID: moduleItem.ID
    };

    const index = moduleTabsStore.moduleTabList.findIndex(
        (module) => module.ID === moduleItem.ID
    );

    if (index === -1) {
        moduleTabsStore.addModuleTab(selectedModule);
    } else {
        moduleTabsStore.setActiveModuleTab(moduleTabsStore.moduleTabList[index].ID);
    }
};

const convertToMenuItems = (
    items: ModuleItem[],
    parentNames: string[] = []
): MenuProps['items'] => {
    return items.map(item => ({
        key: item.ID,
        label: item.DisplayName,
        icon: () => h('img', { src: getIcon(item.Icon) }),
        children: item.SubModulesList
            ? convertToMenuItems(item.SubModulesList, [...parentNames, item.DisplayName])
            : undefined,
        // 如果是三级菜单（没有子菜单），添加点击事件
        ...(!item.SubModulesList ? {
            onClick: () => handleItemClick(item, parentNames)
        } : {})
    }));
};

const handleItemClick = (item: ModuleItem, parentNames: string[]) => {
    console.log('点击的三级菜单:', item.DisplayName);
    console.log('一级菜单名:', parentNames[0]);
    console.log('二级菜单名:', parentNames[1]);

    const selectedModule: ModuleTab = {
        DisplayName: item.DisplayName,
        Url: item.ID as string,
        closable: true,
        loading: true,
        menuPath: [...parentNames, item.DisplayName],
        ID: item.ID
    };

    const index = moduleTabsStore.moduleTabList.findIndex(
        module => module.ID === item.ID
    );

    if (index === -1) {
        moduleTabsStore.addModuleTab(selectedModule);
    } else {
        moduleTabsStore.setActiveModuleTab(moduleTabsStore.moduleTabList[index].ID);
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
    openKeys.value = [latestOpenKey];
    lastOpenKeys = [latestOpenKey];
};


</script>

<style scoped></style>