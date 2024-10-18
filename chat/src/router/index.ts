import { createWebHistory, createRouter } from "vue-router";
import ChatIcon from "@/assets/icons/chat.svg?component";

import store from "@/store";
import { useUserStore } from "@/store/modules/user";

const whiteList = ["/", "/register", "/login", "/chat"];

export const drawerMenuList = [
  {
    path: "chat",
    component: () => import("@/views/Chat/Chat.vue"),
    name: "chat",
    meta: {
      title: "CHATGPT",
      icon: ChatIcon,
    },
  },
];

const init_router = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      // chat 首页
      {
        path: "/",
        component: () => import("@/drawer/index.vue"),
        name: "drawer",
        redirect: "/chat",
        children: [...drawerMenuList],
      },
      // user login
      {
        path: "/login",
        component: () => import("@/views/User/Login.vue"),
        name: "login",
      },
      // user register
      {
        path: "/register",
        component: () => import("@/views/User/Register.vue"),
        name: "register",
      },
    ],
  });
};

const router = init_router();
const userStore = useUserStore(store);

router.beforeEach(async (to, from, next) => {
  const token = userStore.token;
  const firstName = userStore.firstName;

  if (token) {
    if (to.path === "/login" || to.path === "/register") {
      next("/");
    } else {
      if (firstName) {
        next();
      } else {
        await userStore.getUserInfo();
        next({ ...to, replace: true });
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      to.path === "/login" ? next() : next("/login");
    }
  }
});

export default router;
