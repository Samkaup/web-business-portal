/* A Table component adapted from the ReactTable component (from Sport) created
 * to decouple the component.
 * */
import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  ArrowDownIcon as ChevronDownIcon,
  ArrowUpIcon as ChevronUpIcon
} from '@heroicons/react/24/outline';
import { NewTableProps } from './QueryTable.types';
import PageNavigator from '../PageNavigation';
import EmptyStateSimple from '../ui/EmptyState/EmptyStateSimple';
import Button from '../ui/Button/Button';
import { ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import { Spinner } from '../ui/Spinner/Spinner';

export default function QueryTable<T extends object>({
  query,
  columns,
  sortingState,
  setSortingState,
  paginationState,
  setPaginationState,
  pageSizes = [20, 50, 100],
  className,
  onDownload,
  isDownloading
}: NewTableProps<T>) {
  const basePageSize = pageSizes.at(0);

  const table = useReactTable({
    data: query.data?.data,
    columns,
    pageCount: Math.ceil(query.data?.rowCount / paginationState.pageSize),
    state: {
      pagination: paginationState,
      sorting: sortingState
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: setPaginationState,
    onSortingChange: setSortingState,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  const Skeleton = () => (
    <div className="max-w-sm h-2.5 bg-gray-100 rounded-full dark:bg-gray-500 w-full" />
  );

  const TableBodyLoad = () => (
    <>
      {Array.from({ length: basePageSize }).map((_, idx) => (
        <tr key={idx} className="h-14">
          {columns.map((_: any, idx: number) => (
            <td key={idx} className="px-3 py-4 text-sm text-gray-600 z-0">
              <Skeleton />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  if (query.isSuccess && table?.getRowModel().rows.length <= 0)
    return (
      <div className="flex-col flex items-center justify-center w-100 p-8">
        <EmptyStateSimple
          title="Engar hreyfingar fundust"
          actionBtnText="Stofna deild"
        />
      </div>
    );

  return (
    <div className={className}>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-30">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white bg-company"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler()
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              desc: (
                                <ChevronUpIcon className="inline-block ml-3 -mr-1 h-4 w-4" />
                              ),
                              asc: (
                                <ChevronDownIcon className="inline-block ml-3 -mr-1 h-4 w-4" />
                              )
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-200">
                {query.isSuccess && table?.getRowModel().rows.length > 0 && (
                  <>
                    {!query.isFetching ? (
                      <React.Suspense fallback={<TableBodyLoad />}>
                        {table?.getRowModel().rows.map((row) => (
                          <tr key={row.id} className="h-14">
                            {row?.getVisibleCells().map((cell) => (
                              <td
                                key={cell.id}
                                className="whitespace-nowrap px-3 py-4 text-sm text-gray-600"
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </React.Suspense>
                    ) : (
                      <TableBodyLoad />
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200/50 sm:px-6">
        <div className="sm:flex-1 sm:flex sm:items-center sm:justify-between mt-4">
          {/* Row Count */}
          <div>
            <p className="text-sm mt font-medium ml-4 text-gray-600">
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
              <span className="font-medium ml-4">{`af ${
                query.data?.rowCount ?? '0'
              } niðurstöðum`}</span>
            </p>
          </div>

          <Button
            secondary
            size="lg"
            className={className}
            onClick={onDownload}
          >
            <div className="flex justify-between items-center gap-2">
              Sækja hreyfingayfirlit{' '}
              {isDownloading ? (
                <Spinner color="black" />
              ) : (
                <ArrowDownTrayIcon className="h-5 w-5" />
              )}
            </div>
          </Button>
          {/* Page navigation */}
          <PageNavigator
            currentPageIdx={paginationState.pageIndex}
            pageCount={table.getPageCount()}
            setPage={table.setPageIndex}
          />
        </div>
      </div>
    </div>
  );
}
