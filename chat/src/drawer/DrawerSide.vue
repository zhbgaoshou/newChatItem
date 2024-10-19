<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";

import ContactIcon from "@/assets/icons/contact.svg?component";
import MessageIcon from "@/assets/icons/message.svg?component";
import LogoutIcon from "@/assets/icons/logout.svg?component";

import { drawerMenuList } from "@/router";

import { useUserStore } from "@/store/modules/user";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const sidebarList = [
  { icon: ContactIcon, text: "联系我" },
  { icon: MessageIcon, text: "反馈BUG" },
];

function handleLogout() {
  userStore.logout();
  router.replace("/login");
}
</script>
<template>
  <ul
    class="menu flex items-center relative bg-base-100 !m-0 h-full border-r-[1px] border-base-300"
  >
    <!-- Sidebar content here -->
    <li>
      <a v-for="item in sidebarList">
        <component :is="item.icon" class="w-[16px]" />
        {{ item.text }}
      </a>
    </li>
    <div class="divider">功能</div>
    <!-- 菜单 -->
    <li v-for="item in drawerMenuList">
      <a :class="{ active: route.name === item.name }">
        <component :is="item.meta.icon" class="w-[16px]" />
        {{ item.meta.title }}
      </a>
    </li>

    <!-- 底部 -->

    <button class="btn absolute bottom-10 btn-sm text-xs" @click="handleLogout">
      退出登录<LogoutIcon class="w-[16px]" />
    </button>
  </ul>
</template>

<style lang="scss" scoped></style>
