"use client";

import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { useCookieSupport } from "@/hooks/use-cookie-support";

export function CookieWarningBanner() {
  const cookiesEnabled = useCookieSupport();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if cookies are enabled, still checking, or user dismissed
  if (cookiesEnabled !== false || dismissed) {
    return null;
  }

  return (
    <div className="bg-destructive/90 text-destructive-foreground px-4 py-3 relative">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-sm">
            <strong>Cookies Required:</strong> This app needs cookies to function properly. 
            Please enable cookies for this site in your browser settings.
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-destructive-foreground/20 rounded"
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
