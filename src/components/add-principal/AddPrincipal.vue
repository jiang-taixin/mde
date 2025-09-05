<template>
  <a-spin :tip="t('loading')" :spinning="loading" class="flex flex-col">
    <div class="flex flex-row">

      <div class="border w-40">
        <a-radio-group v-model:value="selectedPrincipal" size="small">
          <a-radio class="mb-3" v-for="principal in principalOptions"
            :value="principal.value">{{ principal.label }}</a-radio>
        </a-radio-group>
      </div>
      <div class="border w-[calc(100%-160px)]">

        <div class="w-full flex flex-row py-1 justify-between">
          <a-popover trigger="focus" color="#CCEAFF" placement="bottomLeft" :arrow="false"
            :overlay-inner-style="{ padding: '4px' }">
            <template #title>
              <p class="mb-1 text-base">{{ t('typeKeywords') }}</p>
            </template>
            <template #content>
              <template v-for="item in moduleConfig.Attributes">
                <p class="mb-1 text-sm" v-if="item.IsFuzzyFilter">{{ item.DisplayName }}</p>
              </template>
            </template>
            <a-input-search v-model:value="searchWord" size="small" :placeholder="t('searchPlaceholder')"
              style="width: 200px" @search="onSearch"
              v-if="moduleConfig.Features?.find(item => item.Name === FeatureName.FuzzySearch)" />
          </a-popover>
          <a-button type="link" size="small" @click="openCustomEvent"
            :icon="h('img', { src: getIcon('filter'), style: 'width: 16px' })"></a-button>
        </div>
        <!--表格-->
        <div class="flex-1">
          <vxe-table ref="tableRef" :data="gridData.JsonData" height="300px" size="mini" round :border="true"
            :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
            :checkbox-config="checkboxConfig" :cell-config="{ height: 25 }" :custom-config="customConfig"
            :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
            show-overflow="ellipsis" @checkbox-change="checkboxChange" @checkbox-all="checkAll">
            <!--选择列-->
            <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
            <!--Attribute中的有效列-->
            <template v-for="column in moduleConfig.Attributes">
              <template v-if="!column.Hidden">
                <vxe-column :field="column.Name" :title="column.DisplayName"
                  :width="`${column.DisplayWidth > 0 ? column.DisplayWidth : 80}px`" show-header-overflow
                  :sortable="column.SortOrder !== null" :visible="column.DisplayByDefault">
                </vxe-column>
              </template>
            </template>
          </vxe-table>
        </div>
        <!--分页-->
        <div class="flex justify-end py-2 mb-2">
          <a-pagination size="small" v-model:current="pagination.current" v-model:page-size="pagination.pageSize"
            show-quick-jumper :total="pagination.total" @change="onPageChange" show-size-changer
            :page-size-options="pagination.pageSizeOptions"
            :show-total="(total: any) => t('total', { total: total })" />
        </div>

      </div>

    </div>
  </a-spin>
  <div class="flex justify-end gap-2 w-full mt-3">
    <a-button class="w-28" size="small" @click="confirm">{{ t('confirm') }}</a-button>
    <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>
  </div>
</template>
<script setup lang="ts">
import { SecurityPrincipalType } from '@/models/SecurityModel';
import type { Pagination } from '../module-table/ModuleTable.vue';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { ref, h } from 'vue';
import { FeatureName, type Attribute, type ModuleConfig } from '@/models/moduleConfigModel';
import { getIcon } from '@/utils/icon-transfer';
import { message } from 'ant-design-vue';
const emit = defineEmits(['closeAddPanel', 'confirmAddPanel']);
const { t } = useI18n();
const principalOptions = ref([{
  label: t('principalName.user'), value: SecurityPrincipalType.User
}, {
  label: t('principalName.group'), value: SecurityPrincipalType.Group
}, {
  label: t('principalName.organization'), value: SecurityPrincipalType.Organization
}, {
  label: t('principalName.title'), value: SecurityPrincipalType.Title
}]);
const props = defineProps({
  principalList: {
    type: Object as PropType<SecurityItem[]>,
    required: true,
    default: null
  },
});
const checkboxConfig = reactive<VxeTablePropTypes.CheckboxConfig<any>>({
  highlight: true,
  checkMethod: ({ row }) => {
    return props.principalList.findIndex(item => item.PrincipalID === row.ID) === -1;
  }
})
const selectedPrincipal = ref<SecurityPrincipalType>(SecurityPrincipalType.User);
const loading = ref<boolean>(false);
const selectedRows = ref<any[]>([]);
const moduleConfig = ref<ModuleConfig>({} as ModuleConfig);
const tableRef = ref<VxeTableInstance<any>>();
const pagination = reactive<Pagination>({
  current: 1,
  pageSize: 10,
  pageSizeOptions: ['5', '10', '25', '50', '100', '200'],
  total: 0
});
const searchWord = ref<string>('');
const gridData = reactive<GridData>({
  TotalRecords: 0,
  EntityConfigName: '',
  JsonData: undefined
});
watch(() => selectedPrincipal.value, (principalType) => {
  if (!isVoid(principalType)) {
    // 子表在主表被选中某行时才加载数据    parentID变化从首页开始加载
    pagination.current = 1;
    searchWord.value = '';
    loadGridData();
  }
});
const onSearch = () => {
  pagination.current = 1;
  loadGridData();
};

onMounted(async () => {
  loading.value = true;
  const res = await getModuleConfig("PrincipalAdminConfig");
  moduleConfig.value = res;
  loading.value = false;
  loadGridData();
})

const onPageChange = () => {
  loadGridData();
};

const loadGridData = async () => {
  loading.value = true;
  let searchCondition: SearchConditionValue = {} as SearchConditionValue;
  searchCondition = isVoid(searchWord.value) ? null as any : { AndOr: ANDOR.OR, Conditions: [{ Name: '', Value: searchWord.value }] };
  const params: RequestGridParams = {
    PageSize: pagination.pageSize,
    PageIndex: pagination.current,
    SortAttributeConfigName: null,
    EntityConfigName: moduleConfig.value.Name,
    IsAscending: false,
    SearchCondition: searchCondition,
    MasterCondition: [{ Name: "PrincipalType", Value: selectedPrincipal.value }],
  }
  await getGridData(params).then((res) => {
    loading.value = false;
    if (res) {
      gridData.JsonData = JSON.parse(res.JsonData);
      pagination.total = res.TotalRecords;
    }
  }).catch(() => {
    loading.value = false;
  });
}

const confirm = () => {
  if (selectedRows.value.length === 0) {
    message.error(t('security.noneSelectTips'));
    return;
  }
  emit('confirmAddPanel', selectedPrincipal.value, selectedRows.value);
}
const close = () => {
  emit('closeAddPanel');
}
// 复选框变化
const checkboxChange = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}
// 复选框全选
const checkAll = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}


// 打开选择表格字段选择面板
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
});
const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  immediate: true,
  checkMethod({ column }) {
    return !['check'].includes(column.field) && !moduleConfig.value.Features.find(item => item.Name === column.field)
  }
})
</script>
