import { ClientLayout } from '@/components/ClientLayout';
import './globals.css';
export const revalidate = 0;

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full">
      <head />
      <body className="h-full">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
