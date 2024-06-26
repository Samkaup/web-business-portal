'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import supabaseClient from '@/utils/supabase-browser';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/Shadcn/ui/form';
import toast from 'react-hot-toast';
import { getURL } from '@/lib/utils';
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/Shadcn/ui/alert';
import { Terminal } from 'lucide-react';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import Button from '@/components/ui/Button/Button';
import TextInput from '@/components/ui/Input/textInput';

const formSchema = z.object({
  email: z.string().email({ message: 'Netfang ekki á réttu formi.' })
});

type EmailFormSchema = z.infer<typeof formSchema>;

export function EmailResetForm() {
  const queryClient = useQueryClient();
  const { data: userProfile, isSuccess } = useGetProfile();

  const form = useForm<EmailFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  });

  useEffect(() => {
    if (isSuccess) {
      form.reset({
        email: userProfile.user.email
      });
    }
  }, [userProfile]);

  const onSubmit = (values: EmailFormSchema) => {
    supabaseClient.auth
      .updateUser(
        {
          email: values.email
        },
        { emailRedirectTo: `${getURL()}auth/login` }
      )
      .then(({ error }) => {
        if (error) {
          toast.error('Ekki var hægt að uppfæra netfangið');
          console.error(error);
          return;
        }
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        toast.success('Netfang uppfært.');
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Breyta netfang</FormLabel>
              <FormControl>
                <div className="flex flex-col w-full items-start justify-start gap-2 md:flex-row">
                  <TextInput
                    {...field}
                    type="email"
                    placeholder="Netfang"
                    className="w-full"
                  />
                  <Button
                    type="submit"
                    disabled={
                      form.getValues().email === userProfile?.user?.email
                    }
                  >
                    Uppfæra
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Þetta er það netfang sem þú notar til að skrá þig inn á vefinn.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      {userProfile?.user?.new_email && (
        <Alert variant="default">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Hey!</AlertTitle>
          <AlertDescription>
            Tölvupóstur hefur verið sendur á netfangið{' '}
            {userProfile.user.new_email} til að staðfesta.
          </AlertDescription>
        </Alert>
      )}
    </Form>
  );
}
