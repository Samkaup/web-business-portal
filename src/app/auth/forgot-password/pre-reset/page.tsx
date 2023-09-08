import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/ui/Button/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { redirect } from 'next/navigation';

type Props = {
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function Reset({ searchParams }: Props) {
  if (!searchParams?.resetLink) redirect('/auth/login');

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96 ">
          <div className="flex justify-center">
            <Logo width={250} variant="blue"></Logo>
          </div>
          <div className="mt-5">
            <Link
              href={`${searchParams?.resetLink}`}
              className="font-semibold text-company-900 hover:text-company-800"
            >
              <Button className="w-full flex justify-center gap-1">
                Breyta lykilorði
                <ArrowRightIcon className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
