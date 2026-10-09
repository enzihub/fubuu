import path from 'node:path';

// FUBUU_DEMO=1 swaps Clerk for a local stand-in (src/demo/) so the app can run
// on your machine with invented data and no third-party accounts.
const demo = process.env.FUBUU_DEMO === '1';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    if (demo) {
      const d = path.resolve(process.cwd(), 'src/demo');
      config.resolve.alias = {
        ...config.resolve.alias,
        '@clerk/nextjs/server$': path.join(d, 'clerk-server-mock.ts'),
        '@clerk/nextjs$': path.join(d, 'clerk-mock.tsx'),
        '@clerk/themes$': path.join(d, 'clerk-themes-mock.ts'),
      };
    }
    return config;
  },
};

export default nextConfig;
