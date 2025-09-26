<template>
  <a-spin :spinning="loading">
    <div class="overflow-y-auto min-h-52 max-h-96 hide-scrollbar">
    <div class="w-full">{{ props.moduleConfig.EntityName }}</div>
    <div v-for="attribute in renderAttirbutesList">{{attribute.DisplayName}} -- {{attribute.ExtControlType}}
      --{{attribute.Name}}
    </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import type { Entity } from '@/models/entityModel';
import { CreateUpdateType, type Attribute } from '@/models/moduleConfigModel';
const loading = ref<boolean>(false);

const props = defineProps({
  createUpdateType: {
    type: Number as () => CreateUpdateType,
    required: true,
    default: CreateUpdateType.Create
  },
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
});
// 创建或编辑时需要渲染的字段
const renderAttirbutesList = ref<Attribute[]>([]);
const entity = ref<Entity>();

onMounted(async () => {
  //loading.value = true;
  const res = await getEntity(props.moduleConfig.EntityName, parentId);
  loading.value = false;
  if (res) {
    entity.value = res;
    RenderFields[props.moduleConfig.EntityName].Fields.forEach((item: string) => {
      // displayname在moduleconfig的attribute里面取     其他在entity里面取
      let attribute = (entity.value as Entity).EntityAttributes.find(a => a.Name === item);
      if (attribute) {
        attribute.DisplayName = props.moduleConfig.Attributes.find(a => a.AttributeName === item)?.DisplayName as string;
        renderAttirbutesList.value.push(attribute as Attribute);
      }

    })
  }
  console.log(renderAttirbutesList.value)
})

console.log("-------length:" + Object.keys(RenderFields).length)
</script>
