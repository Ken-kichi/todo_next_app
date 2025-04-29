'use client';

import { LayoutProps } from '@/types';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const classNames = (...classes: (string | false | null | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  const onLogout = () => {
    Cookies.remove('token'); // トークン削除
    router.push('/login'); // ログインページへリダイレクト
  };

  const navigation = [
    { name: 'Todo List', href: '/', current: true },
    { name: 'Add Todo', href: '/task/add', current: false },
    { name: 'Management', href: '/management', current: false },
    { name: 'Logout', onClick: onLogout, current: false }, // ここだけonClick
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="shrink-0">{/* アイコン省略 */}</div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) =>
                    item.onClick ? (
                      <button
                        key={item.name}
                        onClick={item.onClick}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </button>
                    ) : (
                      <a
                        key={item.name}
                        href={item.href}
                        aria-current={item.current ? 'page' : undefined}
                        className={classNames(
                          item.current
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                      >
                        {item.name}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* モバイル用パネルも同じように */}
        <DisclosurePanel className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {navigation.map((item) =>
              item.onClick ? (
                <DisclosureButton
                  key={item.name}
                  as="button"
                  onClick={item.onClick}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              ) : (
                <DisclosureButton
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                >
                  {item.name}
                </DisclosureButton>
              )
            )}
          </div>
        </DisclosurePanel>
      </Disclosure>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
