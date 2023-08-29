import React from 'react';
import TextInput from './textInput';

export function DebouncedInput({
  name,
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  name: string;
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
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
      name={name}
      value={value}
      onChange={(value) => setValue(value)}
    />
  );
}
