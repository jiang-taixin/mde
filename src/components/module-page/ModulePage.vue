<template>
  <a-layout class="h-full">
      <a-layout-sider class="bg-white border h-full overflow-auto hide-scrollbar" width="220">
        <a-tree show-icon v-model:expanded-keys="expandedKeys" v-model:selected-keys="selectedKeys"
          :field-names="{ children: 'SubModulesList', title: 'DisplayName', key: 'Id' }" :tree-data="(menuList as any)"
          @select="selectModule">
          <template #icon="{ data }">
            <img :src="getIcon(data.Icon as string)" class="w-4 h-4 inline"></img>
          </template>
        </a-tree>
      </a-layout-sider>

      <a-layout-content class="bg-white border">
        <div class="h-auto">
        <ModuleTable v-if="moduleConfig" :module-config="moduleConfig" :parentID="parentID" :has-sub-module-config="false" :table-level="TableLevel.MainTable" :from-module="true"/>
        </div>
      </a-layout-content class="h-full">
  </a-layout>

</template>

<script setup lang="ts">
import type { ModuleItem } from "@/models/moduleItemModel";
import { getIcon } from "@/utils/icon-transfer";
import { TableLevel } from '@/models/gridDataModel';
const { t } = useI18n();

const moduleConfig = ref<ModuleConfig>();
const expandedKeys = ref([parentId]);
const selectedKeys = ref([parentId]);
const parentID = ref<string>(parentId);
const menuList = ref<ModuleItem[]>([{
  Id: parentId,
  Description: "",
  DisplayName: t('header.desktop'),
  EntityConfigID: "",
  Icon: null,
  IsSystem: false,
  Language: "",
  ModuleType: "",
  Name: "",
  ParentID: "",
  Sequence: 0,
  Url: null,
  SubModulesList: []
}]);

onMounted(async () => {
  await loadModules();
  await loadConfig();
})

const loadConfig = async () =>{
  const res = await getModuleConfig("ModuleConfig");
  moduleConfig.value = res;
}

const loadModules = async () => {
  const res = await getModulesList(moduleId);
  if (res) {
    menuList.value[0].SubModulesList = res;
  }
}

const selectModule = (selectedKeys: any, {node, event}: any) => {
  console.log('Selected Keys:', selectedKeys)
  if(node.SubModulesList?.length < 1){
    return;
  }
  parentID.value = selectedKeys[0];
}
</script>
