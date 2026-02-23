import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // Développement local Laravel
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8000',
                pathname: '/storage/**',
            },
            // Production Infomaniak
            {
                protocol: 'https',
                hostname: 'api.voiloo.fr',
                // ✅ Correction : On autorise tout ce qui est dans /back/ pour éviter les soucis avec /public/
                pathname: '/**',
            },
            // Unsplash
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    turbopack: {
        rules: {
            '*.svg': {
                loaders: ['@svgr/webpack'],
                as: '*.js',
            },
        },
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
};

export default nextConfig;