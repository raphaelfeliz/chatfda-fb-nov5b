# Replication and Setup Guide

This guide provides the necessary commands and steps to replicate the project environment and file structure.

## 1. Create Project Structure

First, create the directory structure and all the necessary files.

### 1.1 Create Directories

Run the following command to create all the necessary directories:

```bash
mkdir -p \
  docs \
  src/ai \
  src/app \
  src/components/ui \
  src/hooks \
  src/lib
```

### 1.2 Create Files

Next, create the empty files within the directories you just created:

```bash
touch \
  docs/blueprint.md \
  docs/implementationCommands.md \
  docs/projectSpecs.md \
  src/ai/dev.ts \
  src/ai/genkit.ts \
  src/app/globals.css \
  src/app/layout.tsx \
  src/app/page.tsx \
  src/components/app-header.tsx \
  src/components/configurator.tsx \
  src/components/option-card.tsx \
  src/components/progress-tracker.tsx \
  src/components/sku-display.tsx \
  src/hooks/use-mobile.tsx \
  src/hooks/use-toast.ts \
  src/hooks/use-triage.ts \
  src/lib/placeholder-images.json \
  src/lib/placeholder-images.ts \
  src/lib/triage.ts \
  src/lib/utils.ts \
  src/lib/whatsapp.ts \
  .gitignore \
  apphosting.yaml \
  components.json \
  filemap.md \
  next.config.ts \
  package.json \
  postcss.config.mjs \
  README.md \
  tsconfig.json
```

## 2. Environment Setup

After creating the file structure, set up the development environment.

### 2.1 Node.js

First, ensure you have a compatible version of Node.js installed.

- **Check Node.js version:**
  ```bash
  node -v
  ```
  This project was built using Node.js v20.11.1. It is recommended to use a version in the v20.x range.

### 2.2 Install Dependencies

Next, install all the project dependencies listed in `package.json`.

- **Install with npm:**
  ```bash
  npm install
  ```

### 2.3 Genkit Setup

Initialize Genkit for the AI functionalities.

- **Initialize Genkit:**
  ```bash
  genkit init
  ```

## 3. Running the Project

Once the setup is complete, you can run the project in development mode.

- **Start the development server:**
  ```bash
  npm run dev
  ```

This will start the Next.js development server, and you can view the application by navigating to `http://localhost:3000` in your browser.
