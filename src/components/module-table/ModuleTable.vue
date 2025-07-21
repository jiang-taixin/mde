<template>
<a-spin :tip="t('loading')" :spinning="loading">
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
      <a-button type="link" size="small" @click="openCustomEvent"
        :icon="h('img', { src: getIcon(null), style: 'width: 16px' })"></a-button>
    </div>

    <!--表格-->
    <div class="flex-1">
      <vxe-table ref="tableRef" :data="gridData.JsonData" :max-height="props.hasSubModuleConfig ? '300px' : '400px'"
        :min-height="props.hasSubModuleConfig ? '300px' : '400px'" size="mini" round :border="true" :column-config="{ resizable: true, drag: true }"
        :column-drag-config="columnDragConfig"
        :checkbox-config="{highlight:true}"
        :cell-config="{ height: 25 }"
        :custom-config="customConfig"
        :row-config="{isHover: true, isCurrent: true,keyField:'ID'}"
        :empty-text="t('empty')"
        show-overflow="ellipsis" @cell-dblclick="cellDblclickEvent" @cell-click="cellClickEvent">
        <!--选择列-->
        <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
        <!--Attribute中的有效列-->
        <template v-for="column in props.moduleConfig.Attributes">
          <template v-if="!column.Hidden">
            <vxe-column :field="column.Name" :title="column.DisplayName"
              :width="`${column.DisplayWidth > 0 ? column.DisplayWidth : 80}px`" show-header-overflow
              :sortable="column.SortOrder !== null" :visible="column.DisplayByDefault">
            </vxe-column>
          </template>
        </template>
        <!--Feature中包含的列-->
        <template v-for="feature in props.moduleConfig.Features">
          <vxe-column v-if="feature.IsColumnButton" :field="feature.Name" :title="feature.DisplayName" width="80px"
            :resizable="false" align="center">
            <a-button type="link" size="small" @click="handleClick(feature.Name)"
              :icon="h('img', { src: getIcon(feature.IconCss), style: 'width: 16px' })"></a-button>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <!--分页-->
    <div class="flex justify-end py-2">
      <a-pagination size="small" v-model:current="pagination.current"
      v-model:page-size="pagination.pageSize"
      show-quick-jumper
      :total="pagination.total"
       @change="onPageChange"
      :page-size-options="pagination.pageSizeOptions"
        :show-total="(total: any) => t('total',{total:total})" />
    </div>
  </div>
</a-spin>
</template>
<script setup lang="ts">
import { ref, h, type PropType } from 'vue';
import { FeatureName, type Attribute, type ModuleConfig } from '@/models/moduleConfigModel';
import { getIcon } from '@/utils/icon-transfer';
import { message } from 'ant-design-vue';
import type { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { debounce } from 'lodash';
import { TableLevel, type GridData, type RequestGridParams } from '@/models/gridDataModel';
import { getGridData } from '@/services/gridData-service';
const { t } = useI18n();
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const maxScroll = ref(0);
const searchWord = ref<string>('');
const tableRef = ref<VxeTableInstance<any>>();
const resizeObserver = ref<ResizeObserver>();

const showLoading = inject<(loading: boolean) => void>('showLoading');
const loading = ref<boolean>(false);

const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  hasSubModuleConfig: {
    type: Boolean,
    require: true,
    default: false
  },
  tableLevel:{
    type: Number as PropType<TableLevel>,
    require:true,
    default: TableLevel.MainTable
  },
  rowClick:{
    type: Function,
    require: false,
  },
  parentID:{
    type: String,
    require: false
  }
});

watch(() => props.parentID,(parentId) =>{
  if(!isVoid(parentId)){
    // 子表在主表被选中某行时才加载数据
    loadGridData();
  }
})

interface Pagination{
  current:number,
  pageSize:number,
  pageSizeOptions:number[]|string[],
  total?:number
}

const pagination = reactive<Pagination>({
  current: 1,
  pageSize: props.moduleConfig.PageSize,
  pageSizeOptions: ['5','10','25','50','100','200'],
  total:0
});
const onPageChange = () => {
  console.log('Page change: ',pagination);
  loadGridData();
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
  if(props.tableLevel === TableLevel.MainTable||props.parentID){
    // 只有主表在页面加载时就加载数据
    loadGridData();
  }

});

const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
const loadGridData = async () =>{
  showLoading && showLoading(true);
  loading.value = true;
  const params:RequestGridParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: props.moduleConfig.Name,
    IsAscending: false,
    SearchCondition: null,
    MasterCondition: props.tableLevel === TableLevel.MainTable?null:[{Name:'ParentID',Value:props.parentID}]
  }
  const res = await getGridData(params);
  if(res){
    gridData.JsonData = JSON.parse(res.JsonData);
    console.log("-------grid:"+JSON.stringify(gridData.JsonData[0]))
    pagination.total = res.TotalRecords;
    showLoading && showLoading(false);
    loading.value = false;

    tableRef.value?.setCheckboxRow(gridData.JsonData[0], true);
    if(props.tableLevel === TableLevel.MainTable){
      props.rowClick!(gridData.JsonData[0].ID);
    }
  }
}
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



const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}
const cellDblclickEvent: VxeTableEvents.CellDblclick = ({ row,$event }) => {
  console.log(`double click row: ${JSON.stringify(row)}, event:${JSON.stringify($event)}`);
}
const cellClickEvent: VxeTableEvents.CellClick<any> = ({ row, $event }) => {
  console.log(`click row: ${JSON.stringify(row)}, event:${JSON.stringify($event)}`);
  if(props.tableLevel === TableLevel.MainTable){
    props.rowClick!(row.ID);
  }
}
onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
  window.removeEventListener('resize', calculateMaxScroll);
});


</script>
<style lang="sass">
</style>
