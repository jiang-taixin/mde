import type { Attribute } from "@/models/moduleConfigModel";

const LABEL_WIDTH = 130;
const COMMON_DECORATOR_PROPS = {
  labelAlign: "left" as const,
  labelWidth: LABEL_WIDTH,
  labelStyle: {
    fontSize: '12px'
  },
};
const COMMON_COMPONENT_PROPS = {
  style:{width:'100%'},
  size: "small" as const,
};

export const useDynamicForm = (attribute: Attribute) => {
  const baseConfig = {
    type: 'string' as const,
    title: attribute.DisplayName,
    'x-decorator': 'FormItem' as const,
    'x-decorator-props': COMMON_DECORATOR_PROPS,
  };

  switch (attribute.ExtControlType) {
    case 'entitydatafield':
    case 'boolvaluecombox':
    case 'lovfield':
      return {
        ...baseConfig,
        'x-component': 'Select' as const,
        'x-component-props': {
          ...COMMON_COMPONENT_PROPS,
          placeholder:attribute.PromptMessage?attribute.PromptMessage:''
        },
      };
    case 'textfield':
      return {
        ...baseConfig,
        'x-component': 'Input' as const,
        'x-component-props': {
          ...COMMON_COMPONENT_PROPS,
          placeholder:attribute.PromptMessage?attribute.PromptMessage:''
        },
      };
    case 'datefield':
      return {
        ...baseConfig,
        'x-component': 'DatePicker' as const,
        'x-component-props': COMMON_COMPONENT_PROPS,
      };
    case 'inputcheckfield':
      return {
        ...baseConfig,
        'x-component': 'InputSearch' as const,
        'x-component-props': {
          ...COMMON_COMPONENT_PROPS,
          placeholder:attribute.PromptMessage?attribute.PromptMessage:''
        },
      };
    default:
      break;
  }
};
