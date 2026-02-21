"use client";

// A CSS-only shimmer skeleton that matches the exact bookmark list layout.
// Shown while auth is loading OR data is fetching for the first time.

const shimmer = "animate-pulse bg-muted/60 rounded-lg";

const SkeletonRow = () => (
    <div className="flex items-center gap-4 px-4 sm:px-5 py-3.5">
        {/* Favicon placeholder */}
        <div className={`w-9 h-9 rounded-lg ${shimmer}`} />
        {/* Text placeholder */}
        <div className="flex-1 min-w-0 space-y-2">
            <div className={`h-3.5 w-3/5 ${shimmer}`} />
            <div className={`h-3 w-4/5 ${shimmer}`} />
        </div>
        {/* Timestamp placeholder */}
        <div className={`h-3 w-14 hidden sm:block ${shimmer}`} />
        {/* Actions placeholder */}
        <div className={`h-6 w-6 rounded ${shimmer}`} />
    </div>
);

const SkeletonAddCard = () => (
    <div className="glass rounded-2xl p-5 sm:p-6 space-y-4">
        {/* Header */}
        <div className={`h-4 w-36 ${shimmer}`} />
        {/* URL label + input */}
        <div className="space-y-2">
            <div className={`h-3 w-10 ${shimmer}`} />
            <div className={`h-10 w-full rounded-xl ${shimmer}`} />
        </div>
        {/* Title label + input */}
        <div className="space-y-2">
            <div className={`h-3 w-10 ${shimmer}`} />
            <div className={`h-10 w-full rounded-xl ${shimmer}`} />
        </div>
        {/* Button */}
        <div className={`h-11 w-full rounded-xl ${shimmer}`} />
    </div>
);

const SkeletonHeader = () => (
    <div className="flex items-center gap-3 mb-4">
        <div className={`h-5 w-40 ${shimmer}`} />
        <div className={`h-5 w-14 rounded-full ${shimmer}`} />
    </div>
);

export const SkeletonDashboard = () => (
    <div className="min-h-screen bg-background">
        {/* App Header skeleton */}
        <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/80 backdrop-blur flex items-center justify-between px-4 sm:px-6">
            <div className={`h-6 w-24 ${shimmer}`} />
            <div className="flex items-center gap-3">
                <div className={`h-8 w-24 rounded-xl ${shimmer}`} />
                <div className={`h-8 w-8 rounded-full ${shimmer}`} />
            </div>
        </div>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 lg:gap-8">
                {/* Add card skeleton */}
                <div className="lg:sticky lg:top-24 lg:self-start">
                    <SkeletonAddCard />
                </div>

                {/* Bookmark list skeleton */}
                <div>
                    <SkeletonHeader />
                    <div className="bg-card rounded-2xl border border-border divide-y divide-border">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <SkeletonRow key={i} />
                        ))}
                    </div>
                </div>
            </div>
        </main>
    </div>
);
