/*
*file-summary*
PATH: src/components/chat/chat-tab.tsx
PURPOSE: Manage the chat session lifecycle, user input, message persistence (Firestore/local), and real-time communication with the Gemini AI through `/api/chat`.
SUMMARY: Boots a fixed session from Firestore (with IndexedDB cache), falls back once to a local session if missing, maintains a legacy localStorage mirror for resilience, appends user messages optimistically, mirrors writes to Firestore, and sends/receives AI replies via `/api/chat`. Includes structured logging for full traceability (no dependency on Network tab).
IMPORTS:
  - React: useState, useEffect
  - ChatBubbleArea (default) from '@/components/chat/bubble-area/chat-bubble-area'
  - FooterArea (default) from '@/components/chat/footer-area/footer-area'
  - chat-storage helpers from '@/lib/chat-storage' (createSession, saveSession, loadSession, types)
  - saveMessage (aliased) from '@/lib/firestore'
EXPORTS:
  - ChatTab (named React functional component)
*/

'use client';

import React, { useEffect, useState } from 'react';
import ChatBubbleArea from '@/components/chat/bubble-area/chat-bubble-area';
import FooterArea from '@/components/chat/footer-area/footer-area';

import {
  createSession,
  saveSession,
  loadSession,
  type ChatSession,
  type ChatMessage,
} from '@/lib/chat-storage';
import { saveMessage as saveMessageToFirestore } from '@/lib/firestore';

/* --sectionComment
SECTION: COMPONENT (ChatTab)
SUMMARY: Orchestrates bootstrap, persistence mirror, AI message sending, and rendering.
*/
export function ChatTab() {
  /* --sectionComment
  SECTION: CONSTANTS
  SUMMARY: Defines the static session id and log scope prefix.
  */
  const sessionId = 'default-chat-session';
  const LOG_SCOPE = '[ChatTab → AI]';

  /* --sectionComment
  SECTION: STATE
  SUMMARY: Holds the active session object, message list, and a bootstrap readiness flag.
  */
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bootReady, setBootReady] = useState(false);

  /* --sectionComment
  SECTION: BOOTSTRAP (Firestore-first with local fallback)
  SUMMARY: Load session from Firestore (cached via IndexedDB). If missing, create and persist a new local session.
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
            `[ChatTab] loaded ${loaded.messages?.length ?? 0} messages from Firestore/local cache`
          );
        } else {
          const created = createSession();
          created.sessionId = sessionId;
          saveSession(created);
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
  SUMMARY: Maintain a legacy localStorage mirror for resilience; avoid state feedback loops.
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
  SECTION: SEND HANDLER (optimistic + Firestore mirror + AI request)
  SUMMARY: Append user message locally, persist to Firestore, send to `/api/chat`, and append AI reply.
  */
  const handleSendMessage = async (text: string) => {
    console.group('[ChatTab] handleSendMessage');
    console.time(`${LOG_SCOPE} total`);
    try {
      const trimmed = text?.trim();
      if (!trimmed) {
        console.warn(`${LOG_SCOPE} ignored empty message`);
        return;
      }
      if (!bootReady) console.warn(`${LOG_SCOPE} send attempted before bootstrap complete`);

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
        console.log(`${LOG_SCOPE} optimistic append → next.length =`, next.length);
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
          messages: [{ variant: 'outgoing', text: trimmed, timestamp: ts, sender: 'user', id: String(ts) }],
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      console.timeEnd(`${LOG_SCOPE} fetch latency`);
      console.log(`${LOG_SCOPE} ← AI response:`, data);

      // 4) Append assistant reply
      const aiText = data?.text ?? '(no response)';
      const reply: ChatMessage = {
        id: `${ts}-assistant`,
        sender: 'assistant',
        text: aiText,
        timestamp: Date.now(),
        variant: 'incoming',
      };
      setMessages((prev) => {
        const next = [...prev, reply];
        console.log(`${LOG_SCOPE} ✓ appended assistant reply → next.length =`, next.length);
        return next;
      });

      // 5) Optional: save assistant message to Firestore
      try {
        console.time(`${LOG_SCOPE} Firestore save (assistant)`);
        await saveMessageToFirestore(sessionId, 'assistant', aiText, { timestamp: Date.now() });
        console.timeEnd(`${LOG_SCOPE} Firestore save (assistant)`);
      } catch (fireErr) {
        console.warn(`${LOG_SCOPE} assistant save skipped:`, fireErr);
      }

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
      console.timeEnd(`${LOG_SCOPE} total`);
      console.groupEnd();
      console.groupEnd();
    }
  };

  /* --sectionComment
  SECTION: RENDER
  SUMMARY: Preserve dark theme container and fixed height; delegate list/input to presentational components.
  */
  return (
    <div className="bg-[#0d1a26] flex flex-col h-[80vh] text-white">
      <ChatBubbleArea messages={messages ?? []} />
      <FooterArea onSendMessage={handleSendMessage} />
    </div>
  );
}
