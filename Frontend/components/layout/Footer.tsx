"use client";

import Link from "next/link";
import { Zap, Instagram, Twitter, Youtube, Github } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Roadmap", href: "#" },
    { label: "Changelog", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socials = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Github, href: "#", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/5">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary-400 rounded-sm rotate-45 group-hover:rotate-[60deg] transition-transform duration-300" />
                <Zap size={16} className="relative z-10 text-black fill-black" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight">
                Gym<span className="text-primary-400">Gen</span>
                <span className="text-white/40 text-sm font-light ml-1">AI</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm font-serif leading-relaxed max-w-xs">
              Your intelligent AI-powered fitness companion. Transform your body
              with data-driven workouts and nutrition plans.
            </p>
            <div className="flex gap-4 mt-6">
              {socials.map((s) => (
                <Link
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-white/40 hover:text-primary-400 hover:border-primary-400/40 transition-all duration-300 rounded-sm"
                >
                  <s.icon size={15} />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-widest uppercase text-primary-400/80">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/40 hover:text-white text-sm font-serif transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs font-serif">
            © {new Date().getFullYear()} GymGen AI. All rights reserved.
          </p>
          <p className="text-white/25 text-xs font-serif flex items-center gap-1">
            Built with
            <span className="text-primary-400 mx-1">♦</span>
            for fitness enthusiasts worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}