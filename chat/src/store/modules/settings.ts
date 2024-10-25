import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { setStorage, getStorage } from "@/utils/storage";

export const useSettingsStore = defineStore("settings", () => {
  let isFullScreen = ref(true);
  let isDark = ref(getStorage("isDark") || false);

  watch(isFullScreen, (value) => {
    setStorage("isWidthFullScreen", value);
  });

  watch(isDark, (value) => {
    setStorage("isDark", value);
  });

  return {
    isFullScreen,
    isDark,
  };
});
