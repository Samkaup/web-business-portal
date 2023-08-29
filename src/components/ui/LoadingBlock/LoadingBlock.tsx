import { Spinner } from '@/components/ui/Spinner/Spinner';
import { Props } from './LoadingBlock.types';
export const LoadingBlock = ({
  title = 'Sæki gögn..',
  className = '',
}: Props) => {
  return (
    <>
      <div className={className}>
        <button
          disabled
          type="button"
          className="animate-pulse py-5 px-10 mr-2 text-xl font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center"
        >
          <Spinner></Spinner>
          <span className="ml-4">{title}</span>
        </button>
      </div>
    </>
  );
};
