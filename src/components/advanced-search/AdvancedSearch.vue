<template>
  <div class="w-full flex flex-col bg-primary-100 rounded p-2">
    <div class="w-full flex flex-row items-center gap-2 text-sm font-bold text-primary-400 my-2">
      <img class="w-4 h-4" :src="searchIcon" />
      {{ t('advancedSearchTips') }}
    </div>
    <!--检索组件-->
    <div class="my-2">
      <FormProvider :form="form">
        <SchemaField :schema="schema" />
      </FormProvider>
    </div>
    <a-button class="w-24 flex items-center" size="small" :icon="h('img', { src: searchIcon, style: 'width: 14px' })" @click="advancedSearch">
      <span class="text-base ml-1">{{ t('searchButtonTitle') }}</span>
    </a-button>
  </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();
import searchIcon from "@/assets/images/button/advanced-search.png";
import { h, watch } from 'vue';
import { createForm } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/vue";
import { FormGrid, FormItem, Input, Select, DatePicker } from "@formily/antdv";
import type { ModuleConfig } from "@/models/moduleConfigModel";
import InputSearch from "../input-search/InputSearch.vue";

const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: () => ({ Attributes: [] })
  },
});

const emits = defineEmits(['searchCallback'])

// 先定义schema结构
const schema = reactive({
  type: "object",
  properties: {
    grid: {
      type: "void",
      "x-component": "FormGrid",
      "x-component-props": {
        minColumns: 3,
        maxColumns: 3,
      },
      properties: {} // 初始化为空对象
    },
  }
});

const setupSchema = (config: ModuleConfig) => {
  if (!config?.Attributes) return;
  // 使用新对象替换properties确保响应式更新
  const newProperties = {} as Record<string, any>;
  config.Attributes.forEach(item => {
    console.log("-----------------------");
    if (item.IsAdvancedFilter) {
      newProperties[item.Name] = useDynamicForm(item);
    }
  });

  // 整体替换grid.properties
  schema.properties.grid.properties = newProperties;
  schema.type = "object";
};

const form = createForm();
const { SchemaField } = createSchemaField({
  components: {
    Input,
    DatePicker,
    Select,
    InputSearch,
    FormGrid,
    FormItem
  }
});

const advancedSearch = () =>{
  //console.log("------search :"+typeof(form.values));
  emits('searchCallback', form.values);
}

watch(() => props.moduleConfig, (newConfig) => {
  setupSchema(newConfig);
}, { immediate: true, deep: true });

</script>

<style scoped></style>
