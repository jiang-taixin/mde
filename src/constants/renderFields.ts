// 添加、拷贝添加或编辑时需要渲染的attribute
export const RenderFields: any = {
  // 部门人员管理--人员
  Employee: {
    Fields: ['Code', 'EnglishName', 'ChineseName', 'LogonID', 'Gender', 'Title', 'IsTerminated', "HireDate", "OriginalHiredate", "LastTerminationDate", "LastTransferDate", "DimissionDate", "GRWDepartmentCode", "GRWDepartmentName", "OrganizationCode", "OrganizationName", "SupervisorCode", "DLSupervisorCode", "Email", "BusinessUnit", "IsThirdParty", "Note", "City", "JOBCODE"]
  },
  // 部门人员管理--部门
  Organization: {
    Fields: ['Code', 'EnglishName', 'ChineseName', 'Type', 'CostCenter', 'ParentID', 'ManagerID']
  },
  // 客户管理--客户
  AdvancedAccount: {
    Fields: ['TypeLovItemID', 'Code', 'Name', 'FormerName', 'CityID', 'ErpCode', 'DistributorCategoryLovItemID', "DistributorGradeLovItemID", "DrugstoreTypeLovItemID", "DrugstoreLevelLovItemID", "ParentDrugstoreID", "IsUsing", "MustBeActive", "ERPCode1", "ERPCode2", "BusinessType"]
  },
  // 客户管理--医院
  Hospital: {
    Fields: ['Code', 'Name', 'FormerName', 'CityID', 'ClassificationLovItemID', 'HospitalCategoryLovItemID', "NumberOfBed", "NumberOfClinics", "Address", "PostalCode", "Telephone", "Email", "WebSiteUrl", "Moh", "MohName", "ErpCode", "IsTemp", "IsUsing", "MustBeActive", "Comments", "Note1", "Note2", "Note3", "ERPCode1", "ERPCode2", "Note", "NewArrivalCardNumber", "VendorHospitalType", "POINT_X", "POINT_Y", "AdministrativeDivision", "AdministrativeDistrict", "Category1LovitemID", "Category2LovitemID", "Category3LovitemID", "Category4LovitemID", "Category5LovitemID", "BusinesslicensesID", "HospitalOrganizationCode", "UniformSocialCreditID", "MaintainBatch", "BusinessType", "ThirdVerificationID", "IsOpen", "VerifiedModifiedon", "IndustryId", "GeneralBranchHospital", "GeneralBranchHospitalGroupID", "MedicalTreatmentCombination", "MedicalTreatmentCommunity"]
  },
  // 客户管理--医院--医院科室
  Department: {
    Fields: ['HospitalID', 'StandardDepartmentID', 'Name', 'Address', 'PostalCode', 'Phone']
  },
  // 客户管理--医院--医院产品进口HIB
  HIBHospitalProduct: {
    Fields: ['HospitalID', 'HIBNumber', 'ProductID']
  },
  // 客户管理--医院--医院全产品市场潜力
  HospitalAllProductMarketPotential: {
    Fields: ['HospitalID', 'Year', 'MarketPotential', "TAID", "AllProductDescription", "BG", "Note1", "Note2"]
  },
  // 客户管理--医院--医院策略分类
  HospitalPolicyType: {
    Fields: ['HospitalID', 'Month', 'ProductID', "StrengthID", "TAID", "HospitalTitleID", "HospitalPartDivisionID", "CoreExpansionID", "CityCountyID", "BG", "Segmentation", "InitialPermeability", "Note1", "Note2"]
  },
  // 客户管理--医院--医院产品分级
  HospitalProductClassification: {
    Fields: ["HospitalID", "ClassificationLovItemID", "ProductID"]
  },
  // 客户管理--医院--医院产品市场潜力
  HospitalProductMarketPotential: {
    Fields: ["HospitalID", "Year", "MarketPotential", "ProductID", "Note1", "Note2"]
  },
  // 客户管理--医院--医院Strength市场潜力
  HospitalStrengthMarketPotential: {
    Fields: ["HospitalID", "Year", "MarketPotential", "StrengthID", "Note1", "Note2"]
  },
  // 客户管理--医院--POV产品分级
  POVProductClassification: {
    Fields: ["HospitalID", "ClassificationLovItemID", "ProductID"]
  },
  // 客户管理--分销商
  Distributor: {
    Fields: ["Code", "Name", "FormerName", "GeographyID", "DistributorGradeLovItemID", "DistributorCategory", "ErpCode", "Address", "PostalCode", "Phone", "IsUsing", "ERPCode1", "ERPCode2", "Note", "MustBeActive", "BusinessType", "PBGKA", "MainStore", "ThirdVerificationID", "VerifiedModifiedon", "IsOpen"]
  },
  // 客户管理--分销商--分销商剂型分级
  DistributorPkgClassification: {
    Fields: ["DistributorID", "ClassificationLovItemID", "PackageID"]
  },
  // 客户管理--分销商--分销商剂型价格
  DistributorPackagePrice: {
    Fields: ["DistributorID", "Price", "PackageID"]
  },
  // 客户管理--药店
  Drugstore: {
    Fields: ["Code", "Name", "FormerName", "GeographyID", "DrugstoreType", "ParentID", "IsKATerritory", "DrugstoreLevelLovItemID", "District", "Address", "PostalCode", "Phone", "ErpCode", "IsInTerritory", "MustBeActive", "StaffCount", "PharmacistCount", "AvgMonthSales", "IsCloseToHospital", "IsMedicareDrugstore", "IsSpecialBusinessDistrict", "IsBusinessDistrict", "IsDoctorWaitor", "EDAvgMonthSales", "PrescriptionAvgMonthSales", "NonPrescriptionAvgMonthSales", "IsUsing", "IsInCommunity", "IsShopinShop", "IsKA", "MIDrugstoreNo", "ChainstoreNo", "ERPCode1", "ERPCode2", "Note", "NewQuarter", "BusinessType", "PBGKA", "MainStore", "IsOpen", "DTP", "DualChannel", "Note4", "VerifiedModifiedon", "ThirdVerificationID", "OrganizationCode", "POINT_X", "POINT_Y"]
  },
  // 客户管理--药店--店员
  DrugstoreContact: {
    Fields: ["Code", "DrugstoreID", "ChineseName", "Mobile", "Position", "Title", "Gender", "Birthday", "Hobby", "BehaviorType", "QQ", "Email", "Address", "PostalCode", "IsRightToPrescribe"]
  },
  // 客户管理--药店--药店产品分级
  RsfeDrugstoreLevel: {
    Fields: ["DrugstoreID", "PortfolioID", "DruProLevelID"]
  },
  // 客户管理--第三方医院
  ThirdParty_Hospital: {
    Fields: ["ThirdPartyCode", "HospitalName", "MechanismCode", "HospitalLevelLovitemID", "TheHospitalOrderLovitemID", "HospitalTypeLovitemID", "ForProfitNatureOfHospitalLovitemID", "YearsOfDiagnosisAndTreatment", "AmongThemOutpatientClinicVisits",
      "OfWhichEmergencyDiagnosis", "NumberOfHospitalAdmissions", "NumberOfPatientsOperatedInHospital", "GrossIncome", "BedNumber", "PhysicianNumber"
    ]
  },
  // 产品管理--市场
  Market: {
    Fields: ["Code", "ChineseName", "EnglishName", "Description", "BusinessType"]
  },
  // 产品管理--治疗领域
  TherapeuticArea: {
    Fields: ["Code", "ChineseName", "EnglishName", "MarketID", "Description", "BusinessType"]
  },
  // 产品管理--辉瑞产品
  PfizerProduct: {
    Fields: ["Code", "ChineseName", "EnglishName", "TherapeuticAreaID", "ERPCode1", "ERPCode2", "IsSell", "BusinessType", "Description"]
  },
  // 产品管理--辉瑞产品--产品观念
  ProductConcept: {
    Fields: ["ProductID", "Code", "Value", "Sequence", "Description"]
  },
  // 产品管理--辉瑞产品--产品与优先级关系
  ProductPriority: {
    Fields: ["StrengthID", "ProductID", "Priority"]
  },
  // 产品管理--辉瑞产品--产品提示物
  ProductMaterial: {
    Fields: ["ProductID", "Code", "Value", "Description"]
  },
  // 产品管理--辉瑞产品-- 产品传递信息
  ProductMessage: {
    Fields: ["ProductID", "Code", "Value", "Description"]
  },
  // 产品管理--竞争对手产品
  CompetitorProduct: {
    Fields: ["Code", "ChineseName", "EnglishName", "TherapeuticAreaID", "Description", "IsSell", "Note1", "Note2", "Note3"]
  },
  // 产品管理--剂型
  PfizerPackage: {
    Fields: ["Code", "ChineseName", "EnglishName", "ProductID", "Category", "GoodType", "CalcPrice", "RetailPrice", "Cost", "SheltLife", "UnitOfMeasure", "LegalEntityID", "IsSell", "Description", "Abbreviation", "MaxPrice", "ERPCode1", "ERPCode2", "SalesOrg", "BusinessType"]
  },
  // 产品管理--剂型--剂型核算价
  PackagePrice: {
    Fields: ["PackageID", "BusinessType", "Month", "Price"]
  },
  // 产品管理--剂型--剂型省份核算价
  VBPPackagePrice: {
    Fields: ["PackageID", "ProvinceID", "BusinessType", "Month", "Price"]
  },
  // 产品管理--市场产品关系
  MKTProduct: {
    Fields: ["PositionCode", "TitleID", "PositionChineseName", "PositionEnglishName", "EmployeeID", "ProductID", "IsPushToVeeva"]
  },
  // 产品管理--化学成分
  Api: {
    Fields: ["Code", "EnglishName", "ChineseName", "BusinessType"]
  },
  // 产品管理--Strength
  Strength: {
    Fields: ["Code", "EnglishName", "ChineseName", "BusinessType"]
  },
  // 产品管理--产品线--产品线与产品关系
  PortfolioProduct: {
    Fields: ["PortfolioID", "ProductID", "Sequence"]
  },
  // 产品管理--样品剂型
  SamplePackage: {
    Fields: ["Code", "ChineseName", "EnglishName", "Category", "IsSell", "ERPCode1", "ERPCode2", "SalesOrg", "BusinessType", "VeevaSamplePackage"]
  },
  // 区域管理SFE--版本
  SfeTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish", "BusinessType"]
  },
  // 区域管理SFE--产品线
  SfePortfolio: {
    Fields: ["VersionID", "Code", "Name", "BusinessType"]
  },
  // 区域管理SFE--岗位
  SfePosition: {
    Fields: ["VersionID", "TitleID", "Code", "ChineseName", "EnglishName", "City", "ParentID", "PortfolioID", "EmployeeID", "IsDelegate", "Note", "BusinessType"]
  },
  // 区域管理SFE--医院拆分
  HospitalSplit: {
    Fields: ["VersionID", "MainID", "SplitID", "BusinessType"]
  },
  // 区域管理SFE--Strength剂型
  SfeStrengthPackage: {
    Fields: ["VersionID", "StrengthID", "PackageID", "BusinessType"]
  },
  // 区域管理SFE--RPM&SIM
  SfeRPMPosition: {
    Fields: ["VersionID", "Code", "ChineseName", "EnglishName", "TitleID", "Type", "CityID", "ParentID", "EmployeeID", "IsDelegate", "BusinessType"]
  },
  // 区域管理SFE--医院关联药店
  SfeHospitalDrugstore: {
    Fields: ["VersionID", "Month", "HospitalID", "DrugstoreID", "StrengthID", "Weight", "IsDoubleDrugstore"]
  },
  // 区域管理SFE--区域内医院关联药店变动表
  SfePositionHospitalDrugstoreChange: {
    Fields: ["CompareType", "CompareQuarter", "HospitalCode", "HospitalName", "DrugstoreCode", "DrugstoreName", "StrengthCode", "BU", "SU", "Region", "weight"]
  },
  // 区域管理SFE--区域内医院变动表
  SfePositionAccountChange: {
    Fields: ["CompareTypeID", "CompareQuarter", "HospitalCode", "HospitalName", "HospitalStatus", "PositionEnglishName", "BU", "SU", "Region", "DM"]
  },
  // 区域管理MKT--版本
  TMKTTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish"]
  },
  // 区域管理MKT--产品线
  TMKTPortfolio: {
    Fields: ["VersionID", "Code", "Name"]
  },
  // 区域管理MKT--岗位
  TMKTPosition: {
    Fields: ["VersionID", "TitleID", "Code", "ChineseName", "EnglishName", "City", "ParentID", "PortfolioID", "EmployeeID", "IsDelegate", "Note"]
  },
  // 区域管理MKT--Strength剂型
  TMKTStrengthPackage: {
    Fields: ["VersionID", "StrengthID", "PackageID"]
  },
  // 区域管理MED--版本
  TMEDTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish"]
  },
  // 区域管理MED--产品线
  TMEDPortfolio: {
    Fields: ["VersionID", "Code", "Name"]
  },
  // 区域管理MED--岗位
  TMEDPosition: {
    Fields: ["VersionID", "TitleID", "Code", "ChineseName", "EnglishName", "City", "ParentID", "PortfolioID", "EmployeeID", "IsDelegate", "Note"]
  },
  // 区域管理MED--Strength剂型
  TMEDStrengthPackage: {
    Fields: ["VersionID", "StrengthID", "PackageID"]
  },
  // 区域管理CO--版本
  COTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish"]
  },
  // 区域管理CO--产品线
  COPortfolio: {
    Fields: ["VersionID", "Code", "Name"]
  },
  // 区域管理CO--岗位
  COPosition: {
    Fields: ["VersionID", "TitleID", "Code", "ChineseName", "EnglishName", "ParentID", "PortfolioID", "EmployeeID"]
  },
  // 区域管理CO--岗位--岗位与省份关系
  COPositionProvince: {
    Fields: ["PositionID", "ProvinceID", "DistributorID"]
  },
  // 区域管理HA--版本
  PHAMTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish"]
  },
  // 区域管理CO--产品线
  PHAMPortfolio: {
    Fields: ["VersionID", "Code", "Name"]
  },
  // 区域管理CO--岗位
  PHAMPosition: {
    Fields: ["VersionID", "TitleID", "Code", "ChineseName", "EnglishName", "ParentID", "EmployeeID"]
  },
  // 区域管理RSFE--版本
  RsfeTerritoryVersion: {
    Fields: ["Code", "Name", "StartDate", "EndDate", "IsPublish"]
  },
  // 区域管理RSFE--产品线
  RsfePortfolio: {
    Fields: ["VersionID", "Code", "Name", "BusinessType"]
  },
  // 区域管理RSFE--岗位
  RsfePosition: {
    Fields: ["VersionID", "TitleID", "SubCategoryLovItemID", "Code", "ChineseName", "EnglishName", "City", "ParentID", "PortfolioID", "EmployeeID", "IsDelegate", "Note"]
  },
  // 区域管理RSFE--岗位--岗位客户关系
  RsfePositionAccount: {
    Fields: ["PositionID", "AccountID", "IsPrescription"]
  },
  // 区域管理RSFE--岗位--岗位与省份关系
  RSFERBMPositionProvince: {
    Fields: ["PositionID", "ProvinceID"]
  },
  // 区域管理RSFE--不可收集流向客户
  RsfeNCollFlowAccount: {
    Fields: ["VersionID", "AccountID"]
  },
  // 区域管理RSFE--Strength剂型
  RsfeStrengthPackage: {
    Fields: ["VersionID", "StrengthID", "PackageID"]
  },
  // 区域管理RSFE--非销售岗位
  NonSalesPosition: {
    Fields: ["VersionID", "Code", "ChineseName", "EnglishName", "TitleID", "City", "ParentID", "SalesPositionID", "EmployeeID", "IsDelegate"]
  },
  // 区域管理RSFE--零售关联客户
  RsfeRetailAccount: {
    Fields: ["VersionID", "Month", "StrengthID", "RelationAccountID", "TargetAccountID", "IsPrescription", "IsMultipleTarget", "Tag"]
  },
  // 主数据--其他--法人实体
  LegalEntity: {
    Fields: ["Code", "ErpCode", "Name", "Type", "TargetAccountID", "Address", "PostalCode", "OfficePhone"]
  },
  // 主数据--其他--行政区域
  Geography: {
    Fields: ["Code", "ChineseName", "Type", "ParentID", "Category", "PYCode", "PYAbbr", "StandardCode"]
  },
  // 元数据管理--业务实体
  EntityConfig: {
    Fields: ["Name", "EntityName", "DisplayName", "ChineseDisplayName", "DialogHeight", "DialogWidth", "PageSize"]
  },
  // 元数据管理--业务实体--属性
  AttributeConfig: {
    Fields: ["Name", "ChineseDisplayName", "DisplayName", "ExcelColumn", "IsExcelMandatory", "IsAdvancedFilter", "IsFuzzyFilter", "SortOrder", "DisplayByDefault", "Hidden", "PhysicalViewAlias", "DisplayWidth", "IsBusinessPrimaryKey", "SortDirection"]
  },
  // 元数据管理--抽象实体
  Entity: {
    Fields: ["Name", "PrimaryConfigName", "PhysicalView", "UniqueScopeError", "ChineseUniqueScopeError", "Description"]
  },
  // 元数据管理--抽象实体--属性
  Attribute: {
    Fields: ["Name", "DisplayName", "ChineseDisplayName", "ExtControlType", "IsNullable", "AutoGenerateCode", "Length", "RegExpression", "DataType", "AllowOverwriteNull", "DefaultValue", "PromptMessage", "ChinesePromptMessage", "PhysicalField", "DigitalPrecision", "Description"]
  },
  // 元数据管理--行过滤规则
  RowFilter: {
    Fields: ["EntityID", "Name", "Expression", "Description"]
  },
  // 模块管理--模块
  Module: {
    Fields: ["Name", "DisplayName", "ChineseDisplayName", "Url", "ModuleType", "Icon", "ModelType", "Description", "ChineseDescription"]
  },
  // 系统管理--其他--数据字典
  Lov: {
    Fields: ["LovName", "Description"]
  },
  // 系统管理--其他--数据字典--字典项
  LovItem: {
    Fields: ["Name", "Value", "LovID", "IsDefault"]
  },
  // 系统管理--其他--日志
  Log: {
    Fields: ["Title", "EventID", "Severity", "MachineName", "AppDomainName", "ProcessName", "Message", "Timestamp"]
  },
  // 用户和用户组管理--组
  Group: {
    Fields: ["Code", "Name", "Description"]
  }
};
