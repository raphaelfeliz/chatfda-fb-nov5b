{ pkgs, ... }: {
  # --- Base Configuration ---
  # Use the stable Nix channel for predictable package versions
  channel = "stable-24.05";

  # --- Packages ---
  # Core tools available in your development environment
  packages = [
    pkgs.nodejs_20
  ];

  # --- Environment Variables ---
  # Add your Gemini API key here. It becomes available to all dev sessions.
  env = {
    GEMINI_API_KEY = "AIzaSyDi4HT_YSKST57KsUGcTrt-GBdfZyNrtA0";
  };

  # --- IDX Workspace Configuration ---
  idx = {
    # --- VS Code Extensions ---
    # Installed automatically to enhance your DX
    extensions = [
      "dbaeumer.vscode-eslint"
      "bradlc.vscode-tailwindcss"
      "esbenp.prettier-vscode"
    ];

    # --- Workspace Lifecycle Hooks ---
    # Defines what happens when the environment is created or started
    workspace = {
      onCreate = {
        npm-install = "npm install";
      };
      onStart = {
        dev-server = "npm run dev";
      };
    };

    # --- Previews ---
    # Configure Firebase Studio’s web preview for your app
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--" "--port" "$PORT"];
          manager = "web";
        };
      };
    };
  };
}
