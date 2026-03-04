import "../src/index.css";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#0d0d0d",
              border: "1px solid rgba(217,186,132,0.25)",
              color: "#fff",
              fontFamily: "var(--font-sora, sans-serif)",
            },
          }}
        />
      </body>
    </html>
  );
}
