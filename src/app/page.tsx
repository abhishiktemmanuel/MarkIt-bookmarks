"use client";

export const dynamic = "force-dynamic";

import { useState, useCallback } from "react";
import useSWR from "swr";
import { useAuth } from "@/context/AuthContext";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import AuthPage from "@/components/AuthPage";
import Dashboard from "@/components/Dashboard";
import { SkeletonDashboard } from "@/components/SkeletonDashboard";
import type { BookmarkItem, Collection, AppPage } from "@/types";
import {
    fetchBookmarks,
    fetchCollections,
    createBookmark,
    deleteBookmark,
    archiveBookmark,
    updateBookmark,
    setBookmarkCollection,
    createCollection,
    deleteCollection,
} from "@/lib/api";
import { toast } from "sonner";

// ─── SWR fetchers ────────────────────────────────────────────────────────────
// Keyed by user id so SWR caches per-user and auto-deduplicates requests
const fetcherBookmarks = () => fetchBookmarks();
const fetcherCollections = () => fetchCollections();

export default function Home() {
    const { user, loading: authLoading } = useAuth();
    const [currentPage, setCurrentPage] = useState<AppPage>("bookmarks");
    const [addingBookmark, setAddingBookmark] = useState(false);

    // ─── SWR data fetching (cached, stale-while-revalidate) ──────────────
    const {
        data: bookmarks = [],
        mutate: mutateBookmarks,
    } = useSWR<BookmarkItem[]>(
        user ? `bookmarks-${user.id}` : null, // null = don't fetch when unauthenticated
        fetcherBookmarks,
        {
            revalidateOnFocus: false,    // don't refetch every tab focus (realtime handles it)
            revalidateOnReconnect: true, // do refetch on network reconnect
            dedupingInterval: 5000,      // deduplicate requests within 5s window
        }
    );

    const {
        data: collections = [],
        mutate: mutateCollections,
    } = useSWR<Collection[]>(
        user ? `collections-${user.id}` : null,
        fetcherCollections,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 5000,
        }
    );

    // ─── Realtime Sync ───────────────────────────────────────────────────
    useRealtimeSync({
        user,
        onBookmarkInsert: useCallback((item: BookmarkItem) => {
            mutateBookmarks(
                (prev = []) => prev.some((b) => b.id === item.id) ? prev : [item, ...prev],
                { revalidate: false }
            );
        }, [mutateBookmarks]),
        onBookmarkUpdate: useCallback((item: BookmarkItem) => {
            mutateBookmarks(
                (prev = []) => prev.map((b) => b.id === item.id ? item : b),
                { revalidate: false }
            );
        }, [mutateBookmarks]),
        onBookmarkDelete: useCallback((id: string) => {
            mutateBookmarks(
                (prev = []) => prev.filter((b) => b.id !== id),
                { revalidate: false }
            );
        }, [mutateBookmarks]),
        onCollectionInsert: useCallback((col: Collection) => {
            mutateCollections(
                (prev = []) => prev.some((c) => c.id === col.id) ? prev : [...prev, col],
                { revalidate: false }
            );
        }, [mutateCollections]),
        onCollectionDelete: useCallback((id: string) => {
            mutateCollections(
                (prev = []) => prev.filter((c) => c.id !== id),
                { revalidate: false }
            );
            mutateBookmarks(
                (prev = []) => prev.map((b) =>
                    b.collection_id === id ? { ...b, collection: undefined, collection_id: null } : b
                ),
                { revalidate: false }
            );
        }, [mutateCollections, mutateBookmarks]),
    });

    // ─── Handlers (optimistic via SWR mutate) ────────────────────────────

    const handleAdd = useCallback(async (url: string, title: string) => {
        setAddingBookmark(true);
        const tempId = `temp-${Date.now()}`;
        const domain = url.replace(/https?:\/\//, "").split("/")[0] || url;
        const optimistic: BookmarkItem = {
            id: tempId,
            title: title || domain,
            url: url.replace(/https?:\/\//, ""),
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
            createdAt: "Just now",
        };

        await mutateBookmarks(
            async (prev = []) => {
                try {
                    const saved = await createBookmark(url, title);
                    return [saved, ...prev];
                } catch {
                    toast.error("Failed to save bookmark");
                    return prev;
                }
            },
            {
                optimisticData: (prev = []) => [optimistic, ...prev],
                revalidate: false,
                rollbackOnError: true,
            }
        );
        setAddingBookmark(false);
    }, [mutateBookmarks]);

    const handleDelete = useCallback(async (id: string) => {
        await mutateBookmarks(
            async (prev = []) => {
                try {
                    await deleteBookmark(id);
                    return prev.filter((b) => b.id !== id);
                } catch {
                    toast.error("Failed to delete bookmark");
                    return prev;
                }
            },
            {
                optimisticData: (prev = []) => prev.filter((b) => b.id !== id),
                revalidate: false,
                rollbackOnError: true,
            }
        );
    }, [mutateBookmarks]);

    const handleArchive = useCallback(async (id: string) => {
        const target = bookmarks.find((b) => b.id === id);
        if (!target) return;
        const newArchived = !target.archived;

        await mutateBookmarks(
            async (prev = []) => {
                try {
                    await archiveBookmark(id, newArchived);
                    return prev.map((b) => b.id === id ? { ...b, archived: newArchived } : b);
                } catch {
                    toast.error("Failed to archive bookmark");
                    return prev;
                }
            },
            {
                optimisticData: (prev = []) =>
                    prev.map((b) => b.id === id ? { ...b, archived: newArchived } : b),
                revalidate: false,
                rollbackOnError: true,
            }
        );
    }, [bookmarks, mutateBookmarks]);

    const handleEdit = useCallback(async (id: string, url: string, title: string) => {
        await mutateBookmarks(
            async (prev = []) => {
                try {
                    const updated = await updateBookmark(
                        id,
                        url.startsWith("http") ? url : `https://${url}`,
                        title
                    );
                    return prev.map((b) => b.id === id ? updated : b);
                } catch {
                    toast.error("Failed to update bookmark");
                    return prev;
                }
            },
            {
                optimisticData: (prev = []) =>
                    prev.map((b) => b.id === id
                        ? { ...b, url: url.replace(/https?:\/\//, ""), title }
                        : b
                    ),
                revalidate: false,
                rollbackOnError: true,
            }
        );
    }, [mutateBookmarks]);

    const handleSetCollection = useCallback(
        async (id: string, collectionId: string | null, collectionName?: string | null) => {
            await mutateBookmarks(
                async (prev = []) => {
                    try {
                        await setBookmarkCollection(id, collectionId, collectionName);
                        return prev.map((b) =>
                            b.id === id
                                ? { ...b, collection_id: collectionId, collection: collectionName ?? undefined }
                                : b
                        );
                    } catch {
                        toast.error("Failed to update collection");
                        return prev;
                    }
                },
                {
                    optimisticData: (prev = []) =>
                        prev.map((b) =>
                            b.id === id
                                ? { ...b, collection_id: collectionId, collection: collectionName ?? undefined }
                                : b
                        ),
                    revalidate: false,
                    rollbackOnError: true,
                }
            );
        },
        [mutateBookmarks]
    );

    const handleAddCollection = useCallback(async (name: string) => {
        await mutateCollections(
            async (prev = []) => {
                try {
                    const col = await createCollection(name);
                    return prev.some((c) => c.id === col.id) ? prev : [...prev, col];
                } catch {
                    toast.error("Failed to create collection");
                    return prev;
                }
            },
            { revalidate: false, rollbackOnError: true }
        );
    }, [mutateCollections]);

    const handleDeleteCollection = useCallback(async (id: string) => {
        await mutateCollections(
            async (prev = []) => {
                try {
                    await deleteCollection(id);
                    return prev.filter((c) => c.id !== id);
                } catch {
                    toast.error("Failed to delete collection");
                    return prev;
                }
            },
            {
                optimisticData: (prev = []) => prev.filter((c) => c.id !== id),
                revalidate: false,
                rollbackOnError: true,
            }
        );
        // Detach bookmarks from deleted collection optimistically
        mutateBookmarks(
            (prev = []) => prev.map((b) =>
                b.collection_id === id ? { ...b, collection: undefined, collection_id: null } : b
            ),
            { revalidate: false }
        );
    }, [mutateCollections, mutateBookmarks]);

    // ─── Render ──────────────────────────────────────────────────────────

    // Show skeleton while auth resolves or while initial data hasn't arrived
    if (authLoading) return <SkeletonDashboard />;
    if (!user) return <AuthPage />;
    // Data may still be undefined on first render — show skeleton
    if (!bookmarks && !collections) return <SkeletonDashboard />;

    return (
        <Dashboard
            bookmarks={bookmarks}
            collections={collections}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onArchive={handleArchive}
            onEdit={handleEdit}
            onSetCollection={handleSetCollection}
            onAddCollection={handleAddCollection}
            onDeleteCollection={handleDeleteCollection}
            addingBookmark={addingBookmark}
        />
    );
}
