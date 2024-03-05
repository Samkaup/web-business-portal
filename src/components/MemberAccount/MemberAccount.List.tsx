'use client';

import { DepartmentWithContacts } from '@/utils/supabase_queries/department';
import { MemberAccountItem } from './MemberAccount.Item';
type Props = {
  departments: DepartmentWithContacts[];
};
export default function MemberAccountListWithContacts({ departments }: Props) {
  return (
    <div>
      {departments.map((department) => {
        return (
          <MemberAccountItem
            startOpened={departments.length < 3 ? true : false}
            key={department.external_identifier}
            department={department}
          ></MemberAccountItem>
        );
      })}
    </div>
  );
}
