<template>
  <div class="w-full flex flex-col h-full">
    <!--页面菜单路径-->
    <div class="h-6 flex items-center flex-row justify-between">
      <a-breadcrumb separator=">">
        <a-breadcrumb-item v-for="(menuName, index) in props.moduleTab.MenuPath">
          {{ index !== props.moduleTab.MenuPath.length - 1 ? menuName : '' }}
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div class="flex flex-row items-center">
        <img :src="clock" class="w-5 h-5 mr-2" />
        {{ $t('footer.dateMessage', { week: getWeekNo(), date: dateMessage }) }}
      </div>
    </div>
    <!--页面标题-->
    <div class="h-6 flex items-center flex-row my-2">
      <span class="font-bold text-lg">{{ props.moduleTab.MenuPath[props.moduleTab.MenuPath.length - 1] }}</span>
    </div>
    <!-- 内容 -->
    <div class="flex-1" v-if="moduleConfig">
      <!-- 主表 -->
      <div :class="['flex-col w-full', (moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0 ? 'h-auto' : 'h-full']" ref="mainTableRef">
        <ModuleTable :module-config="moduleConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"
          :table-level="TableLevel.MainTable" :row-click="parentIDChange"/>
      </div>
      <!-- 从表 -->
      <div class="border-t-2" v-if="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0">
        <a-tabs class="h-full" :tab-bar-style="{ marginBottom: '4px' }" size="small">
          <a-tab-pane v-for="subConfig in moduleConfig?.ChildEntityConfigs" :key="subConfig.ID" :tab="subConfig.DisplayName">
             <div class="h-full">
              <ModuleTable :module-config="subConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"
                :table-level="TableLevel.SubTable" :parentID="parentID" :parent-title="props.moduleTab.MenuPath[props.moduleTab.MenuPath.length - 1]"/>
             </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>

  </div>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/moduleItemModel';

import clock from "@/assets/images/others/clock.png";
import { getWeekNo } from "@/utils/datetime";
import type { ModuleConfig } from '@/models/moduleConfigModel';
import { TableLevel } from '@/models/gridDataModel';
const { locale } = useI18n();
const dateMessage = ref<string>();
const mainTableRef = ref<HTMLElement | null>(null);
const moduleConfig = ref<ModuleConfig>();
const parentID = ref<string>('');
const parentIDChange = (newID: string) => {
  parentID.value = newID;
}
watch(locale, () => {
  if (locale.value === Language.ZH_CN) {
    dateMessage.value = getDateMessage();
  } else {
    dateMessage.value = getEnglishDate();
  }
}, { immediate: true });

const props = defineProps({
  moduleTab: {
    type: Object as PropType<ModuleTab>,
    require: true,
    default: null
  },
});


onMounted(async () => {
  loadConfig();
});

const loadConfig = async () =>{
  const res = await getModuleConfig(props.moduleTab.Url.split('entity=')[1]);
  moduleConfig.value = res;
  props.moduleTab.Loading = false;
}


</script>
<style scoped></style>
