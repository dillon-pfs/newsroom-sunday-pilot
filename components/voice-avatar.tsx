import Image from "next/image";
import type { Voice } from "@/lib/cast";
import { cn } from "@/lib/utils";

export function VoiceAvatar({
  voice,
  size,
  className,
  labelled = false,
}: {
  voice: Voice;
  size: number;
  className?: string;
  labelled?: boolean;
}) {
  return (
    <Image
      src={voice.avatar}
      alt={labelled ? voice.name : ""}
      width={size}
      height={size}
      className={cn("bg-paper object-cover", className)}
    />
  );
}
