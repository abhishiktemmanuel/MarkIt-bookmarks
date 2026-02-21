import { Bookmark, FolderOpen, Archive, User } from "lucide-react";
import type { AppPage } from "@/pages/Index";

interface Props {
  currentPage: AppPage;
  onPageChange: (page: AppPage) => void;
}

const navItems: { page: AppPage; label: string; icon: typeof Bookmark }[] = [
  { page: "bookmarks", label: "Bookmarks", icon: Bookmark },
  { page: "collections", label: "Collections", icon: FolderOpen },
  { page: "archive", label: "Archive", icon: Archive },
  { page: "profile", label: "Profile", icon: User },
];

const BottomNav = ({ currentPage, onPageChange }: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-strong border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ page, label, icon: Icon }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
