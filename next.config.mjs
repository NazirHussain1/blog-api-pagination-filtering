/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    domains: ["res.cloudinary.com"], // <-- allow Cloudinary images
  },
};

export default nextConfig;
