'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
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
import { TableRow } from '@/types';
import { CompanySelector } from '../UserForm/CompanySelector';

export default function CompanySwitcher() {
  const [open, setOpen] = React.useState(false);
  const { company, isSuccess, setSelectedCompany } = useCompany();
  const { data: user } = useGetProfile();
  function getInitals(fullName: string) {
    const parts: string[] = fullName.split(' ');
    const initalsArr = parts.map((part: string) => part.at(0)).slice(0, 2);
    return initalsArr.join('');
  }

  const handleCompanySelect = (company: TableRow<'company'>) => {
    console.log('Selecting company');
    setSelectedCompany(company);
  };

  return (
    <div className="flex w-full flex-row items-start justify-between px-4 py-3 sm:items-center">
      {isSuccess && (
        <div>
          <Link href="#" onClick={() => setOpen(true)}>
            <p className="text-sm font-medium leading-none px-4 text-white">
              {company?.name}
            </p>
            <p className="text-sm font-medium leading-none pt-1 px-4 text-white/75">
              kt. {company?.external_identifier}
            </p>
          </Link>
        </div>
      )}
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <div className="relative w-10 h-10 ">
            <Link href="#">
              <Avatar className="w-full h-full rounded-full overflow-hidden bg-gray-200">
                {user && (
                  <AvatarFallback className="w-full h-full flex items-center justify-center text-lg font-bold">
                    {getInitals(user.profile.full_name)}
                  </AvatarFallback>
                )}
              </Avatar>
              {/* Enable when Notifications have been setup */}
              {/* <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 bg-red-500/90 rounded-full text-white text-xs font-bold">
                2
              </div> */}
            </Link>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuGroup>
            {user && user.user.app_metadata.userrole === 'ADMIN' && (
              <DropdownMenuItem>
                <Link href="/admin/users">Stjórnsíða (admin)</Link>
              </DropdownMenuItem>
            )}
            <Link href="/profile" className="hover:bg-company">
              <DropdownMenuItem>Mínar stillingar</DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator></DropdownMenuSeparator>
            <DropdownMenuItem>
              <Link href="/companies">Fyrirtæki</Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Velja fyrirtæki</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-0">
                <CompanySelector
                  selectedCompany={company}
                  onSelect={(company: TableRow<'company'>) =>
                    handleCompanySelect(company)
                  }
                />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <form method="POST" action="/auth/signout">
                <button type="submit" className="w-full">
                  Útskrá
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
