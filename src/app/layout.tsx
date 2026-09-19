import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yatri Setu | Himalayan Safety Platform',
  description: 'Smart mountain travel safety & corridor telemetry.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-[#F8FAFC] text-slate-900 selection:bg-emerald-600 selection:text-white">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}