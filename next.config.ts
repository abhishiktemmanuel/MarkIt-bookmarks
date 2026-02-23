import type { NextConfig } from "next";

const isExtension = process.env.IS_EXTENSION_BUILD === 'true';

const nextConfig: NextConfig = {
    output: isExtension ? 'export' : undefined,
    images: {
        unoptimized: isExtension,
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
                protocol: "https",
                hostname: "api.microlink.io",
            },
            {
                protocol: "https",
                hostname: "**.microlink.io",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
        dirs: ["src/app", "src/components/AuthPage.tsx", "src/context", "src/hooks", "src/lib"],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};



export default nextConfig;

