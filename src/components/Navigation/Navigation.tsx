'use client';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classNames from '@/utils/style/classNames';
import NavSettingsDropddown from '@/components//NavSettingsDropdown/NavSettingsDropdown';

const navigation = [
  { name: 'Heim', href: '/' },
  { name: 'Hreyfingaryfirlit', href: '/transactions' },
  { name: 'Deildir & úttektaraðilar', href: '/contacts' }
];
const userNavigation = [
  {
    name: 'Mínar stillingar',
    href: '/profile'
  },
  {
    name: 'Fyrirtækin mín',
    href: '/companies'
  }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div>
      <Disclosure as="nav" className="bg-company">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Link href="/">
                      <Logo />
                    </Link>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            pathname === item.href
                              ? 'bg-white/10 text-white'
                              : 'text-white hover:bg-company hover:bg-opacity-75',
                            'rounded-md px-3 py-2 text-sm font-medium'
                          )}
                          aria-current={
                            pathname === item.href ? 'page' : undefined
                          }
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    <NavSettingsDropddown></NavSettingsDropddown>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-company p-2 text-white hover:bg-company hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-company">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      pathname === item.href
                        ? 'bg-company text-white'
                        : 'text-white hover:bg-company hover:bg-opacity-75',
                      'block rounded-md px-3 py-2 text-base font-medium'
                    )}
                    aria-current={pathname === item.href ? 'page' : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="border-t border-company pb-3 pt-4">
                <NavSettingsDropddown />
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-white hover:bg-company-950 hover:bg-opacity-75"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
