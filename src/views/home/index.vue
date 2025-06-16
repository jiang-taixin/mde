<template>
    <a-tabs v-model:active-key="activeModuleTab" type="editable-card" tab-position="bottom" :hide-add="true"
        @edit="handleTabEdit" class="h-full">
        <a-tab-pane v-for="pane in moduleTabsStore.moduleTabList" :key="(pane.Url as string)" :closable="pane.closable">
            <template #tab>
                <span>
                    <template v-if="pane.Url === 'desktop'">
                        <!-- <HomeOutlined /> -->
                        <img :src="getIcon(null)"></img>
                    </template>
                    <template v-else>
                        <!-- <LoadingOutlined v-if="pane.loading" />
                        <ProfileOutlined v-else /> -->
                        <img :src="getIcon(null)"></img>
                    </template>
                    {{ pane.DisplayName }}
                </span>
            </template>
            <template v-if="pane.Url !== 'desktop'">
                <Content :moduleTab="pane" class="h-full" />
            </template>
        </a-tab-pane>
    </a-tabs>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/ModuleItem';
import { getIcon } from "@/utils/icon-transfer";
import type { Key } from 'ant-design-vue/es/_util/type';

const { t } = useI18n();

const moduleTabsStore = useModuleTabsStore();
const desktopModeule: ModuleTab = { DisplayName: t("header.desktop"), Url: "desktop", closable: false, loading: false, menuPath: [t("header.desktop")], ID: "desktop" };
moduleTabsStore.addModuleTab(desktopModeule);
const { activeModuleTab } = storeToRefs(moduleTabsStore);
console.log("---------- activeModuleTab:" + JSON.stringify(activeModuleTab));

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