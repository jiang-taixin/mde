import type { CustomColumn } from "@/models/SecurityModel";
const { t } = i18n.global;

export const CLEAR_KEY = '__CLEAR__';
export const moduleId = '00000000-0000-0000-0000-000000000000';  // 获取模块列表的根ID
export const parentId = '00000000-0000-0000-0000-000000000000';  // 获取省份列表的根ID

// 数据校验
export const Month_Regex = /^\d+$/;    // 月份校验    只能是数字

// 固定配置   权限操作显示的数据列
export const module_security_columns: CustomColumn[] = [{
  Name: "PrincipalName",
  DisplayName: t('customColumnTitle.principal'),
  SortOrder:1,
  DefaultWidth:400
}, {
  Name: "Scope",
  DisplayName: t('customColumnTitle.scope'),
  DefaultWidth:120,
  SortOrder:null
},
{
  Name: "Read",
  DisplayName: t('customColumnTitle.read'),
  DefaultWidth:100,
  SortOrder:null
}
]

export const filter_security_columns: CustomColumn[] = [{
  Name: "PrincipalName",
  DisplayName: t('customColumnTitle.principal'),
  SortOrder: 1,
  DefaultWidth: 250
}, {
  Name: "Scope",
  DisplayName: t('customColumnTitle.scope'),
  DefaultWidth: 100,
  SortOrder:null
},
{
  Name: "Create",
  DisplayName: t('customColumnTitle.create'),
  DefaultWidth:65,
  SortOrder:null
},
{
  Name: "Read",
  DisplayName: t('customColumnTitle.read'),
  DefaultWidth:65,
  SortOrder:null
},
{
  Name: "Update",
  DisplayName: t('customColumnTitle.update'),
  DefaultWidth:65,
  SortOrder:null
},
{
  Name: "Delete",
  DisplayName: t('customColumnTitle.delete'),
  DefaultWidth:65,
  SortOrder:null
}
]

export const merge_columns:CustomColumn[] = [
{
  Name: "field",
  DisplayName: t('customColumnTitle.field'),
  SortOrder:null,
  DefaultWidth:200
}, {
  Name: "record1",
  DisplayName: t('customColumnTitle.record1'),
  DefaultWidth:300,
  SortOrder:null
},
{
  Name: "record2",
  DisplayName: t('customColumnTitle.record2'),
  DefaultWidth:300,
  SortOrder:null
},
{
  Name: "result",
  DisplayName: t('customColumnTitle.result'),
  DefaultWidth:300,
  SortOrder:null
}
]
