// 上传文件
export async function uploadFile(entityName:string, importType:number, formData:any):Promise<any> {
  return http.post(`/API/excel/Upload?entity=${entityName}&importtype=${importType}`,formData,{formData:true,loading:true,timeout:0});
}

// 校验文件
export async function validateFile(entityName:string, sessionID:string, incrementFlag:boolean):Promise<any> {
  return http.get(`/API/excel/Upload?entityName=${entityName}&sessionID=${sessionID}&incrementFlag=${incrementFlag}`);
}
