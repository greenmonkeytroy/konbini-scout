"use client";

import Link from "next/link";
import { SignInButton, UserButton, Show } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border-warm bg-rice-paper/95 backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-1.5 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="font-display text-xl text-konbini-red transition-opacity hover:opacity-80"
          aria-label="Konbini Scout home"
        >
          Konbini Scout
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <Link
            href="/browse/savoury"
            className="hidden text-sm font-semibold text-nori-light transition-colors hover:text-nori sm:block"
          >
            Browse
          </Link>
          <Link
            href="/shelf/my"
            className="hidden text-sm font-semibold text-nori-light transition-colors hover:text-nori sm:block"
          >
            My Shelves
          </Link>

          {/* Auth */}
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-md bg-konbini-red px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-konbini-red-dark">
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </nav>
      </div>
    </header>
  );
}
