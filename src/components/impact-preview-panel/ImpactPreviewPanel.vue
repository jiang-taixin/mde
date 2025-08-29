<template>
  <a-spin :spinning="loading">
    <div class="flex flex-col h-full">
      <div class="flex flex-row items-center justify-between">
        <img :src="getIcon('grid-header-icon')" class="w-6 h-6 mr-1" />
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px; margin-left:4px' })"
          @click="openCustomEvent"></a-button>
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
          show-quick-jumper show-size-changer :total="pagination.total" @change="onPageChange"
          :page-size-options="pagination.pageSizeOptions" :show-total="(total: any) => t('total', { total: total })" />
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { type ImpactEntity } from '@/models/uploadModel';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { getIcon } from '@/utils/icon-transfer';
import { h } from 'vue';
import type { Attribute, ModuleConfig } from '@/models/moduleConfigModel';
import { getDeletionImpactEntityData } from '@/services/upload-file-service';
const { t } = useI18n();

const props = defineProps({
  impactEntity: {
    type: Object as PropType<ImpactEntity>,
    required: true,
    default: null
  },
  sessionId:{
    type:String,
    required:true,
    default:'',
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
  const res = await getModuleConfig(props.impactEntity.EntityConfigName);
  moduleConfig.value = res;
  pagination.pageSize = moduleConfig.value.PageSize;
  loadData();
}

const loadData = async () => {
  loading.value = true;
  const params: PreviewRequest = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    EntityConfigName: props.impactEntity.EntityConfigName,
    SessionID: props.sessionId,
  }
  await getDeletionImpactEntityData(params).then((res: { JsonData: string; TotalRecords: number | undefined; }) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      pagination.total = res.TotalRecords;
    }
  }).catch(() => {
    loading.value = false;
  });
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

