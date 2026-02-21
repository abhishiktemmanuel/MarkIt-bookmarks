"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpDown, ExternalLink, Check, X } from "lucide-react";
import type { BookmarkItem, Collection } from "@/types";
import BookmarkActions from "@/components/BookmarkActions";

// Dynamically loaded — keeps microlink + spring physics out of the initial JS bundle
const LinkPreview = dynamic(
  () => import("@/components/ui/link-preview").then((m) => m.LinkPreview),
  {
    ssr: false,
    loading: () => <span />, // invisible placeholder while chunk loads
  }
);

interface Props {
  bookmarks: BookmarkItem[];
  collections: Collection[];
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onSetCollection: (id: string, collectionId: string | null, collectionName?: string | null) => void;
  onEdit: (id: string, url: string, title: string) => Promise<void>;
}

type SortKey = "newest" | "oldest" | "az" | "za";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "az", label: "A → Z" },
  { key: "za", label: "Z → A" },
];

const BookmarkList = ({
  bookmarks,
  collections,
  onDelete,
  onArchive,
  onSetCollection,
  onEdit,
}: Props) => {
  const [sort, setSort] = useState<SortKey>("newest");
  const [showSort, setShowSort] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(() => {
    const arr = [...bookmarks];
    switch (sort) {
      case "oldest": return arr.reverse();
      case "az": return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "za": return arr.sort((a, b) => b.title.localeCompare(a.title));
      default: return arr;
    }
  }, [bookmarks, sort]);

  const startEdit = (b: BookmarkItem) => {
    setEditingId(b.id);
    setEditUrl(b.url);
    setEditTitle(b.title);
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async () => {
    if (!editingId || !editUrl.trim()) return;
    setSaving(true);
    await onEdit(editingId, editUrl.trim(), editTitle.trim());
    setSaving(false);
    setEditingId(null);
  };

  const fullUrl = (url: string) =>
    url.startsWith("http") ? url : `https://${url}`;

  const isValidUrl = (url: string): boolean => {
    try {
      const parsed = new URL(fullUrl(url));
      // Must have a real hostname (not just a bare word like 'localhost' or empty)
      return /\.[a-z]{2,}$/i.test(parsed.hostname) || parsed.hostname === "localhost";
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">Recent Bookmarks</h2>
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
            {bookmarks.length} Total
          </span>
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setShowSort(!showSort)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowUpDown className="w-3 h-3" />
            {SORT_OPTIONS.find((s) => s.key === sort)?.label}
          </button>
          <AnimatePresence>
            {showSort && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-9 w-36 glass rounded-xl p-1.5 shadow-lg z-20 border border-border"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => { setSort(opt.key); setShowSort(false); }}
                    className={`w-full flex items-center justify-between text-sm rounded-lg px-3 py-2 transition-colors ${sort === opt.key
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-accent"
                      }`}
                  >
                    {opt.label}
                    {sort === opt.key && <Check className="w-3 h-3" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <p className="text-muted-foreground text-sm">No bookmarks yet. Add your first one!</p>
        </motion.div>
      ) : (
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          <AnimatePresence mode="popLayout">
            {sorted.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="group flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
              >
                {/* Favicon */}
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-5 h-5"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>

                {/* Content */}
                {editingId === bookmark.id ? (
                  /* ── Edit Mode ── */
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Title"
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      placeholder="URL"
                      className="w-full rounded-lg border border-border bg-background/60 px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                    <div className="flex gap-2 mt-0.5">
                      <button
                        onClick={saveEdit}
                        disabled={!editUrl.trim() || saving}
                        className="flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded-lg disabled:opacity-40"
                      >
                        <Check className="w-3 h-3" />
                        {saving ? "Saving…" : "Save"}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── Display Mode ── */
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    {isValidUrl(bookmark.url) ? (
                      <LinkPreview url={fullUrl(bookmark.url)} className="flex-1 min-w-0">
                        <a
                          href={fullUrl(bookmark.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 min-w-0 block group/link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground truncate group-hover/link:text-primary transition-colors">
                              {bookmark.title}
                            </p>
                            <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0" />
                            {bookmark.collection && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md flex-shrink-0 hidden sm:inline">
                                {bookmark.collection}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                        </a>
                      </LinkPreview>
                    ) : (
                      /* Invalid URL — no preview, just a plain non-clickable display */
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {bookmark.title}
                          </p>
                          {bookmark.collection && (
                            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md flex-shrink-0 hidden sm:inline">
                              {bookmark.collection}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Time + Actions (hidden while editing) */}
                {editingId !== bookmark.id && (
                  <>
                    <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                      {bookmark.createdAt}
                    </span>
                    <BookmarkActions
                      bookmarkId={bookmark.id}
                      isArchived={bookmark.archived}
                      collections={collections}
                      currentCollectionId={bookmark.collection_id}
                      currentCollectionName={bookmark.collection}
                      onDelete={onDelete}
                      onArchive={onArchive}
                      onSetCollection={onSetCollection}
                      onEdit={() => startEdit(bookmark)}
                    />
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default BookmarkList;
