"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useHelloVote } from "@/hooks/useHelloVote";

export const PollList = () => {
  // ──────────────────────────────
  // HOOKS I STANY
  // ──────────────────────────────
  const { polls, loadPolls, vote } = useHelloVote();
  const [loading, setLoading] = useState(true);
  const [typingText, setTypingText] = useState("");

  // ──────────────────────────────
  // PEŁNY TEKST DO ANIMACJI
  // ──────────────────────────────
  const fullText =
    "Survey creation and voting are currently unavailable – we are deploying the smart contract. We apologize for the inconvenience!";

  // ──────────────────────────────
  // ŁADOWANIE ANKIET
  // ──────────────────────────────
  useEffect(() => {
    loadPolls().finally(() => setLoading(false));
  }, []);

  // ──────────────────────────────
  // ANIMACJA „TYPING EFFECT” – CYKLICZNIE CO 5 SEKUND
  // ──────────────────────────────
  useEffect(() => {
    if (polls.length === 0) {
      const startTyping = () => {
        let index = 0;
        const interval = setInterval(() => {
          setTypingText(fullText.slice(0, index + 1));
          index++;
          if (index === fullText.length) {
            clearInterval(interval);
          }
        }, 35);
      };

      startTyping();

      const loop = setInterval(() => {
        setTypingText(""); // wyczyść tekst
        startTyping();     // rozpocznij ponownie
      }, 10000); // powtarzanie co 10 sekund

      return () => clearInterval(loop);
    }
  }, [polls]);

  // ──────────────────────────────
  // OBSŁUGA STANÓW ŁADOWANIA
  // ──────────────────────────────
  if (loading)
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-sm md:text-base font-semibold text-white/80 drop-shadow-md"
      >
        Loading polls...
      </motion.p>
    );

  // ──────────────────────────────
  // BRAK ANKIET – TYPING EFFECT
  // ──────────────────────────────
  if (polls.length === 0)
    return (
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-sm md:text-base font-semibold text-white/80 drop-shadow-md"
      >
        {typingText}
      </motion.p>
    );

  // ──────────────────────────────
  // WYŚWIETLANIE LISTY ANKIET
  // ──────────────────────────────
  return (
    <div className="space-y-6">
      {polls.map((poll, idx) => (
        <motion.div
          key={idx}
          whileHover={{ scale: 1.02 }}
          className="bg-black/30 p-4 rounded-2xl shadow-lg"
        >
          {/* ──────────────────────────────
              TYTUŁ ANKIETY
          ────────────────────────────── */}
          <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>

          {/* ──────────────────────────────
              LISTA OPCJI ANKIETY
          ────────────────────────────── */}
          <ul className="space-y-2">
            {poll.options.map((opt: string, i: number) => (
              <li
                key={i}
                onClick={() => vote(idx, i)}
                className="cursor-pointer bg-white/10 hover:bg-white/20 p-2 rounded-md flex justify-between"
              >
                <span>{opt}</span>
                <span className="text-pink-400">{poll.votes[i]} votes</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};
