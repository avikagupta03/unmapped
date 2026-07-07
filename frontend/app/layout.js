import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'unmapped — Escape the Ordinary',
  description: 'Curated weekend trips and treks across India for the next generation of travelers.',
  keywords: 'weekend trips India, trekking, camping, Himachal Pradesh, adventure travel',
  openGraph: {
    title: 'unmapped — Escape the Ordinary',
    description: 'Curated weekend escapes for the next generation of travelers.',
    type: 'website',
    images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { background: '#1c1c1c', color: '#f5f0ea', border: '1px solid #2a2a2a', borderRadius: '12px', fontSize: '14px' },
              success: { iconTheme: { primary: '#d4a96a', secondary: '#0a0a0a' } },
              error: { iconTheme: { primary: '#f87171', secondary: '#0a0a0a' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
