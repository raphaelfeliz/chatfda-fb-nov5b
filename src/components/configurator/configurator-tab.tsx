/*
*file-summary*
PATH: src/components/configurator/configurator-tab.tsx
PURPOSE: Provide a thin wrapper component used by the tabbed layout to render the Configurator.
SUMMARY: Imports the default Configurator component and exposes a small named wrapper (ConfiguratorTab) for use in mobile/desktop tab switches.
IMPORTS:
  - Configurator (default) from '@/components/configurator/configurator'
EXPORTS:
  - ConfiguratorTab (named React component)
*/

import Configurator from '@/components/configurator/configurator';

export function ConfiguratorTab() {
  return <Configurator />;
}
