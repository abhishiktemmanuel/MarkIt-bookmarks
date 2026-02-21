"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  MoreHorizontal,
  FolderPlus,
  Archive,
  ArchiveRestore,
  Trash2,
  Pencil,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import type { Collection } from "@/types";

interface Props {
  bookmarkId: string;
  isArchived?: boolean;
  collections: Collection[];
  currentCollectionId?: string | null;
  currentCollectionName?: string;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onSetCollection: (id: string, collectionId: string | null, collectionName?: string | null) => void;
  onEdit: (id: string) => void;
}

const BookmarkActions = ({
  bookmarkId,
  isArchived,
  collections,
  currentCollectionId,
  currentCollectionName,
  onDelete,
  onArchive,
  onSetCollection,
  onEdit,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Position the portal menu relative to the trigger button
  const openMenu = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + window.scrollY + 4,
      right: window.innerWidth - rect.right - window.scrollX,
    });
    setOpen(true);
    setShowCollections(false);
  }, []);

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setShowCollections(false);
      }
    };
    const scrollHandler = () => {
      setOpen(false);
      setShowCollections(false);
    };
    document.addEventListener("mousedown", handler);
    window.addEventListener("scroll", scrollHandler, true);
    return () => {
      document.removeEventListener("mousedown", handler);
      window.removeEventListener("scroll", scrollHandler, true);
    };
  }, [open]);

  const menu = (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -4 }}
          transition={{ duration: 0.12 }}
          style={{
            position: "fixed",
            top: menuPos.top,
            right: menuPos.right,
            zIndex: 9999,
          }}
          className="w-48 glass rounded-xl p-1.5 shadow-xl border border-border"
        >
          {!showCollections ? (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onEdit(bookmarkId); setOpen(false); }}
                className="w-full flex items-center gap-2.5 text-sm text-foreground hover:bg-accent rounded-lg px-3 py-2 transition-colors"
              >
                <Pencil className="w-4 h-4 text-muted-foreground" />
                Edit
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setShowCollections(true); }}
                className="w-full flex items-center gap-2.5 text-sm text-foreground hover:bg-accent rounded-lg px-3 py-2 transition-colors"
              >
                <FolderPlus className="w-4 h-4 text-muted-foreground" />
                {currentCollectionId ? "Move collection" : "Add to collection"}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onArchive(bookmarkId); setOpen(false); }}
                className="w-full flex items-center gap-2.5 text-sm text-foreground hover:bg-accent rounded-lg px-3 py-2 transition-colors"
              >
                {isArchived ? (
                  <ArchiveRestore className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Archive className="w-4 h-4 text-muted-foreground" />
                )}
                {isArchived ? "Unarchive" : "Archive"}
              </button>
              <div className="h-px bg-border my-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(bookmarkId); setOpen(false); }}
                className="w-full flex items-center gap-2.5 text-sm text-destructive hover:bg-destructive/10 rounded-lg px-3 py-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1.5">
                Collections
              </p>
              {currentCollectionId && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCollection(bookmarkId, null, null);
                    setOpen(false);
                    setShowCollections(false);
                  }}
                  className="w-full text-left text-sm text-muted-foreground hover:bg-accent rounded-lg px-3 py-2 transition-colors italic"
                >
                  Remove from collection
                </button>
              )}
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetCollection(bookmarkId, c.id, c.name);
                    setOpen(false);
                    setShowCollections(false);
                  }}
                  className={`w-full text-left text-sm rounded-lg px-3 py-2 transition-colors ${c.id === currentCollectionId
                      ? "text-primary bg-primary/10"
                      : "text-foreground hover:bg-accent"
                    }`}
                >
                  {c.name}
                </button>
              ))}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        onClick={(e) => { e.stopPropagation(); open ? setOpen(false) : openMenu(); }}
        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {typeof document !== "undefined" && createPortal(menu, document.body)}
    </div>
  );
};

export default BookmarkActions;
