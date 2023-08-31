'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import { toast } from 'react-hot-toast';
import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import { ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (email.length === 0) {
      toast.error('Missing email');
      setEmailError(true);
      return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/profile/updatePassword`,
    });

    if (error) {
      console.log(error);
      toast.error('Unable to send email');
      setEmailError(true);
    } else setRequestSent(true);
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <Logo width={250} variant="blue"></Logo>
          </div>
          {requestSent ? (
            <div className="flex flex-col gap-8 justify-between">
              <div className="flex flex-col gap-4 justify-between">
                <div className="flex items-center justify-evenly">
                  <EnvelopeIcon className="h-10 w-10" />
                  <h2 className="text-2xl font-bold leading-9 tracking-tight text-gray-600">
                    Opnaðu Tölvupóstinn Þinn
                  </h2>
                </div>
                <p className="text-lg tracking-tight text-gray-600 text-center">
                  Við höfum sent þér leyðbeingar til að breyta lykilorðinu þínu
                  á tölvupóstinn <b>{email}</b>
                </p>
              </div>

              <p className="text-center text-sm">
                Enginn tölvupóstur í innhólfinu þínu? Kíktu í "Spam/Junk"
                möppuna eða{' '}
                <a
                  onClick={() => {
                    setRequestSent(false);
                    setEmail('');
                  }}
                  className="font-semibold text-company-900 hover:text-company-800 cursor-pointer"
                >
                  reyndu annan tölvupóst
                </a>
              </p>
            </div>
          ) : (
            <>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-600 text-center">
                Breyta lykilorði
              </h2>
              <div className="mt-10">
                <form action="#" method="POST" className="space-y-6">
                  <TextInput
                    value={email}
                    onChange={(value) => setEmail(value as string)}
                    name="email"
                    type="email"
                    autoComplete="email"
                    label="Netfang"
                    placeholder="Netfangið þitt"
                    isError={emailError}
                  />

                  <div>
                    <button
                      type="submit"
                      className="mt-8 flex w-full justify-center rounded-md bg-company px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-company"
                      onClick={handleResetPassword}
                    >
                      Áfram
                    </button>
                  </div>

                  <div className="text-sm leading-6 flex justify-center">
                    <Link
                      href="/auth/login"
                      className="font-semibold text-company hover:text-company-800 inline-flex items-center"
                    >
                      <ArrowLeftIcon className="w-4 h-4 ml-4" />
                      Til baka
                    </Link>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
