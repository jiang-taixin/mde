<template>
  <a-collapse v-model:active-key="activeKey">
    <a-collapse-panel collapsible="disabled" key="parent" :header="t('exportParentTitle')" >
      <a-radio-group v-model:value="params.parentSelected" class="flex flex-col">
        <a-radio :value="ExportType.CurrentPage" class="text-base mb-2">
          {{t('exportCurrentPage',{name:props.moduleConfig.DisplayName})}}
        </a-radio>
        <a-radio :value="ExportType.AllWithConditions" class="text-base mb-2">
          {{t('exportAllWithConditions',{name:props.moduleConfig.DisplayName})}}
        </a-radio>
        <a-radio v-if="props.tableLevel === TableLevel.SubTable" :value="ExportType.All" class="text-base">
          {{t('exportAll',{parentTitle:props.parentTitle,childTitle:props.moduleConfig.DisplayName})}}
        </a-radio>
      </a-radio-group>
    </a-collapse-panel>
    <a-collapse-panel v-if="props.moduleConfig.ChildEntityConfigs.length > 0"
      key="child" :header="t('exportChildTitle')" >
      <a-checkbox-group v-model:value="params.childSelected" class="flex flex-col">
        <a-checkbox v-for="child in props.moduleConfig.ChildEntityConfigs" v-bind:value="child.Name" class="text-base mb-2">
          {{child.DisplayName}}
        </a-checkbox>
      </a-checkbox-group>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup lang="ts">
import { ExportType, TableLevel } from '@/models/gridDataModel';
export interface ExportSelection{
  parentSelected: ExportType,
  childSelected: string[]
}

const { t } = useI18n();
const activeKey = ref<string[]>(['parent','child']);
const params = defineModel<ExportSelection>('exportSelection',{
  required:true
})

const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  tableLevel: {
    type: Number as PropType<TableLevel>,
    required: true,
    default: TableLevel.MainTable
  },
  parentTitle: {
    type: String,
    required: false
  }
});

</script>
