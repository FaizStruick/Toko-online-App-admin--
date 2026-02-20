/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
            },
        ],
    },
    typescript: {
    ignoreBuildErrors: true,
    },
    eslint: {
    // Mengabaikan error linting (seperti set-state-in-effect) saat build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
