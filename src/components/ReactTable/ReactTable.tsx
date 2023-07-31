import * as React from 'react';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  PaginationState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Props } from './ReactTable.types';

import {
  ArrowDownIcon as ChevronDownIcon,
  ArrowUpIcon as ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { Database } from '@/lib/database.types';
import supabaseBrowser from '@/utils/supabase-browser';
import { getTransactionCount } from '@/utils/supabase_queries/transaction';
import { getTable } from '@/utils/supabase-queries';
// A debounced input react component

export default function ReactTable<
  T extends keyof Database['public']['Tables']
>({
  columns,
  tableName,
  defaultSort,
  queryKey,
  searchColumns,
  searchValue,
  filter,
  selectQuery,
}: Props<T>) {
  const [rowCount, setRowCount] = useState<any>(0);
  const [pageCount, setPageCount] = useState<any>(0);
  const [sorting, setSorting] = useState<SortingState>([defaultSort]);
  const basePageSize = 20;
  const pageSizes = [basePageSize, 50, 100];

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: basePageSize,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const fetchData = async () => {
    // Gets counts for pagination
    getTransactionCount(supabaseBrowser).then((count) => {
      let pCount = 1;
      if (count) {
        pCount = Math.ceil(count / pageSize);
      }
      setPageCount(pCount);
      setRowCount(count);
    });

    const rangeFrom = pageIndex * pageSize;
    const rangeTo = (pageIndex + 1) * pageSize - 1;

    return await getTable({
      supabaseClient: supabaseBrowser,
      table: tableName,
      selectQuery: selectQuery,
      range: {
        from: rangeFrom,
        to: rangeTo,
      },

      sorting: {
        column: sorting[0].id,
        options: {
          ascending: !sorting[0].desc,
        },
      },
      searchColumns: searchColumns,
      searchValue: searchValue,
      filter: filter,
    });
  };

  const { data: tableData, isLoading } = useQuery(
    [
      queryKey ? queryKey : tableName,
      { pageIndex, pageSize, sorting, searchColumns, searchValue, filter },
    ],
    async () => fetchData(),
    { keepPreviousData: true }
  );

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: {
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const Skeleton = () => (
    <div className="max-w-sm animate-pulse h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-full mb-4" />
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              desc: (
                                <ChevronUpIcon className="inline-block ml-3 -mr-1 h-5 w-5" />
                              ),
                              asc: (
                                <ChevronDownIcon className="inline-block ml-3 -mr-1 h-5 w-5" />
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading
                  ? Array.from({ length: basePageSize }).map((_, idx) => (
                      <tr key={idx}>
                        {columns.map((_, idx) => (
                          <td
                            key={idx}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            <Skeleton />
                          </td>
                        ))}
                      </tr>
                    ))
                  : table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
              <tfoot className="md:hidden">
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200/50 sm:px-6">
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4">
          <div>
            <p className="text-sm ml-4 mt">
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {pageSizes.map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <span className="font-medium ml-4">{`af ${rowCount} niðurstöðum`}</span>
            </p>
          </div>
          <div className="flex-1 flex justify-between sm:justify-end">
            {pageIndex > 5 && (
              <button
                className="hover:cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-white/10"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                Fyrsta síða
              </button>
            )}
            {table.getCanPreviousPage() && (
              <button
                className="ml-5 hover:cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-white/10"
                onClick={() => table.previousPage()}
              >
                Fyrri síða
              </button>
            )}
            <button
              className="ml-5 hover:cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-white/10"
              disabled={true}
            >
              <span>Síða: {pageIndex + 1}</span>
            </button>
            {table.getCanNextPage() && (
              <button
                className="ml-5 hover:cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md hover:bg-white/10"
                onClick={() => table.nextPage()}
              >
                Næsta síða
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
