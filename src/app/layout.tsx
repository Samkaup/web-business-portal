import './globals.css';
import { ClientLayout } from './ClientLayout';
import Footer from '@/components/Footer/Footer';
import Navigation from '../components/Navigation/Navigation';
// do not cache this layout
export const revalidate = 0;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full">
      <head />
      <body className="h-full">
        <ClientLayout>
          <Navigation />
          <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 min-h-full">
              {children}
            </div>
          </main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
