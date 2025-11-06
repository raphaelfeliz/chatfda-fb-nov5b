import { ConfiguratorTab } from '@/components/configurator/configurator-tab';
import { DesktopMainView } from '@/components/app-view/desktop-main-view';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-background font-body">
      <div className="md:hidden">
        <ConfiguratorTab />
      </div>
      <DesktopMainView />
    </main>
  );
}
