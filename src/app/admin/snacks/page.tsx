"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function SnacksPage() {
  const { user } = useUser();
  const snacks = useQuery(api.snacks.list);
  const makers = useQuery(api.makers.list);
  const updateSnack = useMutation(api.admin.updateSnack);

  const makerMap = Object.fromEntries(makers?.map((m) => [m._id, m.name]) ?? []);

  async function togglePublished(id: Id<"snacks">, current: boolean) {
    if (!user) return;
    try {
      await updateSnack({ clerkId: user.id, id, isPublished: !current });
      toast.success(current ? "Moved to drafts" : "Published!");
    } catch {
      toast.error("Failed to update.");
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-nori">Snacks</h1>
        <Link
          href="/admin/snacks/new"
          className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
        >
          <Plus size={16} /> Add Snack
        </Link>
      </div>

      {snacks === undefined ? (
        <p className="text-nori-light">Loading…</p>
      ) : snacks.length === 0 ? (
        <p className="text-nori-light">No snacks yet. Add your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border-warm bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border-warm bg-shelf-wood">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-nori">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-nori">Maker</th>
                <th className="px-4 py-3 text-left font-semibold text-nori">Category</th>
                <th className="px-4 py-3 text-center font-semibold text-nori">Status</th>
                <th className="px-4 py-3 text-right font-semibold text-nori">Rating</th>
                <th className="px-4 py-3 text-right font-semibold text-nori">Actions</th>
              </tr>
            </thead>
            <tbody>
              {snacks.map((snack) => (
                <tr
                  key={snack._id}
                  className={`border-b border-border-warm last:border-0 ${!snack.isPublished ? "opacity-60" : ""}`}
                >
                  <td className="px-4 py-3 font-semibold text-nori">{snack.name}</td>
                  <td className="px-4 py-3 text-nori-light">{makerMap[snack.makerId] ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={snack.category === "savoury" ? "warning" : "info"}>
                      {snack.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => togglePublished(snack._id, snack.isPublished)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        snack.isPublished
                          ? "bg-matcha/20 text-matcha hover:bg-matcha/30"
                          : "bg-border-warm text-nori-light hover:bg-shelf-wood"
                      }`}
                    >
                      {snack.isPublished ? "Published" : "Draft"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right text-nori-light">
                    {snack.totalRatings > 0 ? `${snack.averageRating.toFixed(1)} (${snack.totalRatings})` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/snacks/${snack._id}`}
                      className="text-xs font-semibold text-konbini-red hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
