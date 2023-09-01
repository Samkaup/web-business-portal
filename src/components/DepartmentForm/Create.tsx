import TextInput from '../ui/Input/textInput';
import { useContext, useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import AlertWithDescription from '../ui/Alert/AlertWithDescription';
import { Context } from '@/utils/context-store';
import { Spinner } from '../ui/Spinner/Spinner';
import supabase from '@/utils/supabase-browser';
import { createDepartment } from '@/utils/supabase_queries/department';
import { useQueryClient } from '@tanstack/react-query';
type Props = {
  onCancel?: () => void;
  onSave?: () => void;
};

export default function DepartmentCreate({ onCancel, onSave }: Props) {
  const { company } = useContext(Context);
  const [name, setName] = useState('');
  const queryClient = useQueryClient();
  const [externalIdentifier, setExternalIdentifier] = useState('');

  const [nameError, setNameError] = useState('');
  const [externalIdentifierError, setExternalIdentifierError] = useState('');

  const [submitError, setSubmitError] = useState('asadadad');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear errors
    setNameError('');
    setExternalIdentifierError('');

    if (name.length < 3 && name.length > 0) {
      setNameError('Nafn deildar verður að vera lengra en 2 stafir');
    }
  }, [name, externalIdentifier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const department = {
        name: name,
        external_identifier: externalIdentifier,
        company_id: company.external_identifier,
      };
      await createDepartment({ supabase, department });
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
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <TextInput
                value={externalIdentifier}
                label="Númer deildar / auðkenni"
                errorText={externalIdentifierError}
                isError={externalIdentifierError.length > 0}
                placeholder="t.d 150"
                onChange={setExternalIdentifier}
                name="department-external-identifier"
              ></TextInput>
            </div>
            <div className="sm:col-span-4">
              <TextInput
                value={name}
                label="Nafn á deild"
                errorText={nameError}
                isError={nameError.length > 0}
                placeholder="t.d Rekstrarsvið"
                onChange={setName}
                name="department-name"
              ></TextInput>
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
        <Button type="submit" primary={true} onClick={handleSubmit}>
          {isLoading ? <Spinner /> : <span>Stofna</span>}
        </Button>
      </div>
    </form>
  );
}
