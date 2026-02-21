import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy — MarkIt",
    description: "MarkIt Privacy Policy",
};

const LAST_UPDATED = "21 February 2025";

export default function PrivacyPage() {
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
                        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
                        <p className="text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
                    </div>

                    <Section title="1. Overview">
                        MarkIt is designed with privacy as a core principle. We collect the minimum data necessary to operate the Service and never sell or share your data with third parties.
                    </Section>

                    <Section title="2. Information We Collect">
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li>
                                <strong className="text-foreground">Google account information</strong> — When you sign in, Google provides your name, email address, and profile picture. We store this to identify your account.
                            </li>
                            <li>
                                <strong className="text-foreground">Bookmarks and collections</strong> — URLs and titles that you save within the app. This data exists solely to provide the Service to you.
                            </li>
                            <li>
                                <strong className="text-foreground">Usage data</strong> — Standard server logs (IP address, browser type, pages accessed). These are used for security and diagnostics only and are not linked to your identity.
                            </li>
                        </ul>
                    </Section>

                    <Section title="3. How We Use Your Data">
                        <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground">
                            <li>To provide, maintain, and improve the Service</li>
                            <li>To authenticate you and secure your account</li>
                            <li>To sync your bookmarks across devices in real time</li>
                            <li>To diagnose errors and maintain service reliability</li>
                        </ul>
                    </Section>

                    <Section title="4. Data Storage & Security">
                        Your data is stored on Supabase infrastructure (PostgreSQL). Every database query is enforced by Row Level Security — your bookmarks are cryptographically scoped to your account via your signed session token. No one else, including us, can read your bookmarks through the application layer.

                        <p className="mt-2">Authentication is handled entirely by Supabase Auth and Google OAuth. We do not store passwords.</p>
                    </Section>

                    <Section title="5. Data Sharing">
                        We do <strong className="text-foreground">not</strong> sell, rent, or share your personal data with third parties, except:
                        <ul className="list-disc pl-5 mt-2 space-y-1.5 text-muted-foreground">
                            <li><strong className="text-foreground">Supabase</strong> — our database and auth provider, acting as a data processor</li>
                            <li><strong className="text-foreground">Google</strong> — solely for authentication via OAuth</li>
                            <li><strong className="text-foreground">microlink.io</strong> — URLs are sent to generate website preview screenshots when you hover over a bookmark. No personal information is transmitted.</li>
                        </ul>
                    </Section>

                    <Section title="6. Cookies & Sessions">
                        We use a single <code className="text-xs bg-muted px-1.5 py-0.5 rounded">httpOnly</code> session cookie managed by Supabase to keep you signed in. This cookie is inaccessible to JavaScript and cannot be stolen by client-side scripts. We do not use advertising cookies or third-party tracking cookies.
                    </Section>

                    <Section title="7. Data Retention & Deletion">
                        Your data is retained for as long as your account is active. You can delete individual bookmarks and collections at any time within the app. To request full account deletion, contact us and we will permanently remove all data associated with your account within 30 days.
                    </Section>

                    <Section title="8. Your Rights">
                        Depending on your location, you may have rights including access to your data, correction, deletion, and portability. To exercise any of these rights, please contact us.
                    </Section>

                    <Section title="9. Changes to This Policy">
                        We may update this policy from time to time. We will update the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of the Service constitutes acceptance of the revised policy.
                    </Section>

                    <div className="pt-4 border-t border-border flex items-center justify-between text-sm text-muted-foreground">
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service →
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
