import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 初始化主题
import { setTheme } from "./utils/theme";
import { useSettingsStore } from "./store/modules/settings";
const settingsStore = useSettingsStore(store);
setTheme(settingsStore.theme);

createApp(App).use(router).use(store).mount("#app");
