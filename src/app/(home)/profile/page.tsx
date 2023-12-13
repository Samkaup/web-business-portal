'use client';

import { Separator } from '@/components/Shadcn/ui/separator';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import { PassResetForm } from './forms/password-reset-form';
import { EmailResetForm } from './forms/email-reset-form';
import { useEffect } from 'react';

export default async function Profile() {
  const { data, isSuccess } = useGetProfile();

  useEffect(() => {
    if (isSuccess) {
      console.log(data);
    }
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">
          {isSuccess && data.profile.full_name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Hér getur þú breytt prófíl upplýsingunum þínum.
        </p>
      </div>
      <Separator />
      <EmailResetForm current_email={isSuccess && data.user.email} />
      <Separator />
      <PassResetForm />
    </div>
  );
}
