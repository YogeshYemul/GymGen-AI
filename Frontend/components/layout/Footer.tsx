"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Logo */}
        <Link
          href="/"
          className="font-serif font-bold text-lg tracking-tight"
        >
          Gym<span className="text-primary-400">Gen</span>
          <span className="text-white/40 text-sm ml-1">AI</span>
        </Link>

        {/* Copyright */}
        <p className="text-white/25 text-xs text-center">
          © {new Date().getFullYear()} GymGen AI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
