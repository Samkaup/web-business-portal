'use client';

import { Card } from '@/components/Shadcn/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/Shadcn/ui/pagination';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import { Profile, useGetProfiles } from '@/utils/react_query_hooks/profile';
import { useState } from 'react';

export default function UserRegistationPage() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');

  const { data, isSuccess } = useGetProfiles(search, { page, pageSize: 10 });

  const onSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  return (
    <div className="flex flex-col space-y-4">
      <DebouncedInput
        name="search"
        placeholder="Leita..."
        onChange={onSearch}
        value={search}
        debounce={330}
      />

      {isSuccess &&
        data.profiles.map((profile: Profile, idx: number) => (
          <Card
            key={idx}
            className="p-3 flex items-center justify-between w-full"
          >
            <div>
              <h3 className="text-lg font-medium">{profile.full_name}</h3>
              <h4 className="text-sm text-muted-foreground">{profile.email}</h4>
            </div>
          </Card>
        ))}

      {isSuccess && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
              />
            </PaginationItem>
            {Array.from(
              { length: data.pagination.lastPage },
              (_, i) => i + 1
            ).map((pageNumber: number) => (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={page === pageNumber}
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setPage(data.pagination.nextPage ? page + 1 : page)
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
