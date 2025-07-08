<template>
  <div class="w-full h-full">
    <a-form :model="formState" :label-col="{ style: { width: '100px' } }" ref="formRef" :rules="rules">
      <a-form-item label="Principal" name="principalID">
        <a-select v-model:value="formState.principalID" :options="userProfileStore.userProfile?.Principals"
          :field-names="{ label: 'Name', value: 'ID' }">
        </a-select>
      </a-form-item>
      <a-form-item label="Remember Me">
        <a-checkbox v-model:checked="rememberMe"></a-checkbox>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
const { t } = useI18n();
const userProfileStore = useUserProfileStore();
const principalID = defineModel<string>("principalID", { default: '' });
const {rememberMe} = storeToRefs(userProfileStore);
const formRef = ref();
const formState = reactive({
  principalID: principalID.value,
});

watch(() => formState.principalID, (newVal) => {
  principalID.value = newVal;
});
const rules: Record<string, Rule[]> = {
  principalID: [{ required: true, message: t('principal.selectTips'), trigger: 'change' }],
};
</script>
