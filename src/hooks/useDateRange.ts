import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addDays, startOfMonth } from 'date-fns';
import { DateRange } from 'react-day-picker';

// Local state
let localDateRange: DateRange | undefined = {
  from: startOfMonth(new Date()),
  to: addDays(new Date(), -1)
};

const fetchDateRange = async () => {
  // Directly return the local state
  return localDateRange;
};

export const useDateRange = ({
  queryKey = 'dateRange',
  initialDateRange
}: {
  queryKey?: string;
  initialDateRange?: DateRange;
}) => {
  if (initialDateRange) {
    updateDateRange(initialDateRange);
  }
  return useQuery([queryKey], fetchDateRange);
};

const updateDateRange = async (newDateRange: DateRange | undefined) => {
  // Update the local state
  localDateRange = newDateRange;
  return newDateRange;
};

export const useUpdateDateRange = (queryKey = 'dateRange') => {
  const queryClient = useQueryClient();
  return useMutation(updateDateRange, {
    onSuccess: () => {
      // Invalidate and refetch the date range to get the updated data
      queryClient.invalidateQueries([queryKey]);
    }
  });
};
