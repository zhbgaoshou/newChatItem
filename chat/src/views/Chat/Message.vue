<script setup lang="ts">
import { useChatStore } from "@/store/modules/chat";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

import { ref } from "vue";

// svg
import RewriteIcon from "@/assets/icons/rewrite.svg?component";
import CopyIcon from "@/assets/icons/copy.svg?component";

// bus
import bus from "@/utils/bus";

const chatStore = useChatStore();
let isCopy = ref(false);
const copyText = ref("");

const rewriteText = (text: string) => {
  bus.emit("rewrite", text);
};

const onCopy = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      copyText.value = "复制成功";
    })
    .catch(() => {
      copyText.value = "复制失败";
    })
    .finally(() => {
      isCopy.value = true;

      setTimeout(() => {
        isCopy.value = false;
      }, 2000);
    });
};
</script>

<template>
  <div class="toast toast-top toast-center z-10 opacity-80" v-show="isCopy">
    <div class="alert p-[10px] flex justify-center">
      <span class="text-sm">{{ copyText }}</span>
    </div>
  </div>
  <div
    class="chat my-[10px]"
    v-for="item in chatStore.messageList"
    :key="item.id"
    :class="{
      'chat-start': item.role === 'assistant',
      'chat-end': item.role === 'user',
    }"
  >
    <div class="chat-bubble max-w-[97%] rounded-[20px] flex items-center">
      <MdPreview
        :modelValue="item.content"
        v-if="item.role === 'assistant'"
        :autoFoldThreshold="9999"
        :showCodeRowNumber="false"
      />
      <div v-else class="overflow-auto user-message">{{ item.content }}</div>
    </div>
    <div class="chat-footer mx-[10px]">
      <div v-if="item.role === 'assistant'">
        <div class="tooltip tooltip-bottom tooltip-accent" data-tip="复制">
          <CopyIcon
            class="w-[20px] cursor-pointer opacity-50"
            @click="onCopy(item.content)"
          />
        </div>
      </div>
      <div v-else>
        <div class="tooltip tooltip-bottom tooltip-accent" data-tip="重写">
          <RewriteIcon
            class="w-[20px] cursor-pointer opacity-50"
            @click="rewriteText(item.content)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.md-editor {
  background-color: transparent;
}

.md-editor-preview-wrapper {
  padding: 0;
  margin: 0;
}
.md-editor-preview {
  word-break: normal;
}

.chat-bubble .user-message {
  white-space: pre-wrap; /* 保留空格和换行符，文本会在需要时自动换行 */
  word-wrap: break-word; /* 超长单词在必要时会断开换行 */
  word-break: normal; /* 类似于 word-wrap，在长单词无法放入容器时断行 */
}
</style>
