'use client';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

type Props = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string | null;
  label?: string | null;
  type?: string | null;
  placeholder?: string | null;
  icon?: React.ReactNode;
  required?: boolean;
  isError?: boolean;
  errorText?: string | null;
};

export default function TextInput({
  name,
  autoComplete,
  label,
  type,
  placeholder,
  required,
  isError,
  errorText,
  value,
  onChange,
}: Props) {
  const baseStyle =
    'block w-full rounded-md border-0 py-1.5 pl-2 focus:ring-2 focus:ring-inset sm:leading-6';

  const normalStyle =
    'text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400  focus:ring-indigo-600 sm:text-sm';
  const errorStyle =
    'pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6';

  return (
    <div>
      {label ? <Label label={label} name={name} /> : <></>}
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type={type ? type : ''}
          name={name ? name : ''}
          autoComplete={autoComplete ? autoComplete : ''}
          className={`${baseStyle} ${isError ? errorStyle : normalStyle}`}
          placeholder={placeholder ? placeholder : ''}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />

        {isError ? <ErrorIcon /> : <></>}
      </div>
      {isError ? <ErrorText text={errorText} /> : <></>}
    </div>
  );
}

type LabelProps = {
  name: string;
  label: string;
};

function Label({ name, label }: LabelProps) {
  return (
    <label
      htmlFor={name ? name : ''}
      className="block text-sm font-medium leading-6 text-gray-900"
    >
      {label}
    </label>
  );
}

function ErrorText({ text }: { text: string }) {
  return (
    <p className="mt-2 text-sm text-red-300" id="email-error">
      {text}
    </p>
  );
}

function ErrorIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <ExclamationCircleIcon
        className="h-5 w-5 text-red-500"
        aria-hidden="true"
      />
    </div>
  );
}
