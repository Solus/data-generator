/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure the project for static export
  output: 'export',

  // The directory where the exported site will be generated
  distDir: 'docs',

  // The base path for the project on GitHub Pages
  basePath: '/data-generator',

  // The asset prefix to ensure assets are loaded correctly from the sub-path
  assetPrefix: '/data-generator/',

  // It's a good practice to disable image optimization for static exports if not using a custom loader
  images: {
    unoptimized: true,
  },
};

export default nextConfig;