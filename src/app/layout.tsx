import './globals.css';
import { ClientLayout } from './ClientLayout';
import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
//
// do not cache this layout
export const revalidate = 0;

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  initals: 'TC',
  selectedCompany: 'Samherji hf.',
};
const navLinks = [
  { name: 'Heim', href: '#', current: true },
  { name: 'Hreyfingaryfirlit', href: '/transactions', current: false },
  { name: 'Úttektaraðilar', href: '#', current: false },
  { name: 'Stillingar fyrirtækis', href: '#', current: false },
];
const userNavLinks = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
];

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
          <Navigation
            user={user}
            navigation={navLinks}
            userNavigation={userNavLinks}
          ></Navigation>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 ">
                {children}
              </div>
            </main>
            <Footer></Footer>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
