import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Link, LinkComponent } from "@tanstack/react-router";
import { TanstackLinkComponent } from "./CustomLink";

const links = [
  { to: "/" as const, children: "关于" },
  { to: "/all" as const, children: "全体", preload: "render" as const },
];

const NavbarLink: LinkComponent<typeof TanstackLinkComponent> = (props) => {
  return (
    <TanstackLinkComponent
      preload="intent"
      className="flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 py-1.5 font-medium text-muted-foreground hover:text-primary"
      activeProps={{ className: "bg-accent text-accent-foreground" }}
      {...props}
    />
  );
};

export default function Navbar() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-12 items-center justify-between gap-4">
        {/* 左侧 */}
        <div className="flex items-center gap-2">
          {/* 主要区域 */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-primary hover:text-primary/90 text-2xl font-bold"
            >
              Vtbsfun
            </Link>
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                {links.map((link, index) => (
                  <NavigationMenuItem key={index}>
                    <NavbarLink {...link} />
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        {/* 右侧 */}
        {/* <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="text-sm">
            <a href="#">Sign In</a>
          </Button>
          <Button asChild size="sm" className="text-sm">
            <a href="#">Get Started</a>
          </Button>
        </div> */}
      </div>
    </header>
  );
}
