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
    <!-- 内容  这个是通用页面 -->
    <div class="flex-1" v-if="moduleConfig && getModulePageType() === ModulePageType.Normal">
      <!-- 主表 -->
      <div :class="['flex-col w-full', (moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0 ? 'h-auto' : 'h-full']" ref="mainTableRef">
        <ModuleTable :module-config="moduleConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"
          :table-level="TableLevel.MainTable" :row-click="parentIDChange" @parentVersionChange="parentVersionChange"/>
      </div>
      <!-- 从表 -->
      <div class="border-t-2" v-if="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0">
        <a-tabs class="h-full" :tab-bar-style="{ marginBottom: '4px' }" size="small">
          <a-tab-pane v-for="subConfig in moduleConfig?.ChildEntityConfigs" :key="subConfig.ID" :tab="subConfig.DisplayName">
             <div class="h-full">
              <ModuleTable :module-config="subConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"
                :table-level="TableLevel.SubTable" :parentID="parentID" :parent-version="parentVersion" :parent-title="props.moduleTab.MenuPath[props.moduleTab.MenuPath.length - 1]"/>
             </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
    <!-- 内容  这个是模块页面 -->
    <div class="flex-1 min-h-0" v-if="getModulePageType() === ModulePageType.ModulePage">
      <ModulePage />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ModuleTab } from '@/models/moduleItemModel';

import clock from "@/assets/images/others/clock.png";
import { getWeekNo } from "@/utils/datetime";
import { ModulePageType, type ModuleConfig } from '@/models/moduleConfigModel';
import { TableLevel } from '@/models/gridDataModel';
const { locale } = useI18n();
const dateMessage = ref<string>();
const mainTableRef = ref<HTMLElement | null>(null);
const moduleConfig = ref<ModuleConfig>();
const parentID = ref<string>('');
const parentVersion = ref<any>();
provide('parentConfig', moduleConfig);
const parentIDChange = (newID: string) => {
  parentID.value = newID;
}

const parentVersionChange = (newVersion:any) => {
  parentVersion.value = newVersion;
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
    required: true,
    default: null
  },
});


onMounted(async () => {
  if(getModulePageType() === ModulePageType.Normal){
    loadConfig();
  }
  else{
    props.moduleTab.Loading = false;
  }
});

const loadConfig = async () =>{
  const res = await getModuleConfig(props.moduleTab.Url.split('entity=')[1]);
  moduleConfig.value = res;
  props.moduleTab.Loading = false;
}

// 页面URL与模块类型的映射
const PAGE_URL_MAPPING: Record<string, ModulePageType> = {
  'ModulePage.aspx': ModulePageType.ModulePage
};
// 获取模块类型
const getModulePageType = (): ModulePageType => {
  const { Url } = props.moduleTab;
  // 查找匹配的页面类型
  const matchedType = Object.entries(PAGE_URL_MAPPING).find(([pageUrl]) =>Url.includes(pageUrl));
  return matchedType?.[1] ?? ModulePageType.Normal;
};

</script>
<style scoped></style>
