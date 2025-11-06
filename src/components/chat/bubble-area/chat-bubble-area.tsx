
import React from 'react';
import ChatBubble from './chat-bubble';

interface Message {
  id: number;
  text: string;
  variant: 'incoming' | 'outgoing';
}

interface ChatBubbleAreaProps {
  messages: Message[];
}

const ChatBubbleArea: React.FC<ChatBubbleAreaProps> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg.text} variant={msg.variant} />
      ))}
    </div>
  );
};

export default ChatBubbleArea;
