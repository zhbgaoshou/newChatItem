<script setup lang="ts">
import SendIcon from "@/assets/icons/send.svg?component";
import StopIcon from "@/assets/icons/stop.svg?component";

import { ref, onUnmounted, nextTick } from "vue";

import bus from "@/utils/bus";

const emit = defineEmits(["send", "stop"]);
const props = defineProps(["isStop"]);

const textarea = ref("");
const textareaDOM = ref<HTMLTextAreaElement>();
const inDOM = ref<HTMLTextAreaElement>();

function onSend() {
  if (props.isStop) {
    emit("stop");
  } else {
    if (!textarea.value) return;
    emit("send", textarea.value);
    textarea.value = "";
  }
}

async function textareaIn() {
  await nextTick();
  const target = inDOM.value;
  textareaDOM.value!.style.height = target?.scrollHeight + "px";
}

bus.on("rewrite", (data: any) => {
  textarea.value = data;
  textareaIn();
  inDOM.value?.focus();
});

onUnmounted(() => {
  bus.off("rewrite");
});
</script>

<template>
  <form @submit.prevent="onSend" class="p-3">
    <div
      ref="textareaDOM"
      class="bg-base-200 h-[48px] max-h-[148px] rounded-r-[25px] rounded-l-[25px] flex"
      :class="{ '!h-[48px]': !textarea }"
    >
      <textarea
        ref="inDOM"
        v-model="textarea"
        @input="textareaIn"
        class="join flex-1 textarea bg-base-200 textarea-bordered rounded-l-[25px] resize-none !outline-0 border-none h-full"
        placeholder="想问点什么..."
      >
      </textarea>

      <div class="flex items-end">
        <button
          class="btn btn-circle btn-sm btn-active my-[8px] mr-[16px] ml-[8px]"
          :class="{ 'btn-disabled': !textarea && !isStop }"
        >
          <component
            :is="isStop ? StopIcon : SendIcon"
            class="w-[18px]"
          ></component>
        </button>
      </div>
    </div>
  </form>
</template>
