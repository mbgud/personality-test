/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./live-survey/**/*"],
  },
};

module.exports = nextConfig;
