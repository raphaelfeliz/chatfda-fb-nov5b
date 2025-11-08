/*
*file-summary*
PATH: src/components/chat/footer-area/footer-area.tsx
PURPOSE: Provide the chat input interface for composing and sending messages.
SUMMARY: Implements a controlled text input with validation, Enter-key support, and a Send button.
         It now accepts an `isLoading` prop to disable the controls while the AI is processing.
IMPORTS: React (useState), lucide-react (Send icon)
EXPORTS: FooterArea (React functional component)
*/

import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface FooterAreaProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean; // <-- FIX: Accept the isLoading prop
}

const FooterArea: React.FC<FooterAreaProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSendClick = () => {
    // FIX: Don't send if already loading or if input is empty
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // FIX: Don't send on Enter if already loading
    if (event.key === 'Enter' && !isLoading) {
      handleSendClick();
    }
  };

  return (
    <div className="p-4 bg-[#14293D]">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          placeholder={isLoading ? 'processando...' : 'digite aqui'}
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isLoading} // <-- FIX: Disable input when loading
          className="flex-1 bg-[#0d1a26] rounded-full py-3 px-5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36C0F2] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          onClick={handleSendClick}
          disabled={isLoading} // <-- FIX: Disable button when loading
          className="flex-shrink-0 bg-[#36C0F2] text-[#0d1a26] rounded-full h-12 w-12 flex items-center justify-center hover:bg-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#36C0F2] focus:ring-offset-2 focus:ring-offset-[#14293D] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FooterArea;