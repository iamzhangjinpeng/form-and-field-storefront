import type { NextConfig } from 'next';
const isStatic = process.env.STATIC_EXPORT === 'true';
const config: NextConfig = {
  ...(isStatic
    ? { output: 'export', basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', trailingSlash: true }
    : {}),
  poweredByHeader: false,
};
export default config;
