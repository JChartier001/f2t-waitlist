"use client";

import ConvexClientProvider from "./ConvexClientProvider";
import { ThemeProvider } from "./ThemeProvider";
import ToastProvider from "./Toast";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ConvexClientProvider>
      <ThemeProvider>
        {children}
        <ToastProvider />
      </ThemeProvider>
    </ConvexClientProvider>
  );
};

export default Providers;
