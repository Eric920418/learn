export function ErrorDisplay({ error }: { error?: string | null }) {
  if (!error) return null;

  return (
    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm whitespace-pre-wrap">
      {error}
    </div>
  );
}
