'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button/Button';

export default function Login() {
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');

  const router = useRouter();

  const updatePassValid = (): boolean => {
    let valid = true;

    if (password === '') {
      setPasswordError('Vantar Lykilorð');
      valid = false;
    }
    if (password.length > 72) {
      setPasswordError('Lykilorð má ekki vera lengra en 72 stafir');
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError('Lykilorð má ekki vera styttra en 6 stafir');
      valid = false;
    }
    if (rePassword === '') {
      setRePasswordError('Vantar Lykilorð Aftur');
      valid = false;
    }
    if (password !== rePassword) {
      setRePasswordError('Lykilorðin passa ekki saman');
      valid = false;
    }
    return valid;
  };

  const handleSignUp = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!updatePassValid()) {
      toast.error('Unable to update password');
      return;
    }
    const { error } = await supabaseClient.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error('Unable to update password');
      console.log(error);
      return;
    }

    router.push('/');
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Breyta Lykilorði
          </h2>
          <div className="mt-10">
            <form className="space-y-6">
              <TextInput
                value={password}
                onChange={(value) => setPassword(value as string)}
                name="password"
                type="password"
                autoComplete="current-password"
                label="Lykilorð"
                isError={passwordError.length !== 0}
                errorText={passwordError}
                placeholder="Nýja lykilorðið"
              />
              <TextInput
                value={rePassword}
                onChange={(value) => setRePassword(value as string)}
                name="password"
                type="password"
                autoComplete="current-password"
                label="Lykilorð Aftur"
                isError={rePasswordError.length !== 0}
                errorText={rePasswordError}
                placeholder="Nýja lykilorðið"
              />
              <div>
                <Button
                  className="w-full flex justify-center"
                  onClick={handleSignUp}
                  type="submit"
                >
                  Senda
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
