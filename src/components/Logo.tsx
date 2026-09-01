import Image from "next/image";

export function Logo({ className = "", height = 32 }: { className?: string; height?: number }) {
  const width = Math.round(height * (2846 / 1600));
  return (
    <Image
      src="/images/logo-stelle.png"
      alt="Stelle Odontologia"
      width={width}
      height={height}
      className={className}
      priority
    />
  );
}
