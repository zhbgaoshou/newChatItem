<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { useUserStore } from "@/store/modules/user";
import { useHttp } from "@/hooks/useHttp";
import QIcon from "@/assets/icons/x.svg?component";

const router = useRouter();
const userStore = useUserStore();

userStore.resetFormData();

let registerLoading = ref(false);
let error = ref("");
const handleRegister = async () => {
  const { err } = await useHttp(userStore.register, registerLoading);

  if (!err) {
    router.push("/login");
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
        <h1 class="text-5xl font-bold">现在注册吧!</h1>
        <p class="py-6">
          有远见的、有创造力的人进来了。所有的逃亡者都假定除非是准的。在deleniti中，每个人都有自己的权利和权利。
        </p>
      </div>
      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <form @submit.prevent="handleRegister" class="card-body">
          <div class="form-control">
            <label class="label">
              <span class="label-text">名字</span>
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
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">邮箱(用于找回密码)</span>
            </label>
            <input
              type="email"
              placeholder="email"
              class="input input-bordered !outline-none"
              v-model="userStore.userFormData.email"
            />
          </div>
          <!-- 按钮组 -->
          <div class="form-control mt-1">
            <button class="btn btn-info flex-1 rounded-full">
              <span
                v-if="registerLoading"
                class="loading loading-spinner loading-sm"
              ></span>
              <span v-else>注册</span>
            </button>
            <div class="divider text-sm">已经有账号？</div>
            <button
              class="btn flex-1 rounded-full btn-md"
              @click="router.push('/login')"
            >
              去登录
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
