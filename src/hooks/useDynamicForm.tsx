import { CLEAR_KEY, Month_Regex } from "@/constants";
import type { Attribute, ModuleConfig } from "@/models/moduleConfigModel";
const { t } = i18n.global;

const LABEL_WIDTH = 130;
const COMMON_DECORATOR_PROPS = {
  labelAlign: "left" as const,
  labelWidth: LABEL_WIDTH,
  colon: false,
  labelStyle: {
    fontSize: '12px'
  },
};
const COMMON_COMPONENT_PROPS = {
  style: { width: '100%' },
  size: "small" as const,
};

const createDataSourceOptions = <T extends Record<string, any>>(
  items: T[],
  labelKey: keyof T,
  valueKey: keyof T
) => [
    CLEAR_OPTION,
    ...items.map(item => ({
      label: item[labelKey],
      value: item[valueKey]
    }))
  ];

const updateFieldProps = (field: any, dataSource: any[]) => {
  field.dataSource = dataSource;
  field.componentProps = {
    ...field.componentProps,
    options: dataSource,
    showSearch: true,
    loading: false,
    filterOption: filterOption,
  };
};

const handleLoadingState = (field: any, isLoading: boolean) => {
  field.loading = isLoading;
  field.componentProps.loading = isLoading;
};

const CLEAR_OPTION = {
  label: t('selectPlaceholder'),
  value: CLEAR_KEY,
};

const filterOption = (input: string, option: any) => {
  if (option.value === CLEAR_KEY) return true;
  return option.label.toLowerCase().includes(input.toLowerCase());
};

const fetchData = async (
  field: any,
  fetchFn: (params: any) => Promise<any>,
  params: any,
  labelKey: string,
  valueKey: string
) => {
  try {
    handleLoadingState(field, true);
    const response = await fetchFn(params);
    const dataSource = createDataSourceOptions(response, labelKey, valueKey);
    updateFieldProps(field, dataSource);
  } catch (error) {
    field.dataSource = [];
  } finally {
    handleLoadingState(field, false);
  }
};

export const useDynamicForm = () => {
  // 定义异步获取LOV列表的函数
  const getLovList = async (field: any, lovId: string, open: boolean) => {
    if (!open || field.dataSource?.length > 0) return;
    await fetchData(field, getLovItems, lovId, 'Name', 'ID');
  };

  // 定义异步获取下拉信息
  const getComboxList = async (field: any, attributeName: string, open: boolean) => {
    if (!open || field.dataSource?.length > 0) return;
    await fetchData(field, getComboxItems, attributeName, 'Name', 'Value');
  };

  // 定义异步获取实体数据列表的函数
  const getEntityDataList = async (field: any, entityConfigName: string, open: boolean) => {
    if (!open || field.dataSource?.length > 0) return;
    try {
      handleLoadingState(field, true);
      const params: RequestGridParams = {
        PageSize: -1,
        PageIndex: 1,
        EntityConfigName: entityConfigName,
      };
      const res = await getGridData(params);
      if (res) {
        const data = JSON.parse(res.JsonData);
        const dataSource = createDataSourceOptions(data, 'Name', 'ID');
        updateFieldProps(field, dataSource);
      }
    } catch (error) {
      field.dataSource = [];
    } finally {
      handleLoadingState(field, false);
    }
  };

  const createBaseFieldConfig = (attribute: Attribute) => ({
    type: 'string' as const,
    title: attribute.DisplayName,
    'x-decorator': 'FormItem' as const,
    'x-decorator-props': COMMON_DECORATOR_PROPS,
    'x-component-props': {
      ...COMMON_COMPONENT_PROPS,
      placeholder: attribute.PromptMessage || '',
    }
  });

  const createInputSearchFieldConfig = (attribute: Attribute, config: ModuleConfig) => ({
    type: 'string' as const,
    title: attribute.DisplayName,
    'x-decorator': 'FormItem' as const,
    'x-decorator-props': COMMON_DECORATOR_PROPS,
    'x-component-props': {
      ...COMMON_COMPONENT_PROPS,
      placeholder: attribute.PromptMessage || '',
      entityConfigName: attribute.EntityConfigName,
      moduleConfig: config
    }
  });

  const createSelectorFieldConfig = (
    attribute: Attribute,
    fetchFn: (field: any, param: string, open: boolean) => Promise<void>,
    fetchParam: string
  ) => ({
    ...createBaseFieldConfig(attribute),
    'x-component': 'MySelect' as const,
    'x-component-props': {
      ...COMMON_COMPONENT_PROPS,
      showSearch: true,
      filterOption: false,
      placeholder: attribute.PromptMessage || '',
    },
    'x-reactions': (field: any) => {
      field.componentProps.onDropdownVisibleChange = async (open: boolean) => {
        await fetchFn(field, fetchParam, open);
      };
    },
  });

  const generateFieldSchema = (attribute: Attribute, config: ModuleConfig) => {
    switch (attribute.ExtControlType) {
      case 'entitydatafield':
        return createSelectorFieldConfig(
          attribute,
          getEntityDataList,
          attribute.TargetEntityName as string
        );
      case 'boolvaluecombox':
        return createSelectorFieldConfig(
          attribute,
          getComboxList,
          attribute.AttributeName as string
        );
      case 'lovfield':
        return createSelectorFieldConfig(
          attribute,
          getLovList,
          attribute.TargetLovID as string
        );
      case 'textfield':
        return {
          ...createBaseFieldConfig(attribute),
          'x-component': 'Input' as const,
        };
      case 'inputcheckfield':
        return {
          ...createInputSearchFieldConfig(attribute, config),
          'x-component': 'InputSearch' as const,
        };
      case 'datefield':
        return {
          ...createBaseFieldConfig(attribute),
          'x-component': 'DatePicker' as const,
        };

      case 'provincecityfield':
        // 所在城市    省市联动
        return {
          ...createBaseFieldConfig(attribute),
          'x-component': 'ProvinceCity' as const,
        };

      case 'numberfield':
        return {
          ...createBaseFieldConfig(attribute),
          'x-component': 'Input' as const,
          'x-validator': [
            {
              validator: (value: string) => {
                if (!value) return true; // 非必填
                if (!Month_Regex.test(value)) return t('monthNotNumber', { month: value });
                if (Number(value) >= 999999) return t('monthMaxError');
                return true;
              }
            }
          ]
        }
      default:
        return createBaseFieldConfig(attribute);
    }
  };

  return {
    generateFieldSchema,
    scope: { getLovList, getEntityDataList, getComboxList }
  };
};
