import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "via.placeholder.com",
            },
            {
                hostname: "shutterstock.com",
            },
        ],
    },
};

export default nextConfig;
