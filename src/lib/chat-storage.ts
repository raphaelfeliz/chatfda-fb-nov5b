/*
*file-summary*
PATH: src/lib/chat-storage.ts
PURPOSE: Unified chat persistence layer prioritizing Firestore reads with localStorage fallback.
SUMMARY: Fetches messages from Firestore using offline caching (IndexedDB). 
         Falls back to localStorage only when Firestore returns no data or fails entirely.
IMPORTS: firebase/firestore (collection, getDocs, query, orderBy)
EXPORTS: createSession, saveSession (deprecated), loadSession (Firestore-first)
*/

'use client';

import { db } from './firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

/*
IMPLEMENTATION
PURPOSE: Define chat message and session structures.
HOW: Include metadata for version tracking and device context.
*/
export type ChatMessage = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  variant: 'incoming' | 'outgoing';
};

export type ChatSession = {
  sessionId: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
  meta: {
    version: number;
    device: 'web';
  };
};

/*
IMPLEMENTATION
PURPOSE: Create a new chat session template.
HOW: Generate a unique sessionId using timestamp + random suffix.
*/
export function createSession(): ChatSession {
  const now = Date.now();
  const sessionId = `${now}-${Math.random().toString(36).substring(2, 9)}`;

  return {
    sessionId,
    createdAt: now,
    updatedAt: now,
    messages: [],
    meta: {
      version: 1,
      device: 'web',
    },
  };
}

/*
IMPLEMENTATION
PURPOSE: Disable local persistence to enforce Firestore-first policy.
HOW: Replaces storage writes with console notice for transparency.
*/
export function saveSession(_session: ChatSession) {
  if (typeof window !== 'undefined') {
    console.info('[chat-storage] saveSession disabled — Firestore handles persistence.');
  }
}

/*
IMPLEMENTATION
PURPOSE: Load session data, prioritizing Firestore with built-in IndexedDB cache.
HOW: Query ordered messages from Firestore; fallback to localStorage only if Firestore is empty.
*/
export async function loadSession(sessionId: string): Promise<ChatSession | null> {
  console.groupCollapsed(`[chat-storage] loadSession (${sessionId})`);
  try {
    const q = query(collection(db, 'chats', sessionId, 'messages'), orderBy('timestamp', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const messages: ChatMessage[] = snapshot.docs.map((doc) => {
        const data = doc.data() as Omit<ChatMessage, 'id'>;
        return { id: doc.id, ...data };
      });

      const session: ChatSession = {
        sessionId,
        createdAt: messages[0]?.timestamp ?? Date.now(),
        updatedAt: messages[messages.length - 1]?.timestamp ?? Date.now(),
        messages,
        meta: { version: 1, device: 'web' },
      };

      console.info(`[chat-storage] ✅ Loaded ${messages.length} messages from Firestore (cached or live)`);
      console.groupEnd();
      return session;
    }

    console.warn('[chat-storage] Firestore returned empty; checking localStorage fallback...');
    const legacyData = localStorage.getItem(sessionId);
    if (legacyData) {
      console.warn('[chat-storage] ⚠ Using legacy localStorage fallback data');
      console.groupEnd();
      return JSON.parse(legacyData) as ChatSession;
    }

    console.info('[chat-storage] No data found in Firestore or localStorage.');
    console.groupEnd();
    return null;
  } catch (err) {
    console.error('[chat-storage] ❌ Firestore load error:', err);
    console.groupEnd();
    return null;
  }
}
