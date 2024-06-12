import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/Shadcn/ui/form';
import Button from '@/components/ui/Button/Button';
import TextInput from '@/components/ui/Input/textInput';
import { TableRow } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import supabaseClient from '@/utils/supabase-browser';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatSsn } from '@/utils/string';
import { useQueryClient } from '@tanstack/react-query';

type Props = {
  company: TableRow<'company'>;
  onCancel?: () => void;
  onSave?: () => void;
};

const companySchema = z.object({
  name: z.string({
    required_error: 'Vantar fullt nafn'
  }),
  address: z
    .string({
      required_error: 'Vantar heimilisfang'
    })
    .min(1, 'Vantar heimilisfang'),
  city: z
    .string({
      required_error: 'Vantar borg'
    })
    .min(1, 'Vantar borg'),
  post_code: z
    .string({
      required_error: 'Vantar póstnúmer'
    })
    .min(3, 'Póstnúmer verður að vera nákvæmlega 3 stafir')
    .max(3, 'Póstnúmer verður að vera nákvæmlega 3 stafir'),
  address_2: z.string().nullable().optional()
});

type CompanyFormValues = z.infer<typeof companySchema>;

export default function CompanyForm({ company, onCancel, onSave }: Props) {
  const form = useForm({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
    defaultValues: {
      name: company.name,
      address: company.address,
      city: company.city,
      post_code: company.post_code,
      address_2: company.address_2
    }
  });

  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: CompanyFormValues) => {
    setLoading(true);
    const { error } = await supabaseClient
      .from('company')
      .update(data)
      .eq('external_identifier', company.external_identifier);

    if (error) {
      toast.error('Ekki var hægt að uppfæra netfangið :(');
      console.error(error);
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['company-infinite'] });

    setLoading(false);
    toast.success('Fyrirtæki uppfært!');
    onSave && onSave();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 space-y-3">
        <div className="w-full text-align">
          <h1 className="text-xl font-bold">
            {formatSsn(company.external_identifier)}
          </h1>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nafn *</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder="Jón Jónsson" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heimilisfang *</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder="Laugavegur 1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borg *</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder="Reykjavík" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="post_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Póstnúmer *</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder="101" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Heimilisfang 2</FormLabel>
              <FormControl>
                <TextInput {...field} placeholder="Hæð 2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" secondary onClick={onCancel}>
            Hætta við
          </Button>
          <Button type="submit" isLoading={loading}>
            Uppfæra
          </Button>
        </div>
      </form>
    </Form>
  );
}
