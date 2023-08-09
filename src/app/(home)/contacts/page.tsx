import Header from '@/components/Header/Header';
import supabaseServer from '@/utils/supabase-server';
import { getDepartmentsWithContacts } from '@/utils/supabase_queries/contacts';
import Button from '@/components/ui/Button/button';
import MemberContact from '@/components/MemberContact/MemberContact';

export default async function Contacts() {
  const supabase = supabaseServer();
  const departments = await getDepartmentsWithContacts(supabase);
  return (
    <>
      <Header title="Úttektaraðilar">
        <Button size="sm">Stofna úttektaraðila +</Button>
      </Header>
      {departments.map((department) => {
        return (
          <ul
            role="list"
            className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
          >
            <li
              key={department.id}
              className="relative flex justify-between gap-x-6 px-4 py-5 bg-gray-50  sm:px-6"
            >
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">{department.name}</div>
              </div>
              <div className="flex shrink-0 items-center gap-x-4">DO</div>
            </li>
            <ul
              role="list"
              className="divide-y divide-gray-100 overflow-hidden bg-white shadow-sm ring-1 ring-gray-900/5"
            >
              {department.contact.map((c) => (
                <MemberContact key={c.id} contact={c}></MemberContact>
              ))}
            </ul>
          </ul>
        );
      })}
    </>
  );
}
