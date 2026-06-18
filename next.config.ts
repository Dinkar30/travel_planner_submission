/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This tells Vercel: "Build the site even if there are type errors."
    ignoreBuildErrors: true,
  },
  eslint: {
    // This tells Vercel: "Build the site even if there are linting warnings."
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;