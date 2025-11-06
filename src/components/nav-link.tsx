'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps {
  href: string;
  children: ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-2 text-sm font-medium ${
        isActive
          ? 'text-white ring-1 ring-inset ring-purple-500'
          : 'text-gray-400 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}
