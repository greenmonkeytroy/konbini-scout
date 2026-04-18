"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MakersPage() {
  const makers = useQuery(api.makers.list);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl text-nori">Makers</h1>
        <Link
          href="/admin/makers/new"
          className="inline-flex items-center gap-2 rounded-md bg-konbini-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark"
        >
          <Plus size={16} /> Add Maker
        </Link>
      </div>

      {makers === undefined ? (
        <p className="text-nori-light">Loading…</p>
      ) : makers.length === 0 ? (
        <p className="text-nori-light">No makers yet. Add your first one.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border-warm bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-border-warm bg-shelf-wood">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-nori">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-nori">Country</th>
                <th className="px-4 py-3 text-right font-semibold text-nori">Snacks</th>
              </tr>
            </thead>
            <tbody>
              {makers.map((maker) => (
                <tr key={maker._id} className="border-b border-border-warm last:border-0">
                  <td className="px-4 py-3 font-semibold text-nori">{maker.name}</td>
                  <td className="px-4 py-3 text-nori-light">{maker.country}</td>
                  <td className="px-4 py-3 text-right text-nori-light">{maker.snackCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
