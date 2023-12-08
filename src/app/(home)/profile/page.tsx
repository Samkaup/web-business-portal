'use client';

import { Separator } from '@/components/Shadcn/ui/separator';
import { ProfileForm } from './profile-form';
import { useGetProfile } from '@/utils/react_query_hooks/profile';

export default async function Profile() {
  const { data, isSuccess } = useGetProfile();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{isSuccess && data.full_name}</h3>
        <p className="text-sm text-muted-foreground">
          Hér getur þú breytt prófíl upplýsingunum þínum.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
