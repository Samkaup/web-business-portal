'use client';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Logo from '@/components/Logo/Logo';
import { useGetProfile } from '@/utils/react_query_hooks/profile';
import { useGetSelectedCompany } from '@/utils/react_query_hooks/selected_company';
import Link from 'next/link';

const navigation = [
  { name: 'Heim', href: '#', current: true },
  { name: 'Hreyfingaryfirlit', href: '#', current: false },
  { name: 'Úttektaraðilar', href: '#', current: false },
  { name: 'Stillingar fyrirtækis', href: '#', current: false },
];
const userNavigation = [
  {
    name: 'Your Profile',
    onClick: () => console.log('Your Profile clicked'),
  },
  { name: 'Settings', onClick: () => console.log('Settings clicked') },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function getInitals(fullName: string) {
  const parts: string[] = fullName.split(' ');
  const initalsArr = parts.map((part: string) => part.at(0)).slice(0, 2);
  return initalsArr.join('');
}

export default function Navigation() {
  const { data, isSuccess } = useGetProfile();
  const { data: selectedCompany } = useGetSelectedCompany();

  return (
    <>
      <div className="">
        <Disclosure as="nav" className="bg-company">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Logo />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? 'bg-white/10 text-white'
                                : 'text-white hover:bg-company hover:bg-opacity-75',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={item.current ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <p className="text-white">
                        Selected company: {selectedCompany}
                      </p>
                      <button
                        type="button"
                        className="rounded-full bg-company p-1 text-white hover:text-white/50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-company"
                      >
                        <span className="sr-only">Tilkynningar</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-company text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-company">
                            <span className="sr-only">Open user menu</span>
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ">
                              <span className="font-medium leading-none text-company-950">
                                {isSuccess ? getInitals(data.full_name) : ''}
                              </span>
                            </span>
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <button
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700 w-full'
                                    )}
                                  >
                                    {item.name}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                            <Menu.Item>
                              {({ active }) => (
                                <form action="/auth/signout" method="post">
                                  <button
                                    type="submit"
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700 w-full'
                                    )}
                                  >
                                    Sign Out
                                  </button>
                                </form>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-company p-2 text-white hover:bg-company hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-company">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
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
                        item.current
                          ? 'bg-company text-white'
                          : 'text-white hover:bg-company hover:bg-opacity-75',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="border-t border-company pb-3 pt-4">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white ">
                        <span className="font-medium leading-none text-company-950">
                          {isSuccess ? getInitals(data.full_name) : ''}
                        </span>
                      </span>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-white">
                        {isSuccess ? data?.full_name : ''}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="ml-auto flex-shrink-0 rounded-full bg-company p-1 text-company hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-company"
                    >
                      <span className="sr-only">Tilkynningar</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
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
    </>
  );
}
