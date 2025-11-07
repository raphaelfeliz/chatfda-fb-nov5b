/*
*file-summary*
PATH: src/ai/genkit.ts
PURPOSE: Configure and expose the Genkit client with Gemini AI and define a simple callable flow for chat responses.
SUMMARY: Initializes Genkit with the Google Gemini 2.5-flash model and defines `menuFlow`, a lightweight,
         latency-logged async function that transforms the latest user input into a Gemini prompt and returns
         normalized plain text. Adds structured logs for initialization, prompt size, and response length.
IMPORTS:
  - genkit (core client)
  - googleAI (Gemini plugin)
EXPORTS:
  - ai (Genkit instance)
  - menuFlow (async text-generation helper)
*/

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/* --sectionComment
SECTION: GENKIT CLIENT CONFIG
SUMMARY: Initializes Genkit with Google Gemini 2.5-flash as the default model and logs setup success.
*/
console.group('[genkit]');
console.time('[genkit] init');
export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
console.timeEnd('[genkit] init');
console.log('[genkit] ✅ Initialized Gemini 2.5-flash');
console.groupEnd();

/* --sectionComment
SECTION: MENU FLOW
SUMMARY: Simple async flow that accepts (last, history), sends prompt to Gemini, logs timing, and returns normalized text.
*/
export async function menuFlow(
  last: { role: string; content: { text: string }[] },
  history: { role: string; content: { text: string }[] }[]
): Promise<string> {
  const LOG_SCOPE = '[genkit→menuFlow]';
  const prompt = last?.content?.[0]?.text ?? '';

  console.group(`${LOG_SCOPE} call`);
  console.log(`${LOG_SCOPE} prompt length:`, prompt.length);
  console.log(`${LOG_SCOPE} history size:`, history.length);

  console.time(`${LOG_SCOPE} latency`);
  try {
    const response = await ai.generate({ prompt });
    console.timeEnd(`${LOG_SCOPE} latency`);

    const text =
      (response as any)?.text ??
      (response as any)?.output?.text ??
      (response as any)?.outputText ??
      '';

    console.log(`${LOG_SCOPE} response length:`, text?.length ?? 0);
    console.groupEnd();

    return text || '(no response)';
  } catch (err: any) {
    console.error(`${LOG_SCOPE} ❌ error:`, err?.message || err);
    console.groupEnd();
    return '(error generating response)';
  }
}
