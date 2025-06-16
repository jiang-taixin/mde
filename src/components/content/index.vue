<template>
    <div class="max-h-full w-full flex flex-col">
        <div class="h-7 bg-primary-200 flex items-center flex-row pl-3">
            <template v-for="menuName in props.moduleTab.menuPath">
                <RightCircleOutlined class="pl-3" />
                <span class="ml-1">{{ menuName }}</span>
            </template>
        </div>
        <div class="h-7 bg-primary-200 flex items-center flex-row pl-3">
            <ProfileOutlined class="pl-3" /><span class="ml-1">{{ props.moduleTab.DisplayName }}</span>
        </div>
        <!-- 内容 -->
        <div class="flex-1">
            <!-- 主表 -->
            <div :class="['flex flex-col', moduleConfig?.HasSubConfig ? 'h-1/2' : 'h-full']">
                <!--主表操作栏-->
                <div class="h-8 flex items-center flex-row">
                    <div class="w-full h-6  flex flex-grow max-w-full gap-3">
                        <template v-for="comp in moduleConfig?.ComponentModelList">
                            <a-input-search v-if="comp.Type === ComponentType.SearchInput"
                                v-model:value="searchArguments.searchValue" :placeholder="comp.Title"
                                style="width: 200px">
                            </a-input-search>
                            <a-button v-if="comp.Type === ComponentType.Button" class="flex items-center">
                                <template #icon>
                                    <component :is="getIcon(comp.Icon)" />
                                </template>
                                {{ comp.Title }}
                            </a-button>
                        </template>
                    </div>
                </div>
                <!--主表数据表-->
                <div class="flex-1 w-full  ">
                    <a-table :row-selection="rowSelection" :columns="columns" :data-source="data" size="small"
                        :pagination="pagination" :scroll="{ y: '200px' }">
                        <template #bodyCell="{ column, text }">
                            <template v-if="column.dataIndex === 'name'">
                                <a>{{ text }}</a>
                            </template>
                        </template>
                    </a-table>
                </div>
            </div>
            <!-- 从表 -->
            <div class="h-1/2 " v-if="moduleConfig?.HasSubConfig">
                <a-tabs class="h-full">
                    <a-tab-pane v-for="subConfig in moduleConfig?.SubConfigList" :key="subConfig.ID"
                        :tab="subConfig.TabName">

                        <div class="w-full h-full flex flex-col">
                            <!--从表操作栏-->
                            <div class="w-full h-6  flex max-w-full gap-3">
                                <template v-for="comp in subConfig.ComponentModelList">
                                    <a-input-search v-if="comp.Type === ComponentType.SearchInput"
                                        v-model:value="searchArguments.searchValue" :placeholder="comp.Title"
                                        style="width: 200px">
                                    </a-input-search>
                                    <a-button v-if="comp.Type === ComponentType.Button" class="flex items-center">
                                        <template #icon>
                                            <component :is="getIcon(comp.Icon)" />
                                        </template>
                                        {{ comp.Title }}
                                    </a-button>
                                </template>
                            </div>
                            <!--从表数据表-->
                            <div class="w-full flex-1  ">
                                <a-table :scroll="{ y: '200px' }" :row-selection="rowSelection" :columns="columns"
                                    :data-source="data" :pagination="pagination">
                                    <template #bodyCell="{ column, text }">
                                        <template v-if="column.dataIndex === 'name'">
                                            <a>{{ text }}</a>
                                        </template>
                                    </template>
                                </a-table>

                            </div>
                        </div>

                    </a-tab-pane>
                </a-tabs>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/ModuleItem';
import { ComponentType } from '@/models/moduleConfig';
import { getIcon } from '@/utils/icon-transfer';

const props = defineProps({
    moduleTab: {
        type: Object as PropType<ModuleTab>,
        require: true,
        default: null
    },
});

const searchArguments = reactive({
    searchValue: '',
})

console.log(props.moduleTab.Url)

//const { data: moduleConfig } = getModuleConfig(props.moduleTab.Url.split('entity=')[1]);
onMounted(() => {

    //console.log("-----config data:" + JSON.stringify(moduleConfig.value));
    // 请求结束要切换tab的图标
    setTimeout(() => {
        props.moduleTab.loading = false;
    }, 5000);
})


const pagination = ref({
    current: 1,      // 当前页码
    pageSize: 10,    // 每页条数
    total: 100,      // 总数据量
    showSizeChanger: true, // 显示每页条数选择器
    showQuickJumper: true  // 显示快速跳转
});


</script>
<style scoped></style>
