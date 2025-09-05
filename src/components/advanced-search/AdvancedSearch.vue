<template>
  <div class="w-full flex flex-col bg-primary-100 rounded p-2">
    <div class="w-full flex flex-row items-center gap-2 text-sm font-bold text-primary-400 my-2">
      <img class="w-4 h-4" :src="searchIcon" />
      {{ t('advancedSearchTips') }}
    </div>
    <div class="my-2">
      <FormProvider :form="form">
        <SchemaField :schema="schema" :scope="scope" />
      </FormProvider>
    </div>
    <a-button class="w-24 flex items-center" size="small" :icon="h('img', { src: searchIcon, style: 'width: 14px' })"
      @click="advancedSearch">
      <span class="text-base ml-1">{{ t('searchButtonTitle') }}</span>
    </a-button>
  </div>
</template>

<script lang="ts" setup>
import { h, ref, watch } from 'vue';
import { createForm,onFieldValueChange } from "@formily/core";
import { FormProvider, createSchemaField } from "@formily/vue";
import { FormGrid, FormItem, Input, DatePicker,InputNumber } from "@formily/antdv";
import MySelect from '../my-select/MySelect.vue';
import InputSearch from "../input-search/InputSearch.vue";
import ProvinceCity from '../province-city/ProvinceCity.vue';
import searchIcon from "@/assets/images/button/advanced-search.png";
import type { ModuleConfig } from "@/models/moduleConfigModel";
const { t } = useI18n();
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: () => ({ Attributes: [] })
  },
});

const emits = defineEmits(['searchCallback']);
// 初始化Formily
const form = createForm({
  effects(form){
    // 高级查询参数数据变化时要回传，这个数据在导出时要使用
    // onFieldValueChange('*', () => {
    //   emits('searchParamsChange', form.values);
    // })
  }
});
const { SchemaField } = createSchemaField({
  components: {
    Input, DatePicker, MySelect,ProvinceCity,InputNumber,
    InputSearch, FormGrid, FormItem
  }
});

// 使用自定义Hook
const { generateFieldSchema, scope } = useDynamicForm();
// 响应式schema
const schema = ref({
  type: "object",
  properties: {
    grid: {
      type: "void",
      "x-component": "FormGrid",
      "x-component-props": { minColumns: 3, maxColumns: 3 },
      properties: {}
    },
  }
});
// 更新schema
const setupSchema = (config: ModuleConfig) => {
  if (!config?.Attributes) return;
  const newProperties: Record<string, any> = {};
  config.Attributes.forEach(item => {
    if (item.IsAdvancedFilter) {
      newProperties[item.Name] = generateFieldSchema(item);
    }
  });
  schema.value = {
    ...schema.value,
    properties: {
      grid: {
        ...schema.value.properties.grid,
        properties: newProperties
      }
    }
  };
};
// 监听配置变化
watch(() => props.moduleConfig, setupSchema, { immediate: true, deep: true });
const advancedSearch = () => {
  emits('searchCallback', form.values);
};
</script>

<style scoped></style>
