// next.config.ts
import type { NextConfig } from "next";

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true, 
  skipWaiting: true,
});


const nextConfig: NextConfig = withPWA({
  
});


export default nextConfig;
