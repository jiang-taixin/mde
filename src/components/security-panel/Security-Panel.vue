<template>
  <div>
    <div class="flex-1">
      <vxe-table ref="tableRef" :data="securityList" height="400px" max-height="800px" size="mini" round :border="true"
        :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
        :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }" :custom-config="customConfig"
        :row-config="{ isHover: true, isCurrent: true, keyField: 'ID' }" :empty-text="t('empty')"
        show-overflow="ellipsis" @checkbox-change="checkboxChange" @checkbox-all="checkAll">
        <!--选择列-->
        <vxe-column type="checkbox" width="30" fixed="left" field="check"></vxe-column>
        <!--Attribute中的有效列-->
        <template v-for="column in columns">
          <vxe-column :field="column.Name" :title="column.DisplayName"
            :width="`${column.DefaultWidth > 0 ? column.DefaultWidth : 50}px`" show-header-overflow
            :sortable="column.SortOrder !== null">
            <template #default="{ row }" v-if="column.Name === 'PrincipalName'">
              <div class="flex flex-row items-center">
                <img :src="getIcon(principalMap[row.PrincipalType as SecurityPrincipalType])" class="w-4 h-4 mr-1" />
                {{ row.PrincipalName }}
              </div>
            </template>
            <template #default="{ row }" v-if="column.Name === 'Scope'" align="center">
              <a-select style="font-size: 12px;" :options="scopeOptions" v-model:value="row.Scope" class="w-full"
                size="small" v-if="row.PrincipalType === SecurityPrincipalType.User" @change="updateScope(row)">
              </a-select>
            </template>
            <template #default="{ row }" v-if="isCheckBoxColumn(column.Name)" align="center">
              <a-checkbox :checked="hasPermission(row, column.Name)"
                @change="((event: any) => updatePermission(row, column.Name, event))"></a-checkbox>
            </template>
          </vxe-column>
        </template>
      </vxe-table>
    </div>
    <div class="flex justify-end gap-2 w-full mt-3">
      <a-button class="w-28" size="small" :disabled="selectedRows.length < 1" @click="remove">
        {{ t('remove') }}
      </a-button>
      <a-button class="w-28" size="small" @click="add">{{ t('add') }}</a-button>
      <a-button class="w-28" size="small" @click="save">{{ t('save') }}</a-button>
      <a-button class="w-28" size="small" @click="close">{{ t('close') }}</a-button>

    </div>
    <a-modal v-model:open="open" :width="700" :title="t('customColumnTitle.principal')" :destroy-on-close="true"
      :footer="null">
      <AddPrincipal @closeAddPanel="closeAddPanel" @confirmAddPanel="confirmAddPanel" :principal-list="securityList" />
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { filter_security_columns, module_security_columns } from '@/constants';
import { PermissionFlagType, PrincipalScope, ResourceType, SecurityPrincipalType, type CustomColumn, type SecurityItem } from '@/models/SecurityModel';
import { getSecurityList } from '@/services/module-service';
import type { VxeTableInstance, VxeTablePropTypes } from 'vxe-table';
import { getIcon } from '@/utils/icon-transfer';
import _ from 'lodash';
import { Modal } from 'ant-design-vue';
import AddPrincipal from '../add-principal/AddPrincipal.vue';

const { t } = useI18n();
const open = ref<boolean>(false);
const emit = defineEmits(['closeCallback']);
const tableRef = ref<VxeTableInstance<any>>();
const props = defineProps({
  moduleConfig: {
    type: Object as PropType<ModuleConfig>,
    require: true,
    default: null
  },
  securityId: {
    type: String,
    require: true,
    default: '',
  }
});
const permissionMap: Record<string, PermissionFlagType> = {
  'Create': PermissionFlagType.Create,
  'Read': PermissionFlagType.Read,
  'Update': PermissionFlagType.Update,
  'Delete': PermissionFlagType.Delete
};
const principalMap: Record<SecurityPrincipalType, string> = {
  [SecurityPrincipalType.User]: 'user',
  [SecurityPrincipalType.Group]: 'group',
  [SecurityPrincipalType.Organization]: 'organization',
  [SecurityPrincipalType.Title]: 'title'
};
const columns = ref<CustomColumn[]>();
const selectedRows = ref<any[]>([]);
const securityList = ref<SecurityItem[]>([]);
const resourceType = ref<ResourceType>(ResourceType.Module);
const scopeOptions = ref([
  { value: PrincipalScope.Current, label: 'Self' }, { value: PrincipalScope.Child, label: 'Direct reports' }, { value: PrincipalScope.All, label: 'All reports' }
]);
const NewRacList = ref<SecurityRacItem[]>([]);
const RemoveRacList = ref<SecurityRacItem[]>([]);
const UpdateScopeList = ref<SecurityItem[]>([]);

onMounted(() => {
  initColumns();
  loadSecurityList();
})

const loadSecurityList = async () => {
  const res = await getSecurityList(resourceType.value, props.securityId);
  securityList.value = res;
}

const initColumns = () => {
  switch (props.moduleConfig.EntityName) {
    case "Module":
      resourceType.value = ResourceType.Module;
      columns.value = module_security_columns;
      break;
    case "RowFilter":
      resourceType.value = ResourceType.RowFilter;
      columns.value = filter_security_columns;
      break;
    default:

      break;
  }
}

// 检查行是否有特定权限
const hasPermission = (row: SecurityItem, columnName: string): boolean => {
  const targetPermission = permissionMap[columnName];
  return row.PermissionFlags?.some(flag => flag.PermissionFlag === targetPermission) || false;
};

// 权限改变的时候  新增的权限在NewRacList中    删除的权限在RemoveRacList中
const updatePermission = (row: SecurityItem, columnName: string, event: any) => {
  const permissionType = permissionMap[columnName];
  if (event.target.checked) {
    // 添加权限
    if (!row.PermissionFlags.some(f => f.PermissionFlag === permissionType)) {
      row.PermissionFlags.push({
        ID: row.ID,
        PermissionFlag: permissionType
      });
      const addItem: SecurityRacItem = {
        ID: parentId,
        PermissionFlag: permissionType,
        PrincipalID: row.PrincipalID,
        PrincipalName: row.PrincipalName,
        PrincipalType: row.PrincipalType,
        ResourceID: props.securityId,
        ResourceType: row.ResourceType,
        Scope: row.Scope
      }
      if (!NewRacList.value.includes(addItem)) {
        NewRacList.value.push(addItem);
      }

      if (RemoveRacList.value.includes(addItem)) {
        _.remove(RemoveRacList.value, item => item.ResourceID === addItem.ResourceID);
      }
    }
  } else {
    // 移除权限
    const removeId = row.PermissionFlags.find(item => item.PermissionFlag === permissionType)?.ID as string;
    row.PermissionFlags = row.PermissionFlags.filter(
      f => f.PermissionFlag !== permissionType
    );
    const addItem: SecurityRacItem = {
      ID: removeId,
      PermissionFlag: permissionType,
      PrincipalID: row.PrincipalID,
      PrincipalName: row.PrincipalName,
      PrincipalType: row.PrincipalType,
      ResourceID: props.securityId,
      ResourceType: row.ResourceType,
      Scope: row.Scope,
    }
    if (!RemoveRacList.value.includes(addItem)) {
      RemoveRacList.value.push(addItem);
    }
    if (NewRacList.value.includes(addItem)) {
      _.remove(NewRacList.value, item => item.ResourceID === addItem.ResourceID);
    }
  }
};

// 只有scope变化的时候才用UpdateScopeList数组
const updateScope = (row: SecurityItem) => {
  // 新增的角色不用更新UpdateScopeList
  if (row.ID !== parentId) {
    const index = UpdateScopeList.value.findIndex(
      record => record.ID === row.ID
    );
    if (index !== -1) {
      UpdateScopeList.value[index] = row;
    }
    else {
      UpdateScopeList.value.push(row);
    }
  }
  NewRacList.value.forEach(item => {
    if(item.PrincipalID === row.PrincipalID){
      item.Scope = row.Scope;
    }
  })
}

const add = () => {
  open.value = true;
}
const save = () => {
  if (UpdateScopeList.value.length === 0 && NewRacList.value.length === 0 && RemoveRacList.value.length === 0) {
    emit('closeCallback');
    return;
  }
  Modal.confirm({
    title: t('warning'),
    content: t('security.saveTips'),
    okText: t('confirm'),
    cancelText: t('cancel'),
    onOk: async () => {
      const params = { "UpdateScopeList": UpdateScopeList.value, "NewRacList": NewRacList.value, "RemoveRacList": RemoveRacList.value };
      await saveSecuritySets(params);
      emit('closeCallback');
    }
  })

}
const close = () => {
  emit('closeCallback');
}

const remove = () => {
  Modal.confirm({
    title: t('warning'),
    content: t('security.removeTips'),
    okText: t('confirm'),
    cancelText: t('cancel'),
    onOk: async () => {
      selectedRows.value.forEach(item => {
        const index = securityList.value.findIndex(
          record => record.ID === item.ID
        );
        securityList.value[index].PermissionFlags.forEach(flag => {
          const addItem: SecurityRacItem = {
            ID: flag.ID,
            PermissionFlag: flag.PermissionFlag,
            PrincipalID: securityList.value[index].PrincipalID,
            PrincipalName: securityList.value[index].PrincipalName,
            PrincipalType: securityList.value[index].PrincipalType,
            ResourceID: props.securityId,
            ResourceType: securityList.value[index].ResourceType,
            Scope: securityList.value[index].Scope,
          }
          if (!RemoveRacList.value.includes(addItem)) {
            RemoveRacList.value.push(addItem);
          }
        });
        _.remove(securityList.value, security => security.ID === item.ID);
      })
    }
  })
}
const openCustomEvent = () => {
  const $table = tableRef.value
  if ($table) {
    $table.openCustom()
  }
}

const isCheckBoxColumn = (columnName: string) => {
  return ['Create', 'Read', 'Update', 'Delete'].includes(columnName);
}

// 复选框变化
const checkboxChange = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}
// 复选框全选
const checkAll = () => {
  selectedRows.value = tableRef.value?.getCheckboxRecords() as any;
}

const customConfig = reactive<VxeTablePropTypes.CustomConfig<Attribute>>({
  immediate: true,
  checkMethod({ column }) {
    return !['check'].includes(column.field)
  }
})
const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})

// 关闭权限面板
const closeAddPanel = () => {
  open.value = false;
}

// 添加权限确认
const confirmAddPanel = (principalType: SecurityPrincipalType, principalList: any[]) => {
  principalList.forEach(item => {
    const newPrincipal: SecurityItem = {
      ID: parentId,
      PermissionFlag: PermissionFlagType.Read,
      PrincipalID: item.ID,
      PrincipalName: item.Name,
      ResourceID: '',
      ResourceName: null,
      ResourceType: resourceType.value,
      Scope: PrincipalScope.Current,
      PermissionFlags: [],
      PrincipalType: principalType
    }
    securityList.value.push(newPrincipal);
  });
  open.value = false;
}

defineExpose({
  openCustomEvent
})

</script>
