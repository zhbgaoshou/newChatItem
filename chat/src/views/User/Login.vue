<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/store/modules/user";
import { useHttp } from "@/hooks/useHttp";
import QIcon from "@/assets/icons/x.svg?component";

const router = useRouter();
const userStore = useUserStore();

let loginLoading = ref(false);
let error = ref("");
const handleLogin = async () => {
  const { err } = await useHttp(userStore.login, loginLoading);

  if (!err) {
    router.push("/");
  } else {
    error.value = err;
    setTimeout(() => {
      error.value = "";
    }, 2000);
  }
};
</script>

<template>
  <div class="fixed w-full z-10 flex justify-center" v-if="error">
    <div role="alert" class="alert mt-2 alert-error w-1/2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <span>{{ error }}!</span>

      <button class="btn btn-sm btn-ghost" @click="error = ''">
        <QIcon />
      </button>
    </div>
  </div>
  <div class="hero bg-base-200 h-full">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">马上登录吧!</h1>
        <p class="py-6">
          平台致力于通过先进的人工智能技术，让每个人都能更轻松地获取信息、解决问题、激发创造力。
        </p>
      </div>

      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form @submit.prevent="handleLogin" class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">登录名</span>
            </label>
            <input
              type="text"
              placeholder="username"
              class="input input-bordered !outline-none"
              required
              v-model="userStore.userFormData.username"
            />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">密码</span>
            </label>
            <input
              type="password"
              placeholder="password"
              class="input input-bordered !outline-none"
              required
              v-model="userStore.userFormData.password"
              minlength="6"
            />
            <label class="label">
              <a href="#" class="label-text-alt link link-hover">忘记密码?</a>
            </label>
          </div>
          <!-- 按钮组 -->
          <div class="form-control">
            <button class="btn btn-info flex-1 rounded-full" type="submit">
              <span
                v-if="loginLoading"
                class="loading loading-spinner loading-sm"
              ></span>
              <span v-else>登录</span>
            </button>
            <div class="divider text-sm">OR</div>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                class="btn btn-primary flex-1 rounded-full"
                @click="router.push('/register')"
              >
                去注册
              </button>
              <button
                type="button"
                class="btn flex-1 rounded-full"
                @click="router.replace('/')"
              >
                暂时不注册
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
