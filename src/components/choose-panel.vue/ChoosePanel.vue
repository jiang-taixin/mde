<template>
  <a-spin :spinning="loading">
    <div class="flex flex-col h-full">
      <div class="flex flex-row items-center justify-between">
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
            style="width: 200px" @search="onSearch" />
        </a-popover>
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px; margin-left:4px' })"
          @click="openCustomEvent"></a-button>
      </div>
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" max-height="300px" min-height="300px" size="mini" round
          :border="true" :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :custom-config="customConfig" :cell-config="{ height: 25 }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" show-overflow="ellipsis"
           @checkbox-change="checkboxChange" @checkbox-all="checkAll">
          <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
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
          show-quick-jumper show-size-changer :total="pagination.total" @change="onPageChange"
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
      <div class="flex justify-end gap-2 w-full">
      <a-button class="w-28" size="small" @click="save">
        {{ t('save') }}
      </a-button>
      <a-button class="w-28" size="small" @click="close">
        {{ t('close') }}
      </a-button>
    </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { getIcon } from '@/utils/icon-transfer';
import { h } from 'vue';
import type { Attribute, ModuleConfig } from '@/models/moduleConfigModel';
import type { ChooseParams } from '@/models/chooseModel';
import { getChooseGridData } from '@/services/choose-service';
import { message } from 'ant-design-vue';
const { t } = useI18n();
const searchWord = ref<string>('');
const emit = defineEmits(['closeCallback']);
const selectedRows = ref<any[]>([]);
const parentConfig = inject<any>('parentConfig');
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  parentId:{
    type: String,
    required: true,
    default:''
  }
});

const moduleConfig = ref<ModuleConfig>();
const tableRef = ref<VxeTableInstance<any>>();
const loading = ref<boolean>(false);
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
  loadConfig();
});

const loadConfig = async () => {
  loading.value = true;
  const res = await getRefEntityConfig(props.moduleConfig.Name, props.moduleConfig.ParentEntityConfigName as string);
  loading.value = false;
  moduleConfig.value = res;
  pagination.pageSize = moduleConfig.value.PageSize;
  loadData();
}

const loadData = async () => {
  loading.value = true;
  let searchCondition: SearchConditionValue = {} as SearchConditionValue;
  searchCondition = isVoid(searchWord.value) ? null as any : { AndOr: ANDOR.OR, Conditions: [{ Name: '', Value: searchWord.value }] };
  const params: ChooseParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    EntityConfigName: moduleConfig.value?.Name as string,
    RelationshipEntityConfigName: props.moduleConfig.Name as string,
    RelationshipFilterDataID: props.parentId,
    SortAttributeConfigName: null,
    IsAscending: false,
    SearchCondition: searchCondition,
    MasterCondition: null
  }
  await getChooseGridData(params).then((res: { JsonData: string; TotalRecords: number | undefined; }) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      pagination.total = res.TotalRecords;
      if (gridData.JsonData.length !== 0) {
        tableRef.value?.setCheckboxRow(gridData.JsonData[0], true);
        nextTick(() => {
          selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
        })
      }
    }

  }).catch(() => {
    loading.value = false;
  });
}

const onSearch = () =>{
  pagination.current = 1;
  loadData();
}

// 复选框变化
const checkboxChange = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}
// 复选框全选
const checkAll = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}

const close = () => {
  emit('closeCallback', false);
};

const save = async () => {
  if (selectedRows.value.length === 0) {
    message.error(t('security.noneSelectTips'));
    return;
  }
  let records: { Name: string; Value: any; }[][] = [];
   var downGridAttributes = (props.moduleConfig as ModuleConfig).Attributes;
    var upGridConfigID = parentConfig.value.EntityID;
    var refEntityConfigID = (moduleConfig.value as ModuleConfig).EntityID;
    let firstName = '';
    let secondName = '';
   for (var i = 0; i < downGridAttributes.length; i++) {
     if (downGridAttributes[i].RefEntity == upGridConfigID) {
         firstName = downGridAttributes[i].Name;
     }
     if (downGridAttributes[i].RefEntity == refEntityConfigID) {
         secondName = downGridAttributes[i].AttributeName;
     }
 }
  selectedRows.value.forEach(item => {
    let record = []
    record.push({Name:firstName,Value:props.parentId},{Name:secondName,Value:item.ID});
    records.push(record);
  })
  const params:InsertParams = {
    EntityName: props.moduleConfig.EntityName as string,
    Records:records
  }
  loading.value = true;
  const res = await insertRecords(params);
  loading.value = false;
  if(res.IsSuccess){
    emit('closeCallback', true);
  }

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

