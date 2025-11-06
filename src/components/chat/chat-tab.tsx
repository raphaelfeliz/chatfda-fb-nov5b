
import React from 'react';
import ChatBubbleArea from './bubble-area/chat-bubble-area';
import FooterArea from './footer-area/footer-area';

const ChatTab: React.FC = () => {
  return (
    <div className="bg-[#0d1a26] flex flex-col h-[80vh] text-white">
      <ChatBubbleArea messages={[]} />
      <FooterArea />
    </div>
  );
};

export default ChatTab;
