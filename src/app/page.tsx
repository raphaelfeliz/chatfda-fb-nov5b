/*
*file-summary*
PATH: src/app/page.tsx
PURPOSE: Render the home page with a responsive UI: Configurator and Chat as tabs on mobile and side-by-side on desktop.
SUMMARY: Uses local state to switch tabs on mobile; on desktop, shows the Configurator main area and a sticky Chat sidebar. Imports aligned with current export contracts (named ChatTab, default Configurator).
IMPORTS:
 - React: useState
 - { ChatTab } from '@/components/chat/chat-tab'
 - Configurator from '@/components/configurator/configurator'
 - { ConfiguratorTab } from '@/components/configurator/configurator-tab'
EXPORTS:
 - default Home (React component)
*/

'use client';

import { useState } from 'react';
// --- FINAL FIX: Removed explicit '.tsx' extensions ---
import { ChatTab } from '@/components/chat/chat-tab';
import Configurator from '@/components/configurator/configurator';
import { ConfiguratorTab } from '@/components/configurator/configurator-tab';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'configurator' | 'chat'>('configurator');

  return (
    <main className="flex-1 flex flex-col">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden border-b">
        <nav className="flex items-center justify-around">
          <button
            onClick={() => setActiveTab('configurator')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'configurator'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Monte Agora
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-2 px-4 text-sm font-medium ${
              activeTab === 'chat'
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground'
            }`}
          >
            Chat Online
          </button>
        </nav>
      </div>

      <div className="flex flex-1">
        {/* Mobile View */}
        <div className="md:hidden w-full">
          {activeTab === 'configurator' && <ConfiguratorTab />}
          {activeTab === 'chat' && <ChatTab />}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex flex-1">
          <div className="flex-1 p-4">
            <Configurator />
          </div>
          <div className="w-[400px] border-l">
            <div className="sticky top-0">
              <ChatTab />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}