// import { useQuery, useQueryClient } from '@tanstack/react-query';
//
// let selectedCompany = null;
// // Get QueryClient from the context
// const queryClient = useQueryClient();
//
// const getSelectedCompany = () => {
//   return selectedCompany;
// };
//
// export const setSelectedCompany = (v) => {
//   queryClient.invalidateQueries({ queryKey: ['selectedCompany'] });
//
//   selectedCompany = v;
// };
//
// export const useGetSelectedCompany = () => {
//   return useQuery(['selectedCompany'], async () => {
//     return getSelectedCompany();
//   });
// };
