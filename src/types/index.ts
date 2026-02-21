// Database-aligned types

export interface Collection {
    id: string;
    user_id: string;
    name: string;
    created_at: string;
}

export interface Bookmark {
    id: string;
    user_id: string;
    collection_id: string | null;
    title: string | null;
    url: string;
    is_archived: boolean;
    created_at: string;
    collections?: { name: string } | null; // joined
}

// UI-facing shape (maps DB → component props)
export interface BookmarkItem {
    id: string;
    title: string;
    url: string;
    favicon: string;
    createdAt: string;
    collection?: string; // collection name, not id
    collection_id?: string | null;
    archived?: boolean;
}

export type AppPage = "bookmarks" | "collections" | "archive" | "profile";

// Realtime event payloads
export type RealtimeBookmarkPayload = {
    eventType: "INSERT" | "UPDATE" | "DELETE";
    new: Bookmark | null;
    old: { id: string } | null;
};

export type RealtimeCollectionPayload = {
    eventType: "INSERT" | "DELETE";
    new: Collection | null;
    old: { id: string } | null;
};

// Helpers
export function dbBookmarkToItem(b: Bookmark): BookmarkItem {
    const domain = b.url.replace(/https?:\/\//, "").split("/")[0] || b.url;
    return {
        id: b.id,
        title: b.title || domain,
        url: b.url.replace(/https?:\/\//, ""),
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
        createdAt: new Date(b.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
        collection: b.collections?.name ?? undefined,
        collection_id: b.collection_id,
        archived: b.is_archived,
    };
}
