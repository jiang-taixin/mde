<template>
  <a-button v-for="button in buttons" :disabled="getDisable(button.Type)">
    Button {{ button.Name }}
  </a-button>
  <a-input @click="add" />
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
const index = ref('');
enum ButtonType{
  First = 0,
  Second = 1,
  Third = 2
}

interface Button{
  Type:ButtonType,
  Name:string
}
const list = ref<number[]>([]);
const buttons:Button[] = [{
  Type: ButtonType.First,
  Name: 'First'
},{
  Type:ButtonType.Second,
  Name:'Second'
},{
  Type:ButtonType.Third,
  Name:'Third'
}]
const add = () => {
  list.value.push(1);
}

// 方法实现
const getDisable = (i: ButtonType) => {
  console.log("------------------:"+i);
  return i === ButtonType.First;
};
// 监听输入变化
watch(list, (newVal) => {
  console.log('输入变化:', newVal);
  getDisable();
});
</script>

