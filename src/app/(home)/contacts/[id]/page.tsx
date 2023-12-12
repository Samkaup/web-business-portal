import MemberContactEdit from '@/components/MemberContact/MemberContact.Edit';
import { getContact } from '@/utils/supabase_queries/contact';
import createClient from '@/utils/supabase-server';
export default async function MemberContact({
  params
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const contact = await getContact(supabase, params.id);
  return <MemberContactEdit contact={contact}></MemberContactEdit>;
}
