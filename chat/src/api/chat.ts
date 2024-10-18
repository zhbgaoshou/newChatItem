import { useUserStore } from "@/store/modules/user";
import http from "@/utils/http";

const userStore = useUserStore();
export const sendMessageApi = (data: any, signal: AbortSignal) => {
  return fetch(`/api/chat/index`, {
    method: "POST",
    headers: { Authorization: `Bearer ${userStore.token}` },
    body: JSON.stringify(data),
    signal,
  });
};

export const getMessageApi = () => {
  return http.get(`/chat/messages/?user=${userStore.userId}`);
};
