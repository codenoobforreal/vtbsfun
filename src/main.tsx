import { ErrorInfo, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import { DEFAULT_GCTIME, DEFAULT_STALETIME } from "./constants";
import { ErrorBoundary } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALETIME,
      gcTime: DEFAULT_GCTIME,
      retry: false,
    },
  },
});

const router = createRouter({
  routeTree,
  context: {
    queryClient,
  },
  defaultPreload: "intent",
  // 集成 tanstack query
  defaultPreloadStaleTime: 0,
  defaultPreloadDelay: 10 * 1000,
  scrollRestoration: true,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const ErrorFallback = ({
  error,
  // resetErrorBoundary,
}: {
  error: Error;
  // resetErrorBoundary: () => void;
}) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return (
    <div role="alert">
      <p>出错啦：</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
};

const logError = (error: Error, info: ErrorInfo) => {
  console.log(error);
  console.log(info);
};

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={logError}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
