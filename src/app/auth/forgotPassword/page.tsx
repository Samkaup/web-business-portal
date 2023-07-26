'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useState } from 'react';

import TextInput from '@/components/Input/textInput';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);

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
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Breyta Lykilorði
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

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleResetPassword}
                >
                  Senda Tölvupóst
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
