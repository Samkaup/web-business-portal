'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/Shadcn/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/Shadcn/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/Shadcn/ui/popover';
import { TableRow } from '@/types';
import { useInfiniteCompanies } from '@/utils/react_query_hooks/company';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import classNames from '@/utils/style/classNames';

type TCompany = TableRow<'company'> | null;

type Props = {
  selectedCompany: TCompany;
  onSelect: (company: TCompany) => void;
  className?: string;
};

export function CompanySelector({
  selectedCompany,
  onSelect,
  className
}: Props) {
  const [search, setSearch] = React.useState<string>('');
  const [open, setOpen] = React.useState(false);

  const { data, isSuccess, fetchNextPage, hasNextPage } = useInfiniteCompanies(
    { page: 1, pageSize: 20 },
    search
  );

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    // Check if we've scrolled to the bottom
    if (target.scrollHeight - target.scrollTop === target.clientHeight) {
      if (hasNextPage) fetchNextPage();
    }
  };

  const handleSelect = (company: TCompany) => {
    setOpen(false);
    onSelect(company);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={classNames('w-full justify-between', className)}
        >
          {selectedCompany ? (
            <div className="flex gap-1">
              <p>{selectedCompany.name}</p>-
              <p className="text-muted-foreground text-sm">
                {selectedCompany?.external_identifier}
              </p>
            </div>
          ) : (
            'Veldu fyrirtæki...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <DebouncedInput
            name="search"
            placeholder="Leita..."
            onChange={(value) => setSearch(value as string)}
            value={search}
            debounce={330}
            className="flex-1"
          />
          <CommandList onScroll={handleScroll}>
            <CommandEmpty>Engin fyrirtæki fundust.</CommandEmpty>
            {isSuccess && (
              <CommandGroup>
                {data.pages.map((page, pageIndex) => (
                  <React.Fragment key={pageIndex}>
                    {page.map((company: TCompany) => (
                      <CommandItem
                        key={company.external_identifier}
                        onSelect={() => handleSelect(company)}
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4',
                            selectedCompany?.external_identifier ===
                              company.external_identifier
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div className="flex justify-between w-full">
                          <p>{company.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {company.external_identifier}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                  </React.Fragment>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
