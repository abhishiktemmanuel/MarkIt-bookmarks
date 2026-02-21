"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Bookmark, Collection, BookmarkItem } from "@/types";
import { dbBookmarkToItem } from "@/types";

interface UseRealtimeSyncOptions {
    user: User | null;
    onBookmarkInsert: (item: BookmarkItem) => void;
    onBookmarkUpdate: (item: BookmarkItem) => void;
    onBookmarkDelete: (id: string) => void;
    onCollectionInsert: (collection: Collection) => void;
    onCollectionDelete: (id: string) => void;
}

export function useRealtimeSync({
    user,
    onBookmarkInsert,
    onBookmarkUpdate,
    onBookmarkDelete,
    onCollectionInsert,
    onCollectionDelete,
}: UseRealtimeSyncOptions) {
    // Keep latest callbacks in refs so we don't need them in the dep array
    const cbRef = useRef({
        onBookmarkInsert,
        onBookmarkUpdate,
        onBookmarkDelete,
        onCollectionInsert,
        onCollectionDelete,
    });
    cbRef.current = {
        onBookmarkInsert,
        onBookmarkUpdate,
        onBookmarkDelete,
        onCollectionInsert,
        onCollectionDelete,
    };

    useEffect(() => {
        if (!user) return;

        const supabase = createClient();

        const channel = supabase
            .channel("realtime-sync")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                async (payload) => {
                    const { data } = await supabase
                        .from("bookmarks")
                        .select("*, collections(name)")
                        .eq("id", payload.new.id)
                        .single();
                    if (data) cbRef.current.onBookmarkInsert(dbBookmarkToItem(data as Bookmark));
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                async (payload) => {
                    const { data } = await supabase
                        .from("bookmarks")
                        .select("*, collections(name)")
                        .eq("id", payload.new.id)
                        .single();
                    if (data) cbRef.current.onBookmarkUpdate(dbBookmarkToItem(data as Bookmark));
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    cbRef.current.onBookmarkDelete(payload.old.id as string);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "collections",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    cbRef.current.onCollectionInsert(payload.new as Collection);
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "collections",
                },
                (payload) => {
                    cbRef.current.onCollectionDelete(payload.old.id as string);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]); // Only re-subscribe when user changes
}
