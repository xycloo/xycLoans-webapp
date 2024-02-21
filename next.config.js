const withVideos = require("next-videos");

/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        urlImports: ['https://cdn.plot.ly'],
      },
    images: {
      domains: ["altcoinsbox.com"]
    }
}

module.exports = withVideos(nextConfig)
