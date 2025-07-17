<template>
  <div class="flex flex-col h-full">
    <!--操作栏-->
    <div class="w-full flex flex-row py-1">
      <a-input-search v-model:value="searchWord" size="small" :placeholder="t('searchPlaceholder')" style="width: 200px"
        @search="onSearch" v-if="props.moduleConfig.Features.find(item => item.Name === FeatureName.FuzzySearch)" />
      <div ref="container" class="flex flex-row w-full overflow-hidden" @wheel="handleWheel">
        <!-- 按钮组 超出边界横向滚动-->
        <div ref="content" class="flex" :style="{ transform: `translateX(${scrollOffset}px)` }">
          <a-tooltip v-for="button in props.moduleConfig.Features" :title="button.Description">
            <a-button v-if="!button.IsColumnButton && button.Name !== FeatureName.FuzzySearch" size="small"
              class="flex-shrink-0 whitespace-nowrap ml-2 flex items-center" @click="handleClick(button.Name)">
              {{ button.DisplayName }}
              <template #icon>
                <img :src="getIcon(button.IconCss)" v-if="button.Name !== FeatureName.SwitchVersion"
                  class="w-4 h-4 mr-1" />
              </template>
            </a-button>
          </a-tooltip>

        </div>
      </div>
      <a-button type="link" size="small" @click="openCustomEvent" :icon="h('img', { src: getIcon(null), style: 'width: 16px' })"></a-button>
    </div>

    <!--表格-->
    <div class="flex-1">
      <vxe-table ref="tableRef" :data="tableData" :max-height="props.hasSubModuleConfig?'300px':'98%'" min-height="300px" size="mini" round :border="true" :column-config="{ resizable: true, drag: true }"
        :column-drag-config="columnDragConfig" :cell-config="{ height: 25 }" :custom-config="customConfig"
        show-overflow="ellipsis" @cell-dblclick="cellDblclickEvent">
        <!--选择列-->
        <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
        <!-- :type="column.type" -->
        <vxe-column v-for="column in props.moduleConfig.Attributes" :field="column.Name" :title="column.DisplayName"
          :width="`${column.DisplayWidth>0?column.DisplayWidth:80}px`"
          show-header-overflow :sortable="column.SortOrder !== null"
          :visible="!column.Hidden">
        </vxe-column>
        <template v-for="feature in props.moduleConfig.Features">
          <vxe-column  v-if="feature.IsColumnButton" :field="feature.Name" :title="feature.DisplayName" width="80px" :resizable="false" align="center">
            <a-button type="link" size="small" :icon="h('img', { src: getIcon(null), style: 'width: 16px' })"></a-button>
          </vxe-column>
          </template>
      </vxe-table>
    </div>
    <!--分页-->
    <div class="flex justify-end py-2">
      <a-pagination size="small" v-model:current="current1" show-quick-jumper :total="500" @change="onChange"
        :show-total="total => `Total ${total} items`" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { FeatureName, type Attribute, type ModuleConfig } from '@/models/moduleConfigModel';
import { getIcon } from '@/utils/icon-transfer';
import { message } from 'ant-design-vue';
import type { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { debounce } from 'lodash';
const { t } = useI18n();
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const maxScroll = ref(0);
const searchWord = ref<string>('');
const tableRef = ref<VxeTableInstance<any>>();
const resizeObserver = ref<ResizeObserver>();

const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  hasSubModuleConfig:{
    type: Boolean,
    require: true,
    default: false
  }
});

const current1 = ref<number>(1);
const onChange = (pageNumber: number) => {
  console.log('Page: ', pageNumber);
};
onMounted(() => {
  // 使用ResizeObserver监听尺寸变化
  resizeObserver.value = new ResizeObserver(calculateMaxScroll);
  if (container.value) {
    resizeObserver.value.observe(container.value);
  }
  // 初始计算（双重延迟确保DOM完全渲染）
  setTimeout(() => {
    calculateMaxScroll();
    setTimeout(calculateMaxScroll, 100);
  }, 50);
});
// 按钮组超过最大宽度横向滚动
const calculateMaxScroll = debounce(() => {
  if (container.value && content.value) {
    void container.value.offsetWidth;
    void content.value.offsetWidth;
    const containerWidth = container.value.clientWidth;
    const contentWidth = content.value.scrollWidth;
    maxScroll.value = Math.max(0, contentWidth - containerWidth);
    scrollOffset.value = Math.max(-maxScroll.value, Math.min(0, scrollOffset.value));
  }
}, 100);

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  scrollOffset.value = Math.max(
    -maxScroll.value,
    Math.min(0, scrollOffset.value - e.deltaY)
  )
};

const onSearch = (searchValue: string) => {
  console.log('or use this.value', searchWord.value);
};

const handleClick = (featureName: FeatureName) => {
  message.success(featureName)
}


const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  checkMethod({ column }) {
    return !['check'].includes(column.field) && !props.moduleConfig.Features.find(item => item.Name === column.field)
  }
})

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

const tableData = ref<any[]>([
  { Code: 10001, EnglishName: 'Test1', role: 'Develop', sex: 'Man', age: 28, address: 'test abc' },
  { id: 10002, name: 'Test2', role: 'Test', sex: 'Women', age: 22, address: 'Guangzhou' },
  { id: 10003, name: 'Test3', role: 'PM', sex: 'Man', age: 32, address: 'Shanghai' },
  { id: 10004, name: 'Test4', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10005, name: 'Test5', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10007, name: 'Test7', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
  { id: 10006, name: 'Test6', role: 'Designer', sex: 'Women', age: 24, address: 'Shanghai' },
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

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
  window.removeEventListener('resize', calculateMaxScroll);
});

const cellDblclickEvent: VxeTableEvents.CellClick<any> = ({ row, column }) => {
  console.log(`双击行：${JSON.stringify(row)} 双击列：${column.title}`)
}
</script>
<style lang="sass">
</style>
