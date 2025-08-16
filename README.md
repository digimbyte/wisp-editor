# Wisp Editor

A **one-click desktop editor** for Wisp projects built with **Tauri + React (TypeScript)**.

## Features

- Cross-platform desktop application (.exe/.app/.AppImage)
- **New/Open** project buttons
- **Build** button that calls Python compiler and shows logs
- Clean, dark UI with no web framework dependencies
- Calls `python -m wbc.cli compile` to build `.wbc` files

## Quick Start

### Development
```bash
npm run tauri dev
```

### Build for Production
```bash
npm run tauri build
```

## Testing the Editor

1. **Run the development server**: `npm run tauri dev`
2. **Click "Open"** and select the `TestProject` folder (located at `../TestProject/`)
3. **Ensure the entry script** is set to `scripts/hello.ash`
4. **Click "Build"** to compile the project

The build process will:
- Create a `build/` directory in your project
- Generate `main.wbc` (compiled bytecode)
- Generate `dbg.json` (debug symbols)
- Show compilation logs in the UI

## Project Structure

```
wisp-editor/
├── src/                    # React UI (TypeScript + Vite)
│   └── App.tsx            # Main editor interface
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   ├── lib.rs         # Tauri app setup
│   │   └── cmd_build.rs   # Build command implementation
│   └── Cargo.toml         # Rust dependencies
├── tools/wbc/             # Python compiler stub
│   └── wbc/
│       ├── __init__.py
│       └── cli.py         # Compiler implementation
└── TestProject/           # Sample project for testing
    ├── scripts/
    │   └── hello.ash      # Sample Wisp script
    └── tools/             # Copy of compiler for the project
```

## How It Works

1. **UI Layer**: React app with buttons for New/Open/Build
2. **Bridge Layer**: Tauri commands in Rust that interface between UI and system
3. **Compiler Layer**: Python module that compiles `.ash` files to `.wbc` bytecode
4. **Project Layer**: Each Wisp project contains its scripts and build tools

## Next Steps

- Replace the stub Python compiler with your actual Wisp compiler
- Add Monaco Editor for syntax highlighting and error locations
- Add canvas preview for sprite/graphics testing
- Add TypeScript VM integration for runtime testing
- Add project manifest editor (JSON configuration)
- Add .wpack export functionality

## Dependencies

- **Node.js** ≥ 18 LTS
- **Rust** (latest stable)
- **Python** 3.10-3.12 (for compilation)

The application will automatically detect Python in the system PATH or look for bundled Python in `project/runtime/python/`.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
