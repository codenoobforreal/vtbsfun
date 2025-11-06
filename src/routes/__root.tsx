import Navbar from "@/components/Navbar";
import { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

const RootLayout = () => (
  <>
    <Navbar />
    <div className="my-4 max-w-7xl min-w-2xl w-9/10 m-auto md:w-4/5">
      <Outlet />
    </div>
    <TanStackRouterDevtools />
  </>
);

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});
