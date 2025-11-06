'use client';

import { useState } from 'react';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

// Define the shape of a message
interface ChatMessage {
  message: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
}

export function ChatPanel() {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      message: 'Hello, how can I help you configure your doors and windows today?',
      sender: 'assistant',
      direction: 'incoming',
    },
  ]);

  const handleSend = async (message: string) => {
    const newMessage: ChatMessage = {
      message,
      sender: 'user',
      direction: 'outgoing',
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }), // send all messages for context (good practice for later)
      });

      const data = await response.json();
      const { reply } = data; // a single message object { role, content }

      setMessages([
        ...newMessages,
        {
          message: reply.content,
          sender: reply.role,
          direction: 'incoming',
        },
      ]);
    } catch (error) {
      console.error('Failed to fetch from API:', error);
      // Optionally, add an error message to the chat
      setMessages([
        ...newMessages,
        {
          message: 'Sorry, I am having trouble connecting. Please try again later.',
          sender: 'assistant',
          direction: 'incoming',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: 'calc(100vh - 80px)' }}>
      <MainContainer>
        <ChatContainer>
          <MessageList typingIndicator={typing ? <TypingIndicator content="Assistant is typing" /> : null}>
            {messages.map((msg, i) => (
              <Message
                key={i}
                model={{
                  message: msg.message,
                  sentTime: 'just now',
                  sender: msg.sender,
                  direction: msg.direction,
                  position: 'normal',
                }}
              />
            ))}
          </MessageList>
          <MessageInput placeholder="Type message here" onSend={handleSend} attachButton={false} />
        </ChatContainer>
      </MainContainer>
    </div>
  );
}
