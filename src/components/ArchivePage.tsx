"use client";

import { Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { BookmarkItem } from "@/types";

interface Props {
    bookmarks: BookmarkItem[];
    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
}

const ArchivePage = ({ bookmarks, onDelete, onArchive }: Props) => {
    const archived = bookmarks.filter((b) => b.archived);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-center gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">Archive</h2>
                <span className="text-xs font-medium text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    {archived.length}
                </span>
            </div>

            {archived.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <Archive className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm">No archived bookmarks</p>
                    <p className="text-muted-foreground/60 text-xs mt-1">
                        Use the menu on any bookmark to archive it
                    </p>
                </motion.div>
            ) : (
                <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
                    <AnimatePresence mode="popLayout">
                        {archived.map((bookmark) => (
                            <motion.div
                                key={bookmark.id}
                                layout
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="group flex items-center gap-4 px-4 sm:px-5 py-3.5 hover:bg-accent/50 transition-colors"
                            >
                                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={bookmark.favicon}
                                        alt=""
                                        className="w-5 h-5"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{bookmark.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{bookmark.url}</p>
                                </div>
                                <span className="text-xs text-muted-foreground hidden sm:block flex-shrink-0">
                                    {bookmark.createdAt}
                                </span>
                                <button
                                    onClick={() => onArchive(bookmark.id)}
                                    className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                                    title="Unarchive"
                                >
                                    <ArchiveRestore className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete(bookmark.id)}
                                    className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                    title="Delete"
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

export default ArchivePage;
