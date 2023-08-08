import Image from 'next/image';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen">
      <Image
        src="/images/Samkaup_litrík_dama.jpg"
        alt="samkaup background"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-company-900/50 backdrop-brightness-50">
        {children}
      </div>
    </div>
  );
}
