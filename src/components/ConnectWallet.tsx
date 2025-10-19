"use client";

import React, { useState } from "react";
import { Web3Modal } from "@web3modal/react";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { configureChains, createClient, Chain } from "wagmi";
import { ethers } from "ethers";

// ---- KONFIGURACJA CELO ----
const CELO_CHAIN: Chain = {
  id: 42220,
  name: "Celo Mainnet",
  network: "celo",
  nativeCurrency: {
    name: "Celo",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: {
    default: "https://forno.celo.org",
  },
  blockExplorers: {
    default: { name: "Celo Explorer", url: "https://celoscan.io" },
  },
  testnet: false,
};

export const ConnectWallet = ({
  onConnect,
}: {
  onConnect: (signer: ethers.Signer) => void;
}) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>("");

  const connectWallet = async () => {
    try {
      // 1️⃣ Konfiguracja wagmi i Web3Modal
      const chains = [CELO_CHAIN];
      const { provider } = configureChains(chains, [w3mProvider({ projectId: "YOUR_PROJECT_ID" })]);
      const wagmiClient = createClient({
        autoConnect: true,
        connectors: w3mConnectors({ projectId: "YOUR_PROJECT_ID", chains }),
        provider,
      });
      const ethereumClient = new EthereumClient(wagmiClient, chains);

      const web3Modal = new Web3Modal({
        projectId: "YOUR_PROJECT_ID",
        themeMode: "light",
      });

      // 2️⃣ Połączenie portfela
      const connection = await web3Modal.connect();
      const ethersProvider = new ethers.BrowserProvider(connection);
      const signer = await ethersProvider.getSigner();
      const userAddress = await signer.getAddress();

      // 3️⃣ Automatyczne przełączenie sieci na Celo
      try {
        await connection.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x" + CELO_CHAIN.id.toString(16) }],
        });
      } catch (switchError: any) {
        if (switchError.code === 4902 || switchError.code === -32603) {
          await connection.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x" + CELO_CHAIN.id.toString(16),
                chainName: CELO_CHAIN.name,
                nativeCurrency: CELO_CHAIN.nativeCurrency,
                rpcUrls: [CELO_CHAIN.rpcUrls.default],
                blockExplorerUrls: [CELO_CHAIN.blockExplorers.default.url],
              },
            ],
          });
        }
      }

      setConnected(true);
      setAddress(userAddress);
      onConnect(signer);
    } catch (err: any) {
      console.error("Błąd połączenia portfela:", err);
      alert("Nie udało się połączyć portfela: " + err.message);
    }
  };

  return (
    <div className="mb-4">
      {connected ? (
        <p>Połączono: {address}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-violet-500 to-pink-500 py-2 px-4 rounded-md text-white font-bold"
        >
          Połącz portfel
        </button>
      )}
    </div>
  );
};
