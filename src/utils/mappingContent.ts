import { i18n } from "@/language/index";
const { t } = i18n.global;

type MappingType = Record<number, string>;
const mappings = {
  status: {} as MappingType,
  yesNo: {} as MappingType
};

setTimeout(() => {
  mappings.status = {
    0: t('dropdown.status.active'),
    1: t('dropdown.status.deleted')
  };
  mappings.yesNo = {
    0: t('dropdown.yesOrNo.no'),
    1: t('dropdown.yesOrNo.yes')
  };
}, 500);

const STATUS_COLUMNS = new Set([
  'Status',
  'DrugstoreStatus',
  'RelationAccountStatus'
]);

const YES_NO_COLUMNS = new Set([
  'IsDelegate',
  'IsThirdParty',
  'IsActive',
  'IsMaintenance',
  'IsPublish',
  'SpeakerStatus',
  'IsCollFlow',
  'IsPrescription',
  'IsMultipleTarget',
  'TargetAccountStatus',
  'IsDoubleDrugstore',
  'HospitalStatus',
  'IsLockIdentity'
]);

export function mappingContent(columnName: string, columnValue: any): any {
  if (isVoid(columnValue)) {
    return columnValue;
  }
  const numericValue = Number(columnValue);
  if (STATUS_COLUMNS.has(columnName)) {
    return mappings.status[numericValue];
  }
  if (YES_NO_COLUMNS.has(columnName)) {
    return mappings.yesNo[numericValue];
  }
  return columnValue;
}
