import { Configurator } from '@/components/configurator/configurator';
import { ChatPanel } from '@/components/chat/chat-panel';

export function DesktopMainView() {
    return (
        <div className="hidden md:flex md:flex-row">
            <div className="flex-1 border-r">
                <Configurator />
            </div>
            <div className="w-full max-w-[400px]">
                <ChatPanel />
            </div>
        </div>
    );
}
