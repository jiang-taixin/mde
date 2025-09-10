<template>
  <div class="flex items-center w-full h-full">
    <template v-if="props.attribute.ExtControlType === 'textfield' || props.attribute.ExtControlType === 'textarea'">
      <a-input size="small" :disabled="props.disabled" :placeholder="(props.attribute.PromptMessage as string)"
        v-model:value="localValue" @input="handleValueChange"></a-input>
    </template>
    <template v-if="props.attribute.ExtControlType === 'provincecityfield'">
      <a-form-item-rest>
        <a-select class="w-1/2 max-w-48" size="small" v-model:value="provinceValue" :disabled="props.disabled"
          :options="provinceOptions" @change="handleProvinceChange" show-search :filter-option="filterOption"
          :loading="provinceLoading"></a-select>
      </a-form-item-rest>
      <a-select class="w-1/2 max-w-48" size="small" v-model:value="localValue"
        :disabled="props.disabled" :options="cityOptions"
        @change="handleCityChange" show-search :filter-option="filterOption" :loading="cityLoading"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'lovfield'">
      <a-select :allow-clear="true" class="w-full" size="small" v-model:value="localValue"
        :field-names="{ label: 'Name', value: 'ID' }" :disabled="props.disabled" :options="lovOptions"
        @change="handleValueChange" :loading="loadingSelect"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'boolvaluecombox'">
      <a-select :allow-clear="true" class="w-full" size="small" v-model:value="localValue"
        :field-names="{ label: 'Name', value: 'Value' }" :disabled="props.disabled" :options="comboxOptions"
        @change="handleValueChange" :loading="loadingSelect"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'numberfield'">
      <a-input-number min="0" :precision="props.attribute.DigitalPrecision" class="w-full" size="small"
        :placeholder="(props.attribute.PromptMessage as string)" :disabled="props.disabled" v-model:value="localValue"
        @change="handleValueChange"></a-input-number>
    </template>
    <template v-if="props.attribute.ExtControlType === 'inputcheckfield'">
      <a-input-search class="w-full" size="small" :disabled="props.disabled" v-model:value="inputWord"
      @search="search" :loading="loading">
      </a-input-search>
    </template>
  </div>
  <a-modal v-model:open="open" :width="600" @ok="confirm" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center">
        {{ t('searchButtonTitle') }}
        <a-form-item-rest>
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 14px; margin-left:4px' })"
          @click="openCustom"></a-button>
          </a-form-item-rest>
      </div>

    </template>
    <SearchResult ref="resultRef" v-model:selectedObject="selectedObject" :entity-config-name="props.moduleConfig.Name"
      :target-entity-name="props.moduleConfig.Name" :key-word="inputWord" @confirm="confirm" :for-merge="true" />
  </a-modal>
</template>
<script setup lang="ts">
import { h } from 'vue';
import { getIcon } from '@/utils/icon-transfer';
import type { LovItem } from '@/models/metaDataModel';
import type { Attribute } from '@/models/moduleConfigModel';
import { getParentGeoGraphy } from '@/services/metaData-service';
import { message } from 'ant-design-vue';
import type { SeletedObject } from '../search-result/SearchResult.vue';
const { t } = useI18n();
const open = ref<boolean>(false);
const loading = ref<boolean>(false);
const cityLoading = ref<boolean>(false);
const provinceLoading = ref<boolean>(false);
const loadingSelect = ref<boolean>(false);

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  attribute: {
    type: Object as PropType<Attribute>,
    required: true,
    default: null
  },
  defaultValue: {
    type: [String, null, Number],
    required: true,
  },
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  typeValue:{
    type:String,
    required:false,
  }
});

const selectedObject = ref<SeletedObject>({
  DisplayName: '',
  Code: ''
});

const resultRef = ref(null);
const localValue = ref(props.defaultValue as string);
const lovOptions = ref<LovItem[]>([]);
const comboxOptions = ref<LovItem[]>([]);
const provinceOptions = ref<any>([]);
const cityOptions = ref<any>([]);
const provinceValue = ref<string>('');
const inputWord = ref<string>('');
const skipMainStore = ref<boolean>(false);
const emit = defineEmits<{
  (e: 'updateValue', data: { name: string; value: any }): void
}>();
watch(() => props.defaultValue, (newValue) => {
  localValue.value = newValue as any;
}, { immediate: true });
watch(() => props.defaultValue, () => {
  if(skipMainStore.value){
    skipMainStore.value = false;
    return;
  }
  if (props.attribute.ExtControlType === 'inputcheckfield') {
    getMainStore()
  }
  if (props.attribute.ExtControlType === 'provincecityfield') {
    getProvinceOptions()
  }
});
onMounted(() => {
  // 如果是下拉组件  获取元素据列表
  if (props.attribute.ExtControlType === 'lovfield') {
    if (lovOptions.value.length === 0) {
      getLovOptions();
    }
  }
  if (props.attribute.ExtControlType === 'boolvaluecombox') {
    if (comboxOptions.value.length === 0) {
      getComboxOptions();
    }
  }
  if (props.attribute.ExtControlType === 'provincecityfield') {
    if (provinceOptions.value.length === 0) {
      getProvinceOptions();
    }
  }
  if (props.attribute.ExtControlType === 'inputcheckfield') {
    getMainStore();
  }
})

const getLovOptions = async () => {
  loadingSelect.value = true;
  const res = await getLovItems(props.attribute.TargetLovID);
  loadingSelect.value = false;
  if (res) {
    lovOptions.value = res;
    // lov类型使用的是ID
    localValue.value = lovOptions.value.find(item => item.ID === props.defaultValue)?.ID as string;
  }
}

const getComboxOptions = async () => {
  loadingSelect.value = true;
  const res = await getComboxItems(props.attribute.AttributeName);
  loadingSelect.value = false;
  if (res) {
    comboxOptions.value = res;
    // bool类型的下拉使用的是Value
    localValue.value = comboxOptions.value.find(item => item.Name === props.defaultValue)?.Value as string;
  }
}

const getProvinceOptions = async () => {
  provinceLoading.value = true;
  const res = await getGeoGraphyList(parentId);
  provinceLoading.value = false;
  provinceOptions.value = [];
  if (res && Array.isArray(res)) {
    res.forEach(item => {
      const provinceData = { label: `${item.ChineseName}(${item.PYCode})`, value: item.ID };
      provinceOptions.value.push(provinceData);
    })
    // 获取到省的列表后再根据传进来的市ID定位到当前省   然后根据省id再获取市列表
    if (!isVoid(props.defaultValue)) {
      const proRes = await getParentGeoGraphy(props.defaultValue as string);
      if (proRes) {
        provinceValue.value = proRes.ID;
        localValue.value = props.defaultValue as string;
        getCityOptions();
      }
    }
  }
}
const getCityOptions = async () => {
  cityLoading.value = true;
  cityOptions.value = [];
  const cityRes = await getGeoGraphyList(provinceValue.value);
  cityLoading.value = false;
  if (cityRes) {
    cityRes.forEach(item => {
      const cityData = { label: `${item.ChineseName}(${item.PYCode})`, value: item.ID };
      cityOptions.value.push(cityData);
    })
  }

}


const getMainStore = async () => {
  // 获取总店信息
  if (!isVoid(props.defaultValue)) {
    loading.value = true;
    let searchCondition: SearchConditionValue = {} as SearchConditionValue;
    let masterCondition: any = [];
    if(props.typeValue && props.typeValue !== '1' && props.typeValue !== '3'){
      masterCondition.push({
        Name: 'DrugstoreTypeLovItemValue', Value: 3
      });
    }
    searchCondition = { AndOr: ANDOR.ANDOR, Conditions: [{ Name: 'ID', Value: props.defaultValue }] };
    const params: RequestGridParams = {
      PageIndex: 1,
      PageSize: -1,
      EntityConfigName: props.moduleConfig.Name,
      SearchCondition: searchCondition,
      MasterCondition: masterCondition.length > 0?masterCondition:null
    }
    const storeRes = await getGridData(params);
    loading.value = false;
    if (storeRes) {
      inputWord.value = JSON.parse(storeRes.JsonData)[0].Name;
    }
  }
  else{
    inputWord.value = '';
  }
}
const handleProvinceChange = () => {
  localValue.value = '';
  updateValue();
  getCityOptions();
}
const handleCityChange = () => {
  updateValue();
}

const updateValue = () => {
  emit('updateValue', {
    name: props.attribute.Name,
    value: localValue.value === undefined ? '' : localValue.value
  })
}

const handleValueChange = () => {
  updateValue();
}

const filterOption = (input: string, option: any) => {
  return option.ChineseName.toLowerCase().includes(input.toLowerCase());
};

const search = (value: string) => {
  if (!isVoid(value)) {
    inputWord.value = value;
    open.value = true;
  }
  else {
    message.error(t('typeKeywords'));
  }
}

const confirm = () => {
  if (isVoid(selectedObject.value.Code)) {
    message.error(t('noneSelectionTips'));
    return;
  }
  skipMainStore.value = true;
  localValue.value = selectedObject.value.Code;
  inputWord.value = selectedObject.value.DisplayName;
  updateValue();
  open.value = false;
}


const openCustom = () => {
  if (resultRef.value) {
    (resultRef.value as any).openCustomEvent();
  }
}
</script>
