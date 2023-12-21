import { ClientLayout } from '@/components/ClientLayout';
import Image from 'next/image';

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Image
        src="/images/Samkaup_litrík_dama.jpg"
        alt="samkaup background"
        fill
        className="absolute inset-0 object-cover "
        priority
      />
      <div className="absolute inset-0 bg-black/50 backdrop-brightness-75 z-10"></div>
      <div className="relative z-10">
        <div className="flex flex-col items-center p-6 ">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </div>
    </div>
  );
}
