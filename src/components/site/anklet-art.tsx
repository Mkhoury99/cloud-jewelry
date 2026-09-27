export function AnkletArt({ variant }: { variant: "beads" | "pearl" }) {
  return (
    <svg viewBox="0 0 320 400" className="h-full w-full" role="img" aria-hidden="true">
      <rect width="320" height="400" fill="#FED2DF" />
      <g fill="none" stroke="#580A1A" strokeWidth="1.7" strokeLinecap="round">
        <path d="M34 176c48-28 204-28 252 0" />
        <path d="M146 174c-2 34 2 58 16 86" />
        <path d="M174 174c2 34-2 58-16 86" />
        <path d="M162 258c12 10 22 8 30-2" />
      </g>
      {variant === "pearl" ? (
        <circle cx="160" cy="168" r="11" fill="#FDF6F7" stroke="#580A1A" strokeWidth="1.7" />
      ) : (
        <g fill="#580A1A">
          <circle cx="78" cy="186" r="4" />
          <circle cx="112" cy="170" r="4" />
          <circle cx="208" cy="170" r="4" />
          <circle cx="242" cy="186" r="4" />
        </g>
      )}
    </svg>
  );
}
