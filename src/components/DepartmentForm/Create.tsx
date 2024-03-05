import TextInput from '../ui/Input/textInput';
import { useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import AlertWithDescription from '../ui/Alert/AlertWithDescription';
import { Spinner } from '../ui/Spinner/Spinner';
import { useQueryClient } from '@tanstack/react-query';
import { useCompany } from '@/hooks/useCompany';
import { DebouncedInput } from '../ui/Input/debouncedInput';
import toast from 'react-hot-toast';
import { Check } from 'lucide-react';
type Props = {
  onCancel?: () => void;
  onSave?: () => void;
};

export default function DepartmentCreate({ onCancel, onSave }: Props) {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [externalIdentifier, setExternalIdentifier] = useState('');
  const [externalIdentifierError, setExternalIdentifierError] = useState('');
  const [externalIdentifierTaken, setExternalIdentifierTaken] = useState(false);
  const [formDisabled, setFormDisabled] = useState(true);

  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingIDCheck, setIsLoadingIDCheck] = useState(false);

  const checkIfTaken = async (id: string) => {
    try {
      setIsLoadingIDCheck(true);
      const response = await fetch(`/api/account/available?account_no=${id}`, {
        method: 'POST'
      });
      if (!response.ok) {
        toast.error('Ekki tókst að ná sambandi við vefþjónustu kerfis');
        throw new Error(`HTTP error: ${response.status}`);
      }
      const body = await response.json();
      if (body.available) {
        setExternalIdentifierError('');
      } else {
        setExternalIdentifierError('Númer er ekki í boði');
        setExternalIdentifierTaken(true);
      }
    } catch (e) {
      toast.error('Eitthvað fór úrskeiðis hjá vefþjónustu kerfis');
    } finally {
      setIsLoadingIDCheck(false);
    }
  };
  useEffect(() => {
    if (
      externalIdentifierError.length > 0 ||
      externalIdentifierTaken ||
      nameError.length > 0 ||
      name.length === 0
    ) {
      setFormDisabled(true);
    } else {
      setFormDisabled(false);
    }
  }, [externalIdentifierError, externalIdentifierTaken, nameError]);

  useEffect(() => {
    // Clear errors
    setNameError('');
    setExternalIdentifierError('');
    setExternalIdentifierTaken(false);

    if (name.length < 3 && name.length > 0) {
      setNameError('Nafn deildar verður að vera lengra en 2 stafir');
    }
    if (externalIdentifier.length < 3 && externalIdentifier.length > 0) {
      setNameError('Númer deildar verður að vera lengra en 2 stafir');
    }
    if (externalIdentifier.length > 2) {
      checkIfTaken(externalIdentifier);
    }
  }, [name, externalIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!company.external_identifier) {
        setSubmitError('Fyrirtæki ekki rétt, endurhlaða síðu.');
        setIsLoading(false);
      }
      const payload = {
        department_name: name,
        customer_number: company?.external_identifier
      };
      if (externalIdentifier) {
        payload['department_number'] = externalIdentifier;
      }
      const response = await fetch('/api/account/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      toast.success('Deild/Reikningur hefur verið búinn til.');
      queryClient.invalidateQueries({
        queryKey: [`department_with_contacts`]
      });
      onSave();
    } catch (e) {
      console.error(e.message);
      toast.error('Ekki tókst að búa til deild, reyndu aftur.');
      // setSubmitError(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <TextInput
                value={name}
                label="Nafn á deild *"
                errorText={nameError}
                isError={nameError.length > 0}
                placeholder="t.d Rekstrarsvið"
                onChange={(name) => setName(name as string)}
                name="department-name"
              ></TextInput>
            </div>
            <div className="sm:col-span-4">
              <DebouncedInput
                value={externalIdentifier}
                label="Númer deildar / auðkenni (valkvæmt)"
                errorText={
                  externalIdentifierTaken
                    ? 'Númer ekki í boði, veldu annað'
                    : externalIdentifierError
                }
                debounce={1000}
                isError={
                  externalIdentifierError.length > 0 || externalIdentifierTaken
                }
                placeholder="t.d 150"
                isLoading={isLoadingIDCheck}
                onChange={(externalIdentifier) =>
                  setExternalIdentifier(externalIdentifier as string)
                }
                name="department-external-identifier"
              ></DebouncedInput>
              {!externalIdentifierTaken &&
                externalIdentifier.length > 0 &&
                externalIdentifierError.length == 0 && (
                  <div className="flex flex-shrink items-center mr-1 mt-2">
                    <Check className="w-4 h-4 text-green-800 mr-2"></Check>
                    Númer er laust
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      {submitError && (
        <AlertWithDescription
          type="error"
          description={submitError}
          title="Villa"
        />
      )}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Button type="button" secondary={true} onClick={onCancel}>
          Hætta við
        </Button>
        <Button
          type="submit"
          disabled={formDisabled}
          primary={true}
          onClick={handleSubmit}
        >
          {isLoading ? <Spinner /> : <span>Stofna</span>}
        </Button>
      </div>
    </form>
  );
}
