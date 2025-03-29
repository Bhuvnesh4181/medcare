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
                source: "/api/:path*", 
                destination: "http://localhost:3001/api/:path*", 
            },
        ];
    },
};

export default nextConfig;