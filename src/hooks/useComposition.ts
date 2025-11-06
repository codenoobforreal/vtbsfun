import {
  useState,
  useRef,
  useCallback,
  ChangeEvent,
  CompositionEvent,
} from "react";

/**
 * 处理输入法的输入问题
 * 避免例如拼音输入过程中频繁触发回调，只在输入完成时触发
 * @param initialValue 初始值
 * @param onComplete 输入完成时的回调函数
 * @returns 返回需要绑定到input元素的属性和方法
 */
export function useComposition(
  initialValue: string = "",
  onComplete?: (value: string) => void,
) {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const isComposingRef = useRef<boolean>(false);

  // 处理输入框变化
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newValue = event.target.value;
      setInputValue(newValue);

      // 如果正在输入中文拼音，不触发完成回调
      if (isComposingRef.current) return;

      // 非拼音输入时立即触发回调
      onComplete?.(newValue);
    },
    [onComplete],
  );

  // 开始中文拼音输入
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  // 结束中文拼音输入
  const handleCompositionEnd = useCallback(
    (event: CompositionEvent<HTMLInputElement>) => {
      isComposingRef.current = false;
      const finalValue = event.currentTarget.value;

      // 拼音输入完成后触发回调
      onComplete?.(finalValue);
    },
    [onComplete],
  );

  // 手动设置值的方法
  const setValue = useCallback(
    (value: string) => {
      setInputValue(value);
      onComplete?.(value);
    },
    [onComplete],
  );

  // 清空输入框
  const clear = useCallback(() => {
    setInputValue("");
    onComplete?.("");
  }, [onComplete]);

  return {
    // 状态值
    value: inputValue,

    // 事件处理函数
    onChange: handleChange,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,

    // 操作方法
    setValue,
    clear,
  };
}
