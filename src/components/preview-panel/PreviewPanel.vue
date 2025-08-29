<template>
  <a-spin :spinning="loading">
    <div class="flex flex-col h-full">
      <div class="flex flex-row items-center justify-between">
        <div>
          <span>{{ t('upload.total') }}</span>
          <a-button type="link" size="small" class="px-1 text-blue-500 underline-button cursor-pointer mr-1"
          @click="reloadData(0,props.previewSummary.Total as number)">{{
            props.previewSummary.Total }}</a-button>
          <span>{{ t('upload.new') }}</span>
          <a-button type="link" size="small" class="px-1 text-green-500 underline-button cursor-pointer mr-1"
          @click="reloadData(1,props.previewSummary.Insert as number)">{{
            props.previewSummary.Insert }}</a-button>
          <span>{{ t('upload.update') }}</span>
          <a-button type="link" size="small" class="px-1 text-red-500 underline-button cursor-pointer mr-1"
          @click="reloadData(2,props.previewSummary.Update as number)">{{
            props.previewSummary.Update }}</a-button>
          <span>{{ t('upload.delete') }}</span>
          <a-button type="link" size="small" class="px-1 text-red-500 underline-button cursor-pointer mr-1"
          @click="reloadData(3,props.previewSummary.Delete as number)">{{
            props.previewSummary.Delete }}</a-button>
          <span>{{ t('upload.merge') }}</span>
          <a-button type="link" size="small" class="px-1 text-red-500 underline-button cursor-pointer mr-1"
          @click="reloadData(4,props.previewSummary.Merge as number)">{{
            props.previewSummary.Merge }}</a-button>
        </div>
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px; margin-left:4px' })"
          @click="openCustomEvent"></a-button>
      </div>
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" max-height="300px" min-height="300px" size="mini" round
          :border="true" :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :custom-config="customConfig" :cell-config="{ height: 25 }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" show-overflow="ellipsis">
          <template v-if="props.moduleConfig" v-for="column in previewAttributes">
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
          show-quick-jumper show-size-changer :total="pagination.total" @change="onPageChange"
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { ValidationType, type PreviewRequest, type Summary } from '@/models/uploadModel';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { getIcon } from '@/utils/icon-transfer';
import { h } from 'vue';
import type { Attribute, ModuleConfig } from '@/models/moduleConfigModel';
import { getExcelValidationPreview } from '@/services/upload-file-service';
import { Language } from '@/language';
const { t } = useI18n();

const props = defineProps({
  previewSummary: {
    type: Object as PropType<Summary>,
    required: true
  },
  previewValidationType: {
    type: Object as PropType<ValidationType>,
    required: true
  },
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default:null
  },
  validateType:{
    type: Object as PropType<ValidationType>,
    require: true,
    default:ValidationType.All
  },
  sessionId: {
    type:String,
    require: true,
    default: ''
  }
});
console.log(props.moduleConfig)
const tableRef = ref<VxeTableInstance<any>>();
const loading = ref<boolean>(false);
const previewAttributes = ref<Attribute[]>([]);
const operationType = ref<number>(0);
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
  loadData();
};

onMounted(async () => {
  pagination.pageSize = props.moduleConfig.PageSize;
  previewAttributes.value.push({
    DisplayName:  t('upload.errorCode'), Name: 'ErrorCode', DisplayByDefault: true, DisplayWidth: 50, Hidden: false, IsBusinessPrimaryKey: false, Sequence: props.moduleConfig.Attributes.length,
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
  });
  previewAttributes.value.push({
    DisplayName: t('upload.errorMsg'), Name: 'ErrorMsg', DisplayByDefault: true, DisplayWidth: 100, Hidden: false, IsBusinessPrimaryKey: false, Sequence: props.moduleConfig.Attributes.length,
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
  });
  props.moduleConfig?.Attributes.forEach(attribute => {
    console.log(attribute.Name);
    if((attribute.ExcelColumn && attribute.ExcelColumn != null)){
      previewAttributes.value.push(attribute);
    }
  });
  loadData();
});



const loadData = async () => {
  loading.value = true;
  const params: PreviewRequest = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    EntityConfigName: props.moduleConfig?.Name as string,
    IsAscending: false,
    SessionID: props.sessionId,
    ValidationType: props.validateType,
    OperationType: operationType.value
  }
  await getExcelValidationPreview(params).then((res) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      pagination.total = res.TotalRecords;
    }
  }).catch(() => {
    loading.value = false;
  });
}

const reloadData = (type:number, count:number)=>{
  if(count === 0) return;
  operationType.value = type;
  loadData();
}

const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
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
