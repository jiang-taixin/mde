import type { ExportSelection } from "@/components/export-panel/ExportPanel.vue";
import type { Pagination } from "@/components/module-table/ModuleTable.vue";
import { ExportType } from "@/models/gridDataModel";

export function useExportFile() {
  const exportFile = async (exportSelection: ExportSelection, advancedParams: any, moduleConfig: ModuleConfig, pagination: Pagination,
    tableLevel: TableLevel, parentID: string, version: any, keyword:string) => {
    let searchCondition: SearchConditionValue = {} as SearchConditionValue;
    let masterCondition: any = [];
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
    if (tableLevel === TableLevel.SubTable) {
      masterCondition.push({
        Name: moduleConfig.ForeignKeyPhysicalViewAlias, Value: parentID
      });
    }
    if (version) {
      masterCondition.push({
        Name: "VersionID", Value: version.ID
      })
    }
    const params: ExportParams = {
      PageSize: exportSelection.parentSelected === ExportType.CurrentPage ? pagination.pageSize : -1,
      PageIndex: exportSelection.parentSelected === ExportType.CurrentPage ? pagination.current : 1,
      EntityConfigName: moduleConfig.Name,
      IsAscending: false,
      SearchCondition: searchCondition,
      SortAttributeConfigName: null,
      MasterCondition: masterCondition,
      AttributeConfigNames: moduleConfig.Attributes.filter(attribute => !attribute.Hidden && attribute.DisplayByDefault).map(attribute => attribute.Name),
      ChildEntityConfigNames: exportSelection.childSelected
    }
    const res = await exportExcelData(params);
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
    exportFile
  }
};
