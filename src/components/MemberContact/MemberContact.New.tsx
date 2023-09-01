import { PlusIcon } from '@heroicons/react/24/outline';
import TextInput from '../ui/Input/textInput';
import { useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import { Spinner } from '../ui/Spinner/Spinner';
import { createContact } from '@/utils/supabase_queries/contact';
import supabase from '@/utils/supabase-browser';
import { useQueryClient } from '@tanstack/react-query';
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
      };

      await createContact({ supabase, contact });
      queryClient.invalidateQueries({
        queryKey: [`department_with_contacts`],
      });
      onSave();
    } catch (e) {
      setSubmitError(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div>
        <form className="inline-flex items-center pb-4">
          <TextInput
            value={externalIdentifier}
            label="Kennitala"
            isError={externalIdentifierError.length > 0}
            name="contact-ssn"
            onChange={(ssn) => setExternalIdentifier(ssn as string)}
          ></TextInput>
          <TextInput
            className="ml-4"
            value={fullName}
            isError={fullNameError.length > 0}
            label="Fullt nafn"
            name="contact-name"
            onChange={(name) => setFullName(name as string)}
          ></TextInput>
          <TextInput
            className="ml-4"
            value={emailAddress}
            isError={emailAddressError.length > 0}
            label="Netfang"
            name="contact-email"
            onChange={(email) => setEmailAddress(email as string)}
          ></TextInput>
          <TextInput
            className="ml-4"
            value={cellPhone}
            isError={cellPhoneError.length > 0}
            label="Farsímanúmer"
            name="contact-phone"
            onChange={(cellPhone) => setCellPhone(cellPhone as string)}
          ></TextInput>
          {submitError && <span>Error!</span>}
        </form>
      </div>
      <div className="flex items-center gap-x-4">
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