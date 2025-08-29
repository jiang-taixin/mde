<template>
  <a-button @click="open">打开弹框</a-button>
  <a-modal v-model:open="openUpload" :width="500" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ t('upload.previewTitle',{name:'hahahha'}) }}
      </div>
    </template>
    <PreviewPanel :preview-summary="previewSummary" :preview-validation-type="previewValidationType"></PreviewPanel>
  </a-modal>
</template>

<script lang="ts" setup>
const { t } = useI18n();

import { ValidationType } from '@/models/uploadModel';
const openUpload = ref<boolean>(false);

const open = () => {
  openUpload.value = true;
}

const previewSummary = ref<Summary>({
  Total:0,
  Delete: 0,
  Insert: 0,
  Merge: 0,
  Update: 0
});
const previewValidationType = ref<ValidationType>(ValidationType.All);

</script>
