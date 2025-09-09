<template>
  <div class="flex items-center w-full h-full">
    <template v-if="props.attribute.ExtControlType === 'textfield' || props.attribute.ExtControlType === 'textarea'">
      <a-input size="small" :disabled="props.disabled" :placeholder="(props.attribute.PromptMessage as string)"
        v-model:value="localValue" @input="handleValueChange"></a-input>
    </template>
    <template v-if="props.attribute.ExtControlType === 'provincecityfield'">
      <a-form-item-rest>
        <a-select class="w-1/2" size="small" v-model:value="provinceValue"
          :field-names="{ label: 'ChineseName', value: 'ID' }" :disabled="props.disabled" :options="provinceOptions"
          @change="handleProvinceChange"></a-select>
      </a-form-item-rest>
      <a-select class="w-1/2" size="small" v-model:value="localValue"
        :field-names="{ label: 'ChineseName', value: 'ID' }" :disabled="props.disabled" :options="cityOptions"
        @change="handleCityChange"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'lovfield'">
      <a-select :allow-clear="true" class="w-full" size="small" v-model:value="localValue"
        :field-names="{ label: 'Name', value: 'ID' }" :disabled="props.disabled" :options="lovOptions"
        @change="handleValueChange"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'boolvaluecombox'">
      <a-select :allow-clear="true" class="w-full" size="small" v-model:value="localValue"
        :field-names="{ label: 'Name', value: 'Value' }" :disabled="props.disabled" :options="comboxOptions"
        @change="handleValueChange"></a-select>
    </template>
    <template v-if="props.attribute.ExtControlType === 'numberfield'">
      <a-input-number min="0" :precision="props.attribute.DigitalPrecision" class="w-full" size="small" :placeholder="(props.attribute.PromptMessage as string)"
        :disabled="props.disabled" v-model:value="localValue" @change="handleValueChange"></a-input-number>
    </template>
    <template v-if="props.attribute.ExtControlType === 'inputcheckfield'">
      <a-input-search class="w-full" size="small" :disabled="props.disabled" v-model:value="localValue"
        @change="handleValueChange" @search="search">
      </a-input-search>
    </template>
  </div>
  <a-modal v-model:open="open" :width="600" @ok="confirm">
    <template #title>
      <div class="flex items-center">
        {{ t('searchButtonTitle') }}
        <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 14px; margin-left:4px' })"
          @click="openCustom"></a-button>
      </div>

    </template>
    <SearchResult ref="resultRef" v-model:selectedObject="selectedObject" :entity-config-name="props.moduleConfig.Name"
      :target-entity-name="props.moduleConfig.Name" :key-word="localValue" @confirm="confirm" :for-merge="true" />
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
    type: [String, null],
    required: true,
  },
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
});

const selectedObject = ref<SeletedObject>({
  DisplayName: '',
  Code: ''
});

const resultRef = ref(null);
const localValue = ref(props.defaultValue as string);
const lovOptions = ref<LovItem[]>([]);
const comboxOptions = ref<LovItem[]>([]);
const provinceOptions = ref<Geography[]>([]);
const provinceValue = ref<string>('');
const cityOptions = ref<Geography[]>([]);
const emit = defineEmits<{
  (e: 'updateValue', data: { attributeName: string; value: any }): void
}>();
watch(() => props.defaultValue, (newValue) => {
  localValue.value = newValue as any;
}, { immediate: true });
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
  const res = await getLovItems(props.attribute.TargetLovID);
  if (res) {
    lovOptions.value = res;
    // lov类型使用的是ID
    localValue.value = lovOptions.value.find(item => item.ID === props.defaultValue)?.ID as string;
  }
}

const getComboxOptions = async () => {
  const res = await getComboxItems(props.attribute.AttributeName);
  if (res) {
    comboxOptions.value = res;
    // bool类型的下拉使用的是Value
    localValue.value = comboxOptions.value.find(item => item.Name === props.defaultValue)?.Value as string;
  }
}

const getProvinceOptions = async () => {
  const res = await getGeoGraphyList(parentId);
  if (res) {
    provinceOptions.value = res;
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
const getMainStore = async () => {
  // 获取总店信息

  if (!isVoid(props.defaultValue)) {
    let searchCondition: SearchConditionValue = {} as SearchConditionValue;
    searchCondition = { AndOr: ANDOR.ANDOR, Conditions: [{ Name: 'ID', Value: props.defaultValue }] };
    const params: RequestGridParams = {
      PageIndex: 1,
      PageSize: -1,
      EntityConfigName: props.moduleConfig.Name,
      SearchCondition: searchCondition
    }
    const storeRes = await getGridData(params);
    if (storeRes) {
      localValue.value = JSON.parse(storeRes.JsonData)[0].Name;
    }
  }

}
const handleProvinceChange = () => {
  localValue.value = '';
  getCityOptions();
}
const handleCityChange = () => {
  emit('updateValue', {
    attributeName: props.attribute.AttributeName,
    value: localValue.value
  });
}

const getCityOptions = async () => {
  const cityRes = await getGeoGraphyList(provinceValue.value);
  if (cityRes) {
    cityOptions.value = cityRes;
  }
}

const handleValueChange = () => {
  emit('updateValue', {
    attributeName: props.attribute.AttributeName,
    value: localValue.value
  })
}

const search = (value: string) => {
  if (!isVoid(value)) {
    localValue.value = value;
    open.value = !open.value;
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
  localValue.value = selectedObject.value.DisplayName;
  emit('updateValue', {
    attributeName: props.attribute.AttributeName,
    value: selectedObject.value.Code
  })
  open.value = false;
}


const openCustom = () => {
  if (resultRef.value) {
    (resultRef.value as any).openCustomEvent();
  }
}
</script>
