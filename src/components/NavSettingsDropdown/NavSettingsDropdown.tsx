'use client';

import * as React from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/Shadcn/ui/command';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/Shadcn/ui/dropdown-menu';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import { Avatar, AvatarFallback } from '../Shadcn/ui/avatar';
import Link from 'next/link';
import { useCompany } from '@/hooks/useCompany';

export default function CompanySwitcher() {
  const [open, setOpen] = React.useState(false);
  const { company, companies, setSelectedCompany, isSuccess } = useCompany();
  const { data: user } = useGetProfile();

  function getInitals(fullName: string) {
    const parts: string[] = fullName.split(' ');
    const initalsArr = parts.map((part: string) => part.at(0)).slice(0, 2);
    return initalsArr.join('');
  }
  const updateCompany = (name: string) => {
    const selectedCompany = companies.find(
      (c) => c.name.toString().toLowerCase() === name
    );
    setOpen(false);
    setSelectedCompany(selectedCompany);
  };

  return (
    <div className="flex w-full flex-col items-start justify-between px-4 py-3 sm:flex-row sm:items-center">
      {isSuccess && (
        <div>
          <Link href="#" onClick={() => setOpen(true)}>
            <p className="text-sm font-medium leading-none px-4 text-white">
              {company?.name}
            </p>
            <p className="text-sm font-medium leading-none pt-1 px-4 text-white text-opacity-70">
              kt. {company?.external_identifier}
            </p>
          </Link>
        </div>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative w-10 h-10">
            <Link href="#">
              <Avatar className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                {user && (
                  <AvatarFallback className="w-full h-full flex items-center justify-center text-lg font-bold">
                    {getInitals(user.profile.full_name)}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-red-500/90 rounded-full text-white text-xs font-bold">
                2
              </div>
            </Link>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            <Link href="/profile">
              <DropdownMenuLabel>Mínar stillingar</DropdownMenuLabel>
            </Link>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="hover:bg-gray-400 hover:cursor-pointer">
                <Link href="/profile">Fyrirtæki</Link>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Leita..."
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>Finn ekki fyrirtæki.</CommandEmpty>
                    <CommandGroup>
                      {companies?.map((c) => (
                        <CommandItem
                          key={c.external_identifier}
                          value={c.name}
                          onSelect={(e: string) => updateCompany(e)}
                        >
                          <p>{c.name}</p>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <form method="POST" action="/auth/signout">
                <button type="submit">Útskrá</button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
