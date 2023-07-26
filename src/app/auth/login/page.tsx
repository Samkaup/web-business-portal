'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TextInput from '@/components/Input/textInput';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    let emailHasError = email.length === 0;
    let passwordHasError = password.length === 0;

    if (!emailHasError && !passwordHasError) {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        emailHasError = true;
        passwordHasError = true;
      } else router.refresh();
    }

    setEmailError(emailHasError);
    setPasswordError(passwordHasError);
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Inskráning
          </h2>
          <div className="mt-10">
            <form action="#" method="POST" className="space-y-6">
              <TextInput
                value={email}
                onChange={setEmail}
                name="email"
                type="email"
                autoComplete="email"
                label="Netfang"
                placeholder="you@example.com"
                isError={emailError}
              />
              <TextInput
                value={password}
                onChange={setPassword}
                name="password"
                type="password"
                autoComplete="current-password"
                label="Lykilorð"
                placeholder="**************"
                isError={passwordError}
              />

              <div className="text-sm leading-6">
                <Link
                  href="/auth/forgotPassword"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleSignIn}
                >
                  Inskrá
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
