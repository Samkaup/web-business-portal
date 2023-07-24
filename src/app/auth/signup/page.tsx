'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import type { Database } from '@/lib/database.types';
import TextInput from '@/components/Input/textInput';
import Link from 'next/link';

export default function Login() {
  const [fullName, setFullName] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [phoneNr, setPhoneNr] = useState('');
  const [phoneNrError, setPhoneNrError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const signUpValid = (): boolean => {
    let valid = true;

    if (fullName === '') {
      setFullNameError('Vantar Fullt Nafn!');
      valid = false;
    }
    if (phoneNr === '') {
      setPhoneNrError('Vantar Síma númer!');
      valid = false;
    }
    if (email === '') {
      setEmailError('Vantar Netfang!');
      valid = false;
    }
    if (password !== rePassword) {
      setRePassword('Lykilorðin passa ekki saman');
      valid = false;
    }
    if (password === '') {
      setPasswordError('Vantar Lykilorð');
      valid = false;
    }
    if (rePassword === '') {
      setRePasswordError('Vantar Lykilorð Aftur');
      valid = false;
    }
    return valid;
  };

  const handleSignUp = async () => {
    if (!signUpValid()) {
      console.log('Invalid');
      return;
    }
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Nýskráning
          </h2>
          <div className="mt-10">
            <form action="#" method="POST" className="space-y-6">
              <TextInput
                value={fullName}
                onChange={setFullName}
                name="fullName"
                type="name"
                label="Fullt Nafn"
                autoComplete="given-name"
                placeholder="Jón Jónsson"
                errorText={fullNameError}
              />
              <TextInput
                value={phoneNr}
                onChange={setPhoneNr}
                name="phoneNr"
                type="tel"
                autoComplete="tel"
                label="Síma Númer"
                placeholder="7771234"
                errorText={phoneNrError}
              />
              <TextInput
                value={email}
                onChange={setEmail}
                name="email"
                type="email"
                autoComplete="email"
                label="Netfang"
                placeholder="you@example.com"
                errorText={emailError}
              />
              <TextInput
                value={password}
                onChange={setPassword}
                name="password"
                type="password"
                autoComplete="current-password"
                label="Lykilorð"
                placeholder="**************"
                errorText={passwordError}
              />
              <TextInput
                value={rePassword}
                onChange={setRePassword}
                name="password"
                type="password"
                autoComplete="current-password"
                label="Lykilorð Aftur"
                placeholder="**************"
                errorText={rePasswordError}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm leading-6 text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={handleSignUp}
                >
                  Nýskrá
                </button>
                <div className="mt-3">
                  <div className="relative">
                    <div
                      className="absolute inset-0 flex items-center"
                      aria-hidden="true"
                    >
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-sm font-medium leading-6">
                      <span className="bg-white px-6 text-gray-900">
                        eða búa til aðgang
                      </span>
                    </div>
                  </div>

                  <div>
                    <Link
                      href="/login"
                      className="flex w-full justify-center rounded-md bg-indigo-50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                    >
                      Inskrá
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
