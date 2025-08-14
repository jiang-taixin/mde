<template>
  <div class="flex justify-end gap-2 w-full">
  <a-button class="w-28" size="small" >{{t('remove')}}</a-button>
  <a-button class="w-28" size="small" >{{t('add')}}</a-button>
  <a-button class="w-28" size="small" >{{t('save')}}</a-button>
  <a-button class="w-28" size="small">{{t('close')}}</a-button>
  </div>
</template>

<script setup lang="ts">
import { ExportType, TableLevel } from '@/models/gridDataModel';
export interface ExportSelection{
  parentSelected: ExportType,
  childSelected: string[]
}

const { t } = useI18n();

const openCustomEvent = () => {
  console.log("------------");
  // const $table = tableRef.value
  // if ($table) {
  //   $table.openCustom()
  // }
}

defineExpose({
  openCustomEvent
})

</script>
