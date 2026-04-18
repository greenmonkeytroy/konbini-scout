"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

export default function BootstrapPage() {
  const { user } = useUser();
  const bootstrap = useMutation(api.seed.bootstrapAdmin);
  const [result, setResult] = useState("");

  async function run() {
    if (!user) { setResult("Not signed in"); return; }
    try {
      const msg = await bootstrap({ clerkId: user.id, name: user.firstName ?? "Troy" });
      setResult(msg);
    } catch (e: unknown) {
      setResult(e instanceof Error ? e.message : "Error");
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-rice-paper">
      {user ? (
        <p className="text-nori">Signed in as: {user.id}</p>
      ) : (
        <p className="text-nori-light">Not signed in — sign in first</p>
      )}
      <button
        onClick={run}
        className="rounded-md bg-konbini-red px-6 py-3 font-bold text-white hover:bg-konbini-red-dark"
      >
        Set me as admin
      </button>
      {result && <p className="text-nori">{result}</p>}
    </div>
  );
}
