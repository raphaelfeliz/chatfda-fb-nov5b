import { ChatTab } from '@/components/chat/chat-tab';
import { DesktopMainView } from '@/components/app-view/desktop-main-view';

export default function ChatPage() {
  return (
    <main className="min-h-screen w-full bg-background font-body">
      <div className="md:hidden">
        <ChatTab />
      </div>
      <DesktopMainView />
    </main>
  );
}
