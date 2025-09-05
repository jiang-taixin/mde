export const MergeFields:any = {
    Hospital: {
      Fields: ['ID', 'Code', 'Name', 'FormerName', 'CityID', 'ClassificationLovItemID', 'HospitalCategoryLovItemID', 'NumberOfBed', 'NumberOfClinics', 'Address', 'PostalCode', 'Telephone', 'Email', 'WebsiteUrl', 'Moh', 'MohName', 'ErpCode', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing', 'MustBeActive', 'Comments', 'Note1', 'Note2', 'Note3', 'NewArrivalCardNumber', 'VendorHospitalType', 'POINT_X', 'POINT_Y', 'AdministrativeDivision', 'AdministrativeDistrict']
    },
    Doctor: {
      Fields: ['ID', 'Code', 'ChineseName', 'HospitalID', 'StandardDepartmentID', 'Gender', 'MedicalTitle', 'AdminTitle', 'WorkPhone', 'HomePhone', 'Mobile', 'IdentityNo', 'IsLockIdentity', 'Birthday', 'Email', 'University', 'DailyNumberofClinics', 'ContactNumberOfBeds', 'VisitType', 'GeographyID1', 'Address1', 'AddressPostalCode1', 'AddressPhone1', 'GeographyID2', 'Address2', 'AddressPostalCode2', 'AddressPhone2', 'GeographyID3', 'Address3', 'AddressPostalCode3', 'AddressPhone3', 'GeographyID4', 'Address4', 'AddressPostalCode4', 'AddressPhone4', 'GeographyID5', 'Address5', 'AddressPostalCode5', 'AddressPhone5','VendorId','SpeakerType','SpeakerLevel','SpeakerStatus','DoctCertNum','DoctBarcode','Validated','GRVID','MobileStatus','EmailStatus']
    },
    DuplicateDoctor: {
      Fields: ['ID', 'Code', 'ChineseName', 'HospitalID', 'StandardDepartmentID', 'Gender', 'MedicalTitle', 'AdminTitle', 'WorkPhone', 'HomePhone', 'Mobile', 'IdentityNo', 'Birthday', 'Email', 'University', 'DailyNumberofClinics', 'ContactNumberOfBeds', 'VisitType', 'GeographyID1', 'Address1', 'AddressPostalCode1', 'AddressPhone1', 'GeographyID2', 'Address2', 'AddressPostalCode2', 'AddressPhone2', 'GeographyID3', 'Address3', 'AddressPostalCode3', 'AddressPhone3', 'GeographyID4', 'Address4', 'AddressPostalCode4', 'AddressPhone4', 'GeographyID5', 'Address5', 'AddressPostalCode5', 'AddressPhone5','GRVID','RequestID','DoctCertNum','RTEEmail','VendorId','SpeakerType','SpeakerLevel','SpeakerStatus','VRID']
    },
    Distributor: {
      Fields: ['ID', 'Code', 'Name', 'FormerName', 'GeographyID', 'DistributorGradeLovItemID', 'DistributorCategory', 'ErpCode', 'Address', 'PostalCode', 'Phone', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing', 'MustBeActive']
    },
    Drugstore: {
        // fnMergeDialogReadyExtension: function(theDialog) {
        //     var fnDrugstoreTypeChange = function(theDialog, typeValue) {
        //         var ParentDrugstore = theDialog.getField('ParentID');
        //         var IsKATerritory = theDialog.getField('IsKATerritory');
        //         if (ParentDrugstore) {
        //             var isSingleRootDrugstore = (typeValue == 3 || typeValue == 1);
        //             if (isSingleRootDrugstore) {
        //                 //Bug#7969 xiaolang 20101027
        //                 //这段代码注释的原因是,在合并时候,不论药店类型是否变化都应该对Parent进行验证,这部分验证已经移到C#中处理(DrugstoreBL.cs)
        //                 //ParentDrugstore.setValue(''); // reset null value for parent drugstore value
        //                 //Bug#7969 xiaolang 20101027
        //                 IsKATerritory.setValue(''); //
        //             }
        //             else {
        //                 ParentDrugstore.masterCondition = [{ Name: 'DrugstoreTypeLovItemValue', Value: 3}];
        //             }

        //             ParentDrugstore.setDisabled(isSingleRootDrugstore); // Single Root Drugstore
        //             IsKATerritory.setDisabled(isSingleRootDrugstore);
        //         }
        //     }

        //     var fnDrugstoreTypeChangeHandler = function(sender, record, index) {
        //         fnDrugstoreTypeChange(theDialog, record.get('Value'));
        //     }

        //     var DrugstoreType = theDialog.getField('DrugstoreType');
        //     if (DrugstoreType) {
        //         DrugstoreType.on('valuechanged', fnDrugstoreTypeChangeHandler);

        //         DrugstoreType.setDisabled(true); // BUG: 6307

        //         if (DrugstoreType.getStore().getTotalCount() > 0 && DrugstoreType.last != -1) {
        //             fnDrugstoreTypeChange(theDialog, DrugstoreType.getStore().getAt(DrugstoreType.last).Value);
        //         }
        //     }

        //     //ZhangDongxue 20150626追加属性“DrugstoreKAType”验证
        //     var fnDrugstoreKATypeChange = function (theDialog, typeValue) {
        //         var ParentDrugstore = theDialog.getField('ParentID');
        //         var DrugstoreKAType = theDialog.getField('DrugstoreKAType');
        //         if (ParentDrugstore) {
        //             var isSingleRootDrugstore = (typeValue == 1);
        //             if (!isSingleRootDrugstore) {
        //                 DrugstoreKAType.masterCondition = [{ Name: 'DrugstoreTypeLovItemValue', Value: 3}];
        //             }
        //         }
        //     }

        //     var fnDrugstoreKATypeChangeHandler = function (sender, record, index) {
        //         fnDrugstoreKATypeChange(theDialog, record.get('Value'));
        //     }

        //     var DrugstoreKAType = theDialog.getField('DrugstoreType');
        //     if (DrugstoreKAType) {
        //         DrugstoreKAType.on('valuechanged', fnDrugstoreKATypeChangeHandler);

        //         if (DrugstoreKAType.getStore().getTotalCount() > 0 && DrugstoreKAType.last != -1) {
        //             fnDrugstoreKATypeChange(theDialog, DrugstoreKAType.getStore().getAt(DrugstoreKAType.last).Value);
        //         }
        //     }

        // },

        //ZhangDongxue 20150626追加属性“DrugstoreKAType”
        Fields: ['ID', 'Code', 'Name', 'FormerName', 'GeographyID', 'DrugstoreType', 'DrugstoreKAType', 'DrugstoreLevelLovItemID', 'ParentID', 'IsKATerritory', 'District', 'Address', 'PostalCode', 'Phone', 'ErpCode',  /*'IsInTerritory',*/'MustBeActive', 'StaffCount', 'PharmacistCount', 'AvgMonthSales', 'IsCloseToHospital', 'IsMedicareDrugstore', 'IsSpecialBusinessDistrict', 'IsBusinessDistrict', 'IsDoctorWaitor', 'EDAvgMonthSales', 'PrescriptionAvgMonthSales', 'NonPrescriptionAvgMonthSales', 'IsInCommunity', 'IsShopinShop', 'IsKA', 'MIDrugstoreNo', 'ChainstoreNo', 'ERPCode1', 'ERPCode2', 'Note', 'IsUsing']
    }
};
