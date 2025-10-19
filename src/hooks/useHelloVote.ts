import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/constants";
import Web3Modal from "web3modal"; // stara wersja 1.9.12
import WalletConnectProvider from "@walletconnect/web3-provider";

// Celo Mainnet
const CELO_CHAIN_ID = 42220;
const CELO_RPC_URL = "https://forno.celo.org";

export const useHelloVote = () => {
  const [polls, setPolls] = useState<any[]>([]);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Połączenie portfela
  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              rpc: { [CELO_CHAIN_ID]: CELO_RPC_URL },
            },
          },
        },
      });

      // Otwiera popup portfela
      const connection = await web3Modal.connect();

      // Tworzymy provider i wymuszamy popup
      const provider = new ethers.providers.Web3Provider(connection, "any");
      await provider.send("eth_requestAccounts", []);

      const newSigner = provider.getSigner();

      // Sprawdzenie sieci i przełączenie, jeśli potrzebne
      const network = await provider.getNetwork();
      if (network.chainId !== CELO_CHAIN_ID) {
        try {
          await connection.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + CELO_CHAIN_ID.toString(16) }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902 || switchError.code === -32603) {
            await connection.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x" + CELO_CHAIN_ID.toString(16),
                  chainName: "Celo Mainnet",
                  nativeCurrency: { name: "Celo", symbol: "CELO", decimals: 18 },
                  rpcUrls: [CELO_RPC_URL],
                  blockExplorerUrls: ["https://celoscan.io"],
                },
              ],
            });
          }
        }
      }

      setSigner(newSigner);
      return newSigner;
    } catch (err: any) {
      console.error("Błąd połączenia portfela:", err);
      alert("Nie udało się połączyć portfela: " + err.message);
      return null;
    }
  };

  // Pobranie kontraktu
  const getContract = async () => {
    if (!signer) throw new Error("Portfel niepodłączony");
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  // Ładowanie ankiet
  const loadPolls = async () => {
    const contract = await getContract();
    const count = await contract.pollCount();
    const items = [];
    for (let i = 0; i < count; i++) {
      const info = await contract.getPollInfo(i);
      const [options, votes] = await contract.getPollOptionsWithVotes(i);
      items.push({ title: info[0], ended: info[2], options, votes });
    }
    setPolls(items);
  };

  // Tworzenie ankiety
  const createPoll = async (title: string, options: string[]) => {
    const contract = await getContract();
    const tx = await contract.createPoll(title, options);
    await tx.wait();
    loadPolls();
  };

  // Głosowanie
  const vote = async (pollId: number, optionIndex: number) => {
    const contract = await getContract();
    const tx = await contract.vote(pollId, optionIndex);
    await tx.wait();
    loadPolls();
  };

  return { polls, connectWallet, loadPolls, createPoll, vote, signer };
};
