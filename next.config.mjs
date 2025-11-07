/*
*file-summary*
PATH: next.config.mjs
PURPOSE: Configure Next.js for static export builds.
SUMMARY: Enables full static export and disables image optimization for compatibility with non-SSR hosting environments.
IMPORTS: None (uses JSDoc type import for NextConfig)
EXPORTS: nextConfig (default)
*/


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
