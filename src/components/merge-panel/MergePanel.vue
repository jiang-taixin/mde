<template>
  <div>
    <a-form ref="formRef" :model="resultRecord" layout="vertical">
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="validAttributeList.filter((item: { Name: string }) => item.Name !== props.moduleConfig.PrimaryKey)"
          height="400px" max-height="800px" size="mini" round :border="true"
          :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
          :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }"
          :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
          show-overflow="ellipsis" :row-class-name="getRowClassName">
          <template v-for="column in columns" :key="column.Name">
            <vxe-column :field="column.Name" :title="column.DisplayName"
              :width="`${(column.DefaultWidth ?? 0) > 0 ? column.DefaultWidth : 50}px`" show-header-overflow>
              <!-- 左侧字段名 -->
              <template #default="{ row }" v-if="column.Name === 'field'">
                {{ row.DisplayName }}
                <span class="text-red-500" v-if="!row.IsNullable">*</span>
              </template>

              <!-- 第一条记录 -->
              <template #default="{ row }" v-if="column.Name === 'record1'" align="center">
                <div class="w-full h-full flex items-center">
                  <a-radio :checked="firstRecord[row.Name].Checked" @change="() => clickRecordFirst(row.Name)" />
                  <CustomComponent :disabled="true" :default-value="firstRecord[row.Name].Value"
                    :attribute="validAttributeList.find((item: { Name: any }) => item.Name === row.Name)"
                    :module-config="props.moduleConfig" />
                </div>
              </template>

              <!-- 第二条记录 -->
              <template #default="{ row }" v-if="column.Name === 'record2'" align="center">
                <div class="w-full h-full flex items-center">
                  <a-radio :checked="secondRecord[row.Name].Checked" @change="() => clickRecordSecond(row.Name)" />
                  <CustomComponent :disabled="true" :default-value="secondRecord[row.Name].Value"
                    :attribute="validAttributeList.find((item: { Name: any }) => item.Name === row.Name)"
                    :module-config="props.moduleConfig" />
                </div>
              </template>

              <!-- 合并结果（需要校验） -->
              <template #default="{ row }" v-if="column.Name === 'result'" align="center">
                <a-form-item :name="[row.Name, 'Value']" :rules="fieldRules(row)" :validate-trigger="['change', 'blur']"
                  :validate-status="errors[row.Name] ? 'error' : ''" help="" class="w-full p-0">
                  <div class="w-full flex items-center">
                    <!-- 输入组件 -->
                    <div class="flex-1">
                      <CustomComponent :disabled="resultRecord[row.Name].Disable"
                        :default-value="resultRecord[row.Name]?.Value"
                        :attribute="validAttributeList.find((item: { Name: any }) => item.Name === row.Name)"
                        :module-config="props.moduleConfig" @update-value="handleUpdateValue"
                        :type-value="resultRecord[row.Name].TypeValue" />
                    </div>
                    <!-- 错误按钮 -->
                    <div class="ml-2" v-if="errors[row.Name]">
                      <a-popover placement="right" trigger="click">
                        <template #content>
                          <div style="max-width:260px; word-break:break-word;">
                            {{ errors[row.Name] }}
                          </div>
                        </template>
                        <a-button type="text" danger size="small">!</a-button>
                      </a-popover>
                    </div>
                  </div>
                </a-form-item>
              </template>
            </vxe-column>
          </template>
        </vxe-table>
      </div>
    </a-form>

    <!-- 底部按钮 -->
    <div class="flex justify-end gap-2 w-full mt-3">
      <a-button class="w-28" size="small" @click="merge" :disabled="merging">{{ t('merge.merge') }}</a-button>
      <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { merge_columns } from '@/constants'
import type { Attribute, ModuleConfig } from '@/models/moduleConfigModel'
import { type CustomColumn } from '@/models/SecurityModel'
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table'
import { useI18n } from 'vue-i18n'
import { message } from 'ant-design-vue'

interface RecordItem {
  Value: any
  Checked: boolean,
  Disable?: boolean,
  TypeValue?: string,
}

const { t } = useI18n();
const emit = defineEmits(['closeCallback', 'successCallback']);
const tableRef = ref<VxeTableInstance<any>>();
const formRef = ref<any>();
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
    default: () => []
  }
})

const validAttributeList = ref<Attribute[]>([]);
const firstRecord = ref<Record<string, RecordItem>>({});
const secondRecord = ref<Record<string, RecordItem>>({});
const resultRecord = ref<Record<string, RecordItem>>({});
const LostDataID = ref<string>('');
const SaveDataID = ref<string>('');
const merging = ref<boolean>(false);

// 保存错误
const errors = reactive<Record<string, string>>({});

// 单字段校验方法
const validateField = async (fieldName: string) => {
  try {
    await formRef.value?.validateFields([[fieldName, 'Value']]);
    if (errors[fieldName]) delete errors[fieldName];
  } catch (e: any) {
    if (e?.errorFields && e.errorFields[0]) {
      const name = Array.isArray(e.errorFields[0].name)
        ? e.errorFields[0].name[0]
        : e.errorFields[0].name
      if (name) {
        errors[name] = e.errorFields[0].errors?.[0] ?? '校验失败';
      }
    }
  }
}

const fieldRules = (row: any) => {
  const attr = validAttributeList.value.find(a => a.Name === row.Name);
  const rules: any[] = []
  if (attr && !attr.IsNullable) {
    rules.push({ required: true, message: t('validString.notNull') });
  }
  if (attr && attr.RegExpression !== null) {
    rules.push({
      pattern: attr.RegExpression,
      message: t('validString.inValidError', { format: attr.PromptMessage })
    })
  }
  if (attr?.Length && attr.ExtControlType === 'numberfield') {
    rules.push({
      validator: (_: any, value: any) => {
        if (value == null) return Promise.resolve();
        if (Number(value) > attr.Length) {
          return Promise.reject(new Error(t('validString.overMax', { count: attr.Length })));
        }
        return Promise.resolve();
      }
    })
  }
  if (attr?.Length && attr.ExtControlType === 'textfield') {
    rules.push({
      validator: (_: any, value: any) => {
        if (value == null) return Promise.resolve();
        if (String(value).length > attr.Length) {
          return Promise.reject(new Error(t('validString.overLength', { length: attr.Length })));
        }
        return Promise.resolve();
      }
    })
  }
  return rules
}

const getValidFieldNames = () => {
  return validAttributeList.value.map(attr => attr.Name).filter(name => name !== 'ID');
}

onMounted(() => {
  if (props.recordList.length < 2) return;
  columns.value = merge_columns;
  MergeFields[props.moduleConfig.EntityName].Fields.forEach((item: string) => {
    // MergeFields里面配置的都是AttributeName    这里要按照AttributeName获取
    const attribute = props.moduleConfig.Attributes.find(a => a.AttributeName === item);
    if (attribute) validAttributeList.value.push(attribute as Attribute);
  })
  validAttributeList.value.forEach(attr => {
    // 这里实际使用的是 Name
    const fieldName = attr.Name;
    if (fieldName === 'ID') return;
    firstRecord.value[fieldName] = {
      Value: props.recordList[0][fieldName],
      Checked: true,
    }
    secondRecord.value[fieldName] = {
      Value: props.recordList[1][fieldName],
      Checked: false,
    }
    resultRecord.value[fieldName] = { ...firstRecord.value[fieldName] }
  });
  LostDataID.value = props.recordList[1].ID;
  SaveDataID.value = props.recordList[0].ID;
  resultRecord.value['Code'].Disable = true;
  resultRecord.value['DrugstoreTypeLovItemID'].Disable = true;
  changeParentStoreStatus(0);
})

const changeParentStoreStatus = (index: number) => {
  if (props.moduleConfig.EntityName === 'Drugstore') {
    resultRecord.value['ParentID'].TypeValue = undefined;
    let parentDrugStore = resultRecord.value['ParentID'].Value;
    if (parentDrugStore) {
      let isSingleRootDrugstore = (index === 0 ? props.recordList[0]['DrugstoreTypeLovItemValue'] : props.recordList[1]['DrugstoreTypeLovItemValue']);
      if (isSingleRootDrugstore === '1' || isSingleRootDrugstore === "3") {
        resultRecord.value['IsKATerritory'].Value = '';
      }
      else {
        resultRecord.value['ParentID'].TypeValue = isSingleRootDrugstore;
      }
      resultRecord.value['IsKATerritory'].Disable = true;
      resultRecord.value['ParentID'].Disable = true;
    }
    else {
      resultRecord.value['IsKATerritory'].Disable = false;
      resultRecord.value['ParentID'].Disable = false;
    }
  }
}



const close = () => {
  emit('closeCallback')
}

const merge = async () => {
  try {
    Object.keys(errors).forEach(k => delete errors[k])
    await formRef.value.validate();
  } catch (err: any) {
    Object.keys(errors).forEach(k => delete errors[k]);
    if (err?.errorFields && Array.isArray(err.errorFields)) {
      err.errorFields.forEach((field: any) => {
        const name = Array.isArray(field.name) ? field.name[0] : field.name;
        if (name) errors[name] = field.errors?.[0] ?? String(field);
      })
    }
  }
  // 转换 resultRecord 为所需格式 这里需要把resultRecord里面提取的Name再转变为AttributeName ...
  const record = Object.entries(resultRecord.value).map(([name, item]) => ({
    Name: validAttributeList.value.find(item => item.Name === name)?.AttributeName,
    Value: item.Value
  }));
  // 确保包含 ID
  if (!record.some(item => item.Name === 'ID')) {
    record.unshift({ Name: 'ID', Value: SaveDataID.value });
  }
  const mergeParams = {
    LostDataID: LostDataID.value,
    EntityName: props.moduleConfig.EntityName,
    SurvivedRecord: record
  }
  merging.value = true;
  await doMerge(mergeParams).then(res => {
    if (res.IsSuccess) {
      message.success(t('merge.success'));
      emit('successCallback');
    }
    else {
      message.error(res.Message)
    }
  }).catch(() => {
  }).finally(() => {
    merging.value = false;
  });
}

const clickRecordFirst = (name: string) => {
  if (firstRecord.value[name].Checked) return;
  if (name === 'Code') {
    const fieldNames = getValidFieldNames();
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = true;
      secondRecord.value[key].Checked = false;
      resultRecord.value[key].Value = firstRecord.value[key].Value;
    })
  } else {
    firstRecord.value[name].Checked = true;
    secondRecord.value[name].Checked = false;
    resultRecord.value[name].Value = firstRecord.value[name].Value;
  }
  changeParentStoreStatus(0);
  LostDataID.value = props.recordList[1].ID;
  SaveDataID.value = props.recordList[0].ID;
}

const handleUpdateValue = (data: { name: string; value: any }) => {
  const { name, value } = data;
  if (resultRecord.value[name]) {
    resultRecord.value[name].Value = value;
  } else {
    resultRecord.value[name] = { Value: value, Checked: false };
  }
  // 实时校验
  validateField(name);
}

const clickRecordSecond = (name: string) => {
  if (secondRecord.value[name].Checked) return;
  if (name === 'Code') {
    const fieldNames = getValidFieldNames();
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = false;
      secondRecord.value[key].Checked = true;
      resultRecord.value[key].Value = secondRecord.value[key].Value;
    })
  } else {
    firstRecord.value[name].Checked = false;
    secondRecord.value[name].Checked = true;
    resultRecord.value[name].Value = secondRecord.value[name].Value;
  }
  changeParentStoreStatus(1);
  LostDataID.value = props.recordList[0].ID;
  SaveDataID.value = props.recordList[1].ID;
}

const openCustomEvent = () => {
  const $table = tableRef.value;
  if ($table) $table.openCustom();
}

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

defineExpose({ openCustomEvent })

const getRowClassName = ({ row }: { row: any }) => {
  if (secondRecord.value[row.Name].Value !== firstRecord.value[row.Name].Value) {
    return 'yellow-row';
  }
}
</script>
