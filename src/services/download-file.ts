// 下载excel
export async function downloadFile(entityName: string): Promise<any> {
  return http.get(`/API/excel/ExportExcelTemplate?entityName=${entityName}`,{responseType:'blob',loading:true});
}
