"use client";

import { useState } from "react";
import SocialAccountCardGrid from "./SocialAccountCardGrid";

export default function ConnectAccountsSection() {
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(
    new Set(["tiktok", "youtube"])
  );

  const handleConnect = (platform: string) => {
    setSelectedPlatforms((prev) => {
      const next = new Set(prev);

      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }

      return next;
    });
  };

  return (
    <SocialAccountCardGrid
      onConnect={handleConnect}
      selectedPlatforms={selectedPlatforms}
    />
  );
}
