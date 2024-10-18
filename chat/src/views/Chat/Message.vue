<script setup lang="ts">
import { useChatStore } from "@/store/modules/chat";
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

const chatStore = useChatStore();
</script>

<template>
  <div
    class="chat"
    v-for="item in chatStore.messageList"
    :class="{
      'chat-start': item.role === 'assistant',
      'chat-end': item.role === 'user',
    }"
  >
    <div class="chat-bubble" :class="{ 'w-full': item.role === 'assistant' }">
      <MdPreview
        :modelValue="item.content"
        v-if="item.role === 'assistant'"
        :autoFoldThreshold="9999"
        :showCodeRowNumber="false"
      />

      <div v-else>{{ item.content }}</div>
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
</style>
