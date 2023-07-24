import Image from 'next/image';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-screen">
      <Image
        src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt="Background image"
        fill
        className="absolute inset-0 object-cover"
        priority
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-blue-900/50 backdrop-brightness-50">
        {children}
      </div>
    </div>
  );
}
