import Header from '@/components/Header/Header';
import supabaseServer from '@/utils/supabase-server';
import { getDepartmentsWithContacts } from '@/utils/supabase_queries/contacts';
import Button from '@/components/ui/Button/Button';
import MemberAccountListWithContacts from '@/components/MemberAccount/MemberAccount.List';
import { PlusIcon } from '@heroicons/react/24/outline';

export default async function Contacts() {
  const supabase = supabaseServer();
  const departments = await getDepartmentsWithContacts(supabase);

  return (
    <>
      <Header title="Deildir og úttektaraðilar">
        <Button size="lg">
          Stofna deild
          <PlusIcon className="-mr-0.5 h-5 w-5 text-white"></PlusIcon>
        </Button>
      </Header>

      <MemberAccountListWithContacts
        departments={departments}
      ></MemberAccountListWithContacts>
    </>
  );
}
