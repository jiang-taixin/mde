<template>
    <div class="w-full h-[250px]">
        <vxe-table :data="tableData" size="small" border round height="100%"
            :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
            :cell-config="{ height: 32 }" :custom-config="customConfig" ref="tableRef"
            @column-dragstart="columnDragstartEvent" @column-dragend="columnDragendEvent"
            @column-resizable-change="columnResizableChange">
            <vxe-column v-for="column in columnData" :type="column.type" :field="column.field" :title="column.title"
                :width="column.width" :fixed="column.fixed" show-overflow="ellipsis"
                :sortable="column.field !== 'action'">

                <template #header="{ column }" v-if="column.field !== 'action' && column.type !== 'seq'">

                    <span>{{ column.title }}</span>
                    <a-button class="mx-4" size="small" @click="openCustomEvent">选列</a-button>

                </template>
                <template v-if="column.field === 'action'" #default>
                    <a-button type="link" size="small">查看</a-button>
                </template>
            </vxe-column>
        </vxe-table>

        <OperationTool :buttons="buttons" />
    </div>
</template>

<script lang="ts" setup>
import type { VxeColumnProps, VxeColumnPropTypes, VxePagerEvents, VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table'

const buttons = ref([
    {
        "key": "001",
        "ID": "input-01",
        "Type": "SearchInput",
        "Icon": "search-icon",
        "Title": "Search",
        "Disable": false
    },
    {
        "key": "002",
        "ID": "button-01",
        "Type": "Button",
        "Icon": "search-icon",
        "Title": "高级查询",
        "Disable": false
    },
    {
        "key": "003",
        "ID": "button-02",
        "Type": "Button",
        "Icon": "add-icon",
        "Title": "添加",
        "Disable": false
    },
    {
        "key": "004",
        "ID": "button-03",
        "Type": "Button",
        "Icon": "delete-icon",
        "Title": "删除",
        "Disable": false
    },
    {
        "key": "005",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "006",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "设置为主助理",
        "Disable": false
    },
    {
        "key": "007",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "008",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "009",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "011",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "0011",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "设置为主助理",
        "Disable": false
    },
    {
        "key": "0013",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "0012",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "0014",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    },
    {
        "key": "0015",
        "ID": "button-04",
        "Type": "Button",
        "Icon": "save-icon",
        "Title": "保存设置",
        "Disable": false
    }
])
interface RowVO {
    id: number
    name: string
    role: string
    sex: string
    age: number
    address: string
}

const customConfig = reactive<VxeTablePropTypes.CustomConfig<RowVO>>({
    checkMethod({ column }) {
        return !['seq', 'action'].includes(column.field)
    }
})

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<RowVO>>({
    isCrossDrag: true,
    showGuidesStatus: true,
    showIcon: false,
    trigger: 'cell'
})

const tableRef = ref<VxeTableInstance<RowVO>>()

const columnData = ref<VxeColumnProps[]>([{
    title: '序号',
    type: 'seq',
    width: 70,
    fixed: 'left'
}, {
    title: '姓名',
    field: 'name',
    width: 150,
}, {
    title: '角色',
    field: 'role',
    width: 150,
}, {
    title: '性别',
    field: 'sex',
    width: 150,
}, {
    title: '年龄',
    field: 'age',
    width: 150,
}, {
    title: '地址',
    field: 'address',
    width: 150,
}, {
    title: '操作',
    field: 'action',
    width: 150,
    fixed: 'right'
}])

const tableData = ref<RowVO[]>([
    { id: 10001, name: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
    { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
    { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
    { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10005, name: 'Test5', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10007, name: 'Test7', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' }
])



const columnDragstartEvent: VxeTableEvents.ColumnDragstart = ({ column }) => {
    console.log(`拖拽开始 ${column.field}`)
}

const columnDragendEvent: VxeTableEvents.ColumnDragend = ({ newColumn, oldColumn, dragColumn, dragPos }) => {
    console.log(`拖拽完成，旧列 ${oldColumn.field} 新列 ${newColumn.field}`)
}

const openCustomEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.openCustom()
    }
}

const columnResizableChange = ({ column, columnIndex }) => {
    console.log('列宽变化 column:' + column.renderWidth + ", columnIndex:" + columnIndex);
}



const moduleConfig = ref<ModuleConfig>();


onMounted(async () => {
    const res = await getModuleConfig('EmployeeConfig');
    moduleConfig.value = res;
    //console.log("-----config data:" + JSON.stringify(moduleConfig.value));
})
</script>