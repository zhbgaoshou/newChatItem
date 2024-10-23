<script setup lang="ts">
import { useChatStore } from "@/store/modules/chat";
import { useSettingsStore } from "@/store/modules/settings";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

import {watch} from "vue"



const chatStore = useChatStore();
const settingsStore = useSettingsStore();

watch(()=>settingsStore.theme,(value)=>{
console.log(value);

})
</script>

<template>
  <div
    class="chat my-[10px]"
    v-for="item in chatStore.messageList"
    :class="{
      'chat-start': item.role === 'assistant',
      'chat-end': item.role === 'user',
    }"
  >
    <div class="chat-bubble max-w-[97%] rounded-[20px] flex items-center" >
      <MdPreview
        :modelValue="item.content"
        v-if="item.role === 'assistant'"
        :autoFoldThreshold="9999"
        :showCodeRowNumber="false"
        theme="dark"
      />
      <div v-else class="overflow-auto user-message">{{ item.content }}</div>
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
.md-editor-preview{
  word-break: normal;
}

.chat-bubble .user-message {
  white-space: pre-wrap; /* 保留空格和换行符，文本会在需要时自动换行 */
  word-wrap: break-word; /* 超长单词在必要时会断开换行 */
  word-break: normal; /* 类似于 word-wrap，在长单词无法放入容器时断行 */
}
</style>
