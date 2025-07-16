<template>
  <div class="w-full h-full flex flex-col">
    <!--操作栏-->
    <div class="w-full flex flex-row py-1">
      <a-input-search v-model:value="searchWord" size="small" :placeholder="t('searchPlaceholder')" style="width: 200px"
        @search="onSearch" v-if="props.moduleConfig.Features.find(item => item.Name === 'FuzzySearch')"/>
      <div ref="container" class="flex flex-row w-full overflow-hidden" @wheel="handleWheel">
        <!-- 按钮组 超出边界横向滚动-->
        <div ref="content" class="flex" :style="{ transform: `translateX(${scrollOffset}px)` }">
          <a-tooltip v-for="button in props.moduleConfig.Features" :title="button.Description">
            <a-button v-if="!button.IsColumnButton && button.Name !== 'FuzzySearch'" size="small"
            class="flex-shrink-0 whitespace-nowrap ml-2 flex items-center" @click="handleClick(button.CommandName)">
              {{ button.DisplayName }}
              <template #icon>
                <img :src="getIcon(button.IconCss)" v-if="button.Name !== 'SwitchVersion'" class="w-4 h-4 mr-1" />
              </template>
            </a-button>
          </a-tooltip>

        </div>
      </div>
    </div>

    <!--表格-->
    <div>
      <vxe-table :data="tableData" size="small" round
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
    </div>
    <!--分页-->
    <div class="flex justify-end pb-2">
      <a-pagination size="small" v-model:current="current1" show-quick-jumper :total="500" @change="onChange" :show-total="total => `Total ${total} items`"/>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ModuleConfig } from '@/models/moduleConfigModel';
import type { ModuleTab } from '@/models/moduleItemModel';
import { getIcon } from '@/utils/icon-transfer';
import type { VxeColumnProps, VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
const { t } = useI18n();
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const maxScroll = ref(0);
const searchWord = ref<string>('');
const moduleTabsStore = useModuleTabsStore();
const desktopModeule: ModuleTab = { Url: "desktop", Closable: false, MenuPath: [t("header.desktop")], Loading: false, Id: "desktop" };
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
});
const current1 = ref<number>(1);
const onChange = (pageNumber: number) => {
  console.log('Page: ', pageNumber);
};
onMounted(() => {
  if (!moduleTabsStore.moduleTabList.find(item => item.Id === 'desktop')) {
    moduleTabsStore.addModuleTab(desktopModeule);
  }
  calculateMaxScroll();
  window.addEventListener('resize', handleResize);
});
// 初始化计算最大滚动距离
const calculateMaxScroll = () => {
  if (container.value && content.value) {
    maxScroll.value = Math.max(0, content.value.scrollWidth - container.value.clientWidth);
  }
};

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  scrollOffset.value = Math.max(
    -maxScroll.value,
    Math.min(0, scrollOffset.value - e.deltaY)
  )
};

// 响应式调整
const handleResize = () => {
  calculateMaxScroll();
  scrollOffset.value = Math.max(-maxScroll.value, Math.min(0, scrollOffset.value));
};

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const onSearch = (searchValue: string) => {
  console.log('or use this.value', searchWord.value);
};

const handleClick = (eventName:string) => {
  console.log('button click with event name:'+eventName);
}


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
    { id: 10007, name: 'Test7', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
    { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },{ id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },{ id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },{ id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
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


</script>
<style lang="sass">
</style>
