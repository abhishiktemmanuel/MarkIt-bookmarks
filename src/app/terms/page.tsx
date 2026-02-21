import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
    title: "Terms of Service — MarkIt",
    description: "MarkIt Terms of Service",
};

const LAST_UPDATED = "21 February 2025";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background py-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-10">
                    <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                        <Bookmark className="w-5 h-5" />
                        <span className="font-bold text-lg">MarkIt</span>
                    </Link>
                </div>

                <div className="glass rounded-2xl border border-border p-8 sm:p-10 space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
                        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
                    </div>

                    <Section title="1. Acceptance of Terms">
                        By accessing or using MarkIt (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.
                    </Section>

                    <Section title="2. Description of Service">
                        MarkIt is a personal bookmark manager that allows users to save, organise, and access URLs. The Service requires authentication via a Google account and stores data on your behalf using Supabase infrastructure.
                    </Section>

                    <Section title="3. User Accounts">
                        <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                            <li>You must sign in using a valid Google account.</li>
                            <li>You are responsible for all activity under your account.</li>
                            <li>You must not use the Service for any unlawful purpose.</li>
                            <li>You must not attempt to access other users&apos; data.</li>
                        </ul>
                    </Section>

                    <Section title="4. Your Data">
                        All bookmarks and collections you create are private to your account and are secured using Row Level Security at the database level. You retain full ownership of your data. You may delete your data at any time by deleting your bookmarks and collections within the app.
                    </Section>

                    <Section title="5. Acceptable Use">
                        You agree not to use MarkIt to store, share, or link to content that is illegal, harmful, or violates the rights of others. We reserve the right to suspend accounts that violate these terms.
                    </Section>

                    <Section title="6. Service Availability">
                        We aim to keep the Service available at all times, but we do not guarantee uninterrupted access. The Service may be updated, modified, or discontinued at any time without prior notice.
                    </Section>

                    <Section title="7. Limitation of Liability">
                        MarkIt is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any loss of data, loss of access, or damages arising from your use of the Service.
                    </Section>

                    <Section title="8. Changes to Terms">
                        We may update these Terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised Terms.
                    </Section>

                    <Section title="9. Contact">
                        If you have questions about these Terms, please reach out via the contact information available on our website.
                    </Section>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy →
                        </Link>
                        <Link href="/" className="hover:text-primary transition-colors">
                            Back to MarkIt
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-2">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
        </div>
    );
}
