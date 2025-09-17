<template>
  <a-spin :tip="t('loading')" :spinning="loading" class="flex flex-col">
    <div class="flex flex-col h-full">
      <a-form ref="formRef" :model="localChildList" :label-col="{ span: 7 }" label-align="left"
        :wrapper-col="{ span: 17 }">
        <!-- 权重标题 -->
        <a-form-item :label="weightTitleLabel" :rules="[{ required: true }]">
          {{ weightTitle }}
        </a-form-item>

        <!-- 中文权重名 -->
        <a-form-item :label="t('weight.chineseWeightName')" :rules="[{ required: true }]">
          {{ chineseWeightName }}
        </a-form-item>
        <!-- 动态输入框 -->
        <a-form-item v-for="(item, index) in localChildList" :key="item.id" :label="item.PositionEnglishName"
          :name="[index, 'Weight']" :rules="[weightRule]">
          <a-input-number :min="0" :max="1" :step="0.1" :precision="6" class="w-full" size="small"
            v-model:value="item.Weight" />
        </a-form-item>
      </a-form>

      <!-- 底部按钮 -->
      <div class="flex justify-end gap-2 w-full">
        <a-button class="w-28" size="small" @click="average">
          {{ t('average') }}
        </a-button>
        <a-button class="w-28" type="primary" size="small" @click="save">
          {{ t('save') }}
        </a-button>
        <a-button class="w-28" size="small" @click="close">
          {{ t('close') }}
        </a-button>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

const { t } = useI18n();
const loading = ref<boolean>(false);
const emit = defineEmits(['closeCallback', 'successCallback']);
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  childList: {
    type: Array as PropType<{ [key: string]: any }[]>,
    required: true,
    default: () => []
  }
})

const formRef = ref();
const localChildList = ref<{ [key: string]: any }[]>([]);

const weightRule = {
  required: true,
  validator: (_: any, value: number) => {
    if (value === null || value === undefined) {
      return Promise.reject(new Error(t('validString.notNull')))
    }
    return Promise.resolve()
  }
};

const weightTitleLabel = ref('');
const weightTitle = ref('');
const chineseWeightName = ref('');

onMounted(() => {
  if (props.moduleConfig.Name === 'HospitalStrengthWeightConfig') {
    weightTitleLabel.value = t('weight.hospitalWeightTitle')
  } else {
    weightTitleLabel.value = t('weight.accountWeightTitle')
  }

  localChildList.value = JSON.parse(JSON.stringify(props.childList));

  if (localChildList.value.length !== 0) {
    weightTitle.value = props.moduleConfig.Name === 'HospitalStrengthWeightConfig'
      ? localChildList.value[0].HospitalName
      : localChildList.value[0].AccountName;
    chineseWeightName.value = localChildList.value[0].StrengthChineseName;
  }
})

const save = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;
    // 校验通过执行修改操作
    let records: { Name: string; Value: any; }[][] = [];
    localChildList.value.forEach(item => {
      let record = [];
      record.push({Name:'ID',Value:item.ID});
      record.push({Name:'PositionID',Value:item.PositionID});
      record.push({Name:'StrengthID',Value:item.StrengthID});
      record.push({Name:'VersionID',Value:item.VersionID});
      record.push({Name:'Weight',Value:item.Weight});
      props.moduleConfig.Name === 'HospitalStrengthWeightConfig'?record.push({Name:'HospitalID',Value:item.HospitalID}):record.push({Name:'AccountID',Value:item.AccountID});
      records.push(record);
    })
    const params = {
      EntityName:props.moduleConfig.EntityName,
      Records:records
    }
    const res = await updateWeight(params);
    if(res.IsSuccess){
      emit('successCallback');
    }
    else{
      message.error(res.ErrorMessage);
    }
  } catch (error) {
  }finally{
    loading.value = false;
  }
}

const average = () => {
  if (localChildList.value.length === 0) return;
  const avg = 1 / localChildList.value.length;
  localChildList.value.forEach(item => {
    item.Weight = avg;
  });
}

const close = () => {
  emit('closeCallback')
}
</script>
