export function ensureUniqueKeys(rows: any[], entityConfigName = '') {
  if(entityConfigName === 'HospitalStrengthWeightConfig' || entityConfigName === 'SfeHospitalStrengthWeightOfflineConfig'){
    rows.forEach((row) => {
      row.__rowKey = `${row.VersionCode}_${row.HospitalCode}_${row.StrengthCode}_${row.PositionCode}`;
    });
    return rows;
  }
  else if(entityConfigName === 'AccountStrengthWeightConfig'||entityConfigName === 'RsfeHospitalStrengthWeightOfflineConfig'){
    rows.forEach((row) => {
      row.__rowKey = `${row.VersionCode}_${row.AccountCode}_${row.StrengthCode}_${row.PositionCode}`;
    });
    return rows;
  }
  else if(entityConfigName === 'DoctorConfig'){
    rows.forEach((row) => {
      row.__rowKey = `${row.Code}_${row.HospitalCode}_${row.DepartmentCode}`;
    });
    return rows;
  }
  else{
    rows.forEach((row) => {
      row.__rowKey = `${row.ID}`;
    });
    return rows;
  }
}
