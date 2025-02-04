/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["yt3.googleusercontent.com"], // Permite carregar imagens externas do YouTube
        minimumCacheTTL: 31536000, // Cache de 1 ano (31536000 segundos)
    },
    async headers() {
        return [
            {
                source: "/:path*", // Aplica a todas as rotas, exceto imagens do next/image
                headers: [
                    {
                        key: "Cache-Control",
                        value: "no-store, no-cache, must-revalidate, proxy-revalidate",
                    },
                    {
                        key: "Pragma",
                        value: "no-cache",
                    },
                    {
                        key: "Expires",
                        value: "0",
                    },
                    {
                        key: "Surrogate-Control",
                        value: "no-store",
                    },
                ],
            },
            {
                source: "/_next/image", // Cache apenas para imagens otimizadas pelo Next.js
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=31536000, immutable, stale-while-revalidate=604800", // 1 ano de cache com revalidação semanal
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
