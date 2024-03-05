import { Input } from '@/components/Shadcn/ui/input';
import classNames from '@/utils/style/classNames';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '../Spinner/Spinner';

export type Props = {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  autoComplete?: string | null;
  label?: string | null;
  type?: string | null;
  placeholder?: string | null;
  icon?: React.ReactNode;
  required?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  errorText?: string | null;
  className?: string | null;
  [key: string]: unknown;
};

export default function TextInput({
  name,
  autoComplete,
  label,
  type,
  placeholder,
  required,
  isError,
  isLoading = false,
  errorText,
  value,
  onChange,
  className,
  ...props
}: Props) {
  const baseStyle =
    'flex h-10 border-company/20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const normalStyle =
    'bg-background px-3 py-2 text-sm ring-company-600 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus:ring-company-600 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';
  const errorStyle =
    'pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6';

  return (
    <div className={className}>
      {label ? <Label label={label} name={name} /> : <></>}
      <div className="relative rounded-md shadow-sm">
        <Input
          type={type ? type : ''}
          name={name ? name : ''}
          autoComplete={autoComplete ? autoComplete : ''}
          className={classNames(baseStyle, isError ? errorStyle : normalStyle)}
          placeholder={placeholder ? placeholder : ''}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          value={value}
          {...props}
        />
        {isLoading ? <LoadingIcon /> : <></>}
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

function LoadingIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <Spinner></Spinner>
    </div>
  );
}

function ErrorIcon() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <AlertCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
    </div>
  );
}
