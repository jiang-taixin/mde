<template>
    <div class="h-auto flex flex-col">
        <img class="w-full h-20" :src="banner" />
        <div class="w-full h-12 bg-primary-200 flex items-center justify-between">
            <div class="w-20 bg-red-200 h-full"></div>
            <div class="w-40 bg-red-200 h-full"></div>
        </div>
    </div>
</template>
<script setup lang="ts">
import banner from "@/assets/images/header/banner.png";
const value1 = ref('a1');
const options = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
</script>
<style scoped></style>