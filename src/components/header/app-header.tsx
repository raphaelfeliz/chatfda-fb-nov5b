'use client';

import Image from 'next/image';
import { useConfiguratorContext } from '@/context/ConfiguratorContext';
import { ProgressTracker } from './progress-tracker';
import { ResetButton } from './restart-button';
import { Breadcrumb } from './breadcrumb';

export function AppHeader() {
  const { history, reset } = useConfiguratorContext();

  return (
    <header className="bg-background/80 backdrop-blur-sm z-40 w-full border-b h-[15vh]">
      <div className="container mx-auto px-4 h-full flex items-center">
        {/* --- DESKTOP VIEW --- */}
        <div className="hidden md:flex w-full items-center justify-between">
          <div className="relative w-32 h-[9vh]">
            <Image
              src="/assets/images/logo FDA.png"
              alt="Fábrica do Alumínio Logo"
              fill
              className="object-contain"
            />
          </div>
          <ProgressTracker history={history} onReset={reset} />
        </div>

        {/* --- MOBILE VIEW --- */}
        <div className="md:hidden flex flex-col justify-center w-full h-full space-y-2">
          {/* Top Row */}
          <div className="flex items-center w-full">
            {/* Left */}
            <div className="w-1/2 relative h-[8vh]">
              <Image
                src="/assets/images/logo FDA.png"
                alt="Fábrica do Alumínio Logo"
                fill
                className="object-contain object-left"
              />
            </div>
            {/* Right */}
            <div className="w-1/2 flex justify-end">
              <ResetButton onReset={reset} />
            </div>
          </div>

          {/* Bottom Row */}
          <div className="w-full">
            <Breadcrumb history={history} />
          </div>
        </div>
      </div>
    </header>
  );
}
