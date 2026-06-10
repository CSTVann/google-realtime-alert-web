import Image from "next/image";
import Link from "next/link";

type AppLogoProps = {
  href?: string;
  showText?: boolean;
  size?: "sm" | "md";
};

const sizeMap = {
  sm: { box: "h-9 w-9", px: 36, text: "text-base" },
  md: { box: "h-11 w-11", px: 44, text: "text-lg" },
} as const;

export function AppLogo({ href = "/", showText = true, size = "sm" }: AppLogoProps) {
  const dimensions = sizeMap[size];

  const mark = (
    <div
      className={`${dimensions.box} shrink-0 overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface-muted)]`}
    >
      <Image
        src="/kdn_logo.png"
        alt="Trend Alert logo"
        width={dimensions.px}
        height={dimensions.px}
        className="h-full w-full object-cover"
        priority
      />
    </div>
  );

  const label = showText ? (
    <span className={`${dimensions.text} font-semibold tracking-tight`}>Trend Alert</span>
  ) : null;

  if (!href) {
    return (
      <div className="flex items-center gap-2.5">
        {mark}
        {label}
      </div>
    );
  }

  return (
    <Link href={href} className="flex items-center gap-2.5">
      {mark}
      {label}
    </Link>
  );
}
