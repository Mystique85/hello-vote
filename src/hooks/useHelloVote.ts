// src/hooks/useHelloVote.ts
import { useState } from "react";

interface Poll {
  title: string;
  options: string[];
  votes: number[];
  ended?: boolean;
}

export const useHelloVote = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      title: "Sample Poll 1",
      options: ["Option A", "Option B"],
      votes: [0, 0],
      ended: false,
    },
    {
      title: "Sample Poll 2",
      options: ["Yes", "No", "Maybe"],
      votes: [0, 0, 0],
      ended: false,
    },
  ]);

  // Mock connectWallet: po prostu ustawiamy przykładowy signer
  const connectWallet = async () => {
    return { address: "0x1234...abcd" };
  };

  // Mock loadPolls: nic nie robi, bo dane są lokalne
  const loadPolls = async () => {
    return polls;
  };

  // Mock createPoll: dodaje ankietę do lokalnego stanu
  const createPoll = async (title: string, options: string[]) => {
    if (!title || options.length < 2) return;
    const newPoll: Poll = {
      title,
      options,
      votes: new Array(options.length).fill(0),
      ended: false,
    };
    setPolls(prev => [...prev, newPoll]);
  };

  // Mock vote: zwiększa liczbę głosów lokalnie
  const vote = async (pollId: number, optionIndex: number) => {
    setPolls(prev => {
      const updated = [...prev];
      if (!updated[pollId].ended) {
        updated[pollId].votes[optionIndex] += 1;
      }
      return updated;
    });
  };

  return {
    polls,
    connectWallet,
    loadPolls,
    createPoll,
    vote,
    signer: { address: "0x1234...abcd" }, // mock signer
  };
};
