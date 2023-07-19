import { ClientLayout } from './ClientLayout';
import Footer from './footer/page';
import './globals.css';
import Navigation from './navigation/page';
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
          <Navigation></Navigation>
          <main>
            <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 min-h-full">
              {children}
            </div>
          </main>
          <Footer></Footer>
        </ClientLayout>
      </body>
    </html>
  );
}
