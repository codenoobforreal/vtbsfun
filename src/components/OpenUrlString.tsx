import { cn } from "@/lib/utils";
import { openUrlWithDefaultBrower } from "@/utils";
import { ComponentPropsWithoutRef } from "react";

interface OpenUrlStringProps extends ComponentPropsWithoutRef<"span"> {
  url: string;
}

export function OpenUrlString({
  url,
  className,
  ...props
}: OpenUrlStringProps) {
  function handleClick() {
    openUrlWithDefaultBrower(url);
  }
  return (
    <span
      onClick={handleClick}
      className={cn(
        "hover:underline underline-offset-4 cursor-pointer",
        className,
      )}
      {...props}
    />
  );
}
