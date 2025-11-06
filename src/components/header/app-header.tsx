'use client';

import Image from 'next/image';
import { NavLink } from './nav-link';

export function AppHeader() {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Image src="/assets/images/logo FDA.png" alt="FDA Logo" width={32} height={32} />
          <span className="font-semibold text-foreground hidden sm:inline">Especialista da Fábrica</span>
        </div>
        <nav className="flex items-center gap-4 md:hidden">
          <NavLink href="/">Configurador</NavLink>
          <NavLink href="/chat">Chat</NavLink>
        </nav>
      </div>
    </header>
  );
}
