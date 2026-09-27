export function QtyControl({
  quantity,
  onChange,
  label,
}: {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-burgundy/15 bg-white">
      <button
        type="button"
        className="px-3 py-2 text-lg leading-none text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose"
        aria-label={`Remove one ${label}`}
        onClick={() => onChange(quantity - 1)}
      >
        −
      </button>
      <span className="min-w-6 text-center text-sm text-ink" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        className="px-3 py-2 text-lg leading-none text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose disabled:opacity-30"
        aria-label={`Add another ${label}`}
        disabled={quantity >= 5}
        onClick={() => onChange(quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
