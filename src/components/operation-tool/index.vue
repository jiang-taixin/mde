<template>
    <div ref="containerRef" class="flex w-full overflow-hidden">
        <!-- 可见按钮区域 -->
        <div ref="buttonsRef" class="flex flex-nowrap items-center gap-2 overflow-hidden">
            <template v-for="(button, index) in visibleButtons" :key="button.key || index">
                <a-button v-bind="button.props" @click="button.onClick" class="flex-shrink-0">
                    {{ button.Title }}
                </a-button>
            </template>
        </div>

        <!-- 更多按钮下拉菜单 -->
        <a-dropdown v-if="hiddenButtons.length > 0" :trigger="['click']" placement="bottomRight">
            <a-button type="text" class="flex-shrink-0 px-2">
                <span>更多</span>
                <down-outlined />
            </a-button>
            <template #overlay>
                <a-menu class="min-w-[120px]">
                    <a-menu-item v-for="(button, index) in hiddenButtons" :key="button.key || index"
                        @click="handleHiddenButtonClick(button)">
                        {{ button.Title }}
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { debounce } from 'lodash'


const props = defineProps<{
    buttons: ComponentModel[]
}>()

const containerRef = ref<HTMLElement | null>(null)
const buttonsRef = ref<HTMLElement | null>(null)
const availableWidth = ref(0)
const buttonsWidth = ref<number[]>([])
const hiddenButtons = ref<ComponentModel[]>([])

// 计算可见按钮
const visibleButtons = computed(() => {
    return props.buttons.filter(btn => !hiddenButtons.value.includes(btn))
})

// 处理隐藏按钮点击
const handleHiddenButtonClick = (button: ComponentModel) => {
    button.onClick?.(new MouseEvent('click'))
}

// 计算按钮宽度
const calculateButtonWidths = () => {
    if (!buttonsRef.value) return

    const buttons = buttonsRef.value.querySelectorAll('.ant-btn')
    buttonsWidth.value = Array.from(buttons).map(btn => {
        return btn.getBoundingClientRect().width
    })
}

// 计算可用宽度并确定隐藏按钮
const calculateAvailableWidth = debounce(() => {
    if (!containerRef.value || !buttonsRef.value) return

    const containerWidth = containerRef.value.clientWidth
    const buttons = buttonsRef.value.querySelectorAll('.ant-btn')
    const moreButtonWidth = 80 // 预估"更多"按钮宽度

    let totalWidth = 0
    const newHiddenButtons: ComponentModel[] = []

    buttons.forEach((btn, index) => {
        const btnWidth = buttonsWidth.value[index] || btn.getBoundingClientRect().width
        totalWidth += btnWidth + 8 // 8px 是 gap-2 的间距

        // 如果当前按钮会导致总宽度超出（考虑更多按钮宽度）
        if (totalWidth + moreButtonWidth > containerWidth) {
            newHiddenButtons.push(props.buttons[index])
        }
    })

    hiddenButtons.value = newHiddenButtons
}, 100)

// 监听容器大小变化
const resizeObserver = new ResizeObserver(calculateAvailableWidth)

onMounted(() => {
    if (containerRef.value) {
        resizeObserver.observe(containerRef.value)
    }
    calculateButtonWidths()
    calculateAvailableWidth()
})

onBeforeUnmount(() => {
    if (containerRef.value) {
        resizeObserver.unobserve(containerRef.value)
    }
    calculateAvailableWidth.cancel()
})
</script>

<style scoped>
/* 使用 Tailwind 的类替代了原生 CSS */
</style>