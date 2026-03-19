/**
 * toaster.tsx
 *
 * Wrapper Sonner Toaster untuk Vite + React (tanpa next-themes).
 * Tema dideteksi dari class "dark" di <html> — kompatibel dengan
 * Tailwind dark mode strategy "class".
 *
 * Mount sekali di App.tsx:
 *   <Toaster />
 */

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Deteksi dark mode dari class "dark" di <html> tanpa next-themes */
function useThemeClass(): "light" | "dark" | "system" {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(
        document.documentElement.classList.contains("dark") ? "dark" : "light"
      );
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  return theme;
}

export function Toaster({ className, ...props }: ToasterProps) {
  const theme = useThemeClass();

  return (
    <Sonner
      theme={theme}
      className={cn("toaster group", className)}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  );
}