"use client";

import { useState, useTransition } from "react";

interface DeleteButtonProps {
  onDelete: () => Promise<{ error?: string }>;
  itemName?: string;
}

export function DeleteButton({ onDelete, itemName = "此項目" }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">確定刪除{itemName}？</span>
        <button
          onClick={() => {
            startTransition(async () => {
              const result = await onDelete();
              if (result?.error) {
                setError(result.error);
                setConfirming(false);
              }
            });
          }}
          disabled={isPending}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
        >
          {isPending ? "刪除中..." : "確定"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          取消
        </button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-3 py-1 text-xs text-red-600 border border-red-300 rounded hover:bg-red-50"
    >
      刪除
    </button>
  );
}
