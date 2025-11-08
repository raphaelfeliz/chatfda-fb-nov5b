/*
*file-summary*
PATH: src/ai/genkit.ts
PURPOSE: Configure Genkit/Gemini to act as a structured JSON "form-filler".
SUMMARY: Initializes Gemini 2.5-flash and defines `extractAttributesFromText`. This
         flow accepts only the user's input, injects a "form-filling"
         system prompt, and forces Gemini to return a static set of keys
         (categoria, sistema, etc.) with extracted values or null.
IMPORTS:
 - genkit (core client)
 - googleAI (Gemini plugin)
 - z (Zod for schema definition)
 - fs, path (Node.js for reading the Knowledge Base)
EXPORTS:
 - ai (Genkit instance)
 - ExtractedFacets (Interface for the JSON structure)
 - extractAttributesFromText (async JSON-generation flow)
*/

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';

// RENAMED Interface
export interface ExtractedFacets {
  categoria: string | null;
  sistema: string | null;
  persiana: string | null;
  persianaMotorizada: string | null;
  material: string | null;
  folhasNumber: string | null;
}

// The Zod schema Genkit uses to force Gemini's JSON output structure.
const extractionSchema = z.object({
  categoria: z
    .string()
    .nullable()
    .describe('Identifique interesse por: "porta" ou "janela".'),
  sistema: z
    .string()
    .nullable()
    .describe(
      'Identifique interesse por: "janela-correr", "porta-correr", "giro", ou "maxim-ar".'
    ),
  persiana: z
    .string()
    .nullable()
    .describe('Identifique interesse: "sim" ou "nao".'),
  persianaMotorizada: z
    .string()
    .nullable()
    .describe('Identifique interesse: "motorizada" ou "manual".'),
  material: z
    .string()
    .nullable()
    .describe(
      'Identifique interesse por: "vidro", "vidro + veneziana", "lambri", "veneziana", ou "vidro + lambri".'
    ),
  folhasNumber: z
    .string()
    .nullable()
    .describe('Identifique o número de folhas (ex: "1", "2", "3", "4", "6").'),
});

/* --sectionComment
SECTION: GENKIT CLIENT CONFIG
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
SECTION: KNOWLEDGE BASE LOADER (for later use)
*/
function getKnowledgeBase(): string {
  const LOG_SCOPE = '[genkit→getKnowledgeBase]';
  try {
    const kbPath = path.resolve(process.cwd(), 'src/ai/ai_kb.yaml');
    const fileContent = fs.readFileSync(kbPath, 'utf8');
    console.log(`${LOG_SCOPE} ✅ Loaded ai_kb.yaml`);
    return fileContent;
  } catch (err) {
    console.error(`${LOG_SCOPE} ❌ ERROR: Could not read ai_kb.yaml.`, err);
    return 'Knowledge Base is unavailable.';
  }
}
const knowledgeBase = getKnowledgeBase();

/* --sectionComment
SECTION: AI "FORM-FILLER" FLOW
*/
// RENAMED Function
export async function extractAttributesFromText(
  userInput: string
): Promise<ExtractedFacets> {
  const LOG_SCOPE = '[genkit→extractAttributesFromText]';
  console.group(`${LOG_SCOPE} call`);

  // The prompt with all 6 attributes
  const systemInstruction = `
Sua única tarefa é analisar a mensagem do usuário e extrair atributos de produto.
Responda APENAS com um objeto JSON.

REGRAS:
1.  Sempre retorne um objeto JSON com estas exatas chaves:
    "categoria"
    "sistema"
    "persiana"
    "persianaMotorizada"
    "material"
    "folhasNumber"

2.  Para cada chave, extraia o valor da mensagem do usuário com base nas opções abaixo.
3.  Se o usuário não mencionar uma opção para uma chave, use 'null' como valor.

OPÇÕES VÁLIDAS PARA EXTRAÇÃO:
- "categoria":
  - "porta" (se o usuário disser 'porta', 'portas')
  - "janela" (se o usuário disser 'janela', 'janelas')
- "sistema":
  - "janela-correr" (se o usuário disser 'janela de correr')
  - "porta-correr" (se o usuário disser 'porta de correr')
  - "maxim-ar" (se o usuário disser 'maxim-ar', 'maximar', 'basculante')
  - "giro" (se o usuário disser 'giro', 'de giro', 'de abrir')
- "persiana":
  - "sim" (se o usuário disser 'com persiana', 'persiana integrada', 'blackout')
  - "nao" (se o usuário disser 'sem persiana', 'só vidro')
- "persianaMotorizada":
  - "motorizada" (se o usuário disser 'motorizada', 'automática', 'controle remoto')
  - "manual" (se o usuário disser 'manual')
- "material":
  - "vidro" (se o usuário disser 'vidro')
  - "vidro + veneziana" (se o usuário disser 'vidro e veneziana')
  - "lambri" (se o usuário disser 'lambri', 'fechada')
  - "veneziana" (se o usuário disser 'veneziana', 'ventilada')
  - "vidro + lambri" (se o usuário disser 'vidro e lambri', 'metade vidro')
- "folhasNumber":
  - "1" (se o usuário disser '1 folha', 'uma folha')
  - "2" (se o usuário disser '2 folhas', 'duas folhas')
  - "3" (se o usuário disser '3 folhas', 'três folhas')
  - "4" (se o usuário disser '4 folhas', 'quatro folhas')
  - "6" (se o usuário disser '6 folhas', 'seis folhas')
`;

  console.log(`${LOG_SCOPE} User Input:`, userInput);
  console.time(`${LOG_SCOPE} latency`);

  try {
    const response = await ai.generate({
      prompt: userInput,
      system: systemInstruction,
      output: {
        schema: extractionSchema,
        format: 'json',
      },
    });

    console.timeEnd(`${LOG_SCOPE} latency`);
    const data = response.output;

    if (!data) {
      throw new Error('No output data returned from AI.');
    }

    console.log(`${LOG_SCOPE} ✅ Success, returning JSON:`, data);
    console.groupEnd();
    return data;
  } catch (err: any) {
    console.timeEnd(`${LOG_SCOPE} latency`);
    console.error(`${LOG_SCOPE} ❌ error:`, err?.message || err);
    console.groupEnd();

    // Return a "safe" fallback object in case of error
    return {
      categoria: null,
      sistema: null,
      persiana: null,
      persianaMotorizada: null,
      material: null,
      folhasNumber: null,
    };
  }
}