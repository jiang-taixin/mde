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
            v-if="moduleConfig.Features?.find((item: { Name: any; }) => item.Name === FeatureName.FuzzySearch)" />
        </a-popover>
        <div ref="container" class="flex flex-row w-full overflow-hidden" @wheel="handleWheel">
          <!-- 按钮组 超出边界横向滚动-->
          <div ref="content" class="flex" :style="{ transform: `translateX(${scrollOffset}px)` }">
            <a-tooltip :arrow="false" v-for="button in moduleConfig.Features" :title="button.Description">
              <template v-if="button.Name !== FeatureName.SwitchVersion">
                <a-button :disabled="button.Disable"
                  v-if="!button.IsColumnButton && button.Name !== FeatureName.FuzzySearch" size="small"
                  class="flex-shrink-0 whitespace-nowrap ml-2 flex items-center" @click="handleClick(button.Name)">
                  {{ button.DisplayName }}
                  <template #icon>
                    <img :src="getIcon(button.IconCss)" class="w-4 h-4 mr-1" />
                  </template>
                </a-button>
              </template>
              <template v-else>
                <a-popover placement="bottom" :arrow="false" trigger="click">
                  <a-button v-if="!button.IsColumnButton" size="small"
                    class="flex-shrink-0 whitespace-nowrap ml-2 flex items-center" @click="handleClick(button.Name)">
                    {{ `${button.DisplayName}:${activeVersion?.Name}` }}
                    <template #icon>
                      <img :src="getIcon(button.IconCss)" v-if="button.Name !== FeatureName.SwitchVersion"
                        class="w-4 h-4 mr-1" />
                    </template>
                  </a-button>
                  <template #content>
                    <a-select class="w-36" size="small" @change="changeVersion">
                      <a-select-option v-for="item in versionList" :value="item.ID">{{ item.Name }}</a-select-option>
                    </a-select>
                  </template>
                </a-popover>
              </template>
            </a-tooltip>
          </div>
        </div>
        <a-button type="link" size="small" @click="openCustomEvent"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px' })"></a-button>
      </div>
      <!--高级查询-->
      <div v-show="showAdvancedSearch">
        <AdvancedSearch :module-config="moduleConfig" @searchCallback="onAdvancedSearch" />
      </div>
      <!--表格-->
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" :max-height="props.hasSubModuleConfig ? '300px' : '400px'"
          :min-height="props.hasSubModuleConfig ? '300px' : '400px'" size="mini" round :border="true"
          :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }" :custom-config="customConfig"
          :row-config="{ isHover: true, isCurrent: true, keyField: '__rowKey' }" :empty-text="t('empty')"
          :aggregate-config="group.needGroup ? aggregateConfig : undefined" :spanMethod="spanMethod"
          show-overflow="ellipsis" @cell-dblclick="cellDblclickEvent" @cell-click="cellClickEvent"
          @checkbox-change="checkboxChange" @checkbox-all="checkAll" @column-resizable-change="columnResizeChange"
          @custom-visible-change="columnVisibleChange" @column-dragend="columnDragend">
          <!--选择列-->
          <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
          <!--Attribute中的有效列-->
          <template v-for="column in moduleConfig.Attributes">
            <template v-if="!column.Hidden">
              <vxe-column :field="column.Name" :title="column.DisplayName"
                :row-group-node="column.Name === group.displayField"
                :width="`${column.DisplayWidth > 0 ? column.DisplayWidth : 80}px`" show-header-overflow
                :sortable="column.SortOrder !== null" :visible="column.DisplayByDefault">
                <!--分组信息-->
                <template #group-content="params">
                  <div class="flex items-center">
                    <span class="font-bold text-primary-400 mr-2">{{ (params as any).groupContent }}</span>
                    <span class="font-bold text-primary-400 mr-2">( {{ (params as any).childList.length }} {{ (params as any).childList.length >
                      1 ? 'Items' : 'Item' }} )</span>
                    <template v-if="group.showDetail">
                      <span class="font-bold text-primary-400 mr-2">
                        {{ t('weightTotal', { weight: calculateTotal((params as any).childList) }) }} </span>
                      <a-button type="text" size="small" class="text-primary-400" @click.stop="clickDetail((params as any).childList)">[{{
                        t('groupDetail') }}]</a-button>
                    </template>
                  </div>
                </template>
                <!--自定义显示内容   部分字段需要数据转换-->
                <template #default="{row}">
                  {{mappingContent(column.Name,row[column.Name])}}
                </template>
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
          show-quick-jumper :total="pagination.total" @change="onPageChange" show-size-changer
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
    </div>
  </a-spin>
  <!--导出弹窗-->
  <a-modal v-model:open="openExport" :width="500" @ok="handleExport" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('export-icon')" class="w-4 h-4 mr-1" />
        {{ t('exportTitle', { title: moduleConfig.DisplayName }) }}
      </div>
    </template>
    <ExportPanel :export-selection="exportSelection" :module-config="moduleConfig" :table-level="props.tableLevel"
      :parent-title="props.parentTitle"></ExportPanel>
  </a-modal>
  <!--模板弹窗-->
  <a-modal v-model:open="openDownload" :width="500" @ok="handleDownload" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('download-icon')" class="w-4 h-4 mr-1" />
        {{ t('downloadTitle', { title: moduleConfig.DisplayName }) }}
      </div>
    </template>
    <DownloadPabel :download-selection="downloadSelection" :module-config="moduleConfig" :table-level="props.tableLevel"
      :parent-title="props.parentTitle"></DownloadPabel>
  </a-modal>
  <!--历史弹窗-->
  <a-modal v-model:open="openHistory" :width="600" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('history-icon')" class="w-4 h-4 mr-1" />
        {{ t('historyTitle', { title: moduleConfig.DisplayName }) }}
      </div>
    </template>
    <HistoryPanel ref="resultRef" :module-config="moduleConfig" :history-id="rowID" />
  </a-modal>
  <!--权限弹窗-->
  <a-modal v-model:open="openSecurity" :width="700" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('security-icon')" class="w-4 h-4 mr-1" />
        {{ t('securityTitle', { title: moduleConfig.DisplayName }) }}
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 14px; margin-left:4px' })"
          @click="openSecurityCustomEvent"></a-button>
      </div>
    </template>
    <SecurityPanel ref="securityRef" @closeCallback="closeSecurityPanel" :module-config="moduleConfig"
      :security-id="rowID"></SecurityPanel>
  </a-modal>
  <!--创建或编辑弹窗-->
  <a-modal v-model:open="openCreateUpdate" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ createUpdateTitle }}
      </div>
    </template>
    <CreateUpdatePanel @closeCallback="closeCreateUpdatePanel" @successCallBack="successCreateUpdate"
      :create-update-type="createUpdateType"></CreateUpdatePanel>
  </a-modal>
  <!--上传弹窗-->
  <a-modal v-model:open="openUpload" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('upload-icon')" class="w-5 h-5 mr-1" />
        {{ t('upload.title') }}
      </div>
    </template>
    <UploadPanel @closeCallback="closeUploadPanel" @successCallback="successUpload" :module-config="moduleConfig">
    </UploadPanel>
  </a-modal>
  <!--删除弹窗-->
  <a-modal v-model:open="openDelete" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('delete-icon')" class="w-5 h-5 mr-1" />
        {{ t('upload.deleteTitle', { name: props.moduleConfig.DisplayName }) }}
      </div>
    </template>
    <DeletePanel @closeCallback="closeDeletePanel" :impact-entities="impactEntities" :session-id="sessionID">
    </DeletePanel>
  </a-modal>
  <!--选择弹窗-->
  <a-modal v-model:open="openChoose" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('choose-icon')" class="w-5 h-5 mr-1" />
        {{ t('choose.title', { name: props.moduleConfig.DisplayName }) }}
      </div>
    </template>
    <ChoosePanel @closeCallback="closeChoosePanel" :module-config="moduleConfig" :parent-id="props.parentID">
    </ChoosePanel>
  </a-modal>
  <!--合并弹窗-->
  <a-modal v-model:open="openMerge" :width="1200" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        <img :src="getIcon('merge-icon')" class="w-5 h-5 mr-1" />
        {{ t('merge.title', { name: props.moduleConfig.DisplayName }) }}
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 14px; margin-left:4px' })"
          @click="openMergeCustomEvent"></a-button>
      </div>
    </template>
    <MergePanel ref="mergeRef" @closeCallback="closeMergePanel" @successCallback="successMergePanel"
      :module-config="moduleConfig" :record-list="selectedRows">
    </MergePanel>
  </a-modal>
  <!--权重弹窗-->
  <a-modal v-model:open="openWeight" :width="600" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ t('weightTitle', { title: props.moduleConfig.DisplayName }) }}
      </div>
    </template>
    <WeightPanel :module-config="moduleConfig" :child-list="groupChildList" @closeCallback="closeWeightPanel"
     @successCallback="changeWeightSuccess">
    </WeightPanel>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, h, type PropType } from 'vue';
import { CreateUpdateType, FeatureName, type Attribute, type ModuleConfig } from '@/models/moduleConfigModel';
import { getIcon } from '@/utils/icon-transfer';
import { mappingContent } from '@/utils/mappingContent';
import { message, Modal } from 'ant-design-vue';
import type { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { debounce } from 'lodash';
import type { ExportSelection } from '../export-panel/ExportPanel.vue';
import type { DefaultOptionType, SelectValue } from 'ant-design-vue/es/select';
import type { DownloadSelection } from '../download-panel/DownloadPabel.vue';
import { DownloadType, type CommandData } from '@/models/gridDataModel';
const { exportFile } = useExportFile();
const { moveUpOrDown } = useMoveUpOrDown();
const { getConfigName } = useGetVersionConfigName();
const { downloadFile } = useDownloadFile();
const emits = defineEmits(['parentVersionChange']);
const { t } = useI18n();
const container = ref<HTMLElement | null>(null);
const content = ref<HTMLElement | null>(null);
const loading = ref<boolean>(false);
const scrollOffset = ref(0);
const maxScroll = ref(0);
const searchWord = ref<string>('');
const tableRef = ref<VxeTableInstance<any>>();
const resizeObserver = ref<ResizeObserver>();
const selectedRows = ref<any[]>([]);
const openExport = ref<boolean>(false);
const openDownload = ref<boolean>(false);
const openDelete = ref<boolean>(false);
const sessionID = ref<string>('');
const impactEntities = ref<ImpactEntity[]>([]);
const openChoose = ref<boolean>(false);
const openMerge = ref<boolean>(false);
const openWeight = ref<boolean>(false);
const groupChildList = ref<any[]>();
const advancedParams = ref<any>();                 // 导出和下载时需要使用高级查询的条件   所以条件变化就要更新
const versionList = ref<any[]>();
const activeVersion = ref<any>();
const exportSelection = ref<ExportSelection>({
  parentSelected: ExportType.AllWithConditions,
  childSelected: []
});
const downloadSelection = ref<DownloadSelection>({
  typeSelected: DownloadType.WithoutRecords,
});
const openHistory = ref<boolean>(false);
const rowID = ref<string>('');
const openSecurity = ref<boolean>(false);
const securityRef = ref(null);
const mergeRef = ref(null);
const openUpload = ref<boolean>(false);
const showAdvancedSearch = ref<boolean>(false);
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  hasSubModuleConfig: {
    type: Boolean,
    required: true,
    default: false
  },
  tableLevel: {
    type: Number as PropType<TableLevel>,
    required: true,
    default: TableLevel.MainTable
  },
  rowClick: {
    type: Function,
    required: false,
  },
  parentID: {
    type: String,
    required: false
  },
  parentTitle: {
    type: String,
    required: false
  },
  // 这个参数单独给模块管理页面使用
  fromModule: {
    type: Boolean,
    required: false,
    default: false,
  },
  parentVersion: {
    type: Object,
    required: false,
    default: null,
  }
});
const moduleConfig = ref<ModuleConfig>({} as ModuleConfig);
const group = reactive({
  needGroup: false,
  displayField: '',
  showDetail: false
})
const createUpdateTitle = ref<string>(t('createTitle', { title: moduleConfig.value.DisplayName }));
const openCreateUpdate = ref<boolean>(false);
const createUpdateType = ref<CreateUpdateType>(CreateUpdateType.Create);
watch(() => props.parentID, (parentId) => {
  if (!isVoid(parentId)) {
    // 子表在主表被选中某行时才加载数据    parentID变化从首页开始加载
    pagination.current = 1;
    loadGridData();
  }
});
watch(() => activeVersion, (newVersion) => {
  emits('parentVersionChange', newVersion.value);
}, { deep: true });

watch(selectedRows, () => {
  moduleConfig.value.Features.forEach(feature => {
    let enable = null;
    if (feature.Name == "Merge") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length == 2) {
        enable = ((selectedRows.value[0].Status.toUpperCase() == "NO" && selectedRows.value[1].Status.toUpperCase() == "NO")
          || (selectedRows.value[0].Status == "0" && selectedRows.value[1].Status == "0"));
        if (enable && selectedRows.value[0].HospitalID) {
          enable = (selectedRows.value[0].HospitalID == selectedRows.value[1].HospitalID);
        }
      }
    }
    else if (feature.Name == "SetToActive") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length == 1) {
        enable = selectedRows.value[0].Status == "0" && selectedRows.value[0].IsPublish == "1" && selectedRows.value[0].IsActive == "0";
        if (selectedRows.value.length > 1) enable = false;
      }
    }
    else if (feature.Name == "SetToPrimaryAssistant") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length == 1) {
        enable = selectedRows.value[0].Status == "0" && selectedRows.value[0].IsPrimaryAssistantLovItemName != "Y";
        if (selectedRows.value.length > 1) {
          enable = false;
        }
      }
    }
    else if (feature.Name == "CopyToAdd") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length == 1) {
        enable = (selectedRows.value[0].Status == "0");
      }
    }

    else if (feature.Name == "Remove") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length > 0) {
        selectedRows.value.forEach(item => {
          enable = ((item.Status == "0") || (item.Status.toUpperCase() == "NO"));
          if (!enable) {
            return false;
          }
        })
      }
    }
    else if (feature.Name == "DeleteVersion") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length == 1) {
        enable = selectedRows.value[0].Status == "0";
      }
    }
    else if (feature.Name == "Publish") {
      enable = false;
      if (selectedRows.value && selectedRows.value.length > 0) {
        selectedRows.value.forEach(item => {
          enable = ((item.Status == "0") && (item.IsPublish == "0"));
          if (!enable) {
            return false;
          }
        })
      }
    }
    if (enable !== null) {
      feature.Disable = !enable;
    }
  })
}, { deep: true });

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

onMounted(async () => {
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
  // 如果有分组条件 执行分组
  if (!isVoid(moduleConfig.value.GroupingPhysicalViewAlias)) {
    group.needGroup = true; // 是否显示分组
    if (moduleConfig.value.Name === 'HospitalStrengthWeightConfig' || moduleConfig.value.Name === 'AccountStrengthWeightConfig') {
      group.showDetail = true;
    }
    aggregateConfig.groupFields?.push(moduleConfig.value.GroupingPhysicalViewAlias as string); // 这个字段就是分组的字段
    const attribute = moduleConfig.value.Attributes.find(item => item.Hidden === false);
    group.displayField = attribute?.Name as string; // 这个是分组显示的位置
  }
  pagination.pageSize = moduleConfig.value.PageSize;
  // 加载版本的列表    加载条件是按钮组里有版本的按钮
  if (needLoadVersionList()) {
    await loadVersionList();
  }
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

const needLoadVersionList = () => {
  return moduleConfig.value.Features.findIndex(item => item.Name === FeatureName.SwitchVersion) !== -1;
}
const canEditData = () => {
  return moduleConfig.value.Features.findIndex(item => item.Name === FeatureName.Detail) !== -1;
}
const loadVersionList = async () => {
  // 获取版本列表
  const params: RequestGridParams = {
    PageIndex: 1,
    PageSize: -1,
    EntityConfigName: getConfigName(moduleConfig.value.Name)
  }
  loading.value = true;
  await getGridData(params).then((res) => {
    if (res) {
      versionList.value = JSON.parse(res.JsonData);
      activeVersion.value = versionList.value?.find(item => item.IsActive === '1');
    }
  }).catch(() => {
  }).finally(() => {
    loading.value = false;
  });
}
const loadGridData = async (isAdvancedSearch: boolean = false, searchParams: any = null) => {
  loading.value = true;
  let searchCondition: SearchConditionValue = {} as SearchConditionValue;
  let masterCondition: any = [];
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
    activeVersion.value && masterCondition.push({
      Name: 'VersionID', Value: activeVersion.value?.ID
    });
    props.tableLevel !== TableLevel.MainTable && masterCondition.push({
      Name: moduleConfig.value.ForeignKeyPhysicalViewAlias, Value: props.parentID
    });
    props.fromModule && masterCondition.push({
      Name: "ParentID", Value: props.parentID
    });
  }

  const params: RequestGridParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: moduleConfig.value.Name,
    IsAscending: false,
    SearchCondition: searchCondition,
    MasterCondition: masterCondition.length > 0 ? masterCondition : null,
  }
  await getGridData(params).then((res) => {
    if (res) {
      let rows = JSON.parse(res.JsonData);
      // 为每行重新生成唯一key
      rows = ensureUniqueKeys(rows, moduleConfig.value.Name);
      gridData.JsonData = rows;
      pagination.total = res.TotalRecords;
      if (gridData.JsonData.length !== 0) {
        tableRef.value?.setCheckboxRow(gridData.JsonData[0], true);
        nextTick(() => {
          const allSelected = tableRef.value?.getCheckboxRecords() || [];
          // 过滤掉分组聚合行
          selectedRows.value = allSelected.filter(row => !tableRef.value?.isAggregateRecord(row));
          if(group.needGroup){
            tableRef.value?.setAllRowGroupExpand(true);
          }
        })
        if (props.tableLevel === TableLevel.MainTable && !props.fromModule) {
          props.rowClick!(gridData.JsonData[0].ID);
        }
      }
    }
  }).catch(() => {

  }).finally(() => {
    loading.value = false;
  });

}

const onSearch = () => {
  pagination.current = 1;
  loadGridData();
};

const onAdvancedSearch = (params: any) => {
  advancedParams.value = params;
  loadGridData(true, params);
}

const handleExport = () => {
  openExport.value = false;
  exportFile(exportSelection.value, advancedParams.value, moduleConfig.value, pagination, props.tableLevel, props.parentID as string, props.tableLevel === TableLevel.MainTable ? activeVersion.value : props.parentVersion, searchWord.value);
}

const handleDownload = () => {
  openDownload.value = false;
  downloadFile(downloadSelection.value.typeSelected, advancedParams.value, moduleConfig.value, pagination, props.tableLevel, props.parentID as string, props.tableLevel === TableLevel.MainTable ? activeVersion.value : props.parentVersion, searchWord.value);
}

const changeVersion = async (value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => {
  // 切换语言
  const version = versionList.value?.find(item => item.ID === value);
  activeVersion.value = version;
  loadGridData();
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
            if (delRes.ImpactEntities && delRes.ImpactEntities.length > 0) {
              impactEntities.value = delRes.ImpactEntities;
              sessionID.value = delRes.SesssionID;
              openDelete.value = true;
              return;
            }
            pagination.current = 1;
            loadGridData();
          }
          else {
            message.error(delRes.ErrorMessage)
          }
        }
      });
      break;
    // 多条记录删除
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
            if (removeRes.ImpactEntities && removeRes.ImpactEntities.length > 0) {
              impactEntities.value = removeRes.ImpactEntities;
              sessionID.value = removeRes.SesssionID;
              openDelete.value = true;
              return;
            }
            pagination.current = 1;
            loadGridData();
          }
          else {
            message.error(removeRes.ErrorMessage);
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
      openDownload.value = true;
      break;
    // 历史
    case FeatureName.History:
      rowID.value = row.ID;
      openHistory.value = true;
      break;
    // 上移
    case FeatureName.MoveUp:
      loading.value = true;
      const upRes = await moveUpOrDown(row.ID, MoveDirection.Up, gridData, props.moduleConfig.EntityName);
      loading.value = false;
      if (upRes) {
        gridData.JsonData = upRes;
      }
      break;
    // 下移
    case FeatureName.MoveDown:
      loading.value = true;
      const downRes = await moveUpOrDown(row.ID, MoveDirection.Down, gridData, props.moduleConfig.EntityName);
      loading.value = false;
      if (downRes) {
        gridData.JsonData = downRes;
      }
      break;
    // 权限
    case FeatureName.Security:
      rowID.value = row.ID;
      openSecurity.value = true;
      break;
    // 编辑
    case FeatureName.Detail:
      createUpdateTitle.value = t('updateTitle', { title: moduleConfig.value.DisplayName });
      createUpdateType.value = CreateUpdateType.Update;
      openCreateUpdatePanel();
      break;
    // 上传
    case FeatureName.Upload:
      openUpload.value = true;
      break;
    // 选择
    case FeatureName.Choose:
      openChoose.value = true;
      break;
    // 设置为主助理
    case FeatureName.SetToPrimaryAssistant:
      if (selectedRows.value.length === 0) {
        return;
      }
      Modal.confirm({
        title: t('warning'),
        content: t('setToPrimaryTips'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        onOk: async () => {
          const params: CommandData = {
            CommandName: FeatureName.SetToPrimaryAssistant,
            EntityName: moduleConfig.value.EntityName,
            Records: [[{ Name: 'ID', Value: selectedRows.value[0].ID }]]
          }
          const setRes = await doEntityCommand(params);
          if (setRes.IsSuccess) {
            loadGridData();
          }
          else {
            message.error(setRes.ErrorMessage);
          }
        }
      })
      break;
    // 合并
    case FeatureName.Merge:
      openMerge.value = true;
      break;
    // 删除版本
    case FeatureName.DeleteVersion:
      Modal.confirm({
        title: t('warning'),
        content: t('deleteVersionTips'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        onOk: async () => {
          let records: any[] = [];
          selectedRows.value.forEach(item => {
            records.push([{ Name: 'ID', Value: item.ID }]);
          });
          const params: CommandData = {
            CommandName: 'DeleteVersionDirectly',
            EntityName: moduleConfig.value.EntityName,
            Records: records,
          }
          loading.value = true;
          const delVerRes = await doEntityCommand(params);
          loading.value = false;
          if (delVerRes.IsSuccess) {
            message.success(t('success'));
            loadGridData();
          }
          else {
            message.error(delVerRes.ErrorMessage)
          }
        }
      });
      break;
    // 发布
    case FeatureName.Publish:
      let records: any[] = [];
      selectedRows.value.forEach(item => {
        records.push([{ Name: 'ID', Value: item.ID }]);
      });
      const params: CommandData = {
        CommandName: 'PublishVersion',
        EntityName: moduleConfig.value.EntityName,
        Records: records,
      }
      loading.value = true;
      const delVerRes = await doEntityCommand(params);
      loading.value = false;
      if (delVerRes.IsSuccess) {
        message.success(t('success'));
        loadGridData();
      }
      else {
        message.error(delVerRes.ErrorMessage)
      }
      break;
    // 激活
    case FeatureName.SetToActive:
      Modal.confirm({
        title: t('warning'),
        content: t('activeTips'),
        okText: t('confirm'),
        cancelText: t('cancel'),
        onOk: async () => {
          let records: any[] = [];
          selectedRows.value.forEach(item => {
            records.push([{ Name: 'ID', Value: item.ID }]);
          });
          const params: CommandData = {
            CommandName: 'SetActiveVersion',
            EntityName: moduleConfig.value.EntityName,
            Records: records,
          }
          loading.value = true;
          const delVerRes = await doEntityCommand(params);
          loading.value = false;
          if (delVerRes.IsSuccess) {
            message.success(t('success'));
            loadGridData();
          }
          else {
            message.error(delVerRes.ErrorMessage)
          }
        }
      });
      break;
    case FeatureName.Add:
      createUpdateTitle.value = t('createTitle', { title: moduleConfig.value.DisplayName });
      createUpdateType.value = CreateUpdateType.Create;
      openCreateUpdate.value = true;
      break;
    case FeatureName.CopyToAdd:
      createUpdateTitle.value = t('copyAddTitle', { title: moduleConfig.value.DisplayName });
      createUpdateType.value = CreateUpdateType.CopyAdd;
      openCreateUpdate.value = true;
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
// 打开子组件字段选择面板 -- 权限
const openSecurityCustomEvent = () => {
  if (securityRef.value) {
    (securityRef.value as any).openCustomEvent();
  }
}
// 打开子组件字段选择面板 -- 合并
const openMergeCustomEvent = () => {
  if (mergeRef.value) {
    (mergeRef.value as any).openCustomEvent();
  }
}
// 关闭合并面板
const closeMergePanel = () => {
  openMerge.value = false;
}
// 上传成功
const successMergePanel = () => {
  openMerge.value = false;
  loadGridData();
}
// 关闭权限面板
const closeSecurityPanel = () => {
  openSecurity.value = false;
}
// 关闭新增或编辑面板
const closeCreateUpdatePanel = () => {
  openCreateUpdate.value = false;
}
// 打开新增或编辑面板
const openCreateUpdatePanel = () => {
  openCreateUpdate.value = true;
}
// 创建或编辑成功
const successCreateUpdate = () => {
  openCreateUpdate.value = true;
}

// 关闭上传面板
const closeUploadPanel = () => {
  openUpload.value = false;
}
// 上传成功
const successUpload = () => {
  openUpload.value = false;
  loadGridData();
}

// 关闭删除面板
const closeDeletePanel = () => {
  openDelete.value = false;
}
// 关闭选择面板
const closeChoosePanel = (operation: boolean) => {
  openChoose.value = false;
  if (operation) {
    loadGridData();
  }
}
// 关闭权重面板
const closeWeightPanel = () =>{
  openWeight.value = false;
}

// 调整权重完成
const changeWeightSuccess = () =>{
  openWeight.value = false;
  loadGridData();
}

// 执行process后真正删除
const finishDelete = () => {
  openDelete.value = false;
  pagination.current = 1;
  loadGridData();
}
provide('finishDelete', finishDelete);

const cellDblclickEvent: VxeTableEvents.CellDblclick = ({ row, $event }) => {
  // 双击编辑数据   和点击详情同样的操作   可编辑条件是列表中包含详情按钮列
  if (canEditData()) {
    createUpdateTitle.value = t('updateTitle', { title: moduleConfig.value.DisplayName });
    createUpdateType.value = CreateUpdateType.Update;
    openCreateUpdatePanel();
  }
}

const cellClickEvent: VxeTableEvents.CellClick<any> = ({ row, $event }) => {
  if (props.tableLevel === TableLevel.MainTable && !props.fromModule) {
    props.rowClick!(row.ID);
  }
}

// 复选框变化
const checkboxChange = () => {
  const allSelected = tableRef.value?.getCheckboxRecords() || [];
  // 过滤掉分组聚合行
  selectedRows.value = allSelected.filter(row => !tableRef.value?.isAggregateRecord(row));
}
// 复选框全选
const checkAll = () => {
  const allSelected = tableRef.value?.getCheckboxRecords() || [];
  // 过滤掉分组聚合行
  selectedRows.value = allSelected.filter(row => !tableRef.value?.isAggregateRecord(row));
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

const aggregateConfig = reactive<VxeTablePropTypes.AggregateConfig<any>>({
  groupFields: [],
  expandAll: true,
  padding: false,
  trigger: "row",
  contentMethod() {
    return ``
  },
})
const clickDetail = (childList: any) => {
  groupChildList.value = childList;
  openWeight.value = true;
}
const spanMethod: VxeTablePropTypes.SpanMethod<any> = ({ row, column }) => {
  const $table = tableRef.value
  if ($table && $table.isAggregateRecord(row)) {
    if (column.field === group.displayField) {
      const colCount = $table.getColumns().length;
      return { rowspan: 1, colspan: colCount }
    }
    return { rowspan: 0, colspan: 0 }
  }
  return { rowspan: 1, colspan: 1 }
}

const calculateTotal = (childList: any[]) => {

  if (childList.length === 0) return "0.000000";
  const totalInInt = childList.reduce((sum, item) => {
    const weightNum = parseFloat(item.Weight);
    const validWeight = isNaN(weightNum) ? 0 : weightNum;
    return sum + Math.round(validWeight * 1e6);
  }, 0);
  const total = totalInInt / 1e6;
  return total.toFixed(6);
};

</script>
