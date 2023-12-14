'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import Link from 'next/link';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/ui/Button/Button';
import AlertWithDescription from '@/components/ui/Alert/AlertWithDescription';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setLoading(true);
    let description = '';

    if (email.length === 0 || password.length === 0) {
      if (email.length === 0) {
        setEmailError(true);
        description = 'Vantar netfang';
      }
      if (password.length === 0) {
        setPasswordError(true);

        if (description.length) description = description + ' og lykilorð';
        else description = 'Vantar lykilorð';
      }
      setLoading(false);
    } else {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setEmailError(true);
        setPasswordError(true);
        setLoading(false);
        description = 'Rangt netfang eða lykilorð';
      } else router.refresh();
    }
    setErrorDescription(description);
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg shadow-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <Logo width={250} variant="blue"></Logo>
          </div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-company text-center">
            Mínar síður | Innskráning
          </h2>
          <p className="text-sm text-company text-muted-foreground w-full text-center">
            Kerfið er í prófun. Hafið samband í síma 421-5400 fyrir aðstoð
          </p>
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
              {(emailError || passwordError) && (
                <AlertWithDescription
                  title="Villa"
                  type="error"
                  description={errorDescription}
                />
              )}

              <div className="text-sm leading-6">
                <Link
                  href="/auth/forgot-password"
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
                  <div className="flex gap-2 justify-center">
                    Skrá inn {loading && <Spinner />}
                  </div>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
