/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Sample photos for the mock homepage; real photos will come from Supabase Storage.
    remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }],
  },
};

export default nextConfig;
