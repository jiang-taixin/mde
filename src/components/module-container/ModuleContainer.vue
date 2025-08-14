<template>
    <a-tabs v-model:active-key="activeModuleTab" type="editable-card" :hide-add="true" @edit="handleTabEdit"
        class="h-full hide-more" :tab-bar-style="{ marginBottom: '0px' }" size="small" :moreIcon="null">
        <a-tab-pane v-for="pane in moduleTabsStore.moduleTabList" :key="(pane.Id as string)" :closable="pane.Closable">
            <template #tab>
                <span class="flex flex-row items-center w-max">
                    <template v-if="pane.Url === 'desktop'">
                        <img :src="getIcon('home')" class="w-4 h-4 mr-2"></img>
                    </template>
                    <template v-else>
                        <LoadingOutlined v-if="pane.Loading" />
                        <img v-else :src="getIcon('grid-header-icon')" class="w-4 h-5 mr-2"></img>
                    </template>
                    <div>{{ pane.MenuPath[pane.MenuPath.length-1] }}</div>
                </span>
            </template>
            <template v-if="pane.Url !== 'desktop'">
                <div class="m-2 rounded-lg h-full bg-white p-3 overflow-y-auto scrollbar-thin">
                    <ModuleContent :moduleTab="pane" />
                </div>
            </template>
        </a-tab-pane>
    </a-tabs>
</template>
<script setup lang="ts">
import { getIcon } from "@/utils/icon-transfer";
import type { Key } from 'ant-design-vue/es/_util/type';
import { LoadingOutlined } from '@ant-design/icons-vue';

const moduleTabsStore = useModuleTabsStore();
const { activeModuleTab } = storeToRefs(moduleTabsStore);

const remove = (targetKey: string) => {
    moduleTabsStore.deleteModuleTab(targetKey);
};

const handleTabEdit = (e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => {
    remove(e as string);
}

</script>
<style lang="sass">
</style>
