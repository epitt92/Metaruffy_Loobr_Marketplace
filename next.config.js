/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        removeConsole: process.env.NODE_ENV !== 'development'
    },
    // reactStrictMode: false,
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        ignoreBuildErrors: true
    },
    images: {
        domains: [
            '*',
            'i.nfte.ai',
            'storage.nfte.ai',
            'logo.nftscan.com',
            'loobr.com',
            'map-api.loobr.com',
            'loobr-prod.s3.eu-central-1.amazonaws.com',
            'ipfs.infura.io',
            'meta-ruffy.s3.amazonaws.com',
            'lh3.googleusercontent.com',
            'metaruffy.infura-ipfs.io',
            'loobr-prod.s3.amazonaws.com',
            'loobr.infura-ipfs.io',
            'memelord-fe.s3.us-east-2.amazonaws.com',
            'ruffy.mypinata.cloud',
            'd1don5jg7yw08.cloudfront.net',
            'airnfts.s3.amazonaws.com',
            'bd.infura-ipfs.io',
            'res.cloudinary.com',
            'source.unsplash.com',
            'cannarillaz.mypinata.cloud',
            'assets.otherside.xyz',
            'images.blur.io'
        ]
        // domains: ['ipfs.infura.io'],
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true
    },
    swcMinify: true,
    // experimental: {
    //   images: {
    //     unoptimized: true
    //   }
    // }
    async headers() {
        return [
            {
                // Apply these headers to all routes in your application.
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    }
                ]
            }
        ];
    }
};

// module.exports = nextConfig;

// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

const { withSentryConfig } = require('@sentry/nextjs');

const moduleExports = {
    ...nextConfig
    // Your existing module.exports
};

const sentryWebpackPluginOptions = {
    // Additional config options for the Sentry Webpack plugin. Keep in mind that
    // the following options are set automatically, and overriding them is not
    // recommended:
    //   release, url, org, project, authToken, configFile, stripPrefix,
    //   urlPrefix, include, ignore

    silent: true // Suppresses all logs
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options.
};

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(moduleExports, sentryWebpackPluginOptions);
