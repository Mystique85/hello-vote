"use client";

import { useState } from "react";

export const ConnectWallet = ({
  onConnect,
}: {
  onConnect: (signer: { address: string }) => void;
}) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>("");

  const connectWallet = async () => {
    // Mock połączenia: po prostu ustawiamy przykładowy adres
    const mockSigner = { address: "0x1234...abcd" };
    setConnected(true);
    setAddress(mockSigner.address);
    onConnect(mockSigner);
  };

  return (
    <div className="mb-4">
      {connected ? (
        <p>Połączono: {address}</p>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-blue-500 to-blue-700 py-2 px-4 rounded-md text-white font-bold"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};
