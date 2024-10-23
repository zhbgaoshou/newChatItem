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

const chatTopDOM = ref({} as Element);
const scrollDOM = ref({} as Element);
const chatEndDOM = ref({} as Element);
let isGenerate = ref(false);
let generateText = ref("");
let isBottom = ref(false);
let isStop = ref(false);
const controller = new AbortController();
const signal = controller.signal;

let status = ref(1);
let flag = ref(false);
const getMessageList = async () => {
  console.log("getMessageList");
  await chatStore.getMessage();
};

onMounted(() => {
  // 创建页面监听
  nextTick(async () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.target === chatTopDOM.value) {
            if (entry.isIntersecting) {
              // TODO: 获取历史消息
              await getMessageList();
              if (status.value === 1) {
                toBottom();
                status.value = 0;
              }
            }
          }

          if (entry.target === chatEndDOM.value) {
            if (flag.value) {
              if (entry.isIntersecting) {
                // 监听到底部元素进入
                isBottom.value = true;
              } else {
                isBottom.value = false;
              }
            } else {
              flag.value = true;
            }
          }
        });
      },
      {
        root: null,
        threshold: 0,
      }
    );

    observer.observe(chatTopDOM.value);
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
      toBottom();
    }

    const aiMessage = {
      content: generateText.value,
      role: "assistant",
    };
    chatStore.addMessage(aiMessage);
    generateText.value = "";
  } catch (error) {
    console.log("chat 请求错误" + error);
  } finally {
    isStop.value = false;
  }
};

const toBottom = async () => {
  await nextTick();
  scrollDOM.value.scrollTo({
    top: scrollDOM.value.scrollHeight,
    behavior: "smooth",
  });
};

// 停止生成
const stopHandle = () => {
  controller.abort();
  isStop.value = false;
  isGenerate.value = false;
  generateText.value = "";
};

// 滚动监听(计算是否滚动到底)
</script>

<template>
  <div class="flex flex-col min-h-0 flex-1 justify-between">
    <div class="flex-1 min-h-0 flex relative" id="observer">
      <div class="flex-1 relative overflow-auto" ref="scrollDOM">
        <!-- 上拉加载 -->
        <div ref="chatTopDOM" class="w-full flex justify-center">
          <span class="loading loading-spinner loading-sm"></span>
        </div>

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
        <!-- 底部占位 -->
        <span
          class="block w-1 h-[1px] translate-y-[-50px]"
          ref="chatEndDOM"
        ></span>
      </div>

      <button
        v-show="!isBottom"
        class="btn btn-circle absolute bottom-1 right-1 shadow-lg"
        @click="toBottom()"
      >
        <BottomIcon />
      </button>
    </div>
    <Footer @send="sendHandle" :is-stop="isStop" @stop="stopHandle" />
  </div>
</template>
