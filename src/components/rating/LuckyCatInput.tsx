"use client";

import { useState } from "react";
import { LuckyCat } from "./LuckyCat";

interface LuckyCatInputProps {
  value: number;
  onChange: (score: number) => void;
  disabled?: boolean;
  size?: number;
}

function catState(score: number): "happy" | "neutral" | "grumpy" {
  if (score >= 4) return "happy";
  if (score >= 3) return "neutral";
  return "grumpy";
}

export function LuckyCatInput({ value, onChange, disabled = false, size = 40 }: LuckyCatInputProps) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const state = display > 0 ? catState(display) : "neutral";

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Rate this snack">
      {Array.from({ length: 5 }, (_, i) => {
        const score = i + 1;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onClick={() => onChange(score)}
            onMouseEnter={() => setHovered(score)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`Rate ${score} out of 5`}
            className="transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuckyCat state={state} active={i < display} size={size} />
          </button>
        );
      })}
    </div>
  );
}
