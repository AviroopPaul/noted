"use client";

import { Provider } from "react-redux";
import store from "@/store/store";
import { ThemeProvider } from "./ThemeContext";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </Provider>
    </SessionProvider>
  );
}
