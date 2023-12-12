import {} from '@/components/Shadcn/ui/card';
import { Input } from '@/components/Shadcn/ui/input';
import { useEffect, useRef, useState } from 'react';

type Props = {
  onAction: (token: string) => Promise<boolean>;
};
export default function Component({ onAction }: Props) {
  const [token, setToken] = useState('');

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [num3, setNum3] = useState('');
  const [num4, setNum4] = useState('');
  const [num5, setNum5] = useState('');
  const [num6, setNum6] = useState('');

  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);
  const inputRef3 = useRef<HTMLInputElement>(null);
  const inputRef4 = useRef<HTMLInputElement>(null);
  const inputRef5 = useRef<HTMLInputElement>(null);
  const inputRef6 = useRef<HTMLInputElement>(null);

  // Combine input into one singular string
  useEffect(() => {
    const thisToken = `${num1}${num2}${num3}${num4}${num5}${num6}`;
    setToken(thisToken.toUpperCase());
  }, [num1, num2, num3, num4, num5, num6]);

  // Send action once token has been fulfilled.
  useEffect(() => {
    if (token.length === 6) {
      onAction(token);
    }
  }, [token]);

  // Detect if backspace or delete is triggered on input
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Backspace' || event.key === 'Delete') {
        const focusedInputRef = [
          inputRef1,
          inputRef2,
          inputRef3,
          inputRef4,
          inputRef5,
          inputRef6
        ].find((ref) => ref.current === document.activeElement);
        if (focusedInputRef) {
          const inputIndex = [
            inputRef1,
            inputRef2,
            inputRef3,
            inputRef4,
            inputRef5,
            inputRef6
          ].indexOf(focusedInputRef);

          if (inputIndex > 0) {
            const previousInputRef = [
              inputRef1,
              inputRef2,
              inputRef3,
              inputRef4,
              inputRef5,
              inputRef6
            ][inputIndex - 1];
            previousInputRef.current.focus();
            setNum(inputIndex + 1, ''); // Clear the value of the current input and focus on previous
          }
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [num1, num2, num3, num4, num5, num6]);

  const setNum = (num: number, value: string) => {
    if (num) {
      switch (num) {
        case 1:
          setNum1(value);
          if (value) {
            inputRef2.current.focus();
          }
          break;
        case 2:
          setNum2(value);
          if (value) {
            inputRef3.current.focus();
          }
          break;
        case 3:
          setNum3(value);
          if (value) {
            inputRef4.current.focus();
          }
          break;
        case 4:
          setNum4(value);
          if (value) {
            inputRef5.current.focus();
          }
          break;
        case 5:
          setNum5(value);
          if (value) {
            inputRef6.current.focus();
          }
          break;
        case 6:
          setNum6(value);
          break;
      }
    }
  };
  return (
    <div className="text-center">
      <h2 className="text-xl">Auðkenniskóði</h2>
      <div className="flex justify-between space-x-2 py-8">
        <Input
          aria-label="OTP first digit"
          value={num1}
          autoFocus
          onChange={(e) => setNum(1, e.target.value)}
          maxLength={1}
          ref={inputRef1}
          className="w-14 h-14 text-center text-2xl"
        />
        <Input
          aria-label="OTP second digit"
          value={num2}
          ref={inputRef2}
          onChange={(e) => setNum(2, e.target.value)}
          maxLength={1}
          className="w-14 h-14 text-center text-2xl"
        />
        <Input
          aria-label="OTP third digit"
          value={num3}
          ref={inputRef3}
          onChange={(e) => setNum(3, e.target.value)}
          maxLength={1}
          className="w-14 h-14 text-center text-2xl"
        />
        <Input
          aria-label="OTP fourth digit"
          value={num4}
          ref={inputRef4}
          onChange={(e) => setNum(4, e.target.value)}
          maxLength={1}
          className="w-14 h-14 text-center text-2xl"
        />
        <Input
          aria-label="OTP fifth digit"
          value={num5}
          ref={inputRef5}
          onChange={(e) => setNum(5, e.target.value)}
          maxLength={1}
          className="w-14 h-14 text-center text-2xl"
        />
        <Input
          aria-label="OTP sixth digit"
          value={num6}
          ref={inputRef6}
          onChange={(e) => setNum(6, e.target.value)}
          maxLength={1}
          className="w-14 h-14 text-center text-2xl"
        />
      </div>
    </div>
  );
}
