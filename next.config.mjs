/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  agentRules: false,
  trailingSlash: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
  images: { unoptimized: true },
};

export default config;
