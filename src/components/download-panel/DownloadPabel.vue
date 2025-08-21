<template>
  <a-collapse v-model:active-key="activeKey">
    <a-collapse-panel collapsible="disabled" key="main" :header="t('downloadTempTitle')" >
      <a-radio-group v-model:value="params.typeSelected" class="flex flex-col">
        <a-radio :value="DownloadType.CurrentPage" class="text-base mb-2">
          {{t('exportCurrentPage',{name:props.moduleConfig.DisplayName})}}
        </a-radio>
        <a-radio :value="DownloadType.AllWithConditions" class="text-base mb-2">
          {{t('exportAllWithConditions',{name:props.moduleConfig.DisplayName})}}
        </a-radio>
        <a-radio v-if="props.tableLevel === TableLevel.SubTable" :value="DownloadType.AllRecords" class="text-base mb-2">
          {{t('exportAll',{parentTitle:props.parentTitle,childTitle:props.moduleConfig.DisplayName})}}
        </a-radio>
        <a-radio :value="DownloadType.WithoutRecords" class="text-base mb-2">
          {{t('withoutRecords',{name:props.moduleConfig.DisplayName})}}
        </a-radio>
      </a-radio-group>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { DownloadType, TableLevel } from '@/models/gridDataModel';
export interface DownloadSelection{
  typeSelected: DownloadType,
}
const activeKey = ref<string[]>(['main']);
const { t } = useI18n();
const params = defineModel<DownloadSelection>('downloadSelection',{
  required:true
})

const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  tableLevel: {
    type: Number as PropType<TableLevel>,
    require: true,
    default: TableLevel.MainTable
  },
  parentTitle: {
    type: String,
    require: false
  }
});

</script>
