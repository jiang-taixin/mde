<template>
    <div class="w-full flex flex-col h-full">
        <!--路径-->

        <div class="h-6 flex items-center flex-row justify-between">
            <a-breadcrumb separator=">">
                <a-breadcrumb-item v-for="(menuName, index) in props.moduleTab.menuPath">
                    {{ index !== props.moduleTab.menuPath.length - 1 ? menuName : '' }}
                </a-breadcrumb-item>
            </a-breadcrumb>
            <div class="flex flex-row">
                <img :src="clock" class="w-5 h-5 mr-2" />{{ $t('footer.dateMessage', {
                    week: getWeekNo(), date: dateMessage
                })
                }}
            </div>
        </div>
        <!--页面标题-->
        <div class="h-6 flex items-center flex-row my-2">
            <span class="font-bold text-lg">{{ props.moduleTab.DisplayName }}</span>
        </div>
        <!-- 内容 -->
        <div class="flex-1">
            <!-- 主表 -->
            <div :class="['flex flex-col w-full', moduleConfig?.HasSubConfig ? 'h-1/2' : 'h-full']" ref="mainTableRef">
                <!--主表操作栏-->

                <div class="w-full max-h-8 flex flex-grow gap-1">
                    <a-input-search
                        v-if="moduleConfig?.ComponentModelList.findIndex((item) => item.Type === ComponentType.SearchInput) !== -1"
                        v-model:value="searchArguments.searchValue" style="width: 150px">
                    </a-input-search>
                    <div class="flex gap-1">
                        <template v-for="comp in moduleConfig?.ComponentModelList">
                            <a-button v-if="comp.Type === ComponentType.Button" class="flex items-center gap-1">
                                <template #icon>
                                    <img :src="getIcon(comp.Icon)" class="w-4 h-4" />
                                </template>
                                {{ comp.Title }}
                            </a-button>
                        </template>
                    </div>
                </div>
                <!--主表数据表-->
                <div class="flex-1 w-full ">
                    <a-table class="mt-2 custom-table" :columns="columns" :data-source="data"
                        :scroll="{ x: 'max-content', y: 600 }" :pagination="false" size="small"
                        :row-selection="{ selectedRowKeys: mainSelectedRowKeys, onChange: onMainSelectChange }"
                        @resizeColumn="handleResizeColumn">
                        <template #headerCell="{ column }">

                            <div style="display: flex; align-items: center;">
                                <span style="margin-right: 8px;">{{ column.title }}</span>
                                <a-button type="link" size="small">
                                    操作
                                </a-button>
                            </div>


                        </template>
                        <template #bodyCell="{ column }">
                            <template v-if="column.key === 'operation'">
                                <a class="text-primary-300">Detail</a>
                            </template>
                            <template v-if="column.key === 'history'">
                                <a class="text-primary-300">History</a>
                            </template>
                        </template>
                    </a-table>
                    <div class="flex justify-end mt-2 border-b-2 pb-2">
                        <a-pagination size="small" :total="50" :show-total="total => `Total ${total} items`"
                            show-size-changer show-quick-jumper />
                    </div>
                </div>
            </div>
            <!-- 从表 -->
            <div class="max-h-1/2 " v-if="moduleConfig?.HasSubConfig">
                <a-tabs class="max-h-full" :tab-bar-style="{ marginBottom: '4px' }" size="small">
                    <a-tab-pane v-for="subConfig in moduleConfig?.SubConfigList" :key="subConfig.ID"
                        :tab="subConfig.TabName">

                        <div class="w-full h-full flex flex-col">
                            <!--从表操作栏-->
                            <div class="w-full max-h-8 flex flex-grow gap-1">
                                <a-input-search
                                    v-if="subConfig.ComponentModelList.findIndex((item) => item.Type === ComponentType.SearchInput) !== -1"
                                    v-model:value="searchArguments.searchValue" style="width: 150px">
                                </a-input-search>

                                <template v-for="comp in subConfig.ComponentModelList">
                                    <a-button v-if="comp.Type === ComponentType.Button" class="flex items-center gap-2">
                                        <template #icon>
                                            <img :src="getIcon(comp.Icon)" class="w-4 h-4" />
                                        </template>
                                        {{ comp.Title }}
                                    </a-button>
                                </template>

                            </div>

                            <!--从表数据表-->
                            <div class="w-full flex-1" ref="subTableRef">
                                <a-table class="custom-table mt-2" :columns="columns" :data-source="data"
                                    :scroll="{ x: 'max-content', y: 180 }" :pagination="false" size="small"
                                    :row-selection="{ selectedRowKeys: subSelectedRowKeys, onChange: onSubSelectChange }">
                                    <template #bodyCell="{ column }">
                                        <template v-if="column.key === 'operation'">
                                            <a>action</a>
                                        </template>
                                    </template>
                                </a-table>
                                <div class="flex justify-end mt-2">
                                    <a-pagination size="small" :total="50" :show-total="total => `Total ${total} items`"
                                        show-size-changer show-quick-jumper />
                                </div>
                            </div>
                        </div>

                    </a-tab-pane>
                </a-tabs>
            </div>

        </div>
    </div>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/moduleItemModel';
import { ComponentType, type ModuleConfig } from '@/models/moduleConfigModel';
import clock from "@/assets/images/others/clock.png";
import { getWeekNo } from "@/utils/datetime";
import { getIcon } from '@/utils/icon-transfer';
const { locale } = useI18n();
const dateMessage = ref<string>();
const mainTableRef = ref<HTMLElement | null>(null);
const mainTableheight = ref<string | number>(0);
const subTableRef = ref<HTMLElement | null>(null);
const mainSelectedRowKeys = ref<Key[]>([]);
const subSelectedRowKeys = ref<Key[]>([]);

onMounted(() => {
    const mainTable = mainTableRef.value;
    console.log("---------- main table :" + JSON.stringify(mainTable));
    if (mainTable) {
        mainTableheight.value = mainTable.offsetHeight - 80;
        console.log("---------- main table height:" + mainTableheight.value);
    }
})

// 监听语言切换
watch(locale, () => {
    if (locale.value === Language.ZH_CN) {
        dateMessage.value = getDateMessage();
    } else {
        dateMessage.value = getEnglishDate();

    }
}, { immediate: true });

const moduleConfig = ref<ModuleConfig>();

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


onMounted(async () => {
    const res = await getModuleConfig(props.moduleTab.Url.split('entity=')[1]);
    moduleConfig.value = res;
    //console.log("-----config data:" + JSON.stringify(moduleConfig.value));
    // 请求结束要切换tab的图标
    setTimeout(() => {
        props.moduleTab.loading = false;
    }, 5000);
})


import type { TableColumnsType } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import { Toolbar } from 'vxe-table';
const columns: TableColumnsType = [
    { title: '编码', width: 100, dataIndex: 'code', key: 'code', fixed: 'left', resizable: true, },
    { title: '英文名', width: 100, dataIndex: 'name', key: 'name', resizable: true, },
    { title: 'HR省', dataIndex: 'hrpro', key: 'hrpro', resizable: true, width: 150 },
    { title: 'HR城市', dataIndex: 'hrcity', key: 'hrcity', resizable: true, width: 150 },
    { title: '中文名', dataIndex: 'chname', key: 'chname', resizable: true, width: 150 },
    { title: '性别', dataIndex: 'sex', key: 'sex', width: 150 },
    { title: 'NTID', dataIndex: 'ntid', key: 'ntid', width: 150 },
    { title: '职位', dataIndex: 'po', key: 'po', width: 150 },
    { title: '部门编码', dataIndex: 'depcode', key: 'depcode', width: 150 },
    { title: '部门中文名', dataIndex: 'depname', key: 'depname', width: 150 },
    { title: 'HR部门编码', dataIndex: 'hrdepcode', key: 'hrdepcode', width: 150 },
    { title: 'HR部门名称', dataIndex: 'hrdepname', key: 'hrdepname', width: 150 },
    { title: '主管中文名', dataIndex: 'hrname', key: 'hrname', width: 30 },
    { title: '是否在职', dataIndex: 'active', key: 'active', width: 150 },
    { title: '工作代码', dataIndex: 'workcode', key: 'workcode', width: 150 },
    {
        title: '历史', key: 'history', fixed: 'right',
        width: 100,
    },
    {
        title: '详细',
        key: 'operation',
        fixed: 'right',
        width: 100,
    },
];

interface DataItem {
    code: string;
    name: string;
    hrpro: string;
    hrcity: string;
    chname: string;
    sex: string;
    ntid: string;
    po: string;
    depcode: string;
    depname: string;
    hrdepcode: string;
    hrdepname: string;
    hrname: string;
    active: string;
    workcode: string;
}

const data: DataItem[] = [{
    code: '010721',
    name: 'lyer, Uma R',
    hrpro: '北京',
    hrcity: '北京市',
    chname: 'lyer, Uma R',
    sex: 'M',
    ntid: 'LUR21',
    po: '经理',
    depcode: '810510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}, {
    code: '010733',
    name: 'Paul H',
    hrpro: '上海',
    hrcity: '上海市',
    chname: 'Paul H',
    sex: 'M',
    ntid: 'PAULH',
    po: '经理',
    depcode: '660510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}, {
    code: '010721',
    name: 'lyer, Uma R',
    hrpro: '北京',
    hrcity: '北京市',
    chname: 'lyer, Uma R',
    sex: 'M',
    ntid: 'LUR21',
    po: '经理',
    depcode: '810510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}, {
    code: '010721',
    name: 'lyer, Uma R',
    hrpro: '北京',
    hrcity: '北京市',
    chname: 'lyer, Uma R',
    sex: 'M',
    ntid: 'LUR21',
    po: '经理',
    depcode: '810510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}, {
    code: '010721',
    name: 'lyer, Uma R',
    hrpro: '北京',
    hrcity: '北京市',
    chname: 'lyer, Uma R',
    sex: 'M',
    ntid: 'LUR21',
    po: '经理',
    depcode: '810510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}, {
    code: '010721',
    name: 'lyer, Uma R',
    hrpro: '北京',
    hrcity: '北京市',
    chname: 'lyer, Uma R',
    sex: 'M',
    ntid: 'LUR21',
    po: '经理',
    depcode: '810510',
    depname: 'Global EH&S',
    hrdepcode: '860099',
    hrdepname: 'Global EH&S',
    hrname: '张',
    active: '在职',
    workcode: '605712'
}];


const onMainSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    mainSelectedRowKeys.value = selectedRowKeys;
};
const onSubSelectChange = (selectedRowKeys: Key[]) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    subSelectedRowKeys.value = selectedRowKeys;
};
function handleResizeColumn(w: number, col: any) {
    console.log("-----------handleResizeColumn" + w);
    col.width = w;
}

</script>
<style scoped></style>
