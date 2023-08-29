import classNames from '@/utils/style/classNames';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';

type Props = {
  currentPageIdx: number;
  pageCount: number;
  setPage: (pageNumber: number) => void;
};

export default function PageNavigator({
  currentPageIdx,
  pageCount,
  setPage,
}: Props) {
  const canGetPrevPage = () => currentPageIdx !== 0;
  const canGetNextPage = () => currentPageIdx < pageCount - 1;

  const PageButton = ({ pageIdx }: { pageIdx: number }) => (
    <button
      aria-current="page"
      className={classNames(
        'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
        currentPageIdx === pageIdx
          ? 'z-10 bg-company text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          : 'hover:bg-gray-50'
      )}
      disabled={currentPageIdx === pageIdx}
      onClick={() => setPage(pageIdx)}
    >
      {pageIdx + 1}
    </button>
  );

  return (
    <nav
      className="isolate inline-flex -space-x-px rounded-md shadow-sm"
      aria-label="Pagination"
    >
      <button
        className={classNames(
          'relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
          canGetPrevPage() && 'hover:bg-gray-50 text-gray-400'
        )}
        disabled={!canGetPrevPage()}
        onClick={() => setPage(currentPageIdx - 1)}
      >
        <span className="sr-only">Previous</span>
        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
      </button>
      {pageCount < 8 ? (
        <>
          {Array.from({ length: pageCount }).map((_, idx) => (
            <PageButton pageIdx={idx} />
          ))}
        </>
      ) : (
        <>
          {Array.from({
            length: currentPageIdx < 2 ? 3 : currentPageIdx < 3 ? 4 : 1,
          }).map((_, idx) => (
            <PageButton pageIdx={idx} />
          ))}
          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
            ...
          </span>
          {currentPageIdx >= 3 && currentPageIdx < pageCount - 3 && (
            <>
              {Array.from([
                currentPageIdx - 1,
                currentPageIdx,
                currentPageIdx + 1,
              ]).map((num) => {
                return <PageButton pageIdx={num} />;
              })}

              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            </>
          )}

          {Array.from(
            {
              length:
                currentPageIdx > pageCount - 3
                  ? 3
                  : currentPageIdx > pageCount - 4
                  ? 4
                  : 1,
            },
            (_, idx) => idx
          )
            .reverse()
            .map((num) => (
              <PageButton pageIdx={pageCount - num - 1} />
            ))}
        </>
      )}
      <button
        className={classNames(
          'relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0',
          canGetNextPage() && 'hover:bg-gray-50 text-gray-400'
        )}
        disabled={!canGetNextPage()}
        onClick={() => setPage(currentPageIdx + 1)}
      >
        <span className="sr-only">Next</span>
        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
      </button>
    </nav>
  );
}
