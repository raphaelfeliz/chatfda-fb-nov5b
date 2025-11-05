# Project Architecture & Technology Summary

This document provides a high-level overview of the technologies, architectural patterns, and development practices used in the "Door and Window Configurator" project.

## Technology Stack

The application is built on a modern, robust technology stack chosen for its efficiency, scalability, and strong typing capabilities.

- **Frontend Framework**: [Next.js](https://nextjs.org/) (built on [React](https://react.dev/)) is used for its powerful features, including server-side rendering (SSR), static site generation (SSG), and an intuitive file-based routing system.
- **Language**: [TypeScript](https://www.typescriptlang.org/) is used throughout the project to provide static typing, which improves code quality, enhances developer productivity, and reduces runtime errors.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) is employed for its utility-first approach, allowing for rapid and consistent UI development directly within the markup. It is configured with PostCSS for CSS transformations.
- **UI Components**: The project utilizes a component library based on [Shadcn/UI](https://ui.shadcn.com/), which provides a set of accessible and reusable UI primitives (e.g., Cards, Buttons, Toasts).
- **State Management**: Application state, specifically the logic for the product configuration quiz, is managed by a custom-built TypeScript state machine (`TriageMachine`). This centralizes the core business logic and makes the UI a direct reflection of the current state.
- **Development Environment**: The entire development environment is declaratively defined and managed by [Nix](https://nixos.org/) through the `.idx/dev.nix` file. This ensures a reproducible, consistent, and isolated environment for all developers, codifying all required packages, extensions, and startup commands.

## Architectural Approach

The project follows a component-based and state-driven architecture that promotes separation of concerns and reusability.

- **State-Driven UI**: The core of the application is the `TriageMachine` class (`/src/lib/triage.ts`). This state machine dictates the flow of questions and options presented to the user. The React UI dynamically renders based on the output of this machine, which is managed by the `useTriage` custom hook.
- **Component-Based Structure**: The user interface is broken down into a series of modular and reusable React components (located in `/src/components`). This includes presentational components (e.g., `OptionCard`, `SkuDisplay`) and container components (`Configurator`) that manage state and logic.
- **Custom Hooks for Logic Encapsulation**: Business logic and side effects are abstracted into custom React hooks (`/src/hooks`). The `useTriage` hook encapsulates all interaction with the state machine, while the `useIsMobile` hook provides responsive design capabilities.
- **Utility-First Design**: The use of Tailwind CSS encourages a consistent design system. Utility classes are combined using a `cn` helper function (`/src/lib/utils.ts`) that intelligently merges class names, preventing style conflicts.

## Development & Deployment

- **Reproducible Environments**: The `.idx/dev.nix` file is the single source of truth for the development environment. It defines the specific versions of Node.js, and other system-level dependencies, as well as VS Code extensions and workspace lifecycle hooks (`onCreate`, `onStart`). This guarantees that every developer works in an identical setup, eliminating "it works on my machine" issues.
- **Deployment**: The project is configured for deployment on **Google Cloud App Hosting**, as indicated by the presence of the `apphosting.yaml` file. This provides a scalable and managed platform for hosting the Next.js application.
