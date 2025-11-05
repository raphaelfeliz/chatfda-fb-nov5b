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
      "dbaeumer.vscode-eslint",      # For JavaScript/TypeScript linting.
      "bradlc.vscode-tailwindcss",   # For Tailwind CSS IntelliSense and linting.
      "esbenp.prettier-vscode"      # For automatic code formatting.
    ];

    # Define workspace lifecycle hooks.
    workspace = {
      # Commands to run only once when the workspace is first created.
      onCreate = {
        npm-install = "npm install"; # Installs all project dependencies from package.json.
      };
    };
  };
}
