<script setup lang="ts">
import { useChatStore } from "@/store/modules/chat";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

import { ref } from "vue";

// svg
import RewriteIcon from "@/assets/icons/rewrite.svg?component";
import CopyIcon from "@/assets/icons/copy.svg?component";

import { useThrottleFn } from "@vueuse/core";


// bus
import bus from "@/utils/bus";

const chatStore = useChatStore();
// let isCopy = ref(false);
const copyText = ref("复制");

const rewriteText = (text: string) => {
  bus.emit("rewrite", text);
};

const onCopy = useThrottleFn( (text: string) => {
  // 先检查 navigator.clipboard 是否存在
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        copyText.value = "复制成功";
      })
      .catch(() => {
        fallbackCopyTextToClipboard(text); // 使用备用方法复制
        copyText.value = "复制失败，使用备用方法";
      })
      .finally(() => {
        handleCopyState();
      });
  } else {
    // 如果 navigator.clipboard 不存在，直接使用备用方法
    fallbackCopyTextToClipboard(text);
    copyText.value = "复制成功";
    handleCopyState();
  }
},2000)

// 备用方法：使用 textarea 和 execCommand 进行复制
const fallbackCopyTextToClipboard = (text: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed"; // 避免滚动条跳动
  textarea.style.opacity = "0"; // 隐藏 textarea
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    document.execCommand("copy");
  } catch (err) {
    console.error("Fallback: 复制失败", err);
  }
  document.body.removeChild(textarea);
};

// 控制复制状态
const handleCopyState = () => {
  setTimeout(() => {
    copyText.value = "复制";
  }, 2000);
};

</script>

<template>

  <div
    class="chat"
    v-for="item in chatStore.messageList"
    :key="item.id"
    :class="{
      'chat-start': item.role === 'assistant',
      'chat-end': item.role === 'user',
    }"
  >
    <div class="chat-bubble max-w-[97%] rounded-[20px] flex items-center bg-base-200" :class="{ '!bg-base-100': item.role === 'assistant' }">
      <MdPreview
        :modelValue="item.content"
        v-if="item.role === 'assistant'"
        :autoFoldThreshold="9999"
        :showCodeRowNumber="false"
        preview-theme="github"
        theme="light"
      />
      <div v-else class="overflow-auto user-message">{{ item.content }}</div>
    </div>

    <div class="chat-footer mx-[10px]">
      <div v-if="item.role === 'assistant'" class="-translate-y-[20px] translate-x-[8px]">
        <div class="tooltip tooltip-bottom tooltip-base-200" :data-tip="copyText">
          <CopyIcon
            class="w-[20px] cursor-pointer opacity-50"
            @click="onCopy(item.content)"
          />
        </div>
      </div>
      <div v-else>
        <div class="tooltip tooltip-bottom tooltip-base-200" data-tip="重写">
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

.chat-bubble:before{
  content: "";
  display: none;
}
</style>
