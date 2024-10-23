import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";
import { getStorage, setStorage } from "@/utils/storage";
import { setTheme } from "@/utils/theme";

const initialWidthFullScreen = getStorage("isWidthFullScreen");
const initialDarkMode = getStorage("isDarkMode");

export const useSettingsStore = defineStore("settings", () => {
  let isDarkMode = ref(initialDarkMode || false);
  let isFullScreen = ref(initialWidthFullScreen || false);

  const theme = computed({
    get: () => {
      setTheme(isDarkMode.value);
      return isDarkMode.value;
    },
    set: (value) => {
      setTheme(value);
      setStorage("isDarkMode", value);
    },
  });


  watch(isFullScreen, (value) => {
    setStorage("isWidthFullScreen", value);
  });


  return {
    theme,
    isFullScreen,
  };
});
