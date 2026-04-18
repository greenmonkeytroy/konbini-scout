"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUser } from "@clerk/nextjs";

type Category = "savoury" | "sweet" | "both";

export default function NewFlavourPage() {
  const router = useRouter();
  const { user } = useUser();
  const createFlavour = useMutation(api.admin.createFlavour);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "sweet" as Category,
    description: "",
    iconEmoji: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !user) return;
    setLoading(true);
    try {
      await createFlavour({
        clerkId: user.id,
        name: form.name,
        category: form.category,
        description: form.description || undefined,
        iconEmoji: form.iconEmoji || undefined,
      });
      toast.success("Flavour created!");
      router.push("/admin/flavours");
    } catch {
      toast.error("Failed to create flavour.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-3xl text-nori">New Flavour</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-nori">Name *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Matcha"
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-nori">Category *</label>
          <div className="flex gap-3">
            {(["savoury", "sweet", "both"] as Category[]).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setForm((f) => ({ ...f, category: cat }))}
                className={`rounded-md px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  form.category === cat
                    ? "bg-konbini-red text-white"
                    : "border border-border-warm text-nori hover:bg-shelf-wood"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-nori">Emoji Icon</label>
          <Input
            value={form.iconEmoji}
            onChange={(e) => setForm((f) => ({ ...f, iconEmoji: e.target.value }))}
            placeholder="e.g. 🍵"
            maxLength={4}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-nori">Description</label>
          <Input
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            placeholder="Brief description (optional)"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save Flavour"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
