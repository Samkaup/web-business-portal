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
        className="absolute inset-0 object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/50 backdrop-brightness-75 z-10"></div>
      <div className="relative z-10 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg shadow-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col items-center">{children}</div>
        </div>
      </div>
    </div>
  );
}
