import Image from "next/image";
import Link from "next/link";

export function BrandLockup() {
  return (
    <Link href="/" className="flex items-center gap-3 no-underline">
      <Image
        src="/brand/mark-cream.png"
        alt=""
        width={48}
        height={48}
        className="size-10 shrink-0 sm:size-12"
        priority
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-mono text-[11px] tracking-[0.22em] text-masthead uppercase">
          Poor Form Desk · Sunday pilot
        </span>
        <Image
          src="/brand/wordmark-cream.png"
          alt="Poor Form Sports"
          width={560}
          height={284}
          className="h-auto w-[200px] sm:w-[248px]"
          priority
        />
      </span>
    </Link>
  );
}

export function BrandMark({
  size = 16,
  variant = "cream",
}: {
  size?: number;
  variant?: "cream" | "bar";
}) {
  return (
    <Image
      src={variant === "bar" ? "/brand/mark-bar.png" : "/brand/mark-cream.png"}
      alt=""
      width={size}
      height={size}
      className="inline-block shrink-0"
    />
  );
}
