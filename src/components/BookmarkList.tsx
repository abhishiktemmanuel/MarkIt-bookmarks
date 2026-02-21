import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookmarkItem } from "@/pages/Dashboard";

interface Props {
  bookmarks: BookmarkItem[];
  onDelete: (id: string) => void;
}

const BookmarkList = ({ bookmarks, onDelete }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">Recent Bookmarks</h2>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {bookmarks.length} Total
          </span>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <p className="text-muted-foreground text-sm">No bookmarks yet. Add your first one!</p>
        </motion.div>
      ) : (
        <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.25 }}
                className="group flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
              >
                {/* Favicon */}
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-5 h-5"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {bookmark.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {bookmark.url}
                  </p>
                </div>

                {/* Time */}
                <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                  {bookmark.createdAt}
                </span>

                {/* Delete */}
                <button
                  onClick={() => onDelete(bookmark.id)}
                  className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default BookmarkList;
