import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "via.placeholder.com",
            },
            {
                hostname: "www.shutterstock.com",
            },
            {
                hostname: "res.cloudinary.com",
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: "/api/:path*", // Match API routes
                destination: "http://localhost:3001/api/:path*", // Redirect to backend
            },
        ];
    },
};

export default nextConfig;