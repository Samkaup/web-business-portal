import Header from '@/components/Header/Header';
import { Separator } from '@/components/Shadcn/ui/separator';
import { SidebarNav } from '@/components/SidebarNav';
import { UserIcon } from '@heroicons/react/24/outline';

const sidebarNavItems = [
  {
    icon: <UserIcon className="w-5 h-5 mr-2" />,
    title: 'Notendur',
    href: '/admin/users'
  }
];

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  return (
    <>
      <div className="space-y-6  pb-16 md:block">
        <Header title="Stjórnsíða fyrir Samkaup" />
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  );
}
