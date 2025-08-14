<template>

  <div class="flex justify-end gap-2 w-full">
    <a-button class="w-28" size="small">{{ t('remove') }}</a-button>
    <a-button class="w-28" size="small" @click="add">{{ t('add') }}</a-button>
    <a-button class="w-28" size="small">{{ t('save') }}</a-button>
    <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>

    <a-modal v-model:open="open" title="Basic Modal">
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>
  </div>

</template>

<script setup lang="ts">

const { t } = useI18n();
const open = ref<boolean>(false);

const emit = defineEmits(['closeCallback']);

const add = () => {
  open.value = true;
}
const close = () => {
  emit('closeCallback');
}
const openCustomEvent = () => {
  console.log("------------");
  // const $table = tableRef.value
  // if ($table) {
  //   $table.openCustom()
  // }
}



defineExpose({
  openCustomEvent
})

</script>
