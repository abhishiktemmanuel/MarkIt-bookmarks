import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Initial session sync for Browser Extension environment
    const _chrome = typeof window !== 'undefined' ? (window as any).chrome : undefined;
    if (_chrome && _chrome.runtime && _chrome.runtime.id) {
        _chrome.storage.local.get(['supabaseSession'], (result: any) => {
            if (result.supabaseSession) {
                client.auth.setSession(result.supabaseSession);
            }
        });
    }


    return client;
}

