import { Analytics } from '@vercel/analytics/react';
import { ClientLayout } from '@/components/ClientLayout';
import './globals.css';
export const revalidate = 0;

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full" suppressHydrationWarning>
      <head />
      <body className="h-full">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
