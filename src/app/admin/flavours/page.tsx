"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Plus } from "lucide-react";

export default function FlavoursPage() {
  const flavours = useQuery(api.flavours.list);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-nori">Flavours</h1>
        <Link
          href="/admin/flavours/new"
          className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
        >
          <Plus size={16} /> Add Flavour
        </Link>
      </div>

      {flavours === undefined ? (
        <p className="text-nori-light">Loading…</p>
      ) : flavours.length === 0 ? (
        <p className="text-nori-light">No flavours yet. Add your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border-warm bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border-warm bg-shelf-wood">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-nori">Flavour</th>
                <th className="px-4 py-3 text-left font-semibold text-nori">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-nori">Snacks</th>
              </tr>
            </thead>
            <tbody>
              {flavours.map((f) => (
                <tr key={f._id} className="border-b border-border-warm last:border-0">
                  <td className="px-4 py-3 font-semibold text-nori">
                    {f.iconEmoji && <span className="mr-2">{f.iconEmoji}</span>}
                    {f.name}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={f.category === "savoury" ? "warning" : f.category === "sweet" ? "info" : "success"}>
                      {f.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right text-nori-light">{f.snackCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
