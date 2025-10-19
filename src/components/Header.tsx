"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useHelloVote } from "@/hooks/useHelloVote";

export const Header = () => {
  const { connectWallet, signer } = useHelloVote();
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const getAddress = async () => {
      if (signer) {
        const addr = await signer.getAddress();
        setAddress(addr);
      }
    };
    getAddress();
  }, [signer]);

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
        {/* Animowany gradient z glow */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="text-5xl font-bold font-poppins drop-shadow-[0_0_15px_rgba(255,105,203,0.7)] animate-gradient"
        >
          Hello Vote
        </motion.h1>

        {/* Typing SVG */}
        <div className="mt-2 text-left">
          <img
            src="https://readme-typing-svg.herokuapp.com?font=Courier+Prime&weight=700&size=20&pause=700&color=35D07F&center=false&vCenter=false&width=1500&lines=Your+voice.+Your+survey.;Our+shared+ecosystem+%E2%80%94+earn+influence,+collect+%24VOTE+tokens,+and+help+shape+the+HUB+Ecosystem"
            alt="Typing SVG"
          />
        </div>
      </div>

      {/* Przycisk podłączenia portfela */}
      <div className="mt-4 md:mt-0 md:ml-8 flex justify-center md:justify-start">
        {!signer ? (
          <button
            onClick={connectWallet}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"
              />
            </svg>
            Connect Wallet
          </button>
        ) : (
          <p className="text-green-400 font-semibold">
            Połączono: {address.slice(0, 6)}...{address.slice(-4)}
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
