<script setup lang="ts">
import SendIcon from "@/assets/icons/send.svg?component";
import StopIcon from "@/assets/icons/stop.svg?component";

import { ref } from "vue";

const emit = defineEmits(["send", "stop"]);
const props = defineProps(["isStop"]);

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
  <form @submit.prevent="onSend" class="p-3">
    <div
      class="bg-base-200 relative h-[48px] max-h-[148px] rounded-r-[25px] rounded-l-[25px] flex justify-between pr-[20px]"
    >
      <textarea
        v-model="textarea"
        class="join flex-1 textarea bg-base-200 textarea-bordered rounded-l-[25px] resize-none !outline-0 border-none h-full"
        placeholder="想问点什么..."
      >
      </textarea>
      <button
        class="btn btn-circle btn-sm btn-active absolute right-[10px] bottom-[8px]"
      >
        <component
          :is="isStop ? StopIcon : SendIcon"
          class="w-[18px]"
        ></component>
      </button>
    </div>
  </form>
</template>
