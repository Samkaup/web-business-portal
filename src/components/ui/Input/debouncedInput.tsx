import React from 'react';
import TextInput, { Props as TextInputProps } from './textInput';
export function DebouncedInput({
  name,
  value: initialValue,
  onChange,
  isLoading,
  debounce = 500,
  ...props
}: {
  name: string;
  value: string | number;
  isLoading?: boolean;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> &
  TextInputProps) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <TextInput
      {...props}
      isLoading={isLoading}
      name={name}
      value={value}
      onChange={(value) => setValue(value)}
    />
  );
}
