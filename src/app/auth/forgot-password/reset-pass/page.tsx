'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import TextInput from '@/components/ui/Input/textInput';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button/Button';
import { LockOpenIcon } from '@heroicons/react/24/outline';

export default function ResetPass() {
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [rePasswordError, setRePasswordError] = useState('');

  const router = useRouter();

  const updatePassValid = (): boolean => {
    let valid = true;

    if (password === '') {
      setPasswordError('Vantar lykilorð');
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
      setRePasswordError('Vantar seinna lykilorð til staðfestingar ');
      valid = false;
    }
    if (password !== rePassword) {
      setRePasswordError('Lykilorðin passa ekki saman');
      valid = false;
    }
    return valid;
  };

  const handleResetPass = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!updatePassValid()) {
        toast.error('Tókst ekki að uppfæra lykilorð');
        setLoading(false);
        return;
      }
      const { error } = await supabaseClient.auth.updateUser({
        password: password
      });
      setLoading(false);

      if (error) {
        toast.error('Tókst ekki að uppfæra lykilorð');
        console.error(error);
        return;
      }
      router.push('/');
    } catch (e) {
      toast.error('Tókst ekki að uppfæra lykilorð');
      setLoading(false);
      console.error(e);
      return;
    }
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-8 text-2xl flex justify-center  items-center text-center font-bold leading-9 tracking-tight text-gray-900">
            Veldu nýtt lykilorð
            <LockOpenIcon className="ml-2 w-6 h-6"></LockOpenIcon>
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
                label="Staðfestu lykilorðið"
                isError={rePasswordError.length !== 0}
                errorText={rePasswordError}
                placeholder="Nýja lykilorðið"
              />
              <div>
                <Button
                  isLoading={isLoading}
                  className="w-full flex justify-center"
                  onClick={handleResetPass}
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
