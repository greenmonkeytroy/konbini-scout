"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface SnackFormProps {
  /** If provided, the form operates in edit mode */
  snackId?: Id<"snacks">;
  initialValues?: {
    name: string;
    makerId: Id<"makers"> | "";
    category: "savoury" | "sweet";
    description: string;
    flavourNotes: string;
    flavourIds: Id<"flavours">[];
    isPublished: boolean;
  };
}

const defaultValues = {
  name: "",
  makerId: "" as Id<"makers"> | "",
  category: "sweet" as "savoury" | "sweet",
  description: "",
  flavourNotes: "",
  flavourIds: [] as Id<"flavours">[],
  isPublished: false,
};

export default function SnackForm({ snackId, initialValues }: SnackFormProps) {
  const router = useRouter();
  const { user } = useUser();
  const makers = useQuery(api.makers.list);
  const createSnack = useMutation(api.admin.createSnack);
  const updateSnack = useMutation(api.admin.updateSnack);

  const [form, setForm] = useState(initialValues ?? defaultValues);
  const [loading, setLoading] = useState(false);

  const flavours = useQuery(api.flavours.byCategory, { category: form.category });

  function toggleFlavour(id: Id<"flavours">) {
    setForm((f) => ({
      ...f,
      flavourIds: f.flavourIds.includes(id)
        ? f.flavourIds.filter((fid) => fid !== id)
        : [...f.flavourIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.makerId || !user) {
      toast.error("Name and maker are required.");
      return;
    }
    setLoading(true);
    try {
      if (snackId) {
        await updateSnack({
          clerkId: user.id,
          id: snackId,
          name: form.name,
          makerId: form.makerId as Id<"makers">,
          description: form.description,
          flavourNotes: form.flavourNotes,
          category: form.category,
          flavourIds: form.flavourIds,
          isPublished: form.isPublished,
        });
        toast.success("Snack updated!");
      } else {
        const newId = await createSnack({
          clerkId: user.id,
          name: form.name,
          makerId: form.makerId as Id<"makers">,
          description: form.description,
          flavourNotes: form.flavourNotes,
          category: form.category,
          flavourIds: form.flavourIds,
          isPublished: form.isPublished,
        });
        toast.success("Snack created!");
        router.push(`/admin/snacks/${newId}`);
        return;
      }
    } catch {
      toast.error("Failed to save snack.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-nori">Name *</label>
        <Input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g. Calbee Shrimp Chips"
          required
        />
      </div>

      {/* Maker */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-nori">Maker *</label>
        <select
          value={form.makerId}
          onChange={(e) => setForm((f) => ({ ...f, makerId: e.target.value as Id<"makers"> }))}
          className="w-full rounded-md border border-border-warm bg-white px-4 py-3 text-base text-nori focus:border-konbini-red focus:outline-none focus:ring-[3px] focus:ring-konbini-red/15"
          required
        >
          <option value="">Select a maker…</option>
          {makers?.map((m) => (
            <option key={m._id} value={m._id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-nori">Category *</label>
        <div className="flex gap-3">
          {(["savoury", "sweet"] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm((f) => ({ ...f, category: cat, flavourIds: [] }))}
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

      {/* Flavour tags */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-nori">Flavour Tags</label>
        <div className="flex flex-wrap gap-2">
          {flavours?.map((f) => (
            <button
              key={f._id}
              type="button"
              onClick={() => toggleFlavour(f._id)}
              className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
                form.flavourIds.includes(f._id)
                  ? "bg-konbini-red text-white"
                  : "border border-border-warm text-nori hover:bg-shelf-wood"
              }`}
            >
              {f.iconEmoji} {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-nori">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          rows={3}
          placeholder="Enthusiastic snack description…"
          className="w-full rounded-md border border-border-warm bg-white px-4 py-3 text-base text-nori placeholder:text-nori-light focus:border-konbini-red focus:outline-none focus:ring-[3px] focus:ring-konbini-red/15"
        />
      </div>

      {/* Flavour notes */}
      <div>
        <label className="mb-1 block text-sm font-semibold text-nori">Flavour Notes</label>
        <textarea
          value={form.flavourNotes}
          onChange={(e) => setForm((f) => ({ ...f, flavourNotes: e.target.value }))}
          rows={2}
          placeholder="Specific flavour description…"
          className="w-full rounded-md border border-border-warm bg-white px-4 py-3 text-base text-nori placeholder:text-nori-light focus:border-konbini-red focus:outline-none focus:ring-[3px] focus:ring-konbini-red/15"
        />
      </div>

      {/* Published */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={form.isPublished}
          onClick={() => setForm((f) => ({ ...f, isPublished: !f.isPublished }))}
          className={`relative h-6 w-11 rounded-full transition-colors ${form.isPublished ? "bg-matcha" : "bg-border-warm"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.isPublished ? "translate-x-5" : "translate-x-0.5"}`}
          />
        </button>
        <span className="text-sm font-semibold text-nori">
          {form.isPublished ? "Published" : "Draft"}
        </span>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : snackId ? "Save Changes" : "Create Snack"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/snacks")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
