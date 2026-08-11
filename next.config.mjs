/** @type {import('next').NextConfig} */
const isDevelopment = process.env.NODE_ENV !== 'production';
const scriptSources = ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : []), 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com', 'https://kit.fontawesome.com', 'https://ka-f.fontawesome.com'];

const nextConfig = {
  reactCompiler: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), payment=(), usb=()' },
          { key: 'Content-Security-Policy', value: `default-src 'self'; script-src ${scriptSources.join(' ')}; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://api.github.com https://ka-f.fontawesome.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;` },
        ],
      },
    ];
  },
};

export default nextConfig;
