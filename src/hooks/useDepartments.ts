import { MultipleSelectOption } from '@/components/ui/SelectMultiple';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Local state
let localSelectedDepartments: MultipleSelectOption[] | undefined = [];

const fetchLocalSelectedDepartments = async () => {
  // Directly return the local state
  return localSelectedDepartments;
};

export const useDepartments = ({
  queryKey = 'selectedDepartments',
  initialSelectedDepartments
}: {
  queryKey?: string;
  initialSelectedDepartments?: MultipleSelectOption[];
}) => {
  if (initialSelectedDepartments) {
    updateSelectedDepartments(initialSelectedDepartments);
  }
  return useQuery([queryKey], fetchLocalSelectedDepartments);
};

const updateSelectedDepartments = async (
  newSelectedDepartments: MultipleSelectOption[] | undefined
) => {
  // Update the local state
  localSelectedDepartments = newSelectedDepartments;
  return newSelectedDepartments;
};

export const useUpdateSelectedDepartments = (queryKey = 'dateRange') => {
  const queryClient = useQueryClient();

  return useMutation(updateSelectedDepartments, {
    onSuccess: () => {
      // Invalidate and refetch the date range to get the updated data
      queryClient.invalidateQueries([queryKey]);
    }
  });
};
