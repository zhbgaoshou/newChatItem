import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { RegisterApi, LoginApi, UserInfoApi } from "@/api/user";
import { getStorage, setStorage, removeStorage } from "@/utils/storage";

// 类型
import type { IUserFormData, IUserInfo } from "@/types/user";

export const useUserStore = defineStore("user", () => {
  const userFormData = ref<IUserFormData>({
    username: "",
    password: "",
    email: "",
  });

  const userInfo = ref<IUserInfo>({} as IUserInfo);

  const token = ref(getStorage("token") || "");

  const userId = computed(() => userInfo.value.id || 0);

  // 重置表单
  const resetFormData = () => {
    userFormData.value = {
      username: "",
      password: "",
      email: "",
    };
  };
  //   重置用户信息
  const resetUserInfo = () => {
    userInfo.value = {} as IUserInfo;
  };

  // 注册
  const register = async () => {
    try {
      return await RegisterApi(userFormData.value);
    } catch (error: any) {
      return Promise.reject(formatError(error.response.data));
    }
  };

  //   登录
  const login = async () => {
    try {
      const res = await LoginApi(userFormData.value);
      token.value = res.access;
      setStorage("token", res.access);
      setStorage("refreshToken", res.refresh);
    } catch (error: any) {
      return Promise.reject("登录失败,请检查账号密码是否正确");
    }
  };

  // 退出登录
  const logout = () => {
    token.value = "";
    resetUserInfo();
    removeStorage("token");
    removeStorage("refreshToken");
  };

  //   获取用户信息
  const getUserInfo = async () => {
    try {
      const res = await UserInfoApi();
      userInfo.value = res;
    } catch (error: any) {
      return Promise.reject(formatError(error.response.data));
    }
  };

  const firstName = computed(() => {
    return userInfo.value.username?.charAt(0).toUpperCase() || "";
  });

  return {
    userFormData,
    register,
    resetFormData,
    login,
    token,
    logout,
    getUserInfo,
    userInfo,
    resetUserInfo,
    firstName,
    userId,
  };
});

function formatError(error: any) {
  const errorArray = Object.entries(error);
  const errorText = errorArray[0][1] as string[];
  return errorText[0];
}
