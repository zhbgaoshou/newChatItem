<script setup lang="ts">
import DrawerSide from "./DrawerSide.vue";
import Head from "@/components/Head/Head.vue";


// store
import { useSettingsStore } from "@/store/modules/settings";

const settingsStore = useSettingsStore();

</script>
<template>
  <div id="layout" class="drawer h-full md:drawer-open transition-all"
    :class="settingsStore.isFullScreen ? 'max-w-full' : 'max-w-[980px]'">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content min-h-0 flex flex-col justify-between">
      <!-- Page content here -->
      <Head />
      <router-view />
    </div>
    <div class="drawer-side z-10">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <DrawerSide />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
