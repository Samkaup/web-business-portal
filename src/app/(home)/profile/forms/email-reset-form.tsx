'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import supabaseClient from '@/utils/supabase-browser';
import { Button } from '@/components/Shadcn/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/Shadcn/ui/form';
import { Input } from '@/components/Shadcn/ui/input';
import toast from 'react-hot-toast';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Vantar netfang.' })
    .email({ message: 'Netfang ekki á réttu formi.' }),
});

type EmailFormSchema = z.infer<typeof formSchema>;

type Props = {
  current_email: string;
};

export function EmailResetForm({ current_email }: Props) {
  const form = useForm<EmailFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: EmailFormSchema) => {
    const { error } = await supabaseClient.auth.updateUser({
      email: values.email,
    });

    if (error) {
      toast.error('Ekki var hægt að uppfæra netfangið');
      console.error(error);
      return;
    }

    toast.success('Netfang uppfært.');
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Netfang</FormLabel>
              <FormControl>
                <div className="flex w-full items-center space-x-2">
                  <Input type="email" placeholder={current_email} {...field} />
                  <Button type="submit">Uppfæra</Button>
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
    </Form>
  );
}
