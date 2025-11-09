// smoke-test.ts
import { extractAttributesFromText } from './src/ai/genkit';
import type { ExtractedFacets } from './src/ai/genkit';

async function runTest() {
  console.log("--- 🚀 STARTING ISOLATION TEST ---");
  
  // 1. HARDCODE THE KEY FOR ISOLATION
  // NOTE: You must replace 'PASTE_YOUR_WORKING_API_KEY_HERE' with the actual key you verified with curl.
  // This bypasses the shell's environment loading issues.
  process.env.TEST_API_KEY = 'random key hahaha';

  const mockInput = 'qual a garantia de uma janela de correr?';

  console.log(`\nSimulating Input: "${mockInput}"`);

  // 2. CALL THE FUNCTION
  const response: ExtractedFacets = await extractAttributesFromText(mockInput);

  // 3. SHOW RESULT
  console.log("\n--- ISOLATION TEST RESULT (JSON) ---");
  console.log(JSON.stringify(response, null, 2));
  console.log("------------------------------------");

  // 4. VALIDATE
  const isKbAnswerValid =
    response.knowledgeBaseAnswer !== null &&
    response.knowledgeBaseAnswer.trim() !== '';
    
  const areFacetsValid =
    response.categoria === 'janela' &&
    response.sistema === 'janela-correr';

  if (isKbAnswerValid && areFacetsValid) {
    console.log("✅ ISOLATION TEST PASSED");
    console.log("Reason: AI correctly performed dual tasks using the hardcoded key.");
  } else {
    console.log("❌ ISOLATION TEST FAILED");
    console.log("Reason: Failed to extract facets AND/OR provided a KB answer.");
    if (!isKbAnswerValid) {
      console.log("- 'knowledgeBaseAnswer' was null or empty.");
    }
    if (!areFacetsValid) {
      console.log("- Facet extraction failed.");
    }
  }
}

runTest();