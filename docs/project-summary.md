# SUMMARY

This is a Next.js 15 application that ships two working pillars: (1) a Firestore-backed **Chat** with offline support and optimistic UI, and (2) a guided **Configurator** that uses a deterministic triage engine to lead users to a final product (SKU + optional URL), with a polished, dark-themed UI built on Tailwind.

Under the hood, Firebase is initialized for the web with IndexedDB persistence. The chat reads from Firestore first (falling back to legacy localStorage only if needed), and writes are batched and replayed after reconnects. The configurator centralizes state via a React context that drives the triage logic and renders selectable options and a final product card (including a WhatsApp call-to-action).

---

# WHAT IT DOES:

## CONTEXT

* Provides a **guided product selection** experience (doors/windows) via a triage state machine with Portuguese prompts and image-backed options.
* Offers a **chat interface** that persists conversations per session, supports offline usage, and keeps the UI responsive with optimistic updates.
* Uses a cohesive **dark theme** and responsive components (cards, buttons, breadcrumbs) for clear progression and restart controls.

## CONFIGURATOR FLOW

* Centralized in `ConfiguratorContext`, which:

  * Holds the **current question**, **history** (for breadcrumbs), **final product** (`Option`), **SKU**, and **fullProductName**.
  * Exposes `selectOption(index)` to advance the triage; if a terminal option carries a `sku`, the flow resolves and shows the result.
  * Exposes `reset()` to return to the triage root and clear history/state.
* UI building blocks:

  * `OptionCard` for each available choice (image + label; clickable).
  * `ResultProductCard` for the terminal state (image, “Ver Preço” link if present, and a **WhatsApp** “Negociar” button).
  * `Breadcrumb` + `ProgressTracker` for path context and quick reset.

## CHAT FLOW

* `ChatTab` boots a fixed session (`default-chat-session`), **loads messages from Firestore** (benefiting from IndexedDB cache), and **optimistically** appends outgoing messages.
* On send:

  * UI appends immediately (timestamped), then `saveMessage()` writes a batched update to Firestore (message + `chats/{sessionId}.updatedAt`).
  * If offline, writes are queued and **replayed** automatically upon reconnect.
* Presentation split:

  * `FooterArea` (controlled input + Send/Enter).
  * `ChatBubbleArea` (scrolling message list).
  * `ChatBubble` (incoming/outgoing bubble styling).

---

# HOW IT DOES IT:

## APPROACH

* **Separation of concerns**:

  * UI is presentational and minimal (bubbles, cards, buttons).
  * Business logic centralized (triage machine + context).
  * Persistence isolated (`firebase.ts` for init, `firestore.ts` for reads/writes).
* **Offline-first Firestore**:

  * IndexedDB persistence enabled; multi-tab fallback when single-tab lock fails.
  * Deterministic message IDs (`sessionId-epoch-sender`) simplify reconciliation.
* **Deterministic flows**:

  * The triage machine produces reproducible paths to a SKU; the context records labels for breadcrumbing and display.

## TECHNOLOGIES

* **Framework & Language**: Next.js 15, React 18, TypeScript.
* **Data**: Firebase Firestore (web SDK) with IndexedDB offline caching.
* **UI**: Tailwind CSS (HSL tokens in `globals.css`), `lucide-react` icons, card/button primitives.
* **Utilities**: `clsx` + `tailwind-merge` via `cn()` helper.
* **Configs**:

  * `next.config.ts` (remote image allowlist; ignore build-time TS/ESLint errors).
  * `next.config.mjs` (static export mode, unoptimized images).
  * `tailwind.config.ts` (theme tokens, animations).
  * `tsconfig.json` (strict + path alias `@/*`).
  * `firestore.rules` (currently **dev-open**: `allow read, write: if true;` — not production safe).

## FILE STRUCTURE

* **Chat (confirmed)**

  * `src/components/chat/chat-tab.tsx` — controller: Firestore-first load, optimistic sends.
  * `src/components/chat/footer-area/footer-area.tsx` — input + send handling.
  * `src/components/chat/bubble-area/chat-bubble-area.tsx` — list renderer.
  * `src/components/chat/bubble-area/chat-bubble.tsx` — single message bubble.
* **Configurator (confirmed)**

  * `src/context/ConfiguratorContext.tsx` — shared state, history, SKU resolution.
  * `src/lib/triage.ts` — triage machine (questions/options; terminal SKUs/URLs).
  * `src/components/configurator/option-card.tsx` — selectable option.
  * `src/components/configurator/result-product-card.tsx` — final product card (price link + WhatsApp CTA).
  * `src/components/header/breadcrumb.tsx` & `src/components/header/progress-tracker.tsx` — path + reset UI.
  * `src/components/configurator/configurator-tab.tsx` — wrapper for `<Configurator />` (the orchestrator component is inferred but not shown).
* **Persistence & Utilities (confirmed)**

  * `src/lib/firebase.ts` — Firebase app + Firestore init; IndexedDB persistence with multi-tab fallback.
  * `src/lib/firestore.ts` — `saveMessage()` (batch write) and `loadSession()` (ordered query).
  * `src/lib/chat-storage.ts` — Firestore-first loader; legacy localStorage bridge (deprecated writes).
  * `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge).
* **Styling & Config (confirmed)**

  * `src/app/globals.css` — dark theme tokens + Tailwind layers.
  * `tailwind.config.ts`, `tsconfig.json`, `next.config.ts`, `next.config.mjs`, `package.json`.
  * `firestore.rules` — **temporary open access** (development only).
