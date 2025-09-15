"use client";

import { useEffect, useState } from "react";

export function useCookieSupport() {
  const [cookiesEnabled, setCookiesEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if cookies are enabled
    const checkCookies = () => {
      if (!navigator.cookieEnabled) {
        setCookiesEnabled(false);
        return;
      }

      // Additional test - try to set and read a test cookie
      try {
        document.cookie = "cookietest=1; SameSite=Strict";
        const cookiesSupported = document.cookie.indexOf("cookietest=") !== -1;
        // Clean up test cookie
        document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT; SameSite=Strict";
        setCookiesEnabled(cookiesSupported);
      } catch {
        setCookiesEnabled(false);
      }
    };

    checkCookies();
  }, []);

  return cookiesEnabled;
}
