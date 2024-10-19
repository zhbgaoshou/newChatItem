import { defineStore } from "pinia";
import { ref, watch, computed } from "vue";

// store
import { setStorage, getStorage } from "@/utils/storage";
// api
import { getMessageApi } from "@/api/chat";

// 图标
import chat3 from "@/assets/icons/chat3.5.svg?component";

interface IModel {
  name: string;
  description: string;
  icon: any;
  active: boolean;
  value: string;
}

interface IMessage {
  model?: string;
  content: string;
  role: string;
}

export const useChatStore = defineStore("chat", () => {
  const modelList = ref<IModel[]>(
    getStorage("modelList") || [
      {
        name: "GPT-3.5",
        value: "gpt-3.5-turbo",
        description: "免费的不太聪明的模型",
        icon: chat3,
        active: true,
      },
      {
        name: "GPT-4o",
        value: "gpt-4o",
        description: "最先进的模型",
        icon: chat3,
        active: false,
      },
    ]
  );
  const messageList = ref<IMessage[]>([]);

  const toggleModel = (name: string) => {
    modelList.value.forEach((item) => {
      item.active = false;
      item.active = item.name === name;
    });
  };

  watch(
    modelList,
    (newModelList) => {
      setStorage("modelList", newModelList);
    },
    {
      deep: true,
      immediate: true,
    }
  );

  const activeModel = computed(() => {
    return modelList.value.find((item) => item.active);
  });

  const addMessage = (message: IMessage) => {
    messageList.value.push(message);
  };

  const getMessage = async () => {
    try {
      const res = await getMessageApi();
      messageList.value = res as any;
    } catch (error) {
      return Promise.reject("获取历史记录失败");
    }
  };

  return {
    modelList,
    toggleModel,
    activeModel,
    messageList,
    addMessage,
    getMessage,
  };
});
