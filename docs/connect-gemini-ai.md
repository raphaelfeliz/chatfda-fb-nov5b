## 1 SETUP PHASE (COMPLETED)

### 1.1 INSTALLATION

* **1.1.1 Install Genkit and Google AI plugin**

  * Added `@genkit-ai/core` and `@genkit-ai/google-genai` to `package.json`.
  * ✅ *Status: done*

### 1.2 CONFIGURATION

* **1.2.1 Create Genkit configuration file**

  * Created `src/ai/genkit.ts` to initialize Genkit with `googleAI()` and set Gemini as the default model.
  * ✅ *Status: done*

### 1.3 API INTEGRATION

* **1.3.1 Create API route for chat**

  * Added `src/app/api/chat/route.ts` to receive messages and communicate with Gemini via Genkit.
  * ✅ *Status: done*

### 1.4 FRONTEND CONNECTION

* **1.4.1 Update chat component**

  * Modified `src/components/chat/chat-tab.tsx` to send messages to `/api/chat` and handle responses.
  * ✅ *Status: done*

---

## 2 STABILIZATION PHASE

### 2.1 ENVIRONMENT & CONFIGURATION

* **2.1.1 Create `.env.local` with `GOOGLE_GENAI_API_KEY`**
* **2.1.2 Add `.env.local` to `.gitignore`**
* **2.1.3 Verify environment variable detection via `process.env`**
* **2.1.4 Implement fallback warning for missing key**

### 2.2 SERVER STABILITY

* **2.2.1 Add structured error handling in `/api/chat`**
* **2.2.2 Return clear JSON error responses**
* **2.2.3 Add lightweight request logging (id, duration)**

---

## 3 INTERACTION PHASE

### 3.1 FRONTEND CONNECTION

* **3.1.1 Add Gemini streaming support to `ChatTab`**
* **3.1.2 Show “AI typing…” indicator during response generation**
* **3.1.3 Preserve chat history for context continuity**

### 3.2 UX IMPROVEMENTS

* **3.2.1 Visually separate AI/user messages**
* **3.2.2 Add timestamps and smooth scroll behavior**
* **3.2.3 Verify responsive layout on mobile and desktop**

---

## 4 TEST & DEPLOY PHASE

### 4.1 LOCAL TESTING

* **4.1.1 Validate `/api/chat` with real Gemini key using `curl`**
* **4.1.2 Test chat flow in browser**
* **4.1.3 Simulate error and offline states**

### 4.2 DEPLOYMENT PREP

* **4.2.1 Configure Firebase Hosting environment variables**
* **4.2.2 Test cloud-hosted API behavior**
* **4.2.3 Perform final smoke test: prompt → Gemini reply → UI render**
