/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  // url: "upspot-service-worker.js",

})
const nextConfig = {
  
  images: {
    domains: [
      "upspotacademy.com",
      "d3pfm9xu0r429a.cloudfront.net",
      "lh3.googleusercontent.com",
    ],
  },
  swcMinify: false,
  future: { webpack5: true },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      config.resolve.alias.canvas = false
      config.resolve.alias['worker-loader'] = false
      config.resolve.alias.encoding = false
      return config
  },
  
};

module.exports = withPWA(nextConfig)

