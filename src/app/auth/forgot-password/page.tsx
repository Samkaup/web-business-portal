'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import { toast } from 'react-hot-toast';
import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button/Button';
import OTPInput from '@/components/Inputs/OTPInput';
import { useRouter } from 'next/navigation';
import { getURL } from '@/lib/utils';

export default function Login() {
  const router = useRouter();
  const [isLoading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  const handleVerifyOTP = async (token: string) => {
    if (!token) return false;

    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token,
      type: 'email'
    });

    if (data?.session && !error) {
      router.push('/auth/forgot-password/reset-pass');
      return;
    }

    console.error(error);
    toast.error('Auðkenniskóði ekki gildur, reyndu aftur');
    setEmailError(true);
  };

  const handleResetPassword = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);

    if (email.length === 0) {
      toast.error('Vantar netfang');
      setEmailError(true);
      return;
    }

    supabaseClient.auth
      .resetPasswordForEmail(email, {
        redirectTo: `${getURL()}auth/forgot-password/reset-pass`
      })
      .then(({ error }) => {
        if (error) {
          toast.error(error.message);
          setEmailError(true);
          return;
        }
        setRequestSent(true);
      })
      .finally(() => {
        setLoading(false);
      });
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
                    Opnaðu tölvupóstinn þinn
                  </h2>
                </div>
                <p className="text-lg tracking-tight text-gray-600 text-center">
                  Við höfum sent þér 6-stafa auðkenniskóða á netfangið{' '}
                  <b>{email}</b> til að breyta lykilorðinu þínu
                </p>
              </div>

              <OTPInput onAction={handleVerifyOTP}></OTPInput>

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
                    <Button
                      size="lg"
                      isLoading={isLoading}
                      className="w-full flex justify-center gap-1"
                      onClick={handleResetPassword}
                    >
                      Áfram
                      <ArrowRightIcon className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-sm leading-6 flex justify-center">
                    <Link
                      href="/auth/login"
                      className="font-semibold text-company hover:text-company-800 inline-flex items-center gap-1"
                    >
                      <ArrowLeftIcon className="w-4 h-4" />
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
