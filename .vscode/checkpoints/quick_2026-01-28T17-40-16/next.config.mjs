/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cloudinary.com", // your Cloudinary domain
      },
    ],
  },
};

export default nextConfig;
