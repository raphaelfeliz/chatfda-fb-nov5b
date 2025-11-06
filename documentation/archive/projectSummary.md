# CONTEXT

The "Door and Window Configurator" is a web application designed to guide users through a structured, question-based process to configure their ideal door or window. By navigating a series of choices, users can customize features such as product type (door or window), opening mechanism, and material. This intuitive system simplifies the decision-making process, ensuring users can create a product that meets their specific needs.

At the heart of the application is the `TriageMachine`, a TypeScript state machine that manages the configuration logic. This class dictates the sequence of questions and the available options for each step. The front end, built with Next.js and React, dynamically renders the user interface based on the state provided by the `TriageMachine`, creating a seamless and interactive experience.

The project is built on a modern technology stack that includes Next.js, React, TypeScript, and Tailwind CSS, with a responsive, mobile-first design. While the codebase includes files for Genkit AI integration, these features are not currently implemented, and the application relies on hardcoded data within the state machine. The application is configured for deployment on Google Cloud App Hosting, making it ready for production.

## Root Files

- **`apphosting.yaml`**: This file is used to configure the deployment on Google Cloud App Hosting. It is currently empty.

- **`next.config.ts`**: This is the configuration file for Next.js. It includes settings for TypeScript, ESLint, and remote image sources. The remote patterns for images allow the application to load images from `placehold.co`, `images.unsplash.com`, `picsum.photos`, and `storage.googleapis.com`.

- **`README.md`**: This file provides a brief introduction to the project and links to the Firebase documentation for customizing the development environment.

- **`components.json`**: This file is likely used for component library configuration, but it is currently empty.

- **`postcss.config.mjs`**: This file configures PostCSS, a tool for transforming CSS with JavaScript plugins. It is set up to use Tailwind CSS.

- **`tailwind.config.ts`**: This is the configuration file for Tailwind CSS. It defines the application's theme, including fonts, colors, and animations. It also specifies the files to be scanned for Tailwind classes and includes the `tailwindcss-animate` plugin.

## /src/app/

- **`globals.css`**: This file contains the global styles for the application. It uses `@tailwind` directives to include Tailwind's base, components, and utilities styles. It also defines a dark theme using CSS variables, with a color palette based on dark blue-grays and purples.

- **`layout.tsx`**: This is the root layout for the Next.js application. It sets up the HTML structure, including the `AppHeader` and `Toaster` components, and applies global styles. It also imports the "Inter" font from Google Fonts and sets the `dark` class on the `html` element, enabling the dark theme.

- **`page.tsx`**: This is the main page of the application. It renders the `Configurator` component, which is the core of the user interface for the door and window configuration process.

## /src/lib/

- **`whatsapp.ts`**: This file exports a function `generateWhatsAppLink` that generates a WhatsApp API link to a hardcoded phone number. The link includes a pre-filled message in Portuguese: "gostaria de negociar o preço de [productName]."

- **`placeholder-images.ts`**: This file defines the `ImagePlaceholder` type and exports an array of these objects called `PlaceHolderImages`. This data is imported from an external JSON file and is used to display product images and related information throughout the application.

- **`triage.ts`**: This is the core of the product configuration logic. It contains the `TriageMachine` class, a state machine that guides the user through a series of questions. The file defines the data structures for questions (`QuestionState`) and answers (`Option`), and the class methods manage the flow of the triage process, transitioning between states based on user selections. All questions, options, and transitions are hardcoded within this file.

- **`utils.ts`**: This file provides a utility function `cn` that merges CSS classes. It uses `clsx` to conditionally apply classes and `tailwind-merge` to resolve conflicting Tailwind CSS classes, ensuring a clean and predictable application of styles.

## /src/components/

- **`app-header.tsx`**: This component renders the application header. It includes the company logo/name and navigation buttons. The header is styled to be sticky and has a blurred background effect.

- **`configurator.tsx`**: This is the main component for the product configurator. It uses the `useTriage` hook to manage the state of the configuration process. It displays the current question and a grid of `OptionCard` components for the user to select from. Once the configuration is complete, it displays the `SkuDisplay` component. It also includes a `ProgressTracker` to show the user's progress.

- **`option-card.tsx`**: This component displays a single option in the configurator. It consists of a card with an image and a label. When clicked, it triggers the `onClick` handler passed to it.

- **`progress-tracker.tsx`**: This component displays the user's progress through the configurator. It shows the path of selections made so far and includes a "Reset" button.

- **`sku-display.tsx`**: This component is displayed when the user has completed the configuration. It shows the final product image, name, and buttons to "See Price" (if a URL is available) and "Negotiate on WhatsApp".

## /src/hooks/

- **`use-mobile.tsx`**: This hook provides a way to check if the user is on a mobile device. It returns `true` if the screen width is less than 768px.

- **`use-triage.ts`**: This custom hook manages the state of the product configurator. It initializes a `TriageMachine` and provides the current state, SKU, history of selections, and functions to select an option and reset the state. It handles the logic of stepping through the triage process and determining the final product.
