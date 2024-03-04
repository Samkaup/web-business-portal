import { PlusIcon } from '@heroicons/react/24/outline';
import TextInput from '../ui/Input/textInput';
import { useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import { Spinner } from '../ui/Spinner/Spinner';
import { createContact } from '@/utils/supabase_queries/contact';
import supabase from '@/utils/supabase-browser';
import { useQueryClient } from '@tanstack/react-query';
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
  const [submitError, setSubmitError] = useState('');
  useEffect(() => {
    // Clear errors
    setExternalIdentifierError('');
    setFullNameError('');
    setEmailAddressError('');
    setCellPhoneError('');

    if (externalIdentifier.length != 10 && externalIdentifier.length > 4) {
      setExternalIdentifierError('Kennitala ekki gild');
    }
    if (fullName.length < 5 && fullName.length > 4) {
      setFullNameError('Nafn úttektaraðila verður að vera lengra en 5 stafir');
    }

    if (cellPhone.length < 7) {
      setCellPhoneError('Nafn úttektaraðila verður að vera lengra en 6 stafir');
    }
  }, [fullName, externalIdentifier, cellPhone, emailAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const contact = {
        external_identifier: externalIdentifier,
        full_name: fullName,
        email_address: emailAddress,
        cell_phone: cellPhone,
        department_id: departmentId,
        closed: false,
        web_changed_at: `${new Date().toISOString()}`
      };

      const contactResponse = await createContact({ supabase, contact });
      if (contactResponse) {
        try {
          const response = await fetch('/api/contact/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              full_name: fullName,
              account_number: departmentId,
              external_identifier: externalIdentifier,
              cell_phone: cellPhone
            })
          });
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          toast.success('Úttektaraðili hefur verið búinn til!');
          onSave();
          queryClient.invalidateQueries({
            queryKey: [`department_with_contacts`]
          });
        } catch (e) {
          return toast.error(`Villa kom upp við stofnun!: ${e.message}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error('Could not create contact in db: ' + contactResponse);
        return toast.error(
          `Villa kom upp við stofnun í gagnagrunni!!  ${contactResponse}`
        );
      }
    } catch (e) {
      setSubmitError(e);
      return toast.error(
        `Villa kom upp við stofnun í gagnagrunni!: ${e.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div>
        <form className="flex flex-col sm:flex-row items-center pb-4">
          <TextInput
            value={externalIdentifier}
            label="Kennitala"
            isError={externalIdentifierError.length > 0}
            name="contact-ssn"
            onChange={(ssn) => setExternalIdentifier(ssn as string)}
          ></TextInput>
          <TextInput
            className="lg:ml-4"
            value={fullName}
            isError={fullNameError.length > 0}
            label="Fullt nafn"
            name="contact-name"
            onChange={(name) => setFullName(name as string)}
          ></TextInput>
          <TextInput
            className="lg:ml-4"
            value={emailAddress}
            isError={emailAddressError.length > 0}
            label="Netfang"
            name="contact-email"
            onChange={(email) => setEmailAddress(email as string)}
          ></TextInput>
          <TextInput
            className="lg:ml-4"
            value={cellPhone}
            isError={cellPhoneError.length > 0}
            label="Farsímanúmer"
            name="contact-phone"
            onChange={(cellPhone) => setCellPhone(cellPhone as string)}
          ></TextInput>
          {submitError && <span>Error!</span>}
        </form>
        <Button type="submit" secondary onClick={handleSubmit}>
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
    </>
  );
}
