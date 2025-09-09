<template>
  <div>
    <a-form ref="formRef" :model="resultRecord" layout="vertical">
      <div class="flex-1">
        <vxe-table ref="tableRef" :data="validAttributeList.filter(item => item.Name !== props.moduleConfig.PrimaryKey)"
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
                  <a-radio :checked="firstRecord[row.AttributeName].Checked"
                    @change="() => clickRecordFirst(row.AttributeName)" />
                  <CustomComponent :disabled="true" :default-value="firstRecord[row.AttributeName].Value"
                    :attribute="validAttributeList.find(item => item.AttributeName === row.AttributeName)"
                    :module-config="props.moduleConfig" />
                </div>
              </template>

              <!-- 第二条记录 -->
              <template #default="{ row }" v-if="column.Name === 'record2'" align="center">
                <div class="w-full h-full flex items-center">
                  <a-radio :checked="secondRecord[row.AttributeName].Checked"
                    @change="() => clickRecordSecond(row.AttributeName)" />
                  <CustomComponent :disabled="true" :default-value="secondRecord[row.AttributeName].Value"
                    :attribute="validAttributeList.find(item => item.AttributeName === row.AttributeName)"
                    :module-config="props.moduleConfig" />
                </div>
              </template>

              <!-- 合并结果（需要校验） -->
              <template #default="{ row }" v-if="column.Name === 'result'" align="center">
                <a-form-item :name="[row.AttributeName, 'Value']" :rules="fieldRules(row)"
                  :validate-trigger="['change', 'blur']" :validate-status="errors[row.AttributeName] ? 'error' : ''"
                  help="" class="w-full p-0">
                  <div class="w-full flex items-center">
                    <!-- 输入组件 -->
                    <div class="flex-1">
                      <CustomComponent :disabled="row.AttributeName === 'Code'"
                        :default-value="resultRecord[row.AttributeName]?.Value"
                        :attribute="validAttributeList.find(item => item.AttributeName === row.AttributeName)"
                        :module-config="props.moduleConfig" @update-value="handleUpdateValue" />
                    </div>
                    <!-- 错误按钮 -->
                    <div class="ml-2" v-if="errors[row.AttributeName]">
                      <a-popover placement="right" trigger="click">
                        <template #content>
                          <div style="max-width:260px; word-break:break-word;">
                            {{ errors[row.AttributeName] }}
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
      <a-button class="w-28" size="small" @click="merge">{{ t('merge.merge') }}</a-button>
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

interface RecordItem {
  Value: any
  Checked: boolean,
}

const { t } = useI18n()
const emit = defineEmits(['closeCallback', 'mergeCallback'])
const tableRef = ref<VxeTableInstance<any>>()
const formRef = ref<any>()
const columns = ref<CustomColumn[]>()
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

const validAttributeList = ref<Attribute[]>([])
const firstRecord = ref<Record<string, RecordItem>>({})
const secondRecord = ref<Record<string, RecordItem>>({})
const resultRecord = ref<Record<string, RecordItem>>({})

// 保存错误
const errors = reactive<Record<string, string>>({})

// 单字段校验方法
const validateField = async (fieldName: string) => {
  try {
    await formRef.value?.validateFields([[fieldName, 'Value']])
    if (errors[fieldName]) delete errors[fieldName]
  } catch (e: any) {
    if (e?.errorFields && e.errorFields[0]) {
      const name = Array.isArray(e.errorFields[0].name)
        ? e.errorFields[0].name[0]
        : e.errorFields[0].name
      if (name) {
        errors[name] = e.errorFields[0].errors?.[0] ?? '校验失败'
      }
    }
  }
}

const fieldRules = (row: any) => {
  const attr = validAttributeList.value.find(a => a.AttributeName === row.AttributeName)
  const rules: any[] = []
  if (attr && !attr.IsNullable) {
    rules.push({ required: true, message: t('validString.notNull') })
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
        if (value == null) return Promise.resolve()
        if (Number(value) > attr.Length) {
          return Promise.reject(new Error(t('validString.overMax', { count: attr.Length })))
        }
        return Promise.resolve()
      }
    })
  }
  if (attr?.Length && attr.ExtControlType === 'textfield') {
    rules.push({
      validator: (_: any, value: any) => {
        if (value == null) return Promise.resolve()
        if (String(value).length > attr.Length) {
          return Promise.reject(new Error(t('validString.overLength', { length: attr.Length })))
        }
        return Promise.resolve()
      }
    })
  }
  return rules
}

const getValidFieldNames = () => {
  return validAttributeList.value.map(attr => attr.AttributeName).filter(name => name !== 'ID')
}

onMounted(() => {
  if (props.recordList.length < 2) return
  columns.value = merge_columns
  MergeFields[props.moduleConfig.EntityName].Fields.forEach((item: string) => {
    const attribute = props.moduleConfig.Attributes.find(a => a.AttributeName === item)
    if (attribute) validAttributeList.value.push(attribute as Attribute)
  })
  validAttributeList.value.forEach(attr => {
    const fieldName = attr.AttributeName
    if (fieldName === 'ID') return
    firstRecord.value[fieldName] = {
      Value: props.recordList[0][fieldName] ?? null,
      Checked: true
    }
    secondRecord.value[fieldName] = {
      Value: props.recordList[1][fieldName] ?? null,
      Checked: false
    }
    resultRecord.value[fieldName] = { ...firstRecord.value[fieldName] }
  })
})

const close = () => {
  emit('closeCallback')
}

const merge = async () => {
  try {
    Object.keys(errors).forEach(k => delete errors[k])
    await formRef.value.validate()
    emit('mergeCallback', resultRecord.value)
  } catch (err: any) {
    Object.keys(errors).forEach(k => delete errors[k])
    if (err?.errorFields && Array.isArray(err.errorFields)) {
      err.errorFields.forEach((field: any) => {
        const name = Array.isArray(field.name) ? field.name[0] : field.name
        if (name) errors[name] = field.errors?.[0] ?? String(field)
      })
    }
  }
}

const clickRecordFirst = (attributeName: string) => {
  if (firstRecord.value[attributeName].Checked) return
  if (attributeName === 'Code') {
    const fieldNames = getValidFieldNames()
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = true
      secondRecord.value[key].Checked = false
      resultRecord.value[key].Value = firstRecord.value[key].Value
      validateField(key)
    })
  } else {
    firstRecord.value[attributeName].Checked = true
    secondRecord.value[attributeName].Checked = false
    resultRecord.value[attributeName].Value = firstRecord.value[attributeName].Value
    validateField(attributeName)
  }
}

const handleUpdateValue = (data: { attributeName: string; value: any }) => {
  const { attributeName, value } = data
  if (resultRecord.value[attributeName]) {
    resultRecord.value[attributeName].Value = value
  } else {
    resultRecord.value[attributeName] = { Value: value, Checked: false }
  }
  // 实时校验
  validateField(attributeName)
}

const clickRecordSecond = (attributeName: string) => {
  if (secondRecord.value[attributeName].Checked) return
  if (attributeName === 'Code') {
    const fieldNames = getValidFieldNames()
    fieldNames.forEach(key => {
      firstRecord.value[key].Checked = false
      secondRecord.value[key].Checked = true
      resultRecord.value[key].Value = secondRecord.value[key].Value
      validateField(key)
    })
  } else {
    firstRecord.value[attributeName].Checked = false
    secondRecord.value[attributeName].Checked = true
    resultRecord.value[attributeName].Value = secondRecord.value[attributeName].Value
    validateField(attributeName)
  }
}

const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) $table.openCustom()
}

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

defineExpose({ openCustomEvent })

const getRowClassName = ({ row }: { row: any }) => {
  if (secondRecord.value[row.AttributeName].Value !== firstRecord.value[row.AttributeName].Value) {
    return 'yellow-row'
  }
}
</script>
