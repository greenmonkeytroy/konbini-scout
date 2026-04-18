"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";

export default function AdminDashboard() {
  const snacks = useQuery(api.snacks.list);
  const makers = useQuery(api.makers.list);
  const flavours = useQuery(api.flavours.list);

  const published = snacks?.filter((s) => s.isPublished).length ?? 0;
  const drafts = (snacks?.length ?? 0) - published;

  const stats = [
    { label: "Total Snacks", value: snacks?.length ?? "…", href: "/admin/snacks" },
    { label: "Published", value: published, href: "/admin/snacks" },
    { label: "Drafts", value: drafts, href: "/admin/snacks" },
    { label: "Makers", value: makers?.length ?? "…", href: "/admin/makers" },
    { label: "Flavours", value: flavours?.length ?? "…", href: "/admin/flavours" },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-nori">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map(({ label, value, href }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-border-warm bg-white p-5 text-center transition-shadow hover:shadow-card"
          >
            <p className="font-display text-3xl text-konbini-red">{value}</p>
            <p className="mt-1 text-sm text-nori-light">{label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
