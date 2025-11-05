
# **App Name**: Door and Window Configurator

## Core Features:

- **Question-Based Navigation**: The application guides users through a structured series of questions to configure their desired door or window. This process is managed by a state machine implemented in the `TriageMachine` class within `src/lib/triage.ts`. The user's selections determine the next question, creating a dynamic and intuitive configuration path.

- **Dynamic Option Display**: For each question, the application dynamically renders a set of options, each presented as a card with an image and a descriptive label. This is driven by the `QuestionState` object provided by the `TriageMachine`, which contains the current question and an array of `Option` objects. Each `Option` object includes a `label`, `value`, and `picture` URL, ensuring that the visual representation is always in sync with the current state of the configuration process.

- **State Management**: The application's state is centrally managed by the `TriageMachine` class. The `getState()` method provides the current `QuestionState`, allowing the UI to render the appropriate question and options. The `triage(index)` method is the core of the state machine, processing the user's selection and transitioning to the next state. The `reset()` method allows the user to start the configuration process over from the beginning. This robust state management ensures a predictable and consistent user experience.

- **SKU and Product URL Retrieval**: Upon completing the configuration, the `TriageMachine` provides a final SKU and a URL for the configured product. When a user selects an option that leads to a final product, the `triage` method returns an object containing the product's `sku`. This SKU can be used for inventory management, order processing, and other business-critical operations. The URL can be used to redirect the user to a product page.

- **Responsive Design**: The application is designed to be fully responsive, with a mobile-first approach. The `use-mobile.tsx` hook is used to adapt the layout and functionality to different screen sizes, ensuring a seamless experience on both desktop and mobile devices.

## Style Guidelines:

- **Primary Color**: Soft blue (`#A0D2EB`) is used to create a sense of trust and reliability, which is crucial for a product configuration experience.
- **Background Color**: A very light grey (`#F0F4F8`) provides a clean, neutral, and non-distracting backdrop for the product options.
- **Accent Color**: Warm orange (`#E59866`) is used for interactive elements, such as buttons and highlights. This color was chosen to provide good contrast against the primary and background colors, making it easy for users to identify calls to action.
- **Typography**: The 'Inter' sans-serif font is used for all body and headline text. This font was chosen for its clean, modern, and neutral aesthetic, which enhances readability.
- **Iconography**: Clear and representative icons are used to visually support each choice, with a focus on doors and windows. These icons help users to quickly and easily understand the options available to them.
- **Layout**: The application employs a card-based layout with images and clear labels for options. This layout is designed to simplify the decision-making process by presenting information in a clear and concise manner.
- **User Feedback**: Subtle transitions and animations are used to provide feedback to the user when they select an option. This feedback helps to create a more engaging and interactive experience.

## State Machine Breakdown

The `TriageMachine` class in `src/lib/triage.ts` defines the state transitions of the configurator. Here is a breakdown of the states and their transitions:

- **`root`**: The initial state. Asks the user if they are looking for a "Janela" (window) or "Porta" (door).
- **`askJanelaSystem`**: Asks for the window opening system ("Correr" or "Maxim-ar").
- **`askPortaSystem`**: Asks for the door opening system ("Correr" or "Giro").
- **`askJanelaCorrerPersiana`**: Asks if the sliding window should have an integrated blind ("Sim" or "Não").
- **`askJanelaMaximarFolhas`**: Asks for the number of modules for the maxim-ar window.
- **`askPortaCorrerPersiana`**: Asks if the sliding door should have an integrated blind ("Sim" or "Não").
- **`askPortaGiroMaterial`**: Asks for the filling material of the swing door.
- **`askJanelaCorrerPersianaTipo`**: Asks if the blind for the sliding window should be motorized or manual.
- **`askJanelaCorrerSemPersianaMaterial`**: Asks for the filling material of the sliding window without a blind.
- **`askPortaCorrerPersianaTipo`**: Asks if the blind for the sliding door should be motorized or manual.
- **`askPortaCorrerSemPersianaMaterial`**: Asks for the filling material of the sliding door without a blind.
- **`askPortaGiroFolhas`**: Asks for the number of leaves for the swing door.
- **`askJanelaCorrerVidroFolhas`**: Asks for the number of leaves for the sliding glass window.
- **`askJanelaCorrerVeneFolhas`**: Asks for the number of leaves for the sliding window with venetian blind.
- **`askPortaCorrerVidroFolhas`**: Asks for the number of leaves for the sliding glass door.
- **`askPortaCorrerVeneFolhas`**: Asks for the number of leaves for the sliding door with venetian blind.

Each of these states has a corresponding private method in the `TriageMachine` class that defines the question and options for that state. The `triage` method handles the transitions between these states based on the user's selections.
