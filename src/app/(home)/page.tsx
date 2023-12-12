import Dashboard from '@/components/Dashboard/Dashboard';
import Header from '@/components/Header/Header';

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="pt-10">
        <Dashboard />
      </div>
    </>
  );
}
