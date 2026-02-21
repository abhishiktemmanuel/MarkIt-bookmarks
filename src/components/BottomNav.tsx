"use client";

import { Bookmark, FolderOpen, Archive, User } from "lucide-react";
import type { AppPage } from "@/types";

interface Props {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

const navItems: { page: AppPage; label: string; Icon: React.ElementType }[] = [
  { page: "bookmarks", label: "Bookmarks", Icon: Bookmark },
  { page: "collections", label: "Collections", Icon: FolderOpen },
  { page: "archive", label: "Archive", Icon: Archive },
  { page: "profile", label: "Profile", Icon: User },
];

const BottomNav = ({ currentPage, onPageChange }: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4">
      <div className="glass-strong rounded-2xl px-2 py-2 flex items-center justify-around">
        {navItems.map(({ page, label, Icon }) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-colors ${currentPage === page
                ? "text-primary bg-primary/10"
                : "text-muted-foreground hover:text-foreground"
              }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
