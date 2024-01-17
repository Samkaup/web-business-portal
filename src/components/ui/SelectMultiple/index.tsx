'use client';

import * as React from 'react';
import { CheckIcon, X } from 'lucide-react';

import { Badge } from '@/components/Shadcn/ui/badge';
import {
  Command,
  CommandGroup,
  CommandItem
} from '@/components/Shadcn/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { useUpdateSelectedDepartments } from '@/hooks/useDepartments';

type Option = Record<'value' | 'label', string>;
export type MultipleSelectOption = Option;
type Props = {
  options: Option[];
  selectPlaceholder: string;
  queryKey: string;
};

export function SelectMultiple({
  options,
  selectPlaceholder = 'Allt',
  queryKey = 'selectedDepartments'
}: Props) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Option[]>([]);
  const [inputValue, setInputValue] = React.useState('');
  const { mutate: updateDateRange } = useUpdateSelectedDepartments(queryKey);

  const handleSelect = (option: Option) => {
    if (!alreadyInSelectedList(option)) {
      setSelected([...selected, option]);
    }
  };
  const alreadyInSelectedList = (option: Option) => {
    return selected.filter((s) => s.value === option.value).length > 0;
  };
  const handleUnselect = React.useCallback((option: Option) => {
    const alreadyInSelected = alreadyInSelectedList(option);
    if (!alreadyInSelected) {
      setSelected((prev) => prev.filter((s) => s.value !== option.value));
    }
  }, []);

  React.useEffect(() => {
    updateDateRange(selected);
  }, [selected]);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    []
  );
  const selectables = options.filter((option) => !selected.includes(option));
  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group border border-company/20 px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => {
            return (
              <Badge key={option.value} variant="secondary">
                {option.label}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleUnselect(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleUnselect(option)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            );
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={selectPlaceholder}
            className="ml-2 bg-transparent outline-none  placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectables.map((option) => {
                return (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue('');
                      handleSelect(option);
                    }}
                    className={'cursor-pointer'}
                  >
                    {alreadyInSelectedList(option) && (
                      <CheckIcon className="w-4 h-4 mr-2"></CheckIcon>
                    )}
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
