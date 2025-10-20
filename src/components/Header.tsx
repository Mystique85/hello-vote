"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ConnectWallet } from "./ConnectWallet";

export const Header = () => {
  const [signer, setSigner] = useState<{ address: string } | null>(null);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col md:flex-row items-start md:items-center justify-between py-6 px-6 mb-4 shadow-lg bg-black/30 backdrop-blur-md rounded-2xl"
    >
      {/* Google Font inline */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap"
        rel="stylesheet"
      />

      {/* Logo i opis */}
      <div className="flex-1 text-center md:text-left">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-5xl font-bold font-poppins drop-shadow-[0_0_15px_rgba(255,105,203,0.7)] animate-gradient"
        >
          Hello Vote
        </motion.h1>

        <div className="mt-2 text-left">
          <img
            src="https://readme-typing-svg.herokuapp.com?font=Courier+Prime&weight=700&size=20&pause=700&color=35D07F&center=false&vCenter=false&width=1500&lines=Deployment+work+is+currently+in+progress,+we+apologize+for+the+inconvenience."
            alt="Typing SVG"
          />
        </div>
      </div>

      {/* Przycisk podłączenia portfela */}
      <div className="mt-4 md:mt-0 md:ml-8 flex justify-center md:justify-start">
        {!signer ? (
          <ConnectWallet onConnect={setSigner} />
        ) : (
          <p className="text-green-400 font-semibold">
            Połączono: {signer.address.slice(0, 6)}...{signer.address.slice(-4)}
          </p>
        )}
      </div>

      {/* Animacja gradientu */}
      <style jsx>{`
        .animate-gradient {
          background: linear-gradient(270deg, #ff6ec7, #7f5af0, #00f0ff);
          background-size: 600% 600%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientBG 8s ease infinite;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </motion.header>
  );
};
