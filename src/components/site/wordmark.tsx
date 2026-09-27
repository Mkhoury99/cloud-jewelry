import { Link } from "@tanstack/react-router";

export function Wordmark() {
  return (
    <Link
      to="/"
      className="inline-flex flex-col items-center leading-none text-rose focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose focus-visible:ring-offset-4 focus-visible:ring-offset-burgundy"
      aria-label="Cloud Jewelry, home"
    >
      <span className="font-serif text-xl font-medium tracking-[0.22em] sm:text-[1.7rem] sm:tracking-[0.28em]">
        CLOUD
      </span>
      <span className="mt-1 text-[0.48rem] tracking-[0.42em] sm:text-[0.58rem] sm:tracking-[0.52em]">
        JEWELRY
      </span>
    </Link>
  );
}
