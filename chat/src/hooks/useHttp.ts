import { Ref, reactive } from "vue";

export const useHttp = async <T>(
  fn: (...args: any[]) => Promise<T>,
  loading: Ref<boolean>,
  ...args: any[]
) => {
  // 使用 reactive 包装响应式数据
  const data = reactive({
    res: null as T | null,
    err: null as null | string,
  });

  // 设置加载状态
  loading.value = true;

  try {
    // 执行传入的异步函数，并将结果放入 reactive 数据中
    data.res = (await fn(...args)) as any;
  } catch (error: any) {
    // 错误处理，确保错误信息是一个 Error 实例
    data.err = error;
  } finally {
    // 结束加载状态
    loading.value = false;
  }

  return data;
};
