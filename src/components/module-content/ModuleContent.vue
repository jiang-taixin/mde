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
    <div class="flex-1">
      <!-- 主表 -->
      <div :class="['flex-col w-full', (moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0 ? 'h-1/2' : 'h-full']" ref="mainTableRef">
        <ModuleTable :module-config="moduleConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"/>
      </div>
      <!-- 从表 -->
      <div class="h-1/2 border-t-2" v-if="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0">
        <a-tabs class="h-full" :tab-bar-style="{ marginBottom: '4px' }" size="small">
          <a-tab-pane v-for="subConfig in moduleConfig?.ChildEntityConfigs" :key="subConfig.ID" :tab="subConfig.DisplayName">
             <div class="h-full">
              <ModuleTable :module-config="subConfig" :has-sub-module-config="(moduleConfig?.ChildEntityConfigs as ModuleConfig[]).length > 0"/>
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
const { locale } = useI18n();
const dateMessage = ref<string>();
const mainTableRef = ref<HTMLElement | null>(null);
const moduleConfig = ref<ModuleConfig>({
  AllowEdit: false,
  Attributes: [],
  ChildEntityConfigs: [],
  Description: null,
  DetailTemplateName: '',
  DialogHeight: 0,
  DialogWidth: 0,
  DisplayName: '',
  EntityAttributes: null,
  EntityID: '',
  EntityName: '',
  ExcelRuntimeVersion: undefined,
  Features: [],
  ForeignKeyID: '',
  ForeignKeyPhysicalViewAlias: undefined,
  GroupingPhysicalViewAlias: undefined,
  ID: '',
  ImportTypeEnum: 0,
  IsSystem: false,
  Language: null,
  Name: '',
  PageSize: 0,
  ParentEntityConfigName: null,
  ParentID: '',
  PhysicalView: '',
  PrimaryConfigID: '',
  PrimaryConfigName: null,
  PrimaryKey: '',
  ServiceDeleteMethod: undefined,
  ServiceGetMethod: undefined,
  ServiceInsertMethod: undefined,
  ServiceUpdateMethod: undefined,
  UniqueScope: 0,
  UniqueScopeError: undefined
});
// 监听语言切换
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
  console.log(JSON.stringify(res.Attributes))
  moduleConfig.value = res;
  props.moduleTab.Loading = false;
}

</script>
<style scoped></style>
