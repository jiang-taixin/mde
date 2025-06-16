<template>
    <div class="w-full h-auto">
        <div class="transition-all duration-300 ease-in-out transform origin-center flex items-center bg-primary-200 px-5 h-7"
            :class="[!props.collapsed && 'scale-100 opacity-100', props.collapsed && 'scale-0 opacity-0 h-0 overflow-hidden']">
            Navigate Explorer
        </div>
        <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" theme="light" mode="inline"
            @openChange="handleOpenChange">
            <template v-for="rootModule in menuList" :key="rootModule.ID">
                <!-- 一级菜单 -->
                <a-sub-menu v-if="rootModule.SubModulesList" :key="rootModule.ID">
                    <template #icon>
                        <img :src="getIcon(rootModule.Icon)" />
                    </template>
                    <template #title>{{ rootModule.DisplayName }}</template>

                    <!-- 二级菜单 -->
                    <template v-for="moduleModule in rootModule.SubModulesList" :key="moduleModule.ID">
                        <a-sub-menu v-if="moduleModule.SubModulesList" :key="moduleModule.ID">
                            <template #icon>
                                <img :src="getIcon(moduleModule.Icon)" />
                            </template>
                            <template #title>{{ moduleModule.DisplayName }}</template>

                            <!-- 三级菜单 -->
                            <a-menu-item v-for="pageModule in moduleModule.SubModulesList" :key="pageModule.ID"
                                @click="itemClick(pageModule, rootModule.DisplayName, moduleModule.DisplayName)">
                                <template #icon>
                                    <img :src="getIcon(pageModule.Icon)" />
                                </template>
                                {{ pageModule.DisplayName }}
                            </a-menu-item>
                        </a-sub-menu>
                    </template>
                </a-sub-menu>
            </template>
        </a-menu>
    </div>
</template>

<script setup lang="ts">
import type { ModuleItem, ModuleTab } from '@/models/ModuleItem';
import { getModulesList } from '@/services/module-service';
import { useModuleTabsStore } from '@/stores/moduleTabs';
import { storeToRefs } from 'pinia';
import { ref, watch, onMounted } from 'vue';
import type { Key } from 'ant-design-vue/es/_util/type';

const moduleTabsStore = useModuleTabsStore();
const { activeModuleTab } = storeToRefs(moduleTabsStore);
const menuList = ref<ModuleItem[]>([]);
const selectedKeys = ref<string[]>([activeModuleTab.value as string]);
const openKeys = ref<Key[]>([]);

import { getIcon } from "@/utils/icon-transfer";

onMounted(async () => {
    const res = await getModulesList("ssss");
    menuList.value = res;
    // 默认展开第一个一级菜单
    if (menuList.value.length > 0 && menuList.value[0].SubModulesList) {
        openKeys.value = [menuList.value[0].ID];
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

// 处理菜单展开状态变化
const handleOpenChange = (keys: Key[]) => {
    // 找出最新变化的菜单项
    const latestChangedKey = keys.length > openKeys.value.length
        ? keys.find(key => !openKeys.value.includes(key))
        : openKeys.value.find(key => !keys.includes(key));
    console.log("---------------- handleOpenChange:" + latestChangedKey);
    if (!latestChangedKey) return;

    // 检查是否是二级或三级菜单
    const isSubMenu = menuList.value.some(root =>
        root.SubModulesList?.some(sub =>
            sub.ID === latestChangedKey ||
            sub.SubModulesList?.some(item => item.ID === latestChangedKey)
        )
    );

    if (!isSubMenu) {
        // 如果是一级菜单的点击，则切换其展开状态
        openKeys.value = keys.includes(latestChangedKey)
            ? [latestChangedKey]
            : [];
    } else {
        // 如果是子菜单的点击，保持当前展开状态
        openKeys.value = keys;
    }
};

const itemClick = (moduleItem: ModuleItem, rootModuleName: string, moduleModuleName: string) => {
    console.log("------ click item:" + JSON.stringify(moduleItem));

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
</script>

<style scoped></style>