import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import '@/app/globals.css';

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}