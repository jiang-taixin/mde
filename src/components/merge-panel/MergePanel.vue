<template>
  <div>
    <div class="flex-1">
      <vxe-table ref="tableRef" :data="validAttributeList" height="400px" max-height="800px" size="mini" round :border="true"
        :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
        :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }" :custom-config="customConfig"
        :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
        show-overflow="ellipsis">
        <template v-for="column in columns">
          <vxe-column :field="column.Name" :title="column.DisplayName"
            :width="`${column.DefaultWidth > 0 ? column.DefaultWidth : 50}px`" show-header-overflow>
            <template #default="{ row }" v-if="column.Name === 'field'">
              {{row.DisplayName}}
            </template>
            <template #default="{ row }" v-if="column.Name === 'record1'" align="center">
              {{recordList[0][row.Name]}}
            </template>
            <template #default="{ row }" v-if="column.Name === 'record2'" align="center">
              {{recordList[1][row.Name]}}
            </template>
            <template #default="{ row }" v-if="column.Name === 'result'" align="center">
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <div class="flex justify-end gap-2 w-full mt-3">
      <a-button class="w-28" size="small" @click="merge">{{ t('merge.merge') }}</a-button>
      <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { merge_columns } from '@/constants';
import type { Attribute } from '@/models/moduleConfigModel';
import { type CustomColumn } from '@/models/SecurityModel';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';

const { t } = useI18n();
const emit = defineEmits(['closeCallback']);
const tableRef = ref<VxeTableInstance<any>>();

const columns = ref<CustomColumn[]>();
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  recordList: {
    type: Array,
    require: true,
    default: [],
  }
});
const validAttributeList = ref<Attribute[]>([]);
const recordList = ref<any[]>(props.recordList);

onMounted(() => {
  columns.value = merge_columns;
  props.moduleConfig.Attributes.forEach(item => {
    if(!item.Hidden && item.DisplayByDefault){
      validAttributeList.value.push(item);
    }
  })
})

const close = () => {
  emit('closeCallback');
}
const merge = () => {
}
const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}

const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  immediate: true,
  checkMethod({ column }) {
    return !['check'].includes(column.field)
  }
})
const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})


defineExpose({
  openCustomEvent
})

</script>
