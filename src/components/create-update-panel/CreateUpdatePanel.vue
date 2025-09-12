
<template></template>
<script setup lang="ts">
import { CreateUpdateType } from '@/models/moduleConfigModel';


const props = defineProps({
  createUpdateType:{
    type:Number as ()=>CreateUpdateType,
    required:true,
    default:CreateUpdateType.Create
  }
});

console.log("-------type:"+props.createUpdateType)
</script>
