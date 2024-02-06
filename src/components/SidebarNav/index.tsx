'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/Shadcn/ui/button';

// Include a ReactNode type for the icon
interface SidebarNavItem {
  href: string;
  title: string;
  icon?: React.ReactNode; // Icon component
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[];
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1',
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            pathname === item.href
              ? 'bg-muted hover:bg-muted'
              : 'hover:bg-transparent hover:underline',
            'flex items-center justify-start' // Updated for icon alignment
          )}
        >
          {item.icon && <span className="mr-2">{item.icon}</span>}{' '}
          {/* Render icon */}
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
