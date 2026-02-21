import { LogOut, Bookmark, FolderOpen, Archive, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import type { BookmarkItem } from "@/pages/Index";

interface Props {
  bookmarks: BookmarkItem[];
  collections: string[];
}

const ProfilePage = ({ bookmarks, collections }: Props) => {
  const totalBookmarks = bookmarks.filter((b) => !b.archived).length;
  const totalArchived = bookmarks.filter((b) => b.archived).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Profile Card */}
      <div className="glass rounded-2xl p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3">
          A
        </div>
        <h2 className="text-lg font-bold text-foreground">Alex Rivera</h2>
        <p className="text-sm text-muted-foreground">alex@example.com</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Bookmarks", value: totalBookmarks, icon: Bookmark },
          { label: "Collections", value: collections.length, icon: FolderOpen },
          { label: "Archived", value: totalArchived, icon: Archive },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
            <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Settings */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
        <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-accent/50 transition-colors">
          <Moon className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground flex-1 text-left">Dark Mode</span>
          <span className="text-xs text-muted-foreground">Coming soon</span>
        </button>
        <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-destructive/10 transition-colors text-destructive">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium flex-1 text-left">Sign out</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
