<template>
    <div class="h-full w-full">
        <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline"
            :inline-collapsed="state.collapsed" :items="items" theme="light" class="bg-primary-100">
        </a-menu>
    </div>
</template>
<script setup lang="ts">
import {
    MailOutlined,
    AppstoreOutlined,
} from '@ant-design/icons-vue';
const state = reactive({
    collapsed: false,
    selectedKeys: ['master_data_management'],
    openKeys: ['master_data_management'],
    preOpenKeys: ['master_data_management'],
});
const items = reactive([
    {
        key: 'master_data_management',
        icon: () => h(MailOutlined),
        label: '主数据管理',
        title: '主数据管理',
        children: [
            {
                key: 'department_employee_management',
                label: '部门人员管理',
                title: '部门人员管理',
                icon: () => h(MailOutlined),
                children: [
                    {
                        key: 'employee',
                        label: '人员管理',
                        title: '人员管理',
                        icon: () => h(MailOutlined),
                    },
                    {
                        key: 'department',
                        label: '部门管理',
                        title: '部门管理',
                        icon: () => h(MailOutlined),
                    },
                ],
            },
            {
                key: 'product_management',
                label: '产品管理',
                title: '产品管理',
                icon: () => h(MailOutlined),
                children: [
                    {
                        key: 'market',
                        label: '市场',
                        title: '市场',
                        icon: () => h(MailOutlined),
                    },
                    {
                        key: 'ta',
                        label: '治疗领域',
                        title: '治疗领域',
                        icon: () => h(MailOutlined),
                    },
                ],
            },
            {
                key: 'customer_management',
                label: '客户管理',
                title: '客户管理',
                icon: () => h(MailOutlined),
                children: [
                    {
                        key: 'hospital',
                        label: '医院',
                        title: '医院',
                        icon: () => h(MailOutlined),
                    },
                    {
                        key: 'hcp',
                        label: '医生',
                        title: '医生',
                        icon: () => h(MailOutlined),
                    },
                ],
            },
        ],
    },
    {
        key: 'system_management',
        icon: () => h(AppstoreOutlined),
        label: '系统管理',
        title: '系统管理',
        children: [
            {
                key: 'modal_management',
                label: '模块管理',
                title: '模块管理',
                icon: () => h(AppstoreOutlined),
                children: [
                    {
                        key: 'modal',
                        label: '模块',
                        title: '模块',
                        icon: () => h(AppstoreOutlined),
                    },
                ],
            },
            {
                key: 'other_management',
                label: '其他',
                title: '其他',
                icon: () => h(AppstoreOutlined),
                children: [
                    {
                        key: 'data_dictionary',
                        label: '数据字典',
                        title: '数据字典',
                        icon: () => h(AppstoreOutlined),
                    },
                    {
                        key: 'log',
                        label: '日志',
                        title: '日志',
                        icon: () => h(AppstoreOutlined),
                    },
                ],
            },
        ],
    },
]);
watch(
    () => state.openKeys,
    (_val, oldVal) => {
        state.preOpenKeys = oldVal;
    },
);
</script>
<style scoped></style>