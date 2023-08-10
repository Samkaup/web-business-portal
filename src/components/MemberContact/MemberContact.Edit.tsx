import Header from '@/components/Header/Header';
import MemberAccountCreate from '../MemberAccount/MemberAccount.Create';

export default function MemberContactEdit({ contact }) {
  return (
    <>
      <Header title={`${contact.full_name}`}>{contact.department.name}</Header>
      <MemberAccountCreate account={false}></MemberAccountCreate>
    </>
  );
}
