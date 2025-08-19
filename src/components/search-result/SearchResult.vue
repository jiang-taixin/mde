<template>
  <a-spin
   :spinning="loading">
    <div class="flex flex-col h-full">
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="gridData.JsonData" max-height="300px"
          min-height="300px" size="mini" round :border="true"
          :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :custom-config="customConfig"
          :cell-config="{ height: 25 }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }"
          show-overflow="ellipsis" @cell-dblclick="cellDblclickEvent"
          @current-row-change="handleCurrentChange"
          >
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
          :page-size-options="pagination.pageSizeOptions"  :show-total="(total: any) => t('total', { total: total })"/>
      </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { ref, } from 'vue';
import { type ModuleConfig } from '@/models/moduleConfigModel';
import type { VxeTableEvents, VxeTableInstance, VxeTablePropTypes } from 'vxe-table/types/all';
import { ANDOR, type GridData, type RequestGridParams } from '@/models/gridDataModel';
import { getGridData } from '@/services/gridData-service';
const { t } = useI18n();

export interface SeletedObject{
  DisplayName:string,
  Code:string
}

const emits = defineEmits(['confirm']);
const tableRef = ref<VxeTableInstance<any>>();
const loading = ref<boolean>(false);
const moduleConfig = ref<ModuleConfig>();
const model = defineModel<SeletedObject>('selectedObject',{default:() => ({DisplayName:'',Code:''})});
const props = defineProps({
  entityConfigName: {
    type: String,
    require: true,
    default: ''
  },
  keyWord:{
    type: String,
    require: true,
    default: '',
  },
  targetEntityName: {
    type: String,
    require: true,
    default: ''
  }
});

watch(() => props.keyWord, () => {
  if (!isVoid(props.keyWord)) {
    // 子表在主表被选中某行时才加载数据
    loadGridData();
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
  loadGridData();
};

onMounted(async () => {
   if(!moduleConfig.value){
    loading.value = true;
    const res = await getModuleConfig(props.targetEntityName);
    loading.value = false;
    moduleConfig.value = res;
  }
  loadGridData();
});

const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
const loadGridData = async () => {
  loading.value = true;

  const searchCondition =  { AndOr: ANDOR.OR, Conditions: [{ Name: '', Value: props.keyWord }] };
  const params: RequestGridParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: props.targetEntityName,
    IsAscending: false,
    SearchCondition: searchCondition,
    MasterCondition: null
  }
  await getGridData(params).then((res) => {
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

const cellDblclickEvent: VxeTableEvents.CellDblclick = ({ row, $event }) => {
  emits('confirm');
}
const handleCurrentChange: VxeTableEvents.CurrentRowChange = ({ row, $event }) => {
  model.value.Code = row.Code;
  model.value.DisplayName = row.EnglishName;
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

defineExpose({
  openCustomEvent
})

</script>
<style lang="sass">
</style>
