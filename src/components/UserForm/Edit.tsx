import TextInput from '../ui/Input/textInput';
import Button from '../ui/Button/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/Shadcn/ui/form';
import { z } from 'zod';
import { CompanySelector } from './CompanySelector';
import { TableRow } from '@/types';
import { useEffect, useState } from 'react';
import { Profile } from '@/utils/react_query_hooks/profile';
import { Button as ShadcnButton } from '@/components/Shadcn/ui/button';
import { TrashIcon } from 'lucide-react';
import { PlusSmallIcon } from '@heroicons/react/24/outline';
import CompanyForm from './CompanyForm';
import { SlideOver } from '../ui/SlideOver/SlideOver';
import toast from 'react-hot-toast';

type Props = {
  onCancel?: () => void;
  onSave?: () => void;
  user: Profile;
};

const userCreationSchema = z.object({
  full_name: z.string({
    required_error: 'Vantar fullt nafn'
  }),
  email: z
    .string({
      required_error: 'Vantar netfang'
    })
    .email({ message: 'Netfang ekki á réttu formi.' })
});

type UserCreationFormValues = z.infer<typeof userCreationSchema>;

type CompanySelector = {
  value: TableRow<'company'> | null;
  isError: boolean;
};

export default function UserEdit({ onCancel, onSave, user }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanySelector[]>([
    { value: null, isError: false }
  ]);

  const [companyNeedingUpdate, setCompanyNeedingUpdate] =
    useState<TableRow<'company'> | null>(null);

  const form = useForm<UserCreationFormValues>({
    resolver: zodResolver(userCreationSchema),
    mode: 'onChange'
  });

  const onSubmit = (data: UserCreationFormValues) => {
    setIsLoading(true);
    const hasError = companies.some((company) => company.value === null);
    if (hasError) {
      setCompanies(
        companies.map((company) => ({
          ...company,
          isError: company.value === null
        }))
      );
      setIsLoading(false);
      return;
    }

    fetch('/api/admin/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...data,
        companies: companies.map((company) => company.value.external_identifier)
      })
    });

    setIsLoading(false);
    toast.success('Notandi hefur verið búinn til!');
    onSave();
  };

  const handleCompanySelect = (index: number, company: TableRow<'company'>) => {
    const companySelector: CompanySelector = {
      value: company,
      isError: false
    };

    setCompanies(
      companies.map((_, idx: number) => (idx === index ? companySelector : _))
    );

    if (companyNeedsUpdate(company)) {
      setCompanyNeedingUpdate(company);
      setIsOpen(true);
    }
  };

  const addCompanySelector = () => {
    setCompanies([...companies, { value: null, isError: false }]);
  };

  const removeCompanySelector = (index: number) => {
    if (companies.length === 1) return;
    setCompanies(companies.filter((_, idx: number) => idx !== index));
  };

  const companyNeedsUpdate = (company: TableRow<'company'>) => {
    return (
      company.name === null ||
      company.credit_limit_amount === null ||
      company.address === null ||
      company.city === null ||
      company.post_code === null
    );
  };

  const onCompanySave = () => {
    setIsOpen(false);
  };

  const onCompanyCancel = (company: TableRow<'company'>) => {
    setCompanies(
      companies.map((companySelector) => {
        if (
          companySelector.value?.external_identifier ===
          company.external_identifier
        )
          return { value: null, isError: true };
        return companySelector;
      })
    );

    setIsOpen(false);
  };

  useEffect(() => {
    form.setValue('full_name', user.full_name);
    form.setValue('email', user.email);
  }, [form, user]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="pt-2 space-y-3">
          <h3 className="text-lg font-medium">Notandi</h3>
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fullt nafn</FormLabel>
                <FormControl>
                  <TextInput {...field} placeholder="Jón Jónsson" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netfang</FormLabel>
                <FormControl>
                  <TextInput {...field} placeholder="jon@mail.is" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h3 className="text-lg font-medium">Fyrirtæki</h3>
          <p className="text-sm text-muted-foreground">
            Veljið fyrirtækin sem notandinn á að hafa aðgang að.
          </p>

          {companies.map((selector: CompanySelector, idx: number) => {
            return (
              <div key={idx}>
                <div className="flex gap-2">
                  <CompanySelector
                    key={idx}
                    selectedCompany={selector.value}
                    onSelect={(company: TableRow<'company'>) =>
                      handleCompanySelect(idx, company)
                    }
                    className={selector.isError && 'border-red-500'}
                  />
                  {companies.length > 1 && (
                    <ShadcnButton
                      variant="destructive"
                      type="button"
                      onClick={() => removeCompanySelector(idx)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </ShadcnButton>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex justify-center">
            <Button type="button" onClick={() => addCompanySelector()}>
              <PlusSmallIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" secondary onClick={onCancel}>
              Hætta við
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Uppfæra
            </Button>
          </div>
        </form>
      </Form>

      <SlideOver
        isOpen={isOpen}
        title="Fyrirtæki ekki tilbúið!"
        description="Vinsamlegast fyllið út upplýsingar sem vanta fyrir fyrirtækið."
        toggleOpen={() => setIsOpen(true)}
        onCancel={() => onCompanyCancel(companyNeedingUpdate)}
      >
        <CompanyForm
          company={companyNeedingUpdate}
          onSave={() => onCompanySave()}
          onCancel={() => onCompanyCancel(companyNeedingUpdate)}
        />
      </SlideOver>
    </>
  );
}
