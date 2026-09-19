import Image from "next/image";
import { cn } from "@/lib/utils";

/** organ-IA logomark: the horse-head mark cropped from the organ-IA logo. */
export function OrganiaMark({ className }: { className?: string }) {
  return (
    <Image
      src="/organia-mark.png"
      alt="organ-IA"
      width={206}
      height={246}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
