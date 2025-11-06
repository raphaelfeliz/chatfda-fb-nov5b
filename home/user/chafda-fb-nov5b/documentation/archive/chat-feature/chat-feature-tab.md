Plan to implement the chat tab.

KEEP THIS TEMPLATE:
# 1 CREATE FILE XYZ.TSX (REPLACE WITH PROPER NAME)
- PATH:
- PURPOSE:
- HOW IT WORKS:
- IMPORTS:
- EXPORTS:

# 2 EXECUTE COMMAND XYZ (REPLACE WITH PROPER COMMAND)
- PURPOSE:
- WHAT IT DOES:


=====

START HERE:

# 1 CREATE FILE `src/components/nav-link.tsx`
- PATH: `src/components/nav-link.tsx`
- PURPOSE: To create a reusable navigation link component that indicates the active page with a purple outline.
- HOW IT WORKS: This component will wrap the Next.js `Link` component and use the `usePathname` hook to determine if the link's `href` matches the current URL. If it does, it will apply a specific class for the active state (e.g., a purple border).
- IMPORTS: `Link` from `next/link`, `usePathname` from `next/navigation`.
- EXPORTS: `NavLink` component.

# 2 UPDATE FILE `src/components/app-header.tsx`
- PATH: `src/components/app-header.tsx`
- PURPOSE: To replace the old header content with the new navigation menu and the FDA logo.
- HOW IT WORKS: The existing header will be modified to include the `NavLink` component for navigation between the "Configurador" and "Chat" pages. The text-based logo will be replaced with an `<Image>` component from Next.js, pointing to the new FDA logo.
- IMPORTS: `Image` from `next/image`, `NavLink` from `./nav-link`.
- EXPORTS: `AppHeader` component.

# 3 CREATE FILE `src/app/chat/page.tsx`
- PATH: `src/app/chat/page.tsx`
- PURPOSE: To create the main page for the chat feature.
- HOW IT WORKS: This will be a new route in the application. It will import and render the `ChatBubbleArea` and `FreeTextArea` components, structuring the page so that the chat bubbles are displayed above the text input area.
- IMPORTS: `ChatBubbleArea` from `@/components/chat-bubble-area`, `FreeTextArea` from `@/components/free-text-area`.
- EXPORTS: `ChatPage` component.

# 4 CREATE FILE `src/components/chat-bubble-area.tsx`
- PATH: `src/components/chat-bubble-area.tsx`
- PURPOSE: To display the conversation's chat bubbles.
- HOW IT WORKS: This component will be responsible for rendering the list of messages in the chat. It will be a scrollable area, and will be designed to automatically scroll to the latest message as new messages are added, ensuring the user always sees the most recent part of the conversation.
- IMPORTS: `useState`, `useEffect`, `useRef` from `react`.
- EXPORTS: `ChatBubbleArea` component.

# 5 CREATE FILE `src/components/free-text-area.tsx`
- PATH: `src/components/free-text-area.tsx`
- PURPOSE: To provide a sticky text input area for the user to type and send messages.
- HOW IT WORKS: This component will be fixed to the bottom of the screen to ensure it is always visible. It will contain a `textarea` for message input and a "Send" button. When the user sends a message, a callback function will be triggered to pass the new message up to the parent `ChatPage`.
- IMPORTS: `useState` from `react`, `Button` from `./ui/button`, `Textarea` from `./ui/textarea`.
- EXPORTS: `FreeTextArea` component.

# 6 EXECUTE COMMAND `mkdir -p public/assets/images`
- PURPOSE: To store the new FDA logo image.
- WHAT IT DOES: This command will create the necessary directory structure for the new logo image.

# 7 UPLOAD FILE `public/assets/images/logo FDA.png`
- PURPOSE: To add the FDA logo to the project.
- WHAT IT DOES: This will place the `logo FDA.png` file into the newly created `images` directory. I will need you to provide the image file.
