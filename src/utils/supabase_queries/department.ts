import { AppSupabaseClient, TableRow } from '@/types';

export const getDepartments = async (
  supabase: AppSupabaseClient
): Promise<TableRow<'department'>[]> => {
  // RLS is enabled
  const { data, error } = await supabase.from('department').select('*');

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

export type DepartmentWithContacts = {
  closed: boolean | null;
  company_id: string | null;
  created_at: string | null;
  discount_scheme: string | null;
  external_identifier: string;
  name: string | null;
  updated_at: string | null;
  contact: Array<{
    cell_phone: string | null;
    closed: boolean | null;
    closed_at: string | null;
    created_at: string | null;
    department_id: string | null;
    email_address: string | null;
    external_identifier: string;
    full_name: string | null;
    main_contact: boolean | null;
    updated_at: string | null;
  }>;
};
type DepartmentWithContactsProps = {
  supabase: AppSupabaseClient;
  company_id: string;
};
export const getDepartmentsWithContacts = async ({
  supabase,
  company_id
}: DepartmentWithContactsProps): Promise<DepartmentWithContacts[]> => {
  if (!company_id) {
    throw Error('company_id parameter is missing');
  }
  const { data: departments, error } = await supabase
    .from('department')
    .select('*, contact(*)')
    .eq('company_id', company_id);

  if (error) {
    console.log(error);
    throw error;
  }
  return departments;
};

export const getDepartmentsByCompany = async (
  supabase: AppSupabaseClient,
  company_id: string
): Promise<TableRow<'department'>[]> => {
  // RLS is enabled
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .eq('company_id', company_id);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

export const getRecentDepartmentsByCompany = async (
  supabase: AppSupabaseClient,
  company_id: string
): Promise<TableRow<'department'>[]> => {
  // RLS is enabled
  const { data, error } = await supabase
    .from('department')
    .select('*')
    .eq('company_id', company_id)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};

type createDepartmentProps = {
  supabase: AppSupabaseClient;
  department: {
    name: string;
    external_identifier: string;
    company_id: string;
  };
};
export const createDepartment = async ({
  supabase,
  department
}: createDepartmentProps): Promise<TableRow<'department'>> => {
  if (!department) {
    throw Error('department parameter is missing');
  }
  const { data, error } = await supabase.from('department').insert(department);

  if (error) {
    console.log(error);
    throw error;
  }

  return data;
};
