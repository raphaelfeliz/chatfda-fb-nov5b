/*
*file-summary*
PATH: src/components/configurator/configurator.tsx
PURPOSE: Render the guided product configurator, driving the triage flow and final product result UI.
SUMMARY: Reads state from ConfiguratorContext; shows either the terminal ResultProductCard (with composed label)
         or the current question with image-backed options via OptionCard. Layout uses a responsive container.
IMPORTS:
  - useConfiguratorContext from '@/context/ConfiguratorContext'
  - { OptionCard } from './option-card'
  - { ResultProductCard } from './result-product-card'
EXPORTS:
  - default Configurator (React component)
*/

'use client';

import { useConfiguratorContext } from '@/context/ConfiguratorContext';
import { OptionCard } from './option-card';
import { ResultProductCard } from './result-product-card';

export default function Configurator() {
  const { currentState, sku, selectOption, finalProduct, fullProductName } =
    useConfiguratorContext();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {sku && finalProduct ? (
        <>
          <ResultProductCard product={{ ...finalProduct, label: fullProductName }} />
        </>
      ) : currentState ? (
        <>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            {currentState.question}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {currentState.options.map((option, index) => (
              <OptionCard
                key={option.value + index}
                option={option}
                onClick={() => selectOption(index)}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
