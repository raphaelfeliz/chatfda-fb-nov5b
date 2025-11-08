/*
*file-summary*
PATH: src/components/chat/chat-tab.tsx
PURPOSE: Manages the chat UI, message history, and acts as the "glue"
         between user text input and the ConfiguratorContext.
SUMMARY: This component is now fully integrated with the ConfiguratorContext.
         It sends user input to the AI, receives a JSON "form" (ExtractedFacets),
         and passes that form to the context's `applyExtractedFacets` function.
         It also *listens* to the context's `currentQuestion` to post app-generated
         question bubbles.
IMPORTS:
 - React: useState, useEffect, useRef
 - Context: useConfiguratorContext
 - Engine/AI types: ExtractedFacets
 - Components: ChatBubbleArea, FooterArea
 - Firestore: chat-storage helpers, saveMessageToFirestore
EXPORTS:
 - ChatTab (named React functional component)
*/

'use client';

import React, { useEffect, useState, useRef } from 'react';
import ChatBubbleArea from '@/components/chat/bubble-area/chat-bubble-area';
import FooterArea from '@/components/chat/footer-area/footer-area';
// --- FIX: Removed ResultProductCard as it's no longer rendered here ---
import {
  createSession,
  saveSession,
  loadSession,
  type ChatSession,
  type ChatMessage,
} from '@/lib/chat-storage';
import { saveMessage as saveMessageToFirestore } from '@/lib/firestore';
import { useConfiguratorContext } from '@/context/ConfiguratorContext';
import { type ExtractedFacets } from '@/ai/genkit';
// --- FIX: Removed Product import as it's no longer needed ---

/* --sectionComment
SECTION: COMPONENT (ChatTab)
*/
export function ChatTab() {
  /* --sectionComment
  SECTION: CONSTANTS
  */
  const sessionId = 'default-chat-session';
  const LOG_SCOPE = '[ChatTab → AI]';

  /* --sectionComment
  SECTION: STATE
  */
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bootReady, setBootReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // --- Get state and functions from our "Smarter Brain" Context ---
  const {
    currentQuestion,
    finalProducts, // <-- We still listen for this to stop posting questions
    applyExtractedFacets,
  } = useConfiguratorContext();

  // Ref to prevent duplicate question-posting
  const lastPostedQuestionRef = useRef<string | null>(null);

  /* --sectionComment
  SECTION: BOOTSTRAP (Firestore-first)
  */
  useEffect(() => {
    console.group('[ChatTab] mount bootstrap');
    (async () => {
      try {
        console.log('sessionId =', sessionId);
        const loaded = await loadSession(sessionId);
        if (loaded) {
          setSession(loaded);
          setMessages(loaded.messages ?? []);
          console.log(
            `[ChatTab] loaded ${
              loaded.messages?.length ?? 0
            } messages from Firestore/local cache`
          );
        } else {
          const created = createSession();
          created.sessionId = sessionId;
          saveSession(created); // Save legacy local
          setSession(created);
          setMessages([]);
          console.log('[ChatTab] created new session (empty)');
        }
      } catch (e) {
        console.error('[ChatTab] bootstrap error:', e);
      } finally {
        setBootReady(true);
        console.groupEnd();
      }
    })();
  }, []);

  /* --sectionComment
  SECTION: LOCAL MIRROR (Deprecated)
  */
  useEffect(() => {
    if (!session) return;
    console.groupCollapsed('[ChatTab] messages changed → local mirror');
    try {
      const snapshot: ChatSession = { ...session, messages, updatedAt: Date.now() };
      saveSession(snapshot);
      console.log('saveSession(snapshot), messages.length =', messages.length);
    } catch (e) {
      console.error('[ChatTab] saveSession error:', e);
    } finally {
      console.groupEnd();
    }
  }, [messages, session]);

  /* --sectionComment
  SECTION: NEW: Listen to ConfiguratorContext
  */
  useEffect(() => {
    // Do not post any new questions if the flow is finished
    if (!bootReady || !currentQuestion || finalProducts) {
      return;
    }

    const newQuestionText = currentQuestion.question;
    const lastMessage = messages[messages.length - 1];

    if (
      newQuestionText &&
      newQuestionText !== lastPostedQuestionRef.current &&
      newQuestionText !== lastMessage?.text
    ) {
      console.log(
        `[ChatTab] Context changed. Posting new question: ${newQuestionText}`
      );
      const ts = Date.now();
      const appBubble: ChatMessage = {
        id: String(ts),
        sender: 'assistant',
        text: newQuestionText,
        timestamp: ts,
        variant: 'incoming',
      };
      setMessages((prev) => [...prev, appBubble]);
      lastPostedQuestionRef.current = newQuestionText; // Mark as posted

      // Save the app's question to Firestore
      saveMessageToFirestore(sessionId, 'bot', newQuestionText, {
        timestamp: ts,
      });
    }
    // Listen for changes to finalProducts to stop posting questions
  }, [currentQuestion, finalProducts, messages, bootReady, sessionId]);

  /* --sectionComment
  SECTION: SEND HANDLER (Refactored for "Form-Filling" AI)
  */
  const handleSendMessage = async (text: string) => {
    console.group('[ChatTab] handleSendMessage');
    console.time(`${LOG_SCOPE} total`);
    setIsLoading(true);
    try {
      const trimmed = text?.trim();
      if (!trimmed) {
        console.warn(`${LOG_SCOPE} ignored empty message`);
        return;
      }
      if (!bootReady)
        console.warn(`${LOG_SCOPE} send attempted before bootstrap complete`);

      const ts = Date.now();
      const optimistic: ChatMessage = {
        id: String(ts),
        sender: 'user',
        text: trimmed,
        timestamp: ts,
        variant: 'outgoing',
      };

      // 1) Optimistic UI append
      setMessages((prev) => {
        const next = [...prev, optimistic];
        console.log(
          `${LOG_SCOPE} optimistic append → next.length =`,
          next.length
        );
        return next;
      });

      // 2) Firestore mirror
      console.time(`${LOG_SCOPE} Firestore write`);
      await saveMessageToFirestore(sessionId, 'user', trimmed, { timestamp: ts });
      console.timeEnd(`${LOG_SCOPE} Firestore write`);
      console.log(`${LOG_SCOPE} Firestore write completed`);

      // 3) AI Request
      console.group(`${LOG_SCOPE} send to /api/chat`);
      console.time(`${LOG_SCOPE} fetch latency`);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: trimmed,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // 4) Receive AI "Form"
      const aiJson: ExtractedFacets = await response.json();
      console.timeEnd(`${LOG_SCOPE} fetch latency`);
      console.log(`${LOG_SCOPE} ← AI response (JSON Form):`, aiJson);

      // 5) Apply AI Form to Context
      applyExtractedFacets(aiJson);

      console.log(`${LOG_SCOPE} completed successfully`);
    } catch (err) {
      console.error(`${LOG_SCOPE} ❌ error during send:`, err);
      const fallback: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Error: unable to reach AI backend.',
        timestamp: Date.now(),
        variant: 'incoming',
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
      console.timeEnd(`${LOG_SCOPE} total`);
      console.groupEnd();
      console.groupEnd();
    }
  };

  /* --sectionComment
  SECTION: RENDER
  */
  return (
    <div className="bg-[#0d1a26] flex flex-col h-[80vh] text-white">
      <ChatBubbleArea messages={messages ?? []} />
      {/* --- FIX: Removed the ResultProductCard section as requested --- */}
      <FooterArea onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}