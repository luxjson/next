import Script from 'next/script';
import AuthProvider from '../context/AuthContext';
import LegacyHashRedirect from '../components/LegacyHashRedirect';

export const metadata = {
  title: 'LUXJSON',
  description: 'Junior Web Developer specialized in building high-performance systems and digital experiences that surpass expectations.',
  keywords: ['luxjson', 'Junior Web Developer', 'Web Developer', 'High-Performance Systems', 'Front-end', 'React', 'JavaScript', 'Indie Dev', 'Portfolio'],
  metadataBase: new URL('https://luxjson.is-a.dev'),
  alternates: { canonical: 'https://luxjson.is-a.dev' },
  openGraph: {
    type: 'website',
    url: 'https://luxjson.is-a.dev/',
    title: 'luxjson | Official Portfolio',
    description: 'Specialized in building high-performance systems and digital experiences that surpass expectations.',
    images: ['https://luxjson.is-a.dev/og-portfolio.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'luxjson | Official Portfolio',
    description: 'Junior Web Developer specialized in high-performance systems and modern digital experiences.',
    images: ['https://luxjson.is-a.dev/og-portfolio.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="google-site-verification" content="nscaG_3zrzN39iqQ24iLb3O3-gwoyfGmC9Tm6aQUoiU" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/assets/styles/luxjson.css" />
      </head>
      <body>
        <AuthProvider>
          <LegacyHashRedirect />
          {children}
        </AuthProvider>
        <Script src="https://kit.fontawesome.com/2a6c7e9c66.js" crossOrigin="anonymous" strategy="afterInteractive" />
      </body>
    </html>
  );
}
