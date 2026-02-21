import { useState } from "react";
import { FolderOpen, Plus, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookmarkItem } from "@/pages/Index";
import BookmarkActions from "@/components/BookmarkActions";

interface Props {
  bookmarks: BookmarkItem[];
  collections: string[];
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onSetCollection: (id: string, collection: string | undefined) => void;
  onAddCollection: (name: string) => void;
}

const CollectionsPage = ({
  bookmarks,
  collections,
  onDelete,
  onArchive,
  onSetCollection,
  onAddCollection,
}: Props) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const activeBookmarks = bookmarks.filter((b) => !b.archived);

  const handleCreate = () => {
    if (newName.trim()) {
      onAddCollection(newName.trim());
      setNewName("");
      setShowAdd(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">Collections</h2>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {collections.length}
          </span>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-4 flex gap-2">
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                placeholder="Collection name..."
                className="flex-1 rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                onClick={handleCreate}
                disabled={!newName.trim()}
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40"
              >
                Create
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {collections.map((collection) => {
          const items = activeBookmarks.filter((b) => b.collection === collection);
          const isOpen = expanded === collection;

          return (
            <div key={collection} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : collection)}
                className="w-full flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-medium text-foreground">{collection}</p>
                  <p className="text-xs text-muted-foreground">{items.length} bookmark{items.length !== 1 ? "s" : ""}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    {items.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No bookmarks in this collection</p>
                    ) : (
                      <div className="divide-y divide-border border-t border-border">
                        {items.map((bookmark) => (
                          <div
                            key={bookmark.id}
                            className="group flex items-center gap-4 px-4 sm:px-5 py-3 hover:bg-accent/50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                              <img src={bookmark.favicon} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{bookmark.title}</p>
                              <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                            </div>
                            <BookmarkActions
                              bookmarkId={bookmark.id}
                              isArchived={bookmark.archived}
                              collections={collections}
                              currentCollection={bookmark.collection}
                              onDelete={onDelete}
                              onArchive={onArchive}
                              onSetCollection={onSetCollection}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Uncategorized */}
      {activeBookmarks.filter((b) => !b.collection).length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">Uncategorized</p>
          <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
            {activeBookmarks
              .filter((b) => !b.collection)
              .map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="group flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <img src={bookmark.favicon} alt="" className="w-4 h-4" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{bookmark.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                  </div>
                  <BookmarkActions
                    bookmarkId={bookmark.id}
                    isArchived={bookmark.archived}
                    collections={collections}
                    currentCollection={bookmark.collection}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onSetCollection={onSetCollection}
                  />
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CollectionsPage;
