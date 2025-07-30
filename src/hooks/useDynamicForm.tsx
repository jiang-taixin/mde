import { CLEAR_KEY } from "@/constants";
import type { LovItem } from "@/models/metaDataModel";
import type { Attribute } from "@/models/moduleConfigModel";
const { t } = i18n.global;

const LABEL_WIDTH = 130;
const COMMON_DECORATOR_PROPS = {
  labelAlign: "left" as const,
  labelWidth: LABEL_WIDTH,
  labelStyle: {
    fontSize: '12px'
  },
};
const COMMON_COMPONENT_PROPS = {
  style: { width: '100%' },
  size: "small" as const,
};

export const useDynamicForm = () => {
  const CLEAR_OPTION = {
    label: t('selectPlaceholder'),
    value: CLEAR_KEY,
  };
  const filterOption = (input: string, option: any) => {
    if (option.value === CLEAR_KEY) return true;
    return option.label.toLowerCase().includes(input.toLowerCase());
  };

  // 定义异步获取LOV列表的函数
  async function getLovList(field: any, lovId: string) {
    if (!lovId) {
      field.dataSource = [];
      return;
    }
    try {
      const response = await getLovItems(lovId);
      field.dataSource = [
        CLEAR_OPTION,
        ...response.map((item: LovItem) => ({
          label: item.Name,
          value: item.ID
        }))];

      field.componentProps = {
        ...field.componentProps,
        showSearch: true,
        filterOption: (input: string, option: any) => filterOption(input, option),
      };
    } catch (error) {
      field.dataSource = [];
    } finally {
    }
  }

  // 定义异步获取下拉信息
  async function getComboxList(field: any, attributeName: string) {
    console.log(field)
    if (!attributeName) {
      field.dataSource = [];
      return;
    }
    try {
      const response = await getComboxItems(attributeName);
      field.dataSource = [
        CLEAR_OPTION,
        ...response.map((item: LovItem) => ({
          label: item.Name,
          value: item.Value
        }))];

      field.componentProps = {
        ...field.componentProps,
        showSearch: true,
        filterOption: (input: string, option: any) => filterOption(input, option),
      };
    } catch (error) {
      field.dataSource = [];
    } finally {
    }
  }

  // 定义异步获取实体数据列表的函数
  async function getEntityDataList(field: any, entityConfigName: string) {
    if (!entityConfigName) {
      field.dataSource = [];
      return;
    }
    try {
      const params: RequestGridParams = {
        PageSize: -1,
        PageIndex: 1,
        EntityConfigName: entityConfigName,
      }
      await getGridData(params).then((res) => {
        if (res) {
          const data = JSON.parse(res.JsonData);
          field.dataSource = [
            CLEAR_OPTION,
            ...data.map((item: any) => ({
              label: item.Name,
              value: item.ID
            }))
          ];
          field.componentProps = {
            ...field.componentProps,
            showSearch: true,
            filterOption: (input: string, option: any) => filterOption(input, option),
          };
        }
      }).catch(() => {
      });
    } catch (error) {
      field.dataSource = [];
    } finally {
    }
  }

  const generateFieldSchema = (attribute: Attribute) => {
    const baseConfig = {
      type: 'string' as const,
      title: attribute.DisplayName,
      'x-decorator': 'FormItem' as const,
      'x-decorator-props': COMMON_DECORATOR_PROPS,
    };
    switch (attribute.ExtControlType) {
      case 'entitydatafield':
        return {
          ...baseConfig,
          'x-component': 'Select' as const,
          'x-component-props': {
            ...COMMON_COMPONENT_PROPS,
            showSearch: true,
            filterOption: false,
            placeholder: attribute.PromptMessage ? attribute.PromptMessage : '',
          },
          'x-reactions': `{{(field) => getEntityDataList(field, '${attribute.TargetEntityName}')}}`
        };
      case 'boolvaluecombox':
        return {
          ...baseConfig,
          'x-component': 'Select' as const,
          'x-component-props': {
            ...COMMON_COMPONENT_PROPS,
            placeholder: attribute.PromptMessage ? attribute.PromptMessage : '',

          },
          'x-reactions': `{{(field) => getComboxList(field, '${attribute.AttributeName}')}}`
        };
      case 'lovfield':
        return {
          ...baseConfig,
          'x-component': 'Select' as const,
          'x-component-props': {
            ...COMMON_COMPONENT_PROPS,
            placeholder: attribute.PromptMessage ? attribute.PromptMessage : '',
          },
          'x-reactions': `{{(field) => getLovList(field, '${attribute.TargetLovID}')}}`
        };
      case 'textfield':
        return {
          ...baseConfig,
          'x-component': 'Input' as const,
          'x-component-props': {
            ...COMMON_COMPONENT_PROPS,
            placeholder: attribute.PromptMessage ? attribute.PromptMessage : ''
          },
        };
      case 'inputcheckfield':
        return {
          ...baseConfig,
          'x-component': 'InputSearch' as const,
          'x-component-props': {
            ...COMMON_COMPONENT_PROPS,
            placeholder: attribute.PromptMessage ? attribute.PromptMessage : ''
          },
        };
      default:
        return baseConfig;
    }
  }

  return { generateFieldSchema, scope: { getLovList, getEntityDataList,getComboxList } }
};
