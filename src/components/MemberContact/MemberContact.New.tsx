import { PlusIcon } from '@heroicons/react/24/outline';
import TextInput from '../ui/Input/textInput';
import { useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import { Spinner } from '../ui/Spinner/Spinner';
import { createContact } from '@/utils/supabase_queries/contact';
import supabase from '@/utils/supabase-browser';
import { useQueryClient } from '@tanstack/react-query';
import kennitala from 'kennitala';

import toast from 'react-hot-toast';
type Props = {
  onSave?: () => void;
  departmentId: string;
};

export default function MemberContactNew({ departmentId, onSave }: Props) {
  const queryClient = useQueryClient();
  const [externalIdentifier, setExternalIdentifier] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [externalIdentifierError, setExternalIdentifierError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [emailAddressError, setEmailAddressError] = useState('');
  const [cellPhoneError, setCellPhoneError] = useState('');
  const [formDisabled, setFormDisabled] = useState(true);
  const resetForm = () => {
    setFullName('');
    setEmailAddress('');
    setCellPhone('');
    setExternalIdentifier('');
  };
  useEffect(() => {
    if (
      externalIdentifierError.length === 0 &&
      fullNameError.length === 0 &&
      emailAddressError.length === 0 &&
      cellPhoneError.length === 0
    ) {
      setFormDisabled(false);
    }
  }, [
    externalIdentifierError,
    fullNameError,
    emailAddressError,
    cellPhoneError
  ]);
  useEffect(() => {
    // Clear errors
    setExternalIdentifierError('');
    setFullNameError('');
    setEmailAddressError('');
    setCellPhoneError('');

    if (
      !kennitala.isValid(externalIdentifier) &&
      externalIdentifier.length > 0
    ) {
      setExternalIdentifierError('Kennitala ekki gild');
    }
    if (fullName.length < 5 && fullName.length > 4) {
      setFullNameError('Nafn úttektaraðila verður að vera lengra en 5 stafir');
    }

    if (cellPhone.length < 7 && cellPhone.length !== 0) {
      setCellPhoneError('Nafn úttektaraðila verður að vera lengra en 6 stafir');
    }
  }, [fullName, externalIdentifier, cellPhone, emailAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const contact = {
      external_identifier: externalIdentifier,
      full_name: fullName,
      email_address: emailAddress,
      cell_phone: cellPhone,
      department_id: departmentId,
      closed: false,
      web_changed_at: new Date().toISOString()
    };

    try {
      const contactResponse = await createContact({ supabase, contact });
      if (!contactResponse) {
        console.error('Could not create contact in db: ' + contactResponse);
        throw new Error(
          `Failed to create contact in database: ${contactResponse}`
        );
      }

      const response = await fetch('/api/contact/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: fullName,
          account_number: departmentId,
          email_address: emailAddress,
          external_identifier: externalIdentifier,
          cell_phone: cellPhone
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      toast.success('Úttektaraðili hefur verið búinn til!');
      resetForm();
      onSave();
      queryClient.invalidateQueries({
        queryKey: [`department_with_contacts`]
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error(`Villa kom upp við stofnun!: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <form
        id={`contact-${departmentId}`}
        className="flex flex-col sm:flex-row lg:items-end lg:justify-evenly"
        onSubmit={handleSubmit}
      >
        <TextInput
          value={externalIdentifier}
          label="Kennitala"
          isError={externalIdentifierError.length > 0}
          errorText="Ekki gild kennitala"
          name="contact-ssn"
          onChange={(ssn) => setExternalIdentifier(ssn as string)}
        ></TextInput>
        <TextInput
          className=""
          value={fullName}
          isError={fullNameError.length > 0}
          label="Fullt nafn"
          errorText="Ekki gilt nafn"
          name="contact-name"
          onChange={(name) => setFullName(name as string)}
        ></TextInput>
        <TextInput
          className=""
          value={emailAddress}
          isError={emailAddressError.length > 0}
          label="Netfang"
          errorText="Ekki gilt netfang"
          name="contact-email"
          onChange={(email) => setEmailAddress(email as string)}
        ></TextInput>
        <TextInput
          className=""
          value={cellPhone}
          isError={cellPhoneError.length > 0}
          label="Farsímanúmer"
          errorText="Ekki gilt farsimanúmer"
          name="contact-phone"
          onChange={(cellPhone) => setCellPhone(cellPhone as string)}
        ></TextInput>
        <div className="items-end">
          <Button
            type="submit"
            className="ml-2"
            disabled={formDisabled}
            secondary
          >
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                Stofna
                <PlusIcon className="ml-2 w-4 h-4"></PlusIcon>
              </>
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
