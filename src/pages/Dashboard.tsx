import { useState } from "react";
import AppHeader from "@/components/AppHeader";
import AddBookmarkCard from "@/components/AddBookmarkCard";
import BookmarkList from "@/components/BookmarkList";

export interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  favicon: string;
  createdAt: string;
}

const MOCK_BOOKMARKS: BookmarkItem[] = [
  { id: "1", title: "Design Inspiration - Dribbble", url: "dribbble.com/shots/popular", favicon: "https://www.google.com/s2/favicons?domain=dribbble.com&sz=32", createdAt: "2 hrs ago" },
  { id: "2", title: "React Documentation", url: "react.dev/learn", favicon: "https://www.google.com/s2/favicons?domain=react.dev&sz=32", createdAt: "5 hrs ago" },
  { id: "3", title: "Open Source Projects", url: "github.com/trending", favicon: "https://www.google.com/s2/favicons?domain=github.com&sz=32", createdAt: "Yesterday" },
  { id: "4", title: "Tailwind CSS Docs", url: "tailwindcss.com/docs", favicon: "https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=32", createdAt: "2 days ago" },
  { id: "5", title: "Portfolio Assets", url: "figma.com/files/recent", favicon: "https://www.google.com/s2/favicons?domain=figma.com&sz=32", createdAt: "3 days ago" },
];

const Dashboard = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(MOCK_BOOKMARKS);

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

  return (
    <div className="min-h-screen bg-background relative">
      {/* Subtle background blobs */}
      <div className="fixed top-[-5%] right-[-5%] w-[30%] h-[30%] bg-primary/5 bg-blob" />
      <div className="fixed bottom-[-5%] left-[-5%] w-[25%] h-[25%] bg-primary/5 bg-blob" />

      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <AddBookmarkCard onAdd={handleAdd} />
          </div>
          <BookmarkList bookmarks={bookmarks} onDelete={handleDelete} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
