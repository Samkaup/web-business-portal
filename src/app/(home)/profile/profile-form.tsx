'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'react-hot-toast';

import supabaseClient from '@/utils/supabase-browser';
import Button from '@/components/ui/Button/Button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/Shadcn/ui/form';
import { Input } from '@/components/Shadcn/ui/input';

const resetPassSchema = z
  .object({
    password: z
      .string({
        required_error: 'Vantar Lykilorð'
      })
      .min(6, {
        message: 'Lykilorð má ekki vera styttra en 6 stafir'
      })
      .max(72, {
        message: 'Lykilorð má ekki vera lengra en 72 stafir'
      }),
    confirmPassword: z.string({
      required_error: 'Vantar Lykilorð Aftur'
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Lykilorðin passa ekki saman'
  });

type ProfileFormValues = z.infer<typeof resetPassSchema>;

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(resetPassSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data: ProfileFormValues) => {
    const { error } = await supabaseClient.auth.updateUser({
      password: data.password
    });

    if (error) {
      toast.error('Ekki er hægt að uppfæra lykilorð');
      console.error(error);
      return;
    }

    form.reset({ password: '', confirmPassword: '' });
    toast.success('Lykilorðið uppfært.');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lykilorð</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lykilorð Aftur</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Uppfæra lykilorð</Button>
      </form>
    </Form>
  );
}
