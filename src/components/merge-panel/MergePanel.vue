<template>
  <div>
    <div class="flex-1">
      <vxe-table ref="tableRef" :data="validAttributeList.filter(item => item.Name !== props.moduleConfig.PrimaryKey)"
        height="400px" max-height="800px" size="mini" round :border="true"
        :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
        :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }"
        :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
        show-overflow="ellipsis">
        <template v-for="column in columns">
          <vxe-column :field="column.Name" :title="column.DisplayName"
            :width="`${(column.DefaultWidth ?? 0) > 0 ? column.DefaultWidth : 50}px`" show-header-overflow>
            <template #default="{ row }" v-if="column.Name === 'field'">
              {{ row.DisplayName }}
              <span class="text-red-500" v-if="!row.IsNullable">*</span>
            </template>
            <template #default="{ row }" v-if="column.Name === 'record1'" align="center">
              <div class="w-full h-full flex items-center">
                <a-radio :checked="firstRecord[row.AttributeName].Checked"
                  @change="() => clickRecordFirst(row.AttributeName)"></a-radio>
                {{ firstRecord[row.AttributeName].Value }}
              </div>
            </template>
            <template #default="{ row }" v-if="column.Name === 'record2'" align="center">
              <div class="w-full h-full flex items-center">
                <a-radio :checked="secondRecord[row.AttributeName].Checked"
                  @change="() => clickRecordSecond(row.AttributeName)"></a-radio>
                {{ secondRecord[row.AttributeName].Value }}
              </div>
            </template>
            <template #default="{ row }" v-if="column.Name === 'result'" align="center">
              {{ resultRecord[row.AttributeName].Value }}
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <div class="flex justify-end gap-2 w-full mt-3">
      <a-button class="w-28" size="small" @click="merge">{{ t('merge.merge') }}</a-button>
      <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { merge_columns } from '@/constants';
import type { Attribute, ModuleConfig } from '@/models/moduleConfigModel';
import { type CustomColumn } from '@/models/SecurityModel';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { useI18n } from 'vue-i18n';

// 定义记录项类型
interface RecordItem {
  Value: any;
  Checked: boolean;
}

const { t } = useI18n();
const emit = defineEmits(['closeCallback', 'mergeCallback']);
const tableRef = ref<VxeTableInstance<any>>();

const columns = ref<CustomColumn[]>();
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    required: true,
    default: null
  },
  recordList: {
    type: Array as PropType<{ [key: string]: any }[]>,
    required: true,
    default: () => [],
  }
});

// 有效字段列表
const validAttributeList = ref<Attribute[]>([]);
const firstRecord = ref<{ [key: string]: RecordItem }>({});
const secondRecord = ref<{ [key: string]: RecordItem }>({});
const resultRecord = ref<{ [key: string]: RecordItem }>({});

// 提取有效字段名（排除ID）
const getValidFieldNames = () => {
  return validAttributeList.value
    .map(attr => attr.AttributeName)
    .filter(name => name !== 'ID');
};

onMounted(() => {
  // 校验记录条数
  if (props.recordList.length < 2) {
    return;
  }

  columns.value = merge_columns;
  MergeFields[props.moduleConfig.EntityName].Fields.forEach((item: string) => {
    const attribute = props.moduleConfig.Attributes.find(attribute => attribute.AttributeName === item);
    attribute && validAttributeList.value.push(attribute as Attribute);
  });

  validAttributeList.value.forEach(attr => {
    const fieldName = attr.AttributeName;
    // 初始化数据
    if (fieldName !== 'ID') {
      firstRecord.value[fieldName] = {
        Value: props.recordList[0][fieldName] ?? null,
        Checked: true // 默认选中第一条
      };
      secondRecord.value[fieldName] = {
        Value: props.recordList[1][fieldName] ?? null,
        Checked: false // 默认不选中第二条
      };

      resultRecord.value[fieldName] = {
        ...firstRecord.value[fieldName]
      };
    }
  });
})

const close = () => {
  emit('closeCallback');
}

const merge = () => {
  // 构造合并后的数据（提取resultRecord中的Value）
  const mergedRecord: { [key: string]: any } = {};
  getValidFieldNames().forEach(key => {
    mergedRecord[key] = resultRecord.value[key].Value;
  });
  // 保留主键，从第一条记录获取
  mergedRecord.ID = props.recordList[0].ID;
  // 通知父组件合并结果
  emit('mergeCallback', mergedRecord);
  close(); // 合并后关闭弹窗
};

const clickRecordFirst = (attributeName: string) => {
  // 如果当前已经选中，则不做处理
  if (firstRecord.value[attributeName].Checked) return;
  if (attributeName === 'Code') {
    // 全选第一条记录的所有字段
    const fieldNames = getValidFieldNames();
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = true;
      secondRecord.value[key].Checked = false;
      resultRecord.value[key].Value = firstRecord.value[key].Value;
    });
  } else {
    // 只选中当前字段
    firstRecord.value[attributeName].Checked = true;
    secondRecord.value[attributeName].Checked = false;
    resultRecord.value[attributeName].Value = firstRecord.value[attributeName].Value;
  }
}

const clickRecordSecond = (attributeName: string) => {
  // 如果当前已经选中，则不做处理
  if (secondRecord.value[attributeName].Checked) return;
  if (attributeName === 'Code') {
    // 全选第二条记录的所有字段
    const fieldNames = getValidFieldNames();
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = false;
      secondRecord.value[key].Checked = true;
      resultRecord.value[key].Value = secondRecord.value[key].Value;
    });
  } else {
    // 只选中当前字段
    firstRecord.value[attributeName].Checked = false;
    secondRecord.value[attributeName].Checked = true;
    resultRecord.value[attributeName].Value = secondRecord.value[attributeName].Value;
  }
}

const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}
const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

defineExpose({
  openCustomEvent
})
</script>
