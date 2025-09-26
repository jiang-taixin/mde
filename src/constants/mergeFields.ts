// 合并时需要渲染的attribute
export const MergeFields: any = {
  Hospital: {
    Fields: ['ID', 'Code', 'Name', 'FormerName', 'CityID', 'ClassificationLovItemID', 'HospitalCategoryLovItemID', 'NumberOfBed', 'NumberOfClinics', 'Address', 'PostalCode', 'Telephone', 'Email', 'WebsiteUrl', 'Moh', 'MohName', 'ErpCode', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing', 'MustBeActive', 'Comments', 'Note1', 'Note2', 'Note3', 'NewArrivalCardNumber', 'VendorHospitalType', 'POINT_X', 'POINT_Y', 'AdministrativeDivision', 'AdministrativeDistrict']
  },
  Doctor: {
    Fields: ['ID', 'Code', 'ChineseName', 'HospitalID', 'StandardDepartmentID', 'Gender', 'MedicalTitle', 'AdminTitle', 'WorkPhone', 'HomePhone', 'Mobile', 'IdentityNo', 'IsLockIdentity', 'Birthday', 'Email', 'University', 'DailyNumberofClinics', 'ContactNumberOfBeds', 'VisitType', 'GeographyID1', 'Address1', 'AddressPostalCode1', 'AddressPhone1', 'GeographyID2', 'Address2', 'AddressPostalCode2', 'AddressPhone2', 'GeographyID3', 'Address3', 'AddressPostalCode3', 'AddressPhone3', 'GeographyID4', 'Address4', 'AddressPostalCode4', 'AddressPhone4', 'GeographyID5', 'Address5', 'AddressPostalCode5', 'AddressPhone5', 'VendorId', 'SpeakerType', 'SpeakerLevel', 'SpeakerStatus', 'DoctCertNum', 'DoctBarcode', 'Validated', 'GRVID', 'MobileStatus', 'EmailStatus']
  },
  DuplicateDoctor: {
    Fields: ['ID', 'Code', 'ChineseName', 'HospitalID', 'StandardDepartmentID', 'Gender', 'MedicalTitle', 'AdminTitle', 'WorkPhone', 'HomePhone', 'Mobile', 'IdentityNo', 'Birthday', 'Email', 'University', 'DailyNumberofClinics', 'ContactNumberOfBeds', 'VisitType', 'GeographyID1', 'Address1', 'AddressPostalCode1', 'AddressPhone1', 'GeographyID2', 'Address2', 'AddressPostalCode2', 'AddressPhone2', 'GeographyID3', 'Address3', 'AddressPostalCode3', 'AddressPhone3', 'GeographyID4', 'Address4', 'AddressPostalCode4', 'AddressPhone4', 'GeographyID5', 'Address5', 'AddressPostalCode5', 'AddressPhone5', 'GRVID', 'RequestID', 'DoctCertNum', 'RTEEmail', 'VendorId', 'SpeakerType', 'SpeakerLevel', 'SpeakerStatus', 'VRID']
  },
  Distributor: {
    Fields: ['ID', 'Code', 'Name', 'FormerName', 'GeographyID', 'DistributorGradeLovItemID', 'DistributorCategory', 'ErpCode', 'Address', 'PostalCode', 'Phone', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing', 'MustBeActive']
  },
  Drugstore: {
    Fields: ['ID', 'Code', 'Name', 'FormerName', 'GeographyID', 'DrugstoreType', 'DrugstoreKAType', 'DrugstoreLevelLovItemID', 'ParentID', 'IsKATerritory', 'District', 'Address', 'PostalCode', 'Phone', 'ErpCode',  /*'IsInTerritory',*/'MustBeActive', 'StaffCount', 'PharmacistCount', 'AvgMonthSales', 'IsCloseToHospital', 'IsMedicareDrugstore', 'IsSpecialBusinessDistrict', 'IsBusinessDistrict', 'IsDoctorWaitor', 'EDAvgMonthSales', 'PrescriptionAvgMonthSales', 'NonPrescriptionAvgMonthSales', 'IsInCommunity', 'IsShopinShop', 'IsKA', 'MIDrugstoreNo', 'ChainstoreNo', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing']
  }
};
