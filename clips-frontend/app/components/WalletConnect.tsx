"use client";

import { useState, useCallback } from "react";
import { Wallet } from "lucide-react";
import { WalletConnectionCard } from "./WalletConnectionCard";

interface WalletState {
  phantom: { connected: boolean; address: string | null };
  metamask: { connected: boolean; address: string | null };
}

export default function WalletConnect() {
  const [wallets, setWallets] = useState<WalletState>({
    phantom: { connected: false, address: null },
    metamask: { connected: false, address: null },
  });
  const [loading, setLoading] = useState<string | null>(null);

  const connectPhantom = useCallback(async () => {
    try {
      setLoading("phantom");
      const provider = (window as unknown as Record<string, unknown>).solana as
        | {
            isPhantom?: boolean;
            connect: () => Promise<{ publicKey: { toString: () => string } }>;
          }
        | undefined;

      if (!provider?.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        setLoading(null);
        return;
      }

      const resp = await provider.connect();
      const address = resp.publicKey.toString();
      setWallets((prev) => ({
        ...prev,
        phantom: { connected: true, address },
      }));
    } catch {
      // User rejected or error
    } finally {
      setLoading(null);
    }
  }, []);

  const connectMetaMask = useCallback(async () => {
    try {
      setLoading("metamask");
      const ethereum = (window as unknown as Record<string, unknown>)
        .ethereum as
        | {
            isMetaMask?: boolean;
            request: (args: { method: string }) => Promise<string[]>;
          }
        | undefined;

      if (!ethereum?.isMetaMask) {
        window.open("https://metamask.io/download/", "_blank");
        setLoading(null);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts[0]) {
        setWallets((prev) => ({
          ...prev,
          metamask: { connected: true, address: accounts[0] },
        }));
      }
    } catch {
      // User rejected or error
    } finally {
      setLoading(null);
    }
  }, []);

  return (
    <div className="w-full max-w-2xl rounded-2xl p-6 sm:p-8 bg-[var(--card-background)] border border-[var(--border-color)]">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10">
          <Wallet size={20} className="text-[var(--brand-primary)]" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Wallet Integration
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted-text)]">
            Connect your wallets to manage your crypto assets.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Phantom (Solana) */}
        <WalletConnectionCard
          name="Phantom"
          network="Solana"
          icon="PH"
          iconBg="#AB9FF2"
          status={
            loading === "phantom"
              ? "loading"
              : wallets.phantom.connected
                ? "connected"
                : "disconnected"
          }
          address={wallets.phantom.address}
          onConnect={connectPhantom}
        />

        {/* MetaMask (EVM) */}
        <WalletConnectionCard
          name="MetaMask"
          network="Ethereum / EVM"
          icon="MM"
          iconBg="#F6851B"
          status={
            loading === "metamask"
              ? "loading"
              : wallets.metamask.connected
                ? "connected"
                : "disconnected"
          }
          address={wallets.metamask.address}
          onConnect={connectMetaMask}
        />
      </div>

      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--border-color)]">
        <p className="text-xs text-[var(--muted-text)] text-center">
          Secure wallet connection powered by Web3.js and Ethers.js
        </p>
      </div>
    </div>
  );
}
