import Image from "next/image";
import { cn } from "@/lib/utils";

/** Emberly logomark: the studio's real horse-head mark asset, tinted navy. */
export function EmberlyMark({ className }: { className?: string }) {
  return (
    <Image
      src="/emberly-mark.png"
      alt="Emberly"
      width={822}
      height={548}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
