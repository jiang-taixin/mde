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
        <a-checkbox class="mt-2" v-model:checked="isCheck" :disabled="isDisabled">{{ t('upload.isIncremental')
        }}</a-checkbox>
      </a-form-item>
      <a-form-item :label="t('upload.results')">
        <span>{{ resultMessage }}</span>
      </a-form-item>
      <a-form-item :label="t('upload.operationTips')">
        <div ref="contentContainer" v-html="operationMessage">
        </div>
      </a-form-item>
    </a-form>
    <div class="flex justify-end gap-2 w-full">
      <a-button class="w-28" size="small" :disabled="!canUpload" @click="handleUpload">
        {{ t('upload.validate') }}
      </a-button>
      <a-button class="w-28" size="small" :disabled="!canImport" @click="importData">
        {{ t('upload.import') }}
      </a-button>
      <a-button class="w-28" size="small" @click="close">
        {{ t('close') }}
      </a-button>
    </div>
  </div>
  <!--删除弹窗-->
  <a-modal v-model:open="openDelete" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ t('upload.deleteTitle',{name:props.moduleConfig.DisplayName}) }}
      </div>
    </template>
    <DeletePanel @closeCallback="closeDeletePanel" :impact-entities="impactEntities" :session-id="sessionID"></DeletePanel>
  </a-modal>
  <!--预览弹窗-->
  <a-modal v-model:open="openReview" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ t('upload.previewTitle',{name:props.moduleConfig.EntityName}) }}
      </div>
    </template>
    <PreviewPanel :preview-summary="previewSummary" :preview-validation-type="previewValidationType"
    :module-config="props.moduleConfig" :session-id="sessionID" :validate-type="previewValidationType"></PreviewPanel>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { getIcon } from '@/utils/icon-transfer';
import type { UploadChangeParam, UploadProps } from 'ant-design-vue';
import { isVoid } from '../../utils/datacheck';
import { ImportType } from '@/models/moduleConfigModel';
import DeletePanel from '../delete-panel/DeletePanel.vue';
import PreviewPanel from '../preview-panel/PreviewPanel.vue';
import { ValidationType, type ImpactEntity, type Summary } from '@/models/uploadModel';
const { t } = useI18n();
const contentContainer = ref<HTMLDivElement|null>(null);
const fileList = ref<UploadProps['fileList']>([]);
const filePath = ref('');
const isCheck = ref<boolean>(true);
const isDisabled = ref<boolean>(true);
const openDelete = ref<boolean>(false);
const openReview = ref<boolean>(false);
const sessionID = ref<string>('');
const impactEntities = ref<ImpactEntity[]>([]);
const resultMessage = ref<string>('');
const operationMessage = ref<string>('');
const canUpload = ref<boolean>(false);
const canImport = ref<boolean>(false);
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  }
});

const summaryCount = reactive({
  validateTotal: NaN,
  inValidateTotal: NaN
});
const validateSummary = ref<Summary>({
  Delete: 0,
  Insert: 0,
  Merge: 0,
  Update: 0
});
const invalidateSummary = ref<Summary>({
  Delete: 0,
  Insert: 0,
  Merge: 0,
  Update: 0
});
const previewSummary = ref<Summary>({
  Total:0,
  Delete: 0,
  Insert: 0,
  Merge: 0,
  Update: 0
});
const previewValidationType = ref<ValidationType>(ValidationType.All);
const emit = defineEmits(['closeCallback']);

onMounted(() =>{
  const importType = props.moduleConfig.ImportTypeEnum;
  if (importType === ImportType.All) {
    isDisabled.value = false;
    isCheck.value = true;
  }
  else if (importType == ImportType.IncrementalData) {
    isDisabled.value = true;
    isCheck.value = true;
  }
  else {
    isDisabled.value = true;
    isCheck.value = false;
  }
  bindButtonEvent();
});

const handleChange = (info: UploadChangeParam) => {
  const status = info.file.status;
  if (status !== 'uploading') {
    filePath.value = `C:\\fakepath\\${info.file.name}`;
    canUpload.value = true;
  }
};

const handleUpload = async () => {
  resultMessage.value = '';
  operationMessage.value = '';
  canImport.value = false;
  if (fileList.value) {
    const formData = new FormData();
    const file = fileList.value[0];
    formData.append('ExcelFile', file.originFileObj as File);
    // 这里的importType 要根据是否勾选设置
    const importType = isCheck.value === true ? 2 : 1;
    const uploadRes = await uploadFile(props.moduleConfig.EntityName, importType, formData);
    if (uploadRes.IsSucceed) {
      // 上传成功之后再校验
      sessionID.value = uploadRes.SessionID;
      handleValidate();
    }
    else {
      resultMessage.value = !isVoid(uploadRes.Message) ? uploadRes.Message : t('upload.validateFailed');
    }
  }
};


const handleValidate = async () => {
  const validateRes = await validateFile(props.moduleConfig.EntityName, sessionID.value, isCheck.value);
  if (validateRes) {
    const { ValidSummary, InValidSummary, ReportType, ImpactEntities } = validateRes;
    validateSummary.value = ValidSummary as Summary;
    invalidateSummary.value = InValidSummary as Summary;
    if (ReportType === 0) {
      if (ValidSummary) {
        summaryCount.validateTotal = ValidSummary.Insert + ValidSummary.Update + ValidSummary.Delete + ValidSummary.Merge;
      }
      if (InValidSummary) {
        summaryCount.inValidateTotal = InValidSummary.Insert + InValidSummary.Update + InValidSummary.Delete + InValidSummary.Merge;
      }
      if (summaryCount.validateTotal === 0 && summaryCount.inValidateTotal === 0) {
        canImport.value = true;
        operationMessage.value = t('upload.operationSuccessTips');
        resultMessage.value = t('upload.resultSuccessTips');
      }
      else {
        canImport.value = false;
        canUpload.value = true;
        resultMessage.value = t('upload.validateFailed');
        operationMessage.value = t('upload.onlyDownload');
      }
    }
    else {
      if (InValidSummary) {
        summaryCount.inValidateTotal = InValidSummary.Insert + InValidSummary.Update + InValidSummary.Delete + InValidSummary.Merge;
      }
      if (summaryCount.inValidateTotal === 0 && ImpactEntities && ImpactEntities.length > 0) {
        //如果验证都成功但是存在删除依赖则进行预览
        //这里是直接打开删除的弹框
        impactEntities.value = ImpactEntities;
        openDelete.value = true;
      }
      else if (summaryCount.inValidateTotal === 0) {
        //如果没有删除依赖项 则可以进行导入
        canImport.value = true;
        operationMessage.value = t('upload.operationSuccessTips');
        resultMessage.value = t('upload.resultSuccessTips');
      }
      else {
        //验证有错误点击统计数字进行不同预览
        if (ValidSummary) {
          summaryCount.validateTotal = ValidSummary.Insert + ValidSummary.Update + ValidSummary.Delete + ValidSummary.Update;
        }
        resultMessage.value = t('upload.operationFailedTips');
        operationMessage.value = t('upload.hasCount',{total:summaryCount.validateTotal+summaryCount.inValidateTotal,
           validate:summaryCount.validateTotal, invalidate:summaryCount.inValidateTotal});
        canImport.value = false;
        canUpload.value = true;
      }
    }
  }
};

const beforeUpload: UploadProps['beforeUpload'] = file => {
  fileList.value = [...(fileList.value || []), file];
  return false;
};

const importData = () => {
  emit('closeCallback');
};

const closeDeletePanel = () =>{
  openDelete.value = false;
}

const handleDownloadClick = async () =>{
  const res = await downloadValidatedExcel(props.moduleConfig.EntityName, sessionID.value);
    if (res.status === 200) {
      const contentDisposition = (res as any).headers['content-disposition'];
      let filename = 'report.xlsx';
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename=(.*)/);
        if (matches !== null && matches.length > 1) {
          filename = matches[1].replace(/"/g, '');
        }
      }
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(filename);
      a.click();
      URL.revokeObjectURL(url);
    }
};
const handleTotalClick = () =>{
  console.log('total click');
  if(summaryCount.validateTotal + summaryCount.inValidateTotal === 0){
    return;
  }
  previewSummary.value.Total = summaryCount.validateTotal + summaryCount.inValidateTotal;
  previewSummary.value.Delete = validateSummary.value.Delete + invalidateSummary.value.Delete;
  previewSummary.value.Insert = validateSummary.value.Insert + invalidateSummary.value.Insert;
  previewSummary.value.Update = validateSummary.value.Update + invalidateSummary.value.Update;
  previewSummary.value.Merge = validateSummary.value.Merge + invalidateSummary.value.Merge;
  previewValidationType.value = ValidationType.All;
  openReview.value = true;
};
const handleValidateClick = () =>{
  console.log('validate click');
  if(summaryCount.validateTotal === 0){
    return;
  }
  previewSummary.value.Total = summaryCount.validateTotal;
  previewSummary.value.Delete = validateSummary.value.Delete;
  previewSummary.value.Insert = validateSummary.value.Insert;
  previewSummary.value.Update = validateSummary.value.Update;
  previewSummary.value.Merge = validateSummary.value.Merge;
  previewValidationType.value = ValidationType.Valid;
  openReview.value = true;
};
const handleInvalidateClick = () =>{
  console.log('invalidate click');
  if(summaryCount.inValidateTotal === 0){
    return;
  }
  previewSummary.value.Total = summaryCount.inValidateTotal;
  previewSummary.value.Delete = invalidateSummary.value.Delete;
  previewSummary.value.Insert = invalidateSummary.value.Insert;
  previewSummary.value.Update = invalidateSummary.value.Update;
  previewSummary.value.Merge = invalidateSummary.value.Merge;
  previewValidationType.value = ValidationType.Invalid;
  openReview.value = true;
};
const bindButtonEvent = () =>{
  if(contentContainer.value){
    const downloadButtons = contentContainer.value.querySelectorAll('.download-button');
    downloadButtons.forEach(button => {
      button.removeEventListener('click', handleDownloadClick);
      button.addEventListener('click',handleDownloadClick);
    });
    const totalButtons = contentContainer.value.querySelectorAll('.total-button');
    totalButtons.forEach(button => {
      button.removeEventListener('click', handleTotalClick);
      button.addEventListener('click',handleTotalClick);
    });
    const validateButtons = contentContainer.value.querySelectorAll('.validate-button');
    validateButtons.forEach(button => {
      button.removeEventListener('click', handleValidateClick);
      button.addEventListener('click',handleValidateClick);
    });
    const invalidateButtons = contentContainer.value.querySelectorAll('.invalidate-button');
    invalidateButtons.forEach(button => {
      button.removeEventListener('click', handleInvalidateClick);
      button.addEventListener('click',handleInvalidateClick);
    });
  }
};

watch(resultMessage, () =>{
  nextTick(() => {
    bindButtonEvent()
  })
});

const close = () => {
  emit('closeCallback');
};

</script>
