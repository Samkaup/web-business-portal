import TextInput from '../ui/Input/textInput';
import { useEffect, useState } from 'react';
import Button from '../ui/Button/Button';
import AlertWithDescription from '../ui/Alert/AlertWithDescription';

type Props = {
  onCancel?: () => void;
  onSave?: () => void;
};

export default function DepartmentCreate({ onCancel, onSave }: Props) {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  const [submitError, setSubmitError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Name validation
    if (name.length <= 2) {
      setNameError;
    }
  }, [name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      console.log('creating ' + name, isLoading);
    } catch (e) {
      setSubmitError(e);
    } finally {
      onSave();
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
                label="Nafn á deild"
                errorText={nameError}
                isError={nameError.length > 0}
                placeholder="t.d "
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
          Stofna
        </Button>
      </div>
    </form>
  );
}
