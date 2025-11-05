
# Project File Map

This document provides a concise overview of the major files and directories in this project.

## Root Directory

- **`next.config.ts`**: Configuration for the Next.js framework.
- **`tailwind.config.ts`**: Configuration for the Tailwind CSS utility-first framework.
- **`tsconfig.json`**: TypeScript compiler options for the project.
- **`package.json`**: Lists project dependencies and defines scripts.
- **`apphosting.yaml`**: Configuration for deploying to Google Cloud App Hosting.

## `src` Directory

### `src/app`

- **`layout.tsx`**: The root layout component for all pages.
- **`page.tsx`**: The main entry point page of the application.
- **`globals.css`**: Global CSS styles applied to the entire application.

### `src/components`

- **`configurator.tsx`**: The primary component that drives the product configuration UI.
- **`app-header.tsx`**: The application's main header component.
- **`option-card.tsx`**: A reusable card component to display a selectable option.
- **`progress-tracker.tsx`**: Displays the user's current progress through the configuration steps.
- **`sku-display.tsx`**: Component to show the final generated SKU.

### `src/components/ui`

- **`*`**: A collection of reusable UI components from the ShadCN library (e.g., `button.tsx`, `card.tsx`, `input.tsx`).

### `src/hooks`

- **`use-triage.ts`**: A custom hook to manage the state and logic of the configuration process via the `TriageMachine`.
- **`use-mobile.tsx`**: A custom hook to detect if the user is on a mobile device.
- **`use-toast.ts`**: A custom hook for displaying toast notifications.

### `src/lib` OK

- **`triage.ts`**: Contains the core `TriageMachine` class, which is a state machine that manages the product configuration logic. OK
- **`utils.ts`**: A collection of utility functions used throughout the application. OK
- **`whatsapp.ts`**: Functions related to WhatsApp integration. OK
- **`placeholder-images.ts`**: Exports data for placeholder images used in the UI. OK

### `src/ai`

- **`genkit.ts`**: Main file for Genkit AI integration.
- **`dev.ts`**: Genkit development-specific setup.

## `docs` Directory

- **`*`**: Contains documentation files related to the project, such as blueprints, implementation commands, and project specifications.
