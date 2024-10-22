<script setup lang="ts">
// vue
import { ref, onMounted, nextTick } from "vue";
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
// svg
import BottomIcon from "@/assets/icons/bottom.svg?component";

const chatStore = useChatStore();
const userStore = useUserStore();

const chatEndDOM = ref({} as Element);
let isGenerate = ref(false);
let generateText = ref("");
let isBottom = ref(false);
let isStop = ref(false);
const controller = new AbortController();
const signal = controller.signal;

const getMessageList = async () => {
  await chatStore.getMessage();
  await nextTick();
  toBottom(false);
};

onMounted(async () => {
  // TODO: 获取历史消息
  await getMessageList();
  // 创建页面监听
  nextTick(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isBottom.value = true;
          } else {
            isBottom.value = false;
          }
        });
      },
      {
        root: document.getElementById("observer"),
      }
    );

    observer.observe(chatEndDOM.value);
  });
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
    isStop.value = true;
    isGenerate.value = true;
    await nextTick();
    toBottom();
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
  }finally {
    isStop.value = false;
  }
};

const toBottom = (option: any = { behavior: "smooth" }) => {
  chatEndDOM.value?.scrollIntoView(option);
};

// 停止生成
const stopHandle = () => {
  controller.abort();
  isStop.value = false;
  isGenerate.value = false;
  generateText.value = "";
};
</script>

<template>
  <div class="flex flex-col min-h-0 flex-1 justify-between">
    <div class="flex-1 min-h-0 flex relative" id="observer">
      <div class="flex-1 relative overflow-auto">
        <Message />
        <!-- 生成中 -->
        <div class="chat chat-start" v-show="isGenerate || generateText">
          <div class="chat-bubble max-w-[97%] flex justify-center items-center">
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

        <span ref="chatEndDOM" class="block h-1 w-1"></span>
      </div>

      <button
        v-show="!isBottom"
        class="btn btn-circle absolute bottom-1 right-1 shadow-lg"
        @click="toBottom()"
      >
        <BottomIcon />
      </button>
    </div>
    <Footer @send="sendHandle" :is-stop="isStop" @stop="stopHandle"/>
  </div>
</template>
