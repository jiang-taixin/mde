// 获取销售单元
export async function getContactRequestQueues(): Promise<ContactRequestQueue[]> {
  return http.get("/API/DataRequest/GetContactRequestQueues");
}

// 获取医生申请summary
export async function getContactRequestSummary(params:string[]):Promise<ContactRequestSummary[]> {
  return http.post("/API/DataRequest/GetContactRequestSummary",params);
}

// 获取医生申请列表
export async function getContactRequestList(params:RequestContactParam):Promise<ContactRequestSummary[]> {
  return http.post("/API/DataRequest/GetContactRequestSummary",params);
}
