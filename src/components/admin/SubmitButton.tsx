"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ label = "儲存" }: { label?: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2 text-white rounded-md font-medium text-sm disabled:opacity-50"
      style={{ backgroundColor: "var(--primary-navy)" }}
    >
      {pending ? "處理中..." : label}
    </button>
  );
}
