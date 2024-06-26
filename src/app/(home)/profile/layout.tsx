import Header from '@/components/Header/Header';
import { Separator } from '@/components/Shadcn/ui/separator';
import { SidebarNav } from '@/components/SidebarNav';

const sidebarNavItems = [
  {
    title: 'Prófíllinn minn',
    href: '/profile'
  }
  // {
  //   title: 'Tilkynningar',
  //   href: '/profile/notifications'
  // }
];

type Props = {
  children: React.ReactNode;
};

export default function SettingsLayout({ children }: Props) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <Header title="Mínar stillingar" />
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
