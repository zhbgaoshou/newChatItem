<script setup lang="ts">
import SendIcon from "@/assets/icons/send.svg?component";
import StopIcon from "@/assets/icons/stop.svg?component";


import { ref } from "vue";

const emit = defineEmits(["send",'stop']);
const props = defineProps(['isStop'])

const textarea = ref("");

function onSend() {
  if (props.isStop) {
    emit("stop");
  } else {
    if (!textarea.value) return;
    emit("send", textarea.value);
    textarea.value = "";
  }

}
</script>

<template>
  <form @submit.prevent="onSend" class="join p-3">
    <textarea v-model="textarea" maxlength="200"
      class="textarea rounded-l-full bg-base-200 textarea-bordered w-full resize-none !outline-0 border-none join-item h-0 p-[10px]"
      placeholder="想问点什么...">
    </textarea>
    <button class="btn btn-circle join-item rounded-r-full shadow-none w-[64px]">
      <component :is="isStop ? StopIcon : SendIcon"></component>
    </button>
  </form>
</template>
