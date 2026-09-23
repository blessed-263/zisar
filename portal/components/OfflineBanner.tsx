"use client";

import * as React from "react";
import { WifiSlash as WifiOff } from "@phosphor-icons/react";

export function OfflineBanner() {
  const [offline, setOffline] = React.useState(false);
  React.useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  if (!offline) return null;
  return (
    <div
      role="status"
      data-print="hide"
      className="anim-fade flex items-center justify-center gap-2 bg-warning-soft px-4 py-1.5 text-[13px] font-medium text-warning"
    >
      <WifiOff className="size-4" aria-hidden />
      You are offline. Changes will be kept on this device.
    </div>
  );
}
