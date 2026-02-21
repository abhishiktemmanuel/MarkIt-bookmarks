"use client";

import { useState, useRef } from "react";
import { FolderOpen, Plus, ChevronRight, Trash2, GripVertical, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookmarkItem, Collection } from "@/types";
import BookmarkActions from "@/components/BookmarkActions";

// ─────────────────────────────────────────────────────────────────────────────
// BookmarkRow MUST be defined outside CollectionsPage so React keeps a stable
// component reference across renders. Defining it inside would create a new
// type every render, causing React to unmount/remount all rows whenever state
// changes — which destroys any in-progress drag operation.
// ─────────────────────────────────────────────────────────────────────────────

interface BookmarkRowProps {
    bookmark: BookmarkItem;
    compact?: boolean;
    draggingId: string | null;
    collections: Collection[];
    bookmarks: BookmarkItem[];
    onDragStart: (e: React.DragEvent, bookmark: BookmarkItem) => void;
    onDragEnd: () => void;
    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
    onEdit: (id: string, url: string, title: string) => Promise<void>;
    onSetCollection: (id: string, collectionId: string | null, collectionName?: string | null) => void;
}

/** Restore full URL — bookmark.url has the scheme stripped by dbBookmarkToItem. */
function toHref(url: string) {
    return url.startsWith("http") ? url : `https://${url}`;
}

function BookmarkRow({
    bookmark,
    compact = false,
    draggingId,
    collections,
    bookmarks,
    onDragStart,
    onDragEnd,
    onDelete,
    onArchive,
    onEdit,
    onSetCollection,
}: BookmarkRowProps) {
    const isDragging = draggingId === bookmark.id;

    return (
        // The WHOLE ROW is draggable — this is the most reliable approach.
        // A tiny grip-only draggable fails when the child SVG intercepts pointer events.
        // draggable={false} on the <a> below prevents native browser link-drag from
        // conflicting with our handler.
        <div
            draggable
            onDragStart={(e) => onDragStart(e, bookmark)}
            onDragEnd={onDragEnd}
            className={`group flex items-center gap-3 ${compact ? "px-4 sm:px-5 py-3" : "px-4 sm:px-5 py-3.5"} hover:bg-accent/50 transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${isDragging ? "opacity-40 scale-[0.98]" : "opacity-100"
                }`}
        >
            {/* Visual drag affordance — not itself draggable, purely decorative */}
            <GripVertical className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground/60 flex-shrink-0 transition-colors pointer-events-none" />

            {/* Favicon — clicking also opens the link via the parent <a> */}
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={bookmark.favicon}
                    alt=""
                    className="w-4 h-4"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>

            {/* Title + URL — opens in new tab on click.
                draggable={false} stops the browser's native <a>-drag which would
                otherwise override our row drag handler. */}
            <a
                href={toHref(bookmark.url)}
                target="_blank"
                rel="noopener noreferrer"
                draggable={false}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 min-w-0"
            >
                <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {bookmark.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
            </a>

            {/* Actions — stop drag events bubbling from the menu */}
            <div onClick={(e) => e.stopPropagation()} onDragStart={(e) => e.preventDefault()}>
                <BookmarkActions
                    bookmarkId={bookmark.id}
                    isArchived={bookmark.archived}
                    collections={collections}
                    currentCollectionId={bookmark.collection_id}
                    currentCollectionName={bookmark.collection}
                    onDelete={onDelete}
                    onArchive={onArchive}
                    onEdit={(id) => {
                        const b = bookmarks.find((x) => x.id === id);
                        if (b) onEdit(id, b.url, b.title);
                    }}
                    onSetCollection={onSetCollection}
                />
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
    bookmarks: BookmarkItem[];
    collections: Collection[];
    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
    onEdit: (id: string, url: string, title: string) => Promise<void>;
    onSetCollection: (id: string, collectionId: string | null, collectionName?: string | null) => void;
    onAddCollection: (name: string) => void;
    onDeleteCollection: (id: string) => void;
}

const CollectionsPage = ({
    bookmarks,
    collections,
    onDelete,
    onArchive,
    onEdit,
    onSetCollection,
    onAddCollection,
    onDeleteCollection,
}: Props) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const [newName, setNewName] = useState("");
    const [showAdd, setShowAdd] = useState(false);

    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState<string | null>(null);
    const dragBookmarkRef = useRef<BookmarkItem | null>(null);

    const activeBookmarks = bookmarks.filter((b) => !b.archived);

    const handleCreate = () => {
        if (newName.trim()) {
            onAddCollection(newName.trim());
            setNewName("");
            setShowAdd(false);
        }
    };

    // ── Drag source handlers ─────────────────────────────────────────────────

    const handleDragStart = (e: React.DragEvent, bookmark: BookmarkItem) => {
        dragBookmarkRef.current = bookmark;
        setDraggingId(bookmark.id);
        e.dataTransfer.effectAllowed = "move";
        // Store id in transfer data as a fallback
        e.dataTransfer.setData("text/plain", bookmark.id);
    };

    const handleDragEnd = () => {
        setDraggingId(null);
        setDragOver(null);
        dragBookmarkRef.current = null;
    };

    // ── Drop zone handlers ───────────────────────────────────────────────────

    const handleCollectionDragOver = (e: React.DragEvent, collectionId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOver !== collectionId) setDragOver(collectionId);
    };

    const handleCollectionDrop = (e: React.DragEvent, collection: Collection) => {
        e.preventDefault();
        const bm = dragBookmarkRef.current;
        if (bm && bm.collection_id !== collection.id) {
            onSetCollection(bm.id, collection.id, collection.name);
        }
        handleDragEnd();
    };

    const handleUncategorizedDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (dragOver !== "uncategorized") setDragOver("uncategorized");
    };

    const handleUncategorizedDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const bm = dragBookmarkRef.current;
        if (bm && bm.collection_id) {
            onSetCollection(bm.id, null, null);
        }
        handleDragEnd();
    };

    const handleZoneDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOver(null);
        }
    };

    // Shared props for BookmarkRow
    const rowProps = {
        draggingId,
        collections,
        bookmarks,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd,
        onDelete,
        onArchive,
        onEdit,
        onSetCollection,
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
        >
            {/* Header */}
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

            {/* New collection input */}
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
                                autoFocus
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

            {/* Drag hint */}
            <AnimatePresence>
                {draggingId && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-muted-foreground text-center"
                    >
                        Drop onto a collection to move · Drop on the Uncategorized zone to remove from collection
                    </motion.p>
                )}
            </AnimatePresence>

            {/* Collection cards */}
            <div className="space-y-2">
                {collections.map((collection) => {
                    const items = activeBookmarks.filter((b) => b.collection_id === collection.id);
                    const isOpen = expanded === collection.id;
                    const isDropTarget = dragOver === collection.id;

                    return (
                        <div
                            key={collection.id}
                            onDragOver={(e) => handleCollectionDragOver(e, collection.id)}
                            onDragLeave={handleZoneDragLeave}
                            onDrop={(e) => handleCollectionDrop(e, collection)}
                            className={`bg-card rounded-2xl border overflow-hidden transition-all duration-150 ${isDropTarget
                                ? "border-primary ring-2 ring-primary/40 shadow-md shadow-primary/10"
                                : "border-border"
                                }`}
                        >
                            <div className="flex items-center">
                                <button
                                    onClick={() => setExpanded(isOpen ? null : collection.id)}
                                    className="flex-1 flex items-center gap-3 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
                                >
                                    <div
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isDropTarget ? "bg-primary/20" : "bg-primary/10"
                                            }`}
                                    >
                                        <FolderOpen className="w-4 h-4 text-primary" />
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <p className="text-sm font-medium text-foreground">{collection.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {items.length} bookmark{items.length !== 1 ? "s" : ""}
                                            {isDropTarget && (
                                                <span className="ml-1.5 text-primary font-medium animate-pulse">
                                                    ← drop here
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <ChevronRight
                                        className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""
                                            }`}
                                    />
                                </button>
                                <button
                                    onClick={() => onDeleteCollection(collection.id)}
                                    className="p-3 mr-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    title="Delete collection"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

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
                                            <p className="text-sm text-muted-foreground text-center py-6">
                                                No bookmarks in this collection
                                            </p>
                                        ) : (
                                            <div className="divide-y divide-border border-t border-border">
                                                {items.map((bookmark) => (
                                                    <BookmarkRow key={bookmark.id} bookmark={bookmark} compact {...rowProps} />
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

            {/* Uncategorize drop zone — shown above Uncategorized section while dragging a categorized bookmark */}
            <AnimatePresence>
                {draggingId && dragBookmarkRef.current?.collection_id && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        onDragOver={handleUncategorizedDragOver}
                        onDragLeave={handleZoneDragLeave}
                        onDrop={handleUncategorizedDrop}
                        className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-5 transition-all duration-150 ${dragOver === "uncategorized"
                            ? "border-amber-400 bg-amber-400/10 text-amber-500"
                            : "border-border text-muted-foreground"
                            }`}
                    >
                        <Inbox className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {dragOver === "uncategorized"
                                ? "Release to uncategorize"
                                : "Drop here to remove from collection"}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Uncategorized section */}
            {activeBookmarks.filter((b) => !b.collection_id).length > 0 && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                        Uncategorized
                    </p>
                    <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
                        {activeBookmarks
                            .filter((b) => !b.collection_id)
                            .map((bookmark) => (
                                <BookmarkRow key={bookmark.id} bookmark={bookmark} {...rowProps} />
                            ))}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default CollectionsPage;
