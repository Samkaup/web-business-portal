import Dashboard from '@/components/Dashboard/Dashboard';
import Header from '@/components/Header/Header';

export default async function HomePage() {
  return (
    <>
      <Header title="Heim"></Header>
      <div className="pt-10">
        <Dashboard></Dashboard>
      </div>
    </>
  );
}
