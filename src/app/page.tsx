"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { encodeAbiParameters, parseAbi } from "viem";
import { useSwitchChain, useWriteContract } from "wagmi";

export default function Home() {
  const { data: hash, error, writeContract } = useWriteContract();

  useEffect(() => {
    if (hash || error) {
      alert(hash || error);
    }
  }, [hash, error]);

  const claimHandler = () => {
    try {
      const abi = parseAbi([
        "function claimPrizeTest(bytes calldata data, bytes32[] calldata merkleProof ) public pure returns (uint256, uint256)",
      ]);

      const data = encodeAbiParameters(
        [{ type: "uint256" }, { type: "uint256" }],
        [BigInt(2), BigInt("31000000000000000")] // index and prizeValue as BigInts
      );

      console.log({ data });

      const proof = [
        "0x365e9c7c8289719dd3778ef87c484e913eb48aa1e5465bc215150433a6127a34",
        "0xf8960361dd21a910aa645603672ce9db93bec25ea0f7d5ca36004fd5c9634ad0",
      ];

      writeContract({
        address: "0xC3dEc972e4ecEBb5C4ab8c15F257469C90A75e27" as `0x${string}`,
        abi,
        functionName: "claimPrizeTest",
        args: [data, proof],
      });
    } catch (error) {
      alert(error);
    }
  };

  const { switchChain } = useSwitchChain();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <ConnectButton />
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={() => switchChain({ chainId: 421614 })}
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:underline hover:underline-offset-4"
          >
            Switch to Arbitrum Sepolia
          </button>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            onClick={claimHandler}
            type="button"
            className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:underline hover:underline-offset-4"
          >
            Claim Prize
          </button>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}
