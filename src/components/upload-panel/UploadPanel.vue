<template>
  <div>
    <a-form :label-col="{ style: { width: '120px' } }" ref="formRef" label-align="left">
      <a-form-item :label="t('upload.excelTips')" class="flex flex-row w-full">
        <div class="flex flex-row justify-between w-full">
          <a-input class="w-72" :placeholder="t('upload.selectTips')" :disabled="true"
            v-model:value="filePath"></a-input>
          <a-upload v-model:file-list="fileList" :max-count="1" @change="handleChange" :before-upload="beforeUpload"
            accept=".xlsx">
            <a-button class="ml-3 flex justify-center items-center"
              :icon="h('img', { src: getIcon('upload-icon'), style: 'width: 16px ;height:16px' })"></a-button>
            <template #itemRender>
            </template>
          </a-upload>
        </div>
        <a-checkbox class="mt-2" v-model:checked="incrementFlag" :disabled="true">{{ t('upload.isIncremental') }}</a-checkbox>
      </a-form-item>
      <a-form-item :label="t('upload.results')">
        <span v-if="showResult">{{ resultMessage }}</span>
      </a-form-item>
      <a-form-item :label="t('upload.operationTips')">
        <span v-if="validateResult">
          {{ t('upload.operationTips1') }}
          <a-button type="link" class="px-1">{{ t('upload.download') }}</a-button>
          {{ t('upload.operationTips2') }}
        </span>
      </a-form-item>
    </a-form>
    <div class="flex justify-end gap-2 w-full">
      <a-button class="w-28" size="small" :disabled="isVoid(filePath)" @click="uploadValidateFile">
        {{ t('upload.validate')}}
      </a-button>
      <a-button class="w-28" size="small" :disabled="!canImport" @click="importData">
        {{ t('upload.import') }}
      </a-button>
      <a-button class="w-28" size="small" @click="close">
        {{ t('close') }}
      </a-button>
    </div>

  </div>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { getIcon } from '@/utils/icon-transfer';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { isVoid } from '../../utils/datacheck';
const { t } = useI18n();
const fileList = ref<UploadProps['fileList']>([]);
const filePath = ref('');
const incrementFlag = ref<boolean>(true);
const showResult = ref<boolean>(true);
const resultMessage = ref<string>('');
const canImport = ref<boolean>(false);
const validateResult = ref<boolean>(true);
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  }
});
const emit = defineEmits(['closeCallback']);

const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    filePath.value = `C:\\fakepath\\${info.file.name}`
  }
};

const uploadValidateFile = async () => {
  if (fileList.value) {
    const formData = new FormData();
    const file = fileList.value[0];
    formData.append('ExcelFile', file.originFileObj as File);
    const res = await uploadFile(props.moduleConfig.EntityName, 2, formData);
    if(res.IsSucceed){
      // 上传成功之后再校验
    }
    else{
      resultMessage.value = !isVoid(res.Message)?res.Message:t('upload.validateFailed');
    }
  }
}

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

const close = () => {
  emit('closeCallback');
}

const importData = () => {
  emit('closeCallback');
}

</script>
