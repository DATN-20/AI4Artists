/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.nightcafe.studio',

      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',

      },
      {
        protocol: 'https',
        hostname: 'images.deepai.org',

      },
      {
        protocol: 'https',
        hostname: '4kwallpapers.com'

      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com'

      }
    ],

  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, stream: false, constants: false };
    return config;
  }

};

export default nextConfig
