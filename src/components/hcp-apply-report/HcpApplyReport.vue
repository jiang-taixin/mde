<template>
  <div class="flex flex-col">
    <div class="grid grid-cols-3">
      <div v-for="value in 10" class="w-full h-28 bg-slate-500">{{value}}</div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
