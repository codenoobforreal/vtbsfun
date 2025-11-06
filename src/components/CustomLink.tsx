import { createLink, LinkComponent } from "@tanstack/react-router";
import { AnchorHTMLAttributes } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface BaseLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {}

function BaseLink(props: BaseLinkProps) {
  return <a {...props} />;
}

export const TanstackLinkComponent = createLink(BaseLink);

export const CustomLink: LinkComponent<typeof TanstackLinkComponent> = (
  props,
) => {
  return <TanstackLinkComponent preload="intent" {...props} />;
};
