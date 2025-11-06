'use client';

import Image from 'next/image';
import { ProgressTracker } from './progress-tracker'
import { useConfiguratorContext } from '@/context/ConfiguratorContext';

export function AppHeader() {
  const { history, reset } = useConfiguratorContext();
  return (
    <header className="bg-background/80 backdrop-blur-sm z-40 w-full border-b h-[10vh]">
      <div className="container mx-auto px-4 h-full flex flex-col justify-center items-center md:flex-row md:justify-between space-y-2 md:space-y-0">
        <div className="relative w-32 h-[9vh]">
          <Image
            src="/assets/images/logo FDA.png"
            alt="Fábrica do Alumínio Logo"
            fill
            className="object-contain"
          />
        </div>

        <div>
          <ProgressTracker history={history} onReset={reset} />
        </div>
      </div>
    </header>
  );
}
