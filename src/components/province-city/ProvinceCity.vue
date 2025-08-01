<template>
  <div class="flex flex-row  h-full items-center">
    <a-select :style="{fontSize: '12px'}" v-model:value="province" size="small" :placeholder="t('selectPlaceholder')" @change="handleProvinceChange"
      class="w-1/2 max-w-32" show-search :filter-option="filterOption" allow-clear
      @dropdown-visible-change="loadProvince">
      <template v-if="loadingProvince">
        <a-select-option :value="null" disabled>
          <a-spin size="small" />
        </a-select-option>
      </template>
      <template v-else>
        <a-select-option v-for="option in provinceOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </template>
    </a-select>

    <a-select v-model:value="city" size="small" :placeholder="t('selectPlaceholder')" class="w-1/2 max-w-32"
      show-search :filter-option="filterOption" allow-clear @dropdown-visible-change="loadCity">
      <template v-if="loadingCity">
        <a-select-option :value="null" disabled>
          <a-spin size="small" />
        </a-select-option>
      </template>
      <template v-else>
        <a-select-option v-for="option in cityOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-select-option>
      </template>
    </a-select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useField } from '@formily/vue';

const { t } = useI18n();
const field = useField();

const loadingProvince = ref(false);
const loadingCity = ref(false);

const filterOption = (input: string, option: any) => {
  return option.label.toLowerCase().includes(input.toLowerCase());
}

const loadProvince = async (open: boolean) => {
  if (open && provinceOptions.value.length === 0) {
    try {
      loadingProvince.value = true;
      const res = await getGeoGraphyList(parentId); // 使用实际父ID
      if (res && Array.isArray(res)) {
        res.forEach(item => {
          const provinceData = {label:`${item.ChineseName}(${item.PYCode})`,value:item.ID};
          provinceOptions.value.push(provinceData);
        })
      }
    } catch (error) {

    } finally {
      loadingProvince.value = false;
    }
  }
}

const loadCity = async (open: boolean) => {
  if (open && province.value && cityOptions.value.length === 0) {
    try {
      loadingCity.value = true
      const res = await getGeoGraphyList(province.value);
      res.forEach(item => {
          const cityData = {label:`${item.ChineseName}(${item.PYCode})`,value:item.ID};
          cityOptions.value.push(cityData);
        })
    } catch (error) {
      console.error('加载城市数据失败:', error);
    } finally {
      loadingCity.value = false;
    }
  }
}

const province = ref('');
const city = ref('');
const provinceOptions = ref<any>([]);
const cityOptions = ref<any>([]);

function handleProvinceChange() {
  city.value = '';
  cityOptions.value = []; // 清空城市选项
}

watch([province, city], () => {
  const result = city.value || province.value || null;
  (field.value as any).setValue(result);
})
</script>
