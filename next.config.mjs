/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "res.cloudinary.com"
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "**"
      }
    ]
  }
};

export default nextConfig;
