<template>
  <a-spin :tip="t('loading')" :spinning="loading">
    <div class="flex flex-col h-full">
      <!--操作栏-->
      <div class="w-full flex flex-row py-1">
        <a-popover trigger="focus" color="#CCEAFF" placement="bottomLeft" :arrow="false"
          :overlay-inner-style="{ padding: '4px' }">
          <template #title>
            <p class="mb-1 text-base">{{ t('typeKeywords') }}</p>
          </template>
          <template #content>
            <template v-for="item in moduleConfig.Attributes">
              <p class="mb-1 text-sm" v-if="item.IsFuzzyFilter">{{ item.DisplayName }}</p>
            </template>
          </template>
          <a-input-search v-model:value="searchWord" size="small" :placeholder="t('searchPlaceholder')"
            style="width: 200px" @search="onSearch"
            v-if="moduleConfig.Features?.find(item => item.Name === FeatureName.FuzzySearch)" />
        </a-popover>
        <div ref="container" class="flex flex-row w-full overflow-hidden" @wheel="handleWheel">
          <!-- 按钮组 超出边界横向滚动-->
          <div ref="content" class="flex" :style="{ transform: `translateX(${scrollOffset}px)` }">
            <a-tooltip :arrow="false" v-for="button in moduleConfig.Features" :title="button.Description">
              <a-button :disabled="button.Name === FeatureName.Remove && !hasSelection"
                v-if="!button.IsColumnButton && button.Name !== FeatureName.FuzzySearch" size="small"
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
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px' })"></a-button>
      </div>

      <div v-show="showAdvancedSearch">
        <AdvancedSearch :module-config="moduleConfig" @searchCallback="onAdvancedSearch"
          @searchParamsChange="onAdvancedSearchParamsChange" />
      </div>

      <!--表格-->
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" :max-height="props.hasSubModuleConfig ? '300px' : '400px'"
          :min-height="props.hasSubModuleConfig ? '300px' : '400px'" size="mini" round :border="true"
          :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }" :custom-config="customConfig"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
          show-overflow="ellipsis" @cell-dblclick="cellDblclickEvent" @cell-click="cellClickEvent"
          @checkbox-change="checkboxChange" @checkbox-all="checkAll" @column-resizable-change="columnResizeChange"
          @custom-visible-change="columnVisibleChange" @column-dragend="columnDragend">
          <!--选择列-->
          <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
          <!--Attribute中的有效列-->
          <template v-for="column in moduleConfig.Attributes">
            <template v-if="!column.Hidden">
              <vxe-column :field="column.Name" :title="column.DisplayName"
                :width="`${column.DisplayWidth > 0 ? column.DisplayWidth : 80}px`" show-header-overflow
                :sortable="column.SortOrder !== null" :visible="column.DisplayByDefault">
              </vxe-column>
            </template>
          </template>
          <!--Feature中包含的列-->
          <template v-for="feature in moduleConfig.Features">
            <vxe-column v-if="feature.IsColumnButton" :field="feature.Name" :title="feature.DisplayName" width="80px"
              :resizable="false" align="center">
              <template #default="{ row }">
                <a-button type="link" size="small" @click="handleClick(feature.Name, row)"
                  :icon="h('img', { src: getIcon(feature.IconCss), style: 'width: 16px' })">
                </a-button>
              </template>
            </vxe-column>
          </template>
        </vxe-table>
      </div>
      <!--分页-->
      <div class="flex justify-end py-2 mb-2">
        <a-pagination size="small" v-model:current="pagination.current" v-model:page-size="pagination.pageSize"
          show-quick-jumper :total="pagination.total" @change="onPageChange"
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
    </div>
  </a-spin>
  <a-modal v-model:open="openExport" :width="500" @ok="handleExport">
    <template #title>
      <div class="flex items-center text-lg">
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('export-icon'), style: 'width: 14px; margin-left:4px' })">
        </a-button>
        {{ t('exportTitle', { title: moduleConfig.DisplayName }) }}
      </div>
      <ExportPanel :export-selection="exportSelection" :module-config="moduleConfig" :table-level="props.tableLevel"
        :parent-title="props.parentTitle"></ExportPanel>
    </template>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, h, type PropType } from 'vue';
import { FeatureName, type Attribute, type ModuleConfig } from '@/models/moduleConfigModel';
import { getIcon } from '@/utils/icon-transfer';
import { message, Modal } from 'ant-design-vue';
import type { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { debounce } from 'lodash';
import { ANDOR, ExportType, TableLevel, type ExportParams, type GridData, type RequestGridParams, type SearchConditionValue } from '@/models/gridDataModel';
import { getGridData } from '@/services/gridData-service';
import type { ExportSelection } from '../export-panel/ExportPanel.vue';
import { useExportFile } from '@/hooks/useExportFile';
const {exportFile} = useExportFile();
const { t } = useI18n();
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const scrollOffset = ref(0);
const maxScroll = ref(0);
const searchWord = ref<string>('');
const tableRef = ref<VxeTableInstance<any>>();
const resizeObserver = ref<ResizeObserver>();
const selectedRows = ref<any[]>([]);
const hasSelection = computed(() => selectedRows.value.length > 0);
const openExport = ref<boolean>(false);
const exportParams = ref<any>();                 // 导出时需要使用高级查询的条件   所以条件变化就要更新
const exportSelection = ref<ExportSelection>({
  parentSelected: ExportType.AllWithConditions,
  childSelected: []
});

const showAdvancedSearch = ref<boolean>(false);

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
  tableLevel: {
    type: Number as PropType<TableLevel>,
    require: true,
    default: TableLevel.MainTable
  },
  rowClick: {
    type: Function,
    require: false,
  },
  parentID: {
    type: String,
    require: false
  },
  parentTitle: {
    type: String,
    require: false
  }
});
const moduleConfig = ref<ModuleConfig>({} as ModuleConfig);
watch(() => props.parentID, (parentId) => {
  if (!isVoid(parentId)) {
    // 子表在主表被选中某行时才加载数据
    loadGridData();
  }
});
export interface Pagination {
  current: number,
  pageSize: number,
  pageSizeOptions: number[] | string[],
  total?: number
}
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['5', '10', '25', '50', '100', '200'],
  total: 0
});

const sortConfig = (config: ModuleConfig) => {
  const sorted = JSON.parse(JSON.stringify(config));
  if (sorted?.Attributes) {
    sorted.Attributes = [...sorted.Attributes].sort((a, b) => {
      return (a.Sequence || 0) - (b.Sequence || 0);
    });
  }
  return sorted;
};


const onPageChange = () => {
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
  moduleConfig.value = sortConfig(props.moduleConfig);
  pagination.pageSize = moduleConfig.value.PageSize;
  if (props.tableLevel === TableLevel.MainTable || props.parentID) {
    // 只有主表在页面加载时就加载数据 子表有选中的主表行时加载
    loadGridData();
  }
});

const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
const loadGridData = async (isAdvancedSearch: boolean = false, searchParams: any = null) => {
  loading.value = true;
  let searchCondition: SearchConditionValue = {} as SearchConditionValue;
  if (isAdvancedSearch) {
    searchCondition = { AndOr: ANDOR.AND, Conditions: [] };
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== CLEAR_KEY && !isVoid(value)) {
        const param = { Name: key, Value: value };
        searchCondition.Conditions.push(param);
      }

    });
  }
  else {
    searchCondition = isVoid(searchWord.value) ? null as any : { AndOr: ANDOR.OR, Conditions: [{ Name: '', Value: searchWord.value }] };
  }

  const params: RequestGridParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: moduleConfig.value.Name,
    IsAscending: false,
    SearchCondition: searchCondition,
    MasterCondition: props.tableLevel === TableLevel.MainTable ? null : [{ Name: moduleConfig.value.ForeignKeyPhysicalViewAlias, Value: props.parentID }]
  }
  await getGridData(params).then((res) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      pagination.total = res.TotalRecords;
      if (gridData.JsonData.length !== 0) {
        tableRef.value?.setCheckboxRow(gridData.JsonData[0], true);
        nextTick(() => {
          selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
        })
        if (props.tableLevel === TableLevel.MainTable) {
          props.rowClick!(gridData.JsonData[0].ID);
        }
      }
    }
  }).catch(() => {
    loading.value = false;
  });

}

const onSearch = () => {
  pagination.current = 1;
  loadGridData();
};

const onAdvancedSearch = (params: any) => {
  loadGridData(true, params);
}

const onAdvancedSearchParamsChange = (params: any) => {
  exportParams.value = params;
}

const handleExport = () => {
  openExport.value = false;
  exportFile(exportSelection.value,exportParams.value,moduleConfig.value,pagination);

}

// 按钮点击事件
const handleClick = async (featureName: FeatureName, row?: any) => {
  message.success(featureName);
  switch (featureName) {
    // 重置设置
    case FeatureName.ResetSetting:
      loading.value = true;
      const resetRes = await resetUserSetting(moduleConfig.value.ID);
      loading.value = false;
      if (resetRes) {
        moduleConfig.value = sortConfig(resetRes);
        pagination.pageSize = moduleConfig.value.PageSize;
        pagination.current = 1;
        loadGridData();
      }
      break;
    // 保存设置
    case FeatureName.SaveSetting:
      loading.value = true;
      await saveUserSetting(moduleConfig.value);
      loading.value = false;
      break;
    // 高级查询
    case FeatureName.AdvancedSearch:
      showAdvancedSearch.value = !showAdvancedSearch.value
      break;
    // 单条记录删除
    case FeatureName.Delete:
      Modal.confirm({
        title: t('warning'),
        content: t('deleteTips'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        onOk: async () => {
          const delRes = await deleteRecords(moduleConfig.value.EntityName, [row.ID]);
          if (delRes.IsSuccess) {
            message.success(t('success'));
            loadGridData();
          }
        }
      });
      break;
    // 多头记录删除
    case FeatureName.Remove:
      if (selectedRows.value.length < 1) {
        message.error(t('deleteListNull'));
        return;
      }
      Modal.confirm({
        title: t('warning'),
        content: t('deleteTips'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        onOk: async () => {
          const ids = selectedRows.value.map((item) => item.ID);
          const removeRes = await deleteRecords(moduleConfig.value.EntityName, ids);
          if (removeRes.IsSuccess) {
            message.success(t('success'));
            loadGridData();
          }
        }
      })
      break;
    // 数据导出
    case FeatureName.Export:
      openExport.value = true;
      break;
    // 下载模板
    case FeatureName.Download:
      break;
    default:
  }
}

// 打开选择表格字段选择面板
const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}
const cellDblclickEvent: VxeTableEvents.CellDblclick = ({ row, $event }) => {

}

const cellClickEvent: VxeTableEvents.CellClick<any> = ({ row, $event }) => {
  if (props.tableLevel === TableLevel.MainTable) {
    props.rowClick!(row.ID);
  }
}
// 复选框变化
const checkboxChange = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}
// 复选框全选
const checkAll = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}
// 列宽变化
const columnResizeChange = (params: { column: any }) => {
  const arrtibute = moduleConfig.value.Attributes.find(arrtibute => arrtibute.Name === params.column.field);
  if (arrtibute) {
    arrtibute.DisplayWidth = params.column.resizeWidth;
  }
}
// 表头顺序拖动后修改attributes中的squeue进行修改    按照表头顺序重拍
const columnDragend: VxeTableEvents.ColumnDragend = debounce(({ newColumn, oldColumn }) => {
  nextTick(() => {
    tableRef.value?.getColumns().forEach((column, index) => {
      const attribute = moduleConfig.value.Attributes.find(item => item.Name === column.field);
      if (attribute) {
        attribute.Sequence = index;
      }
    })
  })
}, 1000);

// 选择列显示隐藏回调
const columnVisibleChange = (params: { column: any, checked: boolean }) => {
  const arrtibute = moduleConfig.value.Attributes.find(arrtibute => arrtibute.Name === params.column.field);
  if (arrtibute) {
    arrtibute.DisplayByDefault = params.checked;
  }
}

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect();
  }
  window.removeEventListener('resize', calculateMaxScroll);
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

const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  immediate: true,
  checkMethod({ column }) {
    return !['check'].includes(column.field) && !moduleConfig.value.Features.find(item => item.Name === column.field)
  }
})

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})


</script>
<style lang="sass">
</style>
