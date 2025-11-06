
import React from 'react';

interface ChatBubbleProps {
  message: string;
  variant: 'incoming' | 'outgoing';
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, variant }) => {
  const bubbleClasses = variant === 'incoming'
    ? 'bg-[#14293D] text-white rounded-t-2xl rounded-br-2xl'
    : 'bg-[#36C0F2] text-[#0d1a26] rounded-t-2xl rounded-bl-2xl';

  const wrapperClasses = variant === 'incoming'
    ? 'flex justify-start'
    : 'flex justify-end';

  return (
    <div className={wrapperClasses}>
      <div className={`${bubbleClasses} p-4 max-w-[75%]`}>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;
