'use client';

import supabaseClient from '@/utils/supabase-browser';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo/Logo';
import Button from '@/components/ui/Button/Button';
import toast from 'react-hot-toast';
import { PassResetForm } from '@/app/(home)/profile/forms/password-reset-form';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export default function Login() {
  const searchParams = useSearchParams();
  const [isActivated, setIsActivated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const tokenHash = searchParams.get('hashed_token');
  const verifyAccount = async () => {
    setIsLoading(true);
    const { error } = await supabaseClient.auth.verifyOtp({
      token_hash: tokenHash,
      type: 'email'
    });
    if (error) {
      toast.error(`Ekki tókst að virkja aðgang: ${error.message}`);
    }
    setIsActivated(true);

    toast.success('Aðgangur virkjaður!');
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white rounded-lg shadow-lg">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-center">
            <Logo width={250} variant="blue"></Logo>
          </div>
          <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-company text-center py-4">
            Mínar síður {!isActivated && <>| Virkja aðgang</>}
          </h2>
          {!isActivated && (
            <p className="text-sm text-company text-muted-foreground w-full text-center">
              Til þess að virkja aðgang þá þarftu að smella á takkan hér að
              neðan og velja þér lykilorð.
            </p>
          )}
          {isActivated ? (
            <div className="text-center pt-4">
              <PassResetForm redirectToURLOnSuccess="/"></PassResetForm>
            </div>
          ) : (
            <div className="flex justify-center w-100 pt-4">
              <Button size="xl" onClick={verifyAccount}>
                {isLoading ? <Spinner></Spinner> : <>Virkja aðgang</>}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
