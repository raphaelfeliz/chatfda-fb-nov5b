# Implementation Plan for Environment Setup

This document outlines the plan to create a fully automated, reproducible, and consistent development environment for the "Door and Window Configurator" project. The core of this plan is to leverage the `.idx/dev.nix` file to declaratively manage all necessary tools, dependencies, and configurations.

## 1. Goal

The primary goal is to configure the `.idx/dev.nix` file so that the development environment is set up automatically upon workspace creation and startup. This eliminates manual setup steps, ensures consistency across all developers, and streamlines the development workflow.

## 2. `dev.nix` Configuration

The following Nix configuration should be placed in the `.idx/dev.nix` file. This single file will define the entire development environment.

```nix
{ pkgs, ... }: {
  # Use a stable channel for Nix packages to ensure reproducibility.
  channel = "stable-24.05";

  # Install necessary system-level packages.
  packages = [
    pkgs.nodejs_20  # Provides the Node.js runtime, required for the Next.js application.
  ];

  # Configure the IDE with recommended VS Code extensions.
  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"      # For JavaScript/TypeScript linting.
      "bradlc.vscode-tailwindcss"   # For Tailwind CSS IntelliSense and linting.
      "esbenp.prettier-vscode"      # For automatic code formatting.
    ];

    # Define workspace lifecycle hooks.
    workspace = {
      # Commands to run only once when the workspace is first created.
      onCreate = {
        npm-install = "npm install"; # Installs all project dependencies from package.json.
      };

      # Commands to run every time the workspace is started or restarted.
      onStart = {
        dev-server = "npm run dev"; # Starts the Next.js development server.
      };
    };

    # Configure the web preview for the application.
    previews = {
      enable = true;
      previews = {
        # Define a preview named "web".
        web = {
          # Command to start the application and listen on the correct port.
          # The `$PORT` variable is dynamically assigned by the environment.
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web"; # Use the standard web preview manager.
        };
      };
    };
  };
}
```

## 3. Explanation of the Configuration

- **`channel`**: Sets the Nix package set to `stable-24.05`, which provides a consistent set of package versions for all users.
- **`packages`**: Installs `nodejs_20`, making the `node`, `npm`, and `npx` commands available in the terminal.
- **`idx.extensions`**: Automatically installs essential VS Code extensions for linting, code formatting, and Tailwind CSS support, creating a rich development experience.
- **`idx.workspace.onCreate`**: The `npm install` command is run automatically the first time the workspace is created, ensuring all dependencies are present before development begins.
- **`idx.workspace.onStart`**: The `npm run dev` command is executed every time the workspace starts, automatically running the application's development server.
- **`idx.previews`**: This section enables and configures a web preview pane within the IDE. It tells the environment how to start the Next.js server and makes it accessible on the `$PORT` provided, allowing for seamless live testing and development.

## 4. Execution Steps

1.  **Create/Update the file**: Save the code block from section 2 into the file at `.idx/dev.nix`.
2.  **Reload the Environment**: After saving the file, a prompt will appear asking to reload the environment. Approving this will apply all the configurations defined in the file.
3.  **Verification**: Once the environment reloads:
    - `npm install` will run automatically (visible in the terminal on first creation).
    - `npm run dev` will start, and its output will be visible in the terminal.
    - The "Previews" panel will show the running web application.

This plan ensures that any developer opening this project will have a fully functional and optimized development environment with zero manual configuration.
