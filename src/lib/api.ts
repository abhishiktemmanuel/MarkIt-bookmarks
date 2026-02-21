"use client";

import type { Collection, Bookmark, BookmarkItem } from "@/types";
import { dbBookmarkToItem } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

// Lazy singleton — never instantiated at module load time (safe during Next.js static build)
let _client: SupabaseClient | null = null;
function getClient(): SupabaseClient {
    if (!_client) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createClient } = require("@/lib/supabase/client");
        _client = createClient() as SupabaseClient;
    }
    return _client!;
}

// ─── Collections ─────────────────────────────────────────────────────────────

export async function fetchCollections(): Promise<Collection[]> {
    const { data, error } = await getClient()
        .from("collections")
        .select("*")
        .order("created_at", { ascending: true });
    if (error) throw error;
    return data ?? [];
}

export async function createCollection(name: string): Promise<Collection> {
    const { data, error } = await getClient()
        .from("collections")
        .insert({ name })
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteCollection(id: string): Promise<void> {
    const { error } = await getClient().from("collections").delete().eq("id", id);
    if (error) throw error;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export async function fetchBookmarks(): Promise<BookmarkItem[]> {
    const { data, error } = await getClient()
        .from("bookmarks")
        .select("*, collections(name)")
        .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Bookmark[]).map(dbBookmarkToItem);
}

export async function createBookmark(
    url: string,
    title: string,
    collectionId?: string | null
): Promise<BookmarkItem> {
    const { data, error } = await getClient()
        .from("bookmarks")
        .insert({ url, title: title || null, collection_id: collectionId ?? null })
        .select("*, collections(name)")
        .single();
    if (error) throw error;
    return dbBookmarkToItem(data as Bookmark);
}

export async function archiveBookmark(id: string, isArchived: boolean): Promise<void> {
    const { error } = await getClient()
        .from("bookmarks")
        .update({ is_archived: isArchived })
        .eq("id", id);
    if (error) throw error;
}

export async function updateBookmark(
    id: string,
    url: string,
    title: string
): Promise<BookmarkItem> {
    const { data, error } = await getClient()
        .from("bookmarks")
        .update({ url, title: title || null })
        .eq("id", id)
        .select("*, collections(name)")
        .single();
    if (error) throw error;
    return dbBookmarkToItem(data as Bookmark);
}

export async function deleteBookmark(id: string): Promise<void> {
    const { error } = await getClient().from("bookmarks").delete().eq("id", id);
    if (error) throw error;
}


export async function setBookmarkCollection(
    id: string,
    collectionId: string | null,
    _collectionName?: string | null
): Promise<void> {
    const { error } = await getClient()
        .from("bookmarks")
        .update({ collection_id: collectionId })
        .eq("id", id);
    if (error) throw error;
}
