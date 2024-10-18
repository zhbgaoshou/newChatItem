<script setup lang="ts">
// vue
import { ref, onMounted } from "vue";
// 组件
import Footer from "@/components/Footer/Footer.vue";
import Message from "./Message.vue";
// store
import { useChatStore } from "@/store/modules/chat";
import { useUserStore } from "@/store/modules/user";
// api
import { sendMessageApi } from "@/api/chat";
//
import { MdPreview } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";

const chatStore = useChatStore();
const userStore = useUserStore();

let isGenerate = ref(false);
let generateText = ref("");
const controller = new AbortController();
const signal = controller.signal;

const getMessageList = () => {
  chatStore.getMessage();
};

onMounted(() => {
  // TODO: 获取历史消息
  getMessageList();
});

const sendHandle = async (content: string) => {
  // TODO: 发送消息
  const param = {
    user: userStore.userId,
    model: chatStore.activeModel?.value,
    content: content,
    role: "user",
  };

  chatStore.addMessage(param);

  try {
    isGenerate.value = true;
    const response = await sendMessageApi(param, signal);
    isGenerate.value = false;
    const reader = (response.body as ReadableStream<Uint8Array>).getReader();
    const textDecoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      let res = textDecoder.decode(value, { stream: true });
      if (res.endsWith("None")) res = res.replace("None", "");
      generateText.value += res;
    }

    const aiMessage = {
      content: generateText.value,
      role: "assistant",
    };
    chatStore.addMessage(aiMessage);
    generateText.value = "";
  } catch (error) {
    console.log("chat 请求错误" + error);
  }
};
</script>

<template>
  <div class="flex flex-col min-h-0 flex-1 justify-between">
    <div class="flex-1 min-h-0 flex">
      <div class="flex-1 relative overflow-auto px-[5px]">
        <Message />
        <!-- 生成中 -->
        <div class="chat chat-start" v-show="isGenerate || generateText">
          <div class="chat-bubble flex justify-center items-center">
            <!-- 加载动画 -->
            <span
              class="loading loading-dots loading-md"
              v-if="isGenerate"
            ></span>
            <!-- 文本 -->

            <MdPreview
              v-else
              :modelValue="generateText"
              :showCodeRowNumber="false"
              :codeFoldable="false"
            />
          </div>
        </div>
      </div>
    </div>
    <Footer @send="sendHandle" />
  </div>
</template>
