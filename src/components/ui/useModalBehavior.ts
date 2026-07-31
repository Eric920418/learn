"use client";

import { useEffect, useRef } from "react";

/**
 * Modal 開啟時的共通行為：Esc 關閉 + 鎖住背景捲動。
 *
 * 從 EventInfoModal 抽出來共用。捲動鎖用 body position:fixed 而非
 * overflow:hidden，因為 iOS Safari 會忽略 body 的 overflow:hidden，背景照樣
 * 能滑；代價是必須自己記住並還原 scrollY。
 *
 * 注意：呼叫端一定要在任何提早 return 之前無條件呼叫這個 hook，否則會違反
 * rules of hooks（它內部有兩個 useEffect）。
 */
export function useModalBehavior(open: boolean, onClose: () => void) {
  // 呼叫端幾乎都會傳 inline arrow function，直接放進 deps 會讓 keydown listener
  // 每次 render 都重新註冊。用 ref 保存最新值，讓 effect 只依賴 open。
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      overflowY: style.overflowY,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    // body 變 fixed 後文件高度歸零、捲軸消失會造成版面橫向跳動，強制保留捲軸槽
    style.overflowY = "scroll";

    return () => {
      Object.assign(style, prev);
      window.scrollTo(0, scrollY);
    };
  }, [open]);
}
