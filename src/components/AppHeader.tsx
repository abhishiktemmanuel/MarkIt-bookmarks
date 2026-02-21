"use client";

import { useState, useRef, useEffect } from "react";
import { Bookmark, LogOut, ChevronDown, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppPage } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface Props {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

const navItems: { page: AppPage; label: string }[] = [
  { page: "bookmarks", label: "All Bookmarks" },
  { page: "collections", label: "Collections" },
  { page: "archive", label: "Archive" },
];

const AppHeader = ({ currentPage, onPageChange }: Props) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
  const avatar = user?.user_metadata?.avatar_url as string | undefined;
  const initial = displayName.charAt(0).toUpperCase();

  // Close on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
      <div className="max-w-5xl mx-auto glass-strong rounded-2xl px-4 md:px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="bg-primary/15 p-1.5 rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">MarkIt</h1>
        </div>

        {/* Nav + Profile */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ page, label }) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`text-sm font-medium transition-colors cursor-pointer ${currentPage === page
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {label}
              </button>
            ))}
          </nav>

          {/* Profile */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary overflow-hidden ring-2 ring-border">
                {avatar ? (
                  <Image src={avatar} alt={displayName} width={32} height={32} className="w-full h-full object-cover" />
                ) : (
                  initial
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground hidden sm:block transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-60 rounded-xl p-3 shadow-2xl border border-border z-50"
                  style={{
                    background: "hsl(var(--card))",
                    backdropFilter: "blur(24px)",
                  }}
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 px-2 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden ring-2 ring-border">
                      {avatar ? (
                        <Image src={avatar} alt={displayName} width={36} height={36} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-sm font-semibold text-primary">{initial}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>

                  <div className="h-px bg-border mb-2" />

                  <button
                    onClick={() => { onPageChange("profile"); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 text-sm text-foreground hover:bg-accent rounded-lg px-2 py-2 transition-colors mb-1"
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Profile
                  </button>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg px-2 py-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
