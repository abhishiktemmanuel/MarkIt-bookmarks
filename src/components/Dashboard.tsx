"use client";

import AppHeader from "@/components/AppHeader";
import AddBookmarkCard from "@/components/AddBookmarkCard";
import BookmarkList from "@/components/BookmarkList";
import BottomNav from "@/components/BottomNav";
import CollectionsPage from "@/components/CollectionsPage";
import ArchivePage from "@/components/ArchivePage";
import ProfilePage from "@/components/ProfilePage";
import type { BookmarkItem, Collection, AppPage } from "@/types";

interface Props {
    bookmarks: BookmarkItem[];
    collections: Collection[];
    currentPage: AppPage;
    onPageChange: (page: AppPage) => void;
    onAdd: (url: string, title: string) => void;
    onDelete: (id: string) => void;
    onArchive: (id: string) => void;
    onEdit: (id: string, url: string, title: string) => Promise<void>;
    onSetCollection: (id: string, collectionId: string | null, collectionName?: string | null) => void;
    onAddCollection: (name: string) => void;
    onDeleteCollection: (id: string) => void;
    addingBookmark?: boolean;
}

const Dashboard = ({
    bookmarks,
    collections,
    currentPage,
    onPageChange,
    onAdd,
    onDelete,
    onArchive,
    onEdit,
    onSetCollection,
    onAddCollection,
    onDeleteCollection,
    addingBookmark,
}: Props) => {
    const activeBookmarks = bookmarks.filter((b) => !b.archived);

    return (
        <div className="min-h-screen bg-background relative pb-20 md:pb-0">
            {/* Subtle background blobs */}
            <div className="fixed top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 bg-blob" />
            <div className="fixed bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-primary/5 bg-blob" />

            <AppHeader currentPage={currentPage} onPageChange={onPageChange} />

            <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
                {currentPage === "bookmarks" && (
                    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
                        <div className="lg:sticky lg:top-24 lg:self-start">
                            <AddBookmarkCard onAdd={onAdd} loading={addingBookmark} />
                        </div>
                        <BookmarkList
                            bookmarks={activeBookmarks}
                            collections={collections}
                            onDelete={onDelete}
                            onArchive={onArchive}
                            onEdit={onEdit}
                            onSetCollection={onSetCollection}
                        />
                    </div>
                )}

                {currentPage === "collections" && (
                    <CollectionsPage
                        bookmarks={bookmarks}
                        collections={collections}
                        onDelete={onDelete}
                        onArchive={onArchive}
                        onEdit={onEdit}
                        onSetCollection={onSetCollection}
                        onAddCollection={onAddCollection}
                        onDeleteCollection={onDeleteCollection}
                    />
                )}

                {currentPage === "archive" && (
                    <ArchivePage
                        bookmarks={bookmarks}
                        onDelete={onDelete}
                        onArchive={onArchive}
                    />
                )}

                {currentPage === "profile" && (
                    <ProfilePage bookmarks={bookmarks} collections={collections} />
                )}
            </main>

            <BottomNav currentPage={currentPage} onPageChange={onPageChange} />
        </div>
    );
};

export default Dashboard;
