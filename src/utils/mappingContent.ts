const StatusMapping:Record<any, any> = {
  0:'Active',
  1:'Deleted'
}

export function mappingContent(columnName:string, columnValue:any) {
  switch(columnName){
    case "Status":
      return StatusMapping[Number(columnValue)];
    default:
      return columnValue;
  }
}
