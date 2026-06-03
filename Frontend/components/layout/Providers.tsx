"use client";

import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1C1C1C",
            color: "#FAFAFA",
            border: "1px solid rgba(245, 197, 24, 0.2)",
            fontFamily: "'Noto Serif', serif",
            fontSize: "14px",
            borderRadius: "2px",
          },
          success: {
            iconTheme: {
              primary: "#F5C518",
              secondary: "#0A0A0A",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#FAFAFA",
            },
          },
        }}
      />
    </>
  );
}