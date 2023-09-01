'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/ui/Button/Button';

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
        <div className="mx-auto w-full max-w-sm lg:w-96 ">
          <div className="flex justify-center">
            <Logo width={250} variant="blue"></Logo>
          </div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 text-center">
            Innskráning
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
              <TextInput
                value={password}
                onChange={(value) => setPassword(value as string)}
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
                  className="font-semibold text-company-900 hover:text-company-800"
                >
                  Gleymt lykilorð?
                </Link>
              </div>

              <div>
                <Button
                  className="w-full flex justify-center"
                  onClick={handleSignIn}
                >
                  Skrá inn
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
