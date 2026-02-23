"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    type ReactNode,
} from "react";
import type { User, SupabaseClient } from "@supabase/supabase-js";

interface AuthContextValue {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Lazy singleton — only created when first accessed (runtime, never at build time)
let _supabase: SupabaseClient | null = null;
function getSupabase() {
    if (!_supabase) {
        // Dynamic import to prevent module-level initialization during static build
        const { createClient } = require("@/lib/supabase/client");
        _supabase = createClient();
    }
    return _supabase!;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const supabase = getSupabase();

        const _chrome = typeof window !== 'undefined' ? (window as any).chrome : undefined;
        const isExtension = _chrome && _chrome.runtime && _chrome.runtime.id;

        const initializeAuth = async () => {
            if (isExtension && _chrome.storage && _chrome.storage.local) {
                // Check extension storage first
                _chrome.storage.local.get(['supabaseSession'], async (result: any) => {
                    if (result.supabaseSession) {
                        setUser(result.supabaseSession.user);
                        setLoading(false);
                        
                        const { data, error } = await supabase.auth.setSession({
                            access_token: result.supabaseSession.access_token,
                            refresh_token: result.supabaseSession.refresh_token,
                        });
                        if (error) {
                            console.error('[MarkIt Extension] Failed to set session:', error);
                        }
                        return;
                    }
                    // Fallback to regular getSession if no extension session or error
                    const { data: { session } } = await supabase.auth.getSession();
                    setUser(session?.user ?? null);
                    setLoading(false);
                    if (typeof window !== 'undefined') {
                        window.postMessage({ type: 'SUPABASE_SESSION_SYNC', session }, '*');
                        if (session) window.localStorage.setItem('markit-extension-session', JSON.stringify(session));
                        else window.localStorage.removeItem('markit-extension-session');
                    }
                });
            } else {
                // Regular web app flow
                const { data: { session } } = await supabase.auth.getSession();
                setUser(session?.user ?? null);
                setLoading(false);
                if (typeof window !== 'undefined') {
                    window.postMessage({ type: 'SUPABASE_SESSION_SYNC', session }, '*');
                    if (session) window.localStorage.setItem('markit-extension-session', JSON.stringify(session));
                    else window.localStorage.removeItem('markit-extension-session');
                }
            }
        };

        initializeAuth();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
            
            // Broadcast session for the extension's content script
            if (typeof window !== 'undefined') {
                window.postMessage({ type: 'SUPABASE_SESSION_SYNC', session }, '*');
                if (session) window.localStorage.setItem('markit-extension-session', JSON.stringify(session));
                else window.localStorage.removeItem('markit-extension-session');
            }
        });

        // Listen for extension storage changes (for session sync)
        let storageListener: ((changes: any, areaName: string) => void) | null = null;
        if (_chrome && _chrome.storage && _chrome.storage.onChanged) {
            storageListener = (changes: any, areaName: string) => {
                if (areaName === 'local' && changes.supabaseSession) {
                    const newSession = changes.supabaseSession.newValue;
                    if (newSession) {
                        getSupabase().auth.setSession(newSession);
                    } else {
                        getSupabase().auth.signOut();
                    }
                }
            };
            _chrome.storage.onChanged.addListener(storageListener);
        }

        // Handle incoming requests for session from content scripts
        const messageListener = async (event: MessageEvent) => {
            if (event.source !== window) return;
            if (event.data && event.data.type === 'REQUEST_SUPABASE_SESSION') {
                const { data: { session } } = await supabase.auth.getSession();
                window.postMessage({ type: 'SUPABASE_SESSION_SYNC', session }, '*');
            }
        };
        if (typeof window !== 'undefined') {
            window.addEventListener('message', messageListener);
        }

        return () => {
            subscription.unsubscribe();
            if (_chrome && _chrome.storage && _chrome.storage.onChanged && storageListener) {
                _chrome.storage.onChanged.removeListener(storageListener);
            }
            if (typeof window !== 'undefined') {
                window.removeEventListener('message', messageListener);
            }
        };
    }, []);

    const signInWithGoogle = useCallback(async () => {
        const supabase = getSupabase();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    }, []);

    const signOut = useCallback(async () => {
        const supabase = getSupabase();
        await supabase.auth.signOut();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
