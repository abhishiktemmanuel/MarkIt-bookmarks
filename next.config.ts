import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        dirs: ["src/app", "src/components/AuthPage.tsx", "src/context", "src/hooks", "src/lib"],
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "www.google.com",
                pathname: "/s2/favicons/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                // microlink.io screenshot CDN
                protocol: "https",
                hostname: "api.microlink.io",
            },
            {
                // microlink CDN for cached screenshots
                protocol: "https",
                hostname: "**.microlink.io",
            },
        ],
    },
};

export default nextConfig;
