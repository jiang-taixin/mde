
import type { Pagination } from "@/components/module-table/ModuleTable.vue";
import { ANDOR, DownloadType, TableLevel, type DownloadParams } from "@/models/gridDataModel";

export function useDownloadFile() {
  const downloadFile = async (typeSelection: DownloadType, advancedParams: any, moduleConfig: ModuleConfig, pagination: Pagination,
    tableLevel: TableLevel, parentID: string, version: any, keyword:string) => {
    let searchCondition: SearchConditionValue = {} as SearchConditionValue;
    let masterCondition: any = [];
    if (typeSelection !== DownloadType.WithoutRecords) {
      searchCondition = { AndOr: ANDOR.AND, Conditions: [] };
      if (advancedParams) {
        Object.entries(advancedParams).forEach(([key, value]) => {
          if (value !== CLEAR_KEY && !isVoid(value)) {
            const param = { Name: key, Value: value };
            searchCondition.Conditions.push(param);
          }
        });
      }
      if(!isVoid(keyword)){
        searchCondition.AndOr = ANDOR.OR;
        searchCondition.Conditions = [{Name:'',Value:keyword}];
      }

    }
    if (tableLevel === TableLevel.SubTable && typeSelection !== DownloadType.AllRecords) {
      masterCondition.push({
        Name: moduleConfig.ForeignKeyPhysicalViewAlias, Value: parentID
      });
    }
    if (version) {
      masterCondition.push({
        Name: "VersionID", Value: version.ID
      })
    }
    const params: DownloadParams = {
      PageSize: typeSelection === DownloadType.CurrentPage ? pagination.pageSize : -1,
      PageIndex: typeSelection === DownloadType.CurrentPage ? pagination.current : 1,
      EntityConfigName: moduleConfig.Name,
      EntityName: moduleConfig.EntityName,
      IsAscending: false,
      SearchCondition: searchCondition,
      SortAttributeConfigName: null,
      MasterCondition: masterCondition,
    }
    const res = typeSelection === DownloadType.WithoutRecords ? (await downloadTemplate(moduleConfig.EntityName)) : (await downloadTemplateWithData(params));
    if (res.status === 200) {
      const contentDisposition = (res as any).headers['content-disposition'];
      let filename = 'report.xlsx';
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename=(.*)/);
        if (matches !== null && matches.length > 1) {
          filename = matches[1].replace(/"/g, '');
        }
      }
      const blob = new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = decodeURIComponent(filename);
      a.click();
      URL.revokeObjectURL(url);
    }
  }
  return {
    downloadFile
  }
};
