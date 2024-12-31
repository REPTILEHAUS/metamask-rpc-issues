"use client";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { type Transport } from "viem";
import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
  ],
  { appName: "Satoshie Raffle", projectId: "XXX" }
);

const transports: Record<number, Transport> = {
  [arbitrumSepolia.id]: http(),
};

export const wagmiConfig = createConfig({
  chains: [arbitrumSepolia],
  connectors: [...connectors, injected()],
  transports,
  ssr: false,
});
