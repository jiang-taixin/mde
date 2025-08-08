<template>
  <a-input-search v-bind="$attrs" v-model:value="selectedUser.DisplayName" :placeholder="props.placeholder" style="width: 100%;" :loading="loading" @search="search">
  </a-input-search>

  <a-modal v-model:open="open" :width="800" @ok="confirm">
    <template #title>
      <div class="flex items-center">
         {{t('searchButtonTitle')}}
      <a-button type="link" size="small"
          :icon="h('img', { src: getIcon('filter'), style: 'width: 16px; margin-left:4px' })" @click="openCustom"></a-button>
      </div>

    </template>
    <SearchResult ref="resultRef" v-model:selectedObject="selectedUser" :entity-config-name="props.entityConfigName" :target-entity-name="props.targetEntityName"
     :key-word="keyWord" @confirm="confirm"/>
  </a-modal>

</template>

<script lang="ts" setup>
import { h } from 'vue';
import { getIcon } from '@/utils/icon-transfer';
import { useField } from '@formily/vue';
import { message } from 'ant-design-vue';
import {type SeletedObject} from '../search-result/SearchResult.vue';
const open = ref<boolean>(false);
const { t } = useI18n();

const field = useField();
const selectedUser = ref<SeletedObject>({
  DisplayName: '',
  Code: ''
});
const resultRef = ref(null);
const keyWord = ref<string>('');

const loading = ref<boolean>(false);
const props = defineProps({
  placeholder: {
    type: String,
    required: true,
    default: ''
  },
  entityConfigName:{
    type: String,
    require: true,
    default: ''
  },
  targetEntityName: {
    type: String,
    require: true,
    default: ''
  }
});

console.log("--------- config:"+props.entityConfigName)

onMounted(() => {

})

const search = (value: string) =>{
  if(!isVoid(value)){
    keyWord.value = value;
    open.value = !open.value;
  }
  else{
    message.error(t('typeKeywords'));
  }
}

const confirm = () =>{
  (field.value as any).setValue(selectedUser.value.Code);
  open.value = false;
}


const openCustom = () => {
  if(resultRef.value){
    (resultRef.value as any).openCustomEvent();
  }
}

</script>

<style scoped></style>
