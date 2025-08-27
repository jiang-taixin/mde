<template>
  <a-spin :tip="t('loading')" :spinning="loading">
    <div class="w-full flex flex-col p-2 overflow-y-auto">
      <!--预览-->
      <div>
        <div class="flex items-center font-bold bg-slate-100">
          <img :src="getIcon('grid-header-icon')" class="w-4 h-5 mr-1" />
          {{ t('hcpApply.overviewTitle') }}
        </div>
        <div class="flex items-center py-2">
          {{ t('hcpApply.salesUnit') }}
          <a-select v-model:value="queueId" style="width: 180px" size="small" class="ml-2" @change="changeQueue">
            <a-select-option v-for="queue in queueData" :value="queue.ID">{{ queue.Name }}</a-select-option>
          </a-select>
        </div>
        <div class="flex-1">
          <vxe-table ref="reviewTableRef" :data="summaryData" max-height="200px" min-height="150px" size="mini" round
            :border="true" :column-config="{ resizable: true, drag: true }" :column-drag-config="columnDragConfig"
            :checkbox-config="{ highlight: true }" :cell-config="{ height: 25 }"
            :row-config="{ isHover: true, isCurrent: true }" :empty-text="t('empty')" show-overflow="ellipsis"
            @cell-click="cellClickEvent">
            <template v-for="(column, index) in summaryColumns">
              <vxe-column v-if="column.field === 'TypeName'" :field="column.field" :title="column.Title"
                show-header-overflow>
              </vxe-column>
              <vxe-column v-else-if="column.field !== 'Summary'" :field="column.field" :title="column.Title"
                show-header-overflow>
                <template #default="{ row }">
                  <span :class="[getColor(column.field), 'underline font-bold']">
                    {{ row[column.field] }}
                  </span>
                </template>
              </vxe-column>
              <vxe-column v-else field="Summary" :title="column.Title" show-header-overflow>
                <template #default="{ row }">
                  <span class="underline font-bold">
                    {{ row[column.field] }}
                  </span>
                </template>
              </vxe-column>
            </template>
          </vxe-table>
        </div>
      </div>
      <!--总计-->
      <div>
        <div class="flex items-center font-bold bg-slate-100">
          <img :src="getIcon('grid-header-icon')" class="w-4 h-5 mr-1" />
          {{ subTitle }}
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script setup lang="ts">
import { getIcon } from "@/utils/icon-transfer";
import type { SelectValue, DefaultOptionType } from "ant-design-vue/es/select";
import type { VxeTablePropTypes } from "vxe-table";
const { t } = useI18n();

const queueId = ref<string>('');
const subTitle = ref<string>(t('hcpApply.detailTitleDefault'));
const queueData = ref<ContactRequestQueue[]>([]);
const loading = ref<boolean>(false);
const summaryData = ref<ContactRequestSummary[]>([]);

const summaryColumns = [{
  Title: t('hcpApply.typeName'),
  field: "TypeName"
}, {
  Title: t('hcpApply.summary'),
  field: 'Summary'
}, {
  Title: t('hcpApply.new'),
  field: "New"
}, {
  Title: t('hcpApply.expiring'),
  field: "Expiring"
}, {
  Title: t('hcpApply.expired'),
  field: "Expired"
}, {
  Title: t('hcpApply.finished'),
  field: "Finished"
}];

onMounted(async () => {
  // 获取销售单元列表
  getContactRequestQueues().then(res => {
    if (res.length !== 0) {
      queueData.value = res;
      queueId.value = res.find(item => item.Name === 'My')?.ID as string;
      loadSummary([queueId.value]);
    }
  });
});

const changeQueue = async (value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => {
  const queues: any[] = [];
  if (queueData.value.find(item => item.ID === value)?.Name === 'All') {
    queueData.value.forEach(item => {
      if (item.Name !== 'My' && item.Name !== 'All') {
        queues.push([item.ID]);
      }
    })
  }
  else {
    queues.push(value as string);
  }
  loadSummary(queues);
}

const loadSummary = (queues: string[]) => {
  loading.value = true;
  getContactRequestSummary(queues).then(res => {
    if (res) {
      summaryData.value = res;
      summaryData.value.forEach(item => {
        item.Summary = item.Expired + item.Expiring + item.Finished + item.New;
      });
    }
  }).finally(() => {
    loading.value = false;
  });


}

const getColor = (name: string) => {
  if (name === 'New') {
    return 'text-green-700';
  }
  else if (name === 'Expiring') {
    return 'text-yellow-500';
  }
  else {
    return 'text-red-500';
  }
}

const cellClickEvent = (params: any) => {
  console.log(params.row);
  if (params.column.field !== 'TypeName') {
    subTitle.value = t('hcpApply.detailTitle', { main: params.row.TypeName, sub: params.column.title });
    let status: any = null;
    switch (params.column.field) {
      case 'New':
        status = 0;
        break;
      case "Expiring":
        status = 1;
        break;
      case "Expired":
        status = 2;
        break;
      case "Finished":
        status = 3;
        break;
      default:
        break;
    }
    const requestParams:RequestContactParam = {
      RType: params.row.Type,
      Status: status,
      Queues: [],
      PageIndex: 0,
      PageSize: 0,
      IsAscending: false
    }
    console.log(requestParams);
    //console.log("-----number:" + params.row.Type);   // 这个对应请求里面的RType
    // Status分别对应
  }
}

const columnDragConfig = reactive<VxeTablePropTypes.ColumnDragConfig<any>>({
  isCrossDrag: true,
  showGuidesStatus: true,
  showIcon: false,
  trigger: 'cell'
})
</script>
