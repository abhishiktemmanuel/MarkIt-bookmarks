"use client";

import { LogOut, Bookmark, FolderOpen, Archive } from "lucide-react";
import { motion } from "framer-motion";
import type { BookmarkItem, Collection } from "@/types";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface Props {
    bookmarks: BookmarkItem[];
    collections: Collection[];
}

const ProfilePage = ({ bookmarks, collections }: Props) => {
    const { user, signOut } = useAuth();
    const totalBookmarks = bookmarks.filter((b) => !b.archived).length;
    const totalArchived = bookmarks.filter((b) => b.archived).length;

    const displayName = user?.user_metadata?.full_name ?? user?.email ?? "User";
    const avatar = user?.user_metadata?.avatar_url as string | undefined;
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            {/* Profile Card */}
            <div className="glass rounded-2xl p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary mx-auto mb-3 overflow-hidden">
                    {avatar ? (
                        <Image src={avatar} alt={displayName} width={64} height={64} className="w-full h-full object-cover" />
                    ) : (
                        initial
                    )}
                </div>
                <h2 className="text-lg font-bold text-foreground">{displayName}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Bookmarks", value: totalBookmarks, icon: Bookmark },
                    { label: "Collections", value: collections.length, icon: FolderOpen },
                    { label: "Archived", value: totalArchived, icon: Archive },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-card rounded-2xl border border-border p-4 text-center">
                        <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                        <p className="text-xl font-bold text-foreground">{value}</p>
                        <p className="text-xs text-muted-foreground">{label}</p>
                    </div>
                ))}
            </div>

            {/* Settings */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden divide-y divide-border">
                <button
                    onClick={signOut}
                    className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-destructive/10 transition-colors text-destructive"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium flex-1 text-left">Sign out</span>
                </button>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
