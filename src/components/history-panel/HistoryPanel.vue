<template>
  <a-spin :spinning="loading">
    <div class="flex flex-col h-full">
      <div class="flex flex-row items-center justify-between">
        <div class="flex flex-row items-center h-full gap-1">
        <a-form-item :label="t('from')" class="mb-0">
          <a-date-picker v-model:value="from" size="small"/>
        </a-form-item>
        <a-form-item :label="t('to')" class="mb-0">
          <a-date-picker v-model:value="to" size="small"/>
        </a-form-item>
        <a-button size="small" @click="loadHistoryData">
          {{t('searchButtonTitle')}}
        </a-button>
        </div>
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px; margin-left:4px' })" @click="openCustomEvent"></a-button>
      </div>
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" max-height="300px" min-height="300px" size="mini" round
          :border="true" :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :custom-config="customConfig" :cell-config="{ height: 25 }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" show-overflow="ellipsis">
          <template v-if="moduleConfig" v-for="column in moduleConfig.Attributes">
            <template v-if="!column.Hidden">
              <vxe-column :field="column.Name" :title="column.DisplayName"
                :width="`${column.DisplayWidth > 0 ? column.DisplayWidth : 80}px`" show-header-overflow
                :sortable="column.SortOrder !== null" :visible="column.DisplayByDefault">
              </vxe-column>
            </template>
          </template>
        </vxe-table>
      </div>
      <div class="flex justify-end py-2 mb-2">
        <a-pagination size="small" v-model:current="pagination.current" v-model:page-size="pagination.pageSize"
          show-quick-jumper :total="pagination.total" @change="onPageChange"
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { ref, } from 'vue';
import { type ModuleConfig } from '@/models/moduleConfigModel';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { type GridData, type RequestHistoryParams } from '@/models/gridDataModel';
const { t } = useI18n();
import { h } from 'vue';
import { getIcon } from '@/utils/icon-transfer';
import { Language } from '@/language';

export interface SeletedObject {
  DisplayName: string,
  Code: string
}

const from = ref<string>('');
const to = ref<string>('');
const tableRef = ref<VxeTableInstance<any>>();
const loading = ref<boolean>(false);
const moduleConfig = ref<ModuleConfig>();
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  historyId:{
    type: String,
    reruire: true,
    default: ''
  }
});
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['5', '10', '25', '50', '100', '200'],
  total: 0
});


interface Pagination {
  current: number,
  pageSize: number,
  pageSizeOptions: number[] | string[],
  total?: number
}
const onPageChange = () => {
  loadHistoryData();
};

onMounted(async () => {
  moduleConfig.value = addOperatedColumns(props.moduleConfig);
  loadHistoryData();
});

// 这里最后三个字段是拼接进去的
const addOperatedColumns = (config: ModuleConfig) => {
  let newConfig = {...config};
  newConfig.Attributes.push({
      DisplayName: t('operatedBy'), Name: 'Operated By', DisplayByDefault: true, DisplayWidth: 100, Hidden: false, IsBusinessPrimaryKey: false, Sequence: 10000,
      AllowOverwriteNull: false,
      AttributeID: '',
      AttributeName: '',
      AutoGenerateCode: false,
      DataType: null,
      DefaultValue: null,
      Description: null,
      DigitalPrecision: 0,
      DisplayFormat: null,
      EntityConfigID: '',
      EntityConfigName: '',
      EntityID: '',
      EntityName: '',
      ErrorMessage: null,
      ExcelColumn: null,
      ExtControlType: '',
      ID: '',
      IsAdvancedFilter: false,
      IsDerivedFromOtherEntity: false,
      IsExcelMandatory: false,
      IsFuzzyFilter: false,
      IsNullable: false,
      IsPrimaryKey: false,
      IsSystem: false,
      Language: Language.ZH_CN,
      Length: 0,
      PhysicalField: '',
      PhysicalViewAlias: '',
      PromptMessage: null,
      ReadOnly: false,
      RefEntity: '',
      RegExpression: null,
      SortDirection: null,
      SortExpression: null,
      SortOrder: null,
      TargetDisplayMemberID: '',
      TargetDisplayMemberName: null,
      TargetEntityID: '',
      TargetEntityName: null,
      TargetLovID: '',
      TargetLovName: null,
      TargetValueMemberID: '',
      TargetValueMemberName: null
    },
  {
      DisplayName: t('operatedOn'), Name: 'Operated On', DisplayByDefault: true, DisplayWidth: 100, Hidden: false, IsBusinessPrimaryKey: false, Sequence: 10001,
      AllowOverwriteNull: false,
      AttributeID: '',
      AttributeName: '',
      AutoGenerateCode: false,
      DataType: null,
      DefaultValue: null,
      Description: null,
      DigitalPrecision: 0,
      DisplayFormat: null,
      EntityConfigID: '',
      EntityConfigName: '',
      EntityID: '',
      EntityName: '',
      ErrorMessage: null,
      ExcelColumn: null,
      ExtControlType: '',
      ID: '',
      IsAdvancedFilter: false,
      IsDerivedFromOtherEntity: false,
      IsExcelMandatory: false,
      IsFuzzyFilter: false,
      IsNullable: false,
      IsPrimaryKey: false,
      IsSystem: false,
      Language: Language.ZH_CN,
      Length: 0,
      PhysicalField: '',
      PhysicalViewAlias: '',
      PromptMessage: null,
      ReadOnly: false,
      RefEntity: '',
      RegExpression: null,
      SortDirection: null,
      SortExpression: null,
      SortOrder: null,
      TargetDisplayMemberID: '',
      TargetDisplayMemberName: null,
      TargetEntityID: '',
      TargetEntityName: null,
      TargetLovID: '',
      TargetLovName: null,
      TargetValueMemberID: '',
      TargetValueMemberName: null
    },
  {
      DisplayName: t('operationType'), Name: 'Operation Type', DisplayByDefault: true, DisplayWidth: 100, Hidden: false, IsBusinessPrimaryKey: false, Sequence: 10002,
      AllowOverwriteNull: false,
      AttributeID: '',
      AttributeName: '',
      AutoGenerateCode: false,
      DataType: null,
      DefaultValue: null,
      Description: null,
      DigitalPrecision: 0,
      DisplayFormat: null,
      EntityConfigID: '',
      EntityConfigName: '',
      EntityID: '',
      EntityName: '',
      ErrorMessage: null,
      ExcelColumn: null,
      ExtControlType: '',
      ID: '',
      IsAdvancedFilter: false,
      IsDerivedFromOtherEntity: false,
      IsExcelMandatory: false,
      IsFuzzyFilter: false,
      IsNullable: false,
      IsPrimaryKey: false,
      IsSystem: false,
      Language: Language.ZH_CN,
      Length: 0,
      PhysicalField: '',
      PhysicalViewAlias: '',
      PromptMessage: null,
      ReadOnly: false,
      RefEntity: '',
      RegExpression: null,
      SortDirection: null,
      SortExpression: null,
      SortOrder: null,
      TargetDisplayMemberID: '',
      TargetDisplayMemberName: null,
      TargetEntityID: '',
      TargetEntityName: null,
      TargetLovID: '',
      TargetLovName: null,
      TargetValueMemberID: '',
      TargetValueMemberName: null
  })
  return newConfig;
}

const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
const loadHistoryData = async () => {
  loading.value = true;
  const params: RequestHistoryParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: props.moduleConfig.Name,
    IsAscending: false,
    SearchCondition: null,
    MasterCondition: null,
    OperationOnStart: from.value,
    OperationOnEnd: to.value,
    DataID: props.historyId
  }
  await getHistoryData(params).then((res) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      console.log(gridData.JsonData)
      pagination.total = res.TotalRecords;
      if (gridData.JsonData.length !== 0) {
      }
    }
  }).catch(() => {
    loading.value = false;
  });
}

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  immediate: true,
})

const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}


</script>
<style lang="sass">
</style>
