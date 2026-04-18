"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Package, Users, Tag, LayoutDashboard } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/snacks", label: "Snacks", icon: Package },
  { href: "/admin/makers", label: "Makers", icon: Users },
  { href: "/admin/flavours", label: "Flavours", icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: clerkUser, isLoaded } = useUser();
  const user = useQuery(
    api.users.byClerkId,
    isLoaded && clerkUser ? { clerkId: clerkUser.id } : "skip"
  );

  useEffect(() => {
    if (!isLoaded) return;
    if (!clerkUser) { router.replace("/"); return; }
    if (user !== undefined && (user === null || user.role !== "admin")) {
      router.replace("/");
    }
  }, [user, router, clerkUser, isLoaded]);

  // Still loading
  if (!isLoaded || user === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rice-paper">
        <p className="text-nori-light">Checking access…</p>
      </div>
    );
  }

  if (user === null || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-rice-paper">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-border-warm bg-shelf-wood">
        <div className="p-6">
          <p className="font-display text-lg text-konbini-red">Konbini Scout</p>
          <p className="text-xs text-nori-light">Admin Panel</p>
        </div>
        <nav className="px-3 pb-6">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "bg-konbini-red text-white"
                    : "text-nori-light hover:bg-border-warm hover:text-nori"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
