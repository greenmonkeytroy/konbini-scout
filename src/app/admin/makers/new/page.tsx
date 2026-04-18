"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useUser } from "@clerk/nextjs";

export default function NewMakerPage() {
  const router = useRouter();
  const { user } = useUser();
  const createMaker = useMutation(api.admin.createMaker);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", country: "", description: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.country || !user) return;
    setLoading(true);
    try {
      await createMaker({
        clerkId: user.id,
        name: form.name,
        country: form.country,
        description: form.description || undefined,
      });
      toast.success("Maker created!");
      router.push("/admin/makers");
    } catch {
      toast.error("Failed to create maker.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-3xl text-nori">New Maker</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-nori">Name *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Calbee"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold text-nori">Country *</label>
          <Input
            value={form.country}
            onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
            placeholder="e.g. Japan"
            required
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
            {loading ? "Saving…" : "Save Maker"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
