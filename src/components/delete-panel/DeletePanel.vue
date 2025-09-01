<template>
  <div class="w-full bg-slate-100">{{t('upload.deleteImpact')}}</div>
  <div class="mx-2 border rounded-sm my-2 h-80">
    <a-row v-for="impactEntity in props.impactEntities" class="my-2">
      <a-col :span="8">{{ impactEntity.DisplayName }}</a-col>
      <a-col :span="2">
        <a-button type="link" size="small" class="px-1 text-blue-500 underline-button cursor-pointer" @click="review(impactEntity)">
          {{impactEntity.Count}}
        </a-button>
      </a-col>
      <a-col :span="14">{{t('upload.deleteTips')}}</a-col>
    </a-row>
  </div>
  <div class="flex justify-end gap-2 w-full">
    <a-button class="w-28" size="small" @click="process">{{ t('upload.process') }}</a-button>
    <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
  </div>
  <a-modal v-model:open="openReview" :width="800" :footer="null" :destroy-on-close="true">
    <template #title>
      <div class="flex items-center text-lg">
        {{ t('upload.previewTitle',{name:selectedEntity?.DisplayName}) }}
      </div>
    </template>
    <ImpactPreviewPanel :impact-entity="selectedEntity" :session-id="props.sessionId"></ImpactPreviewPanel>
  </a-modal>
</template>

<script setup lang="ts">
import type { ImpactEntity } from '@/models/uploadModel';
import ImpactPreviewPanel from '../impact-preview-panel/ImpactPreviewPanel.vue';
const openReview = ref<boolean>(false);
const { t } = useI18n();
const emit = defineEmits(['closeCallback']);
const finishDelete = inject<() => void>('finishDelete');
const props = defineProps({
  impactEntities: {
    type: Object as PropType<ImpactEntity[]>,
    require: true,
    default: []
  },
  sessionId:{
    type:String,
    require:true,
    default:''
  }
});

const review = (entity:ImpactEntity) =>{
  selectedEntity.value = entity;
  openReview.value = true;
}

const process = async () =>{
  const res = await proceedDeletion(props.sessionId);
  if(res.IsSuccess){
    finishDelete?.();
    emit('closeCallback');
  }
}

const selectedEntity = ref<ImpactEntity>();

const close = () => {
  emit('closeCallback');
}
</script>
