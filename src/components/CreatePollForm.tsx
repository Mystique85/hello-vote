"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useHelloVote } from "@/hooks/useHelloVote";

export const CreatePollForm = () => {
  const { createPoll } = useHelloVote(); 
  const [title, setTitle] = useState(""); 
  const [options, setOptions] = useState<string[]>(["", ""]);

  const handleAddOption = () => {
    if (options.length < 10) setOptions([...options, ""]);
  };

  const handleChange = (i: number, value: string) => {
    const newOpts = [...options];
    newOpts[i] = value;
    setOptions(newOpts);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createPoll(title, options.filter(o => o.trim() !== ""));
    setTitle("");
    setOptions(["", ""]);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold">Create a New Poll</h2>

      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Poll Title"
        className="w-full p-2 rounded-md bg-black/20 border border-white/20"
      />

      {options.map((opt, i) => (
        <input
          key={i}
          type="text"
          value={opt}
          onChange={e => handleChange(i, e.target.value)}
          placeholder={`Option ${i + 1}`}
          className="w-full p-2 rounded-md bg-black/20 border border-white/20"
        />
      ))}

      {options.length < 10 && (
        <button
          type="button"
          onClick={handleAddOption}
          className="bg-gradient-to-r from-violet-500 to-pink-500 w-full py-2 rounded-md text-white font-semibold"
        >
          + Add Option
        </button>
      )}

      <button
        type="submit"
        className="bg-gradient-to-r from-green-500 to-teal-500 w-full py-2 rounded-md text-white font-bold mt-4"
      >
        Create Poll
      </button>
    </motion.form>
  );
};
