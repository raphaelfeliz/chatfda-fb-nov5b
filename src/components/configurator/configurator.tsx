/*
*file-summary*
PATH: src/components/configurator/configurator.tsx
PURPOSE: Render the guided product configurator, driving the triage flow and final product result UI.
SUMMARY: Reads state from the refactored ConfiguratorContext; shows either the
         terminal ResultProductCard (with composed label) or the current question
         with image-backed options via OptionCard.
IMPORTS:
 - useConfiguratorContext from '@/context/ConfiguratorContext'
 - { OptionCard } from './option-card'
 - { ResultProductCard } from './result-product-card'
 - { BASE_PRODUCT_URL } from '@/lib/productDatabase' (NEW)
EXPORTS:
 - default Configurator (React component)
*/

'use client';

import { useConfiguratorContext } from '@/context/ConfiguratorContext';
import { OptionCard } from './option-card';
import { ResultProductCard } from './result-product-card';
// --- FIX: Import the base URL to construct the final link ---
import { BASE_PRODUCT_URL } from '@/lib/productDatabase';

export default function Configurator() {
  // 1. Destructure the NEW state variables and functions from the context
  const {
    currentQuestion,    // Replaces currentState
    finalProducts,      // Replaces sku and finalProduct
    fullProductName,    // Unchanged
    setAttribute,       // Replaces selectOption
  } = useConfiguratorContext();

  // 2. Check for the NEW final product state (an array)
  const isFinished = finalProducts && finalProducts.length > 0;
  
  // 3. Get the first product (or null) to display in the result card
  const productToShow = isFinished ? finalProducts[0] : null;

  // --- FIX: Create the 'product' prop for the card, constructing the full URL ---
  const productForCard = productToShow ? {
      label: fullProductName,
      picture: productToShow.image, // Map 'image' to 'picture'
      url: productToShow.slug ? `${BASE_PRODUCT_URL}${productToShow.slug}` : null // Construct the full URL
  } : null;
  // --- END FIX ---

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {isFinished && productForCard ? (
        // Render the final result card
        <>
          {/* Pass the newly constructed object */}
          <ResultProductCard product={productForCard} />
        </>
      ) : currentQuestion ? (
        // Render the current question and options
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {currentQuestion.question}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {currentQuestion.options.map((option, index) => (
              <OptionCard
                key={option.value + index}
                option={option}
                // 4. Use the NEW onClick handler, passing attribute and value
                onClick={() =>
                  setAttribute(currentQuestion.attribute, option.value)
                }
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}