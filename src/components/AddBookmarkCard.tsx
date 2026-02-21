import { useState } from "react";
import { Link, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onAdd: (url: string, title: string) => void;
}

const AddBookmarkCard = ({ onAdd }: Props) => {
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    onAdd(url.trim(), title.trim());
    setUrl("");
    setTitle("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <Link className="w-5 h-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Save a new link</h2>
        </div>

        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste link here..."
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow mb-4"
        />

        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give it a name..."
          className="w-full rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow mb-5"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          disabled={!url.trim()}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:glow-primary transition-shadow"
        >
          <Zap className="w-4 h-4" />
          Add Bookmark
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddBookmarkCard;
