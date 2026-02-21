import { useState } from "react";
import AuthPage from "@/pages/AuthPage";
import Dashboard from "@/pages/Dashboard";

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon: string;
  createdAt: string;
  collection?: string;
  archived?: boolean;
}

export type AppPage = "bookmarks" | "collections" | "archive" | "profile";

const MOCK_BOOKMARKS: BookmarkItem[] = [
  { id: "1", title: "Design Inspiration - Dribbble", url: "dribbble.com/shots/popular", favicon: "https://www.google.com/s2/favicons?domain=dribbble.com&sz=32", createdAt: "2 hrs ago", collection: "Design" },
  { id: "2", title: "React Documentation", url: "react.dev/learn", favicon: "https://www.google.com/s2/favicons?domain=react.dev&sz=32", createdAt: "5 hrs ago", collection: "Dev" },
  { id: "3", title: "Open Source Projects", url: "github.com/trending", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=32", createdAt: "Yesterday", collection: "Dev" },
  { id: "4", title: "Tailwind CSS Docs", url: "tailwindcss.com/docs", favicon: "https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=32", createdAt: "2 days ago" },
  { id: "5", title: "Portfolio Assets", url: "figma.com/files/recent", favicon: "https://www.google.com/s2/favicons?domain=figma.com&sz=32", createdAt: "3 days ago", collection: "Design" },
];

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(MOCK_BOOKMARKS);
  const [currentPage, setCurrentPage] = useState<AppPage>("bookmarks");
  const [collections, setCollections] = useState<string[]>(["Design", "Dev", "Reading"]);

  const handleAdd = (url: string, title: string) => {
    const domain = url.replace(/https?:\/\//, "").split("/")[0] || url;
    const newBookmark: BookmarkItem = {
      id: Date.now().toString(),
      title: title || domain,
      url: url.replace(/https?:\/\//, ""),
      favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      createdAt: "Just now",
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleDelete = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleArchive = (id: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, archived: !b.archived } : b))
    );
  };

  const handleSetCollection = (id: string, collection: string | undefined) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, collection } : b))
    );
  };

  const handleAddCollection = (name: string) => {
    if (name.trim() && !collections.includes(name.trim())) {
      setCollections((prev) => [...prev, name.trim()]);
    }
  };

  if (!isAuthenticated) {
    return (
      <div onClick={() => setIsAuthenticated(true)}>
        <AuthPage />
      </div>
    );
  }

  return (
    <Dashboard
      bookmarks={bookmarks}
      collections={collections}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onAdd={handleAdd}
      onDelete={handleDelete}
      onArchive={handleArchive}
      onSetCollection={handleSetCollection}
      onAddCollection={handleAddCollection}
    />
  );
};

export default Index;
