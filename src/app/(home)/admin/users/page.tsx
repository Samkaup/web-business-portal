'use client';

import { Badge } from '@/components/Shadcn/ui/badge';
import { Card } from '@/components/Shadcn/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/Shadcn/ui/pagination';
import { Skeleton } from '@/components/Shadcn/ui/skeleton';
import UserCreate from '@/components/UserForm/Create';
import UserEdit from '@/components/UserForm/Edit';
import { Button } from '@/components/Shadcn/ui/button';
import EmptyStateSimple from '@/components/ui/EmptyState/EmptyStateSimple';
import { DebouncedInput } from '@/components/ui/Input/debouncedInput';
import { SlideOver } from '@/components/ui/SlideOver/SlideOver';
import { TProfile, useGetProfiles } from '@/utils/react_query_hooks/profile';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Pen, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@/components/ui/Spinner/Spinner';

export default function UserRegistationPage() {
  const pageSize = 10;
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEditOpen, setEditIsOpen] = useState<boolean>(false);
  const [userEdit, setUserEdit] = useState<TProfile>();
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const queryClient = useQueryClient();
  const { data, isSuccess, isLoading } = useGetProfiles(search, {
    page,
    pageSize
  });
  console.log(data);
  const onSearch = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const editUser = (user: TProfile) => {
    setUserEdit(user);
    setEditIsOpen(true);
  };

  const deleteUser = async (userId: string) => {
    const yes = confirm('Ertu viss um að þú viljir eyða þessum notanda?');
    if (yes) {
      setIsLoadingDelete(true);
      try {
        const res = await fetch(
          '/api/admin/users/delete?' +
            new URLSearchParams({
              id: userId
            }),
          {
            method: 'DELETE'
          }
        );
        if (res.status !== 200) {
          throw Error(`HTTP error: ${res.text()}`);
        }
      } catch (e) {
        console.error('Error while deleting user! ', e);
        toast.error('Villa kom upp við eyðslu á notanda, reyndu aftur.');
      } finally {
        queryClient.invalidateQueries(['profiles']);
        setIsLoadingDelete(false);
      }
    }
  };

  const UserCardsRenderer = () => {
    if (isLoading)
      return (
        <>
          {Array.from({ length: pageSize }, (_, i: number) => i).map(
            (idx: number) => (
              <Skeleton
                key={idx}
                className="p-3 flex items-center justify-between w-full h-[70px]"
              />
            )
          )}
        </>
      );
    else if (data.profiles?.length > 0)
      return (
        <>
          {data.profiles.map((profile: TProfile, idx: number) => (
            <Card key={idx} className="p-3">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">
                  <h3 className="text-lg font-medium">{profile.full_name}</h3>
                  <h4 className="text-sm text-muted-foreground">
                    {profile.email}
                  </h4>
                </div>
                <div className="flex justify-end items-center col-span-4">
                  {profile.company.length > 0 ? (
                    <>
                      {profile.company.slice(0, 3).map((company, index) => (
                        <div key={index} className="mr-1">
                          <Badge variant="outline">{company.name}</Badge>
                        </div>
                      ))}
                      {profile.company.length > 3 && (
                        <Badge variant="outline">...</Badge>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-500 text-xs">
                      Engin fyrirtæki skráð á notanda
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Breyta notanda"
                    onClick={() => editUser(profile)}
                  >
                    <Pen className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Eyða notanda"
                    onClick={() => deleteUser(profile.id)}
                  >
                    {isLoadingDelete ? (
                      <Spinner></Spinner>
                    ) : (
                      <Trash className="h-4 w-4 text-red-800" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </>
      );
    else
      return (
        <div className="flex-col flex items-center justify-center w-100 p-8">
          <EmptyStateSimple
            title={`Engar niðurstöður fyrir: ${search}`}
            actionBtnText="Stofna deild"
          />
        </div>
      );
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex gap-2">
        <DebouncedInput
          name="search"
          placeholder="Leita..."
          onChange={onSearch}
          value={search}
          debounce={330}
          className="flex-1"
        />
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="flex gap-1"
        >
          Stofna notanda
          <PlusIcon className="-mr-0.5 h-5 w-5 text-white" />
        </Button>
      </div>

      <UserCardsRenderer />

      {isSuccess && data.profiles?.length > 0 && (
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
              <PaginationItem key={pageNumber}>
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

      <SlideOver
        isOpen={isOpen}
        title="Nýr notandi"
        description="Stofna nýjan notanda sem mun hafa aðgang að sínum reikningi."
        toggleOpen={() => setIsOpen(true)}
        onCancel={() => setIsOpen(false)}
      >
        <UserCreate
          onSave={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        />
      </SlideOver>
      <SlideOver
        isOpen={isEditOpen}
        title="Breyta notandi"
        description="Farið varlega í að breyta um notendaupplýsingar og alls ekki veita leyfi á önnur fyrirtæki nema með skriflegu leyfi."
        toggleOpen={() => setEditIsOpen(true)}
        onCancel={() => setEditIsOpen(false)}
      >
        <UserEdit
          onSave={() => setEditIsOpen(false)}
          onCancel={() => setEditIsOpen(false)}
          user={userEdit}
        />
      </SlideOver>
    </div>
  );
}
