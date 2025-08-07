import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Required for static site generation (SSG)
  output: 'export', 

  // Optional: A flag to disable the trailing slash
  trailingSlash: true,

  // Set the base path and asset prefix for GitHub Pages.
  // Replace 'your-repo-name' with the actual name of your repository.
  // This is only needed for project pages, not for user/organization pages.
  basePath: isProd ? '/data-generator' : '',
  assetPrefix: isProd ? '/data-generator/' : '',

  // Tell Next.js to output to a folder named 'docs'
  // GitHub Pages can be configured to serve from this folder.
  distDir: 'docs',
};

export default nextConfig;
