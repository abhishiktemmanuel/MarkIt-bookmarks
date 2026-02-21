import { useState, useRef, useEffect } from "react";
import { MoreHorizontal, FolderPlus, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  bookmarkId: string;
  isArchived?: boolean;
  collections: string[];
  currentCollection?: string;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onSetCollection: (id: string, collection: string | undefined) => void;
}

const BookmarkActions = ({
  bookmarkId,
  isArchived,
  collections,
  currentCollection,
  onDelete,
  onArchive,
  onSetCollection,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowCollections(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
          setShowCollections(false);
        }}
        className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-8 w-48 glass rounded-xl p-1.5 shadow-lg z-50"
          >
            {!showCollections ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCollections(true);
                  }}
                  className="w-full flex items-center gap-2.5 text-sm text-foreground hover:bg-accent rounded-lg px-3 py-2 transition-colors"
                >
                  <FolderPlus className="w-4 h-4 text-muted-foreground" />
                  {currentCollection ? "Move collection" : "Add to collection"}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive(bookmarkId);
                    setOpen(false);
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(bookmarkId);
                    setOpen(false);
                  }}
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
                {currentCollection && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetCollection(bookmarkId, undefined);
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
                    key={c}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSetCollection(bookmarkId, c);
                      setOpen(false);
                      setShowCollections(false);
                    }}
                    className={`w-full text-left text-sm rounded-lg px-3 py-2 transition-colors ${
                      c === currentCollection
                        ? "text-primary bg-primary/10"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookmarkActions;
