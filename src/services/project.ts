import { join, basename } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile, exists, mkdir, readDir } from '@tauri-apps/plugin-fs';
import * as yaml from 'js-yaml';
import { dialogService } from './dialog';
import { spriteService } from './sprite';

export interface ProjectStructure {
  name: string;
  path: string;
  template?: string;
  board?: string;
  files: {
    scripts: string[];
    assets: string[];
    config: string[];
  };
  lastModified: string;
}

export interface ProjectConfig {
  name: string;
  version: string;
  template?: string;
  board?: string;
  buildSettings: {
    target: string;
    optimization: string;
  };
  dependencies: string[];
}

const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  name: '',
  version: '1.0.0',
  buildSettings: {
    target: 'WSBC Bytecode',
    optimization: 'Debug'
  },
  dependencies: []
};

class ProjectService {
  
  async openProjectDialog(): Promise<string | null> {
    try {
      console.log('Opening project dialog...');
      return await dialogService.selectDirectory();
    } catch (error) {
      console.error('Failed to open project dialog:', error);
      return null;
    }
  }

  async selectDirectoryDialog(): Promise<string | null> {
    try {
      console.log('Opening directory selection dialog...');
      return await dialogService.selectDirectory();
    } catch (error) {
      console.error('Failed to open directory dialog:', error);
      return null;
    }
  }

  async createProject(
    projectPath: string,
    projectName: string,
    template?: string,
    board?: string
  ): Promise<boolean> {
    try {
      console.log('Creating project with params:', { projectPath, projectName, template, board });
      
      const fullProjectPath = await join(projectPath, projectName);
      console.log('Full project path:', fullProjectPath);
      
      // Create project directory structure first
      console.log('Creating directories...');
      await mkdir(fullProjectPath, { recursive: true });
      await mkdir(await join(fullProjectPath, 'scripts'), { recursive: true });
      await mkdir(await join(fullProjectPath, 'assets'), { recursive: true });
      await mkdir(await join(fullProjectPath, 'build'), { recursive: true });
      console.log('Directories created successfully');
      
      // Test file writing now that directory exists
      console.log('Testing basic file write...');
      const testPath = await join(fullProjectPath, 'test.txt');
      try {
        await writeTextFile(testPath, 'Hello World!');
        console.log('Basic file write test successful');
      } catch (writeError) {
        console.error('Basic file write test failed:', writeError);
        console.error('Write error type:', typeof writeError);
        console.error('Write error message:', (writeError as any)?.message || 'No message');
        if (writeError instanceof Error) {
          console.error('Write error stack:', writeError.stack);
        }
        throw new Error(`File write test failed: ${String(writeError)}`);
      }
      
      // Create project config file
      console.log('Creating project config...');
      const projectConfig: ProjectConfig = {
        ...DEFAULT_PROJECT_CONFIG,
        name: projectName,
        template,
        board
      };
      
      const configPath = await join(fullProjectPath, 'wisp-project.yaml');
      const configContent = yaml.dump(projectConfig, { indent: 2 });
      console.log('Config content:', configContent);
      console.log('Writing config to:', configPath);
      
      try {
        await writeTextFile(configPath, configContent);
        console.log('Config file written successfully');
        
        // Verify the file was written and is readable
        await this.verifyFileWritten(configPath, configContent);
        console.log('Config file verified successfully');
      } catch (configError) {
        console.error('Config file write failed:', configError);
        throw configError;
      }
      
      // Create board definition file if board is specified
      if (board && board !== 'custom-board') {
        console.log('Creating board definition file...');
        const boardPath = await join(fullProjectPath, 'board.h');
        const boardContent = this.generateBoardHeader(board);
        try {
          await writeTextFile(boardPath, boardContent);
          console.log('Board file written successfully');
        } catch (boardError) {
          console.error('Board file write failed:', boardError);
          throw boardError;
        }
      }
      
      // Create sample files based on template
      console.log('Creating template files...');
      try {
        await this.createTemplateFiles(fullProjectPath, template || 'Empty Project');
        console.log('Template files created successfully');
      } catch (templateError) {
        console.error('Template files creation failed:', templateError);
        throw templateError;
      }
      
      // Create sprite and audio directories
      console.log('Creating sprite and audio directories...');
      try {
        await spriteService.createSpriteDirectories(fullProjectPath);
        console.log('Sprite and audio directories created successfully');
      } catch (spriteError) {
        console.error('Sprite directories creation failed:', spriteError);
        throw spriteError;
      }
      
      // Create a README file
      console.log('Creating README...');
      const readmePath = await join(fullProjectPath, 'README.md');
      const readmeContent = this.generateReadme(projectName, template, board);
      try {
        await writeTextFile(readmePath, readmeContent);
        console.log('README created successfully');
      } catch (readmeError) {
        console.error('README creation failed:', readmeError);
        throw readmeError;
      }
      
      console.log('Project creation completed successfully');
      return true;
    } catch (error) {
      console.error('Failed to create project:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', (error as any)?.message || 'No message available');
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      return false;
    }
  }

  async loadProject(projectPath: string): Promise<ProjectStructure | null> {
    try {
      if (!(await exists(projectPath))) {
        throw new Error('Project path does not exist');
      }
      
      const projectName = await basename(projectPath);
      const configPath = await join(projectPath, 'wisp-project.yaml');
      
      let projectConfig: ProjectConfig = {
        ...DEFAULT_PROJECT_CONFIG,
        name: projectName
      };
      
      // Load project config if it exists
      if (await exists(configPath)) {
        const configText = await readTextFile(configPath);
        const loadedConfig = yaml.load(configText) as Partial<ProjectConfig>;
        projectConfig = { ...projectConfig, ...loadedConfig };
      }
      
      // Scan project structure
      const files = await this.scanProjectFiles(projectPath);
      
      return {
        name: projectName,
        path: projectPath,
        template: projectConfig.template,
        board: projectConfig.board,
        files,
        lastModified: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to load project:', error);
      return null;
    }
  }

  private async scanProjectFiles(projectPath: string): Promise<ProjectStructure['files']> {
    const files: ProjectStructure['files'] = {
      scripts: [],
      assets: [],
      config: []
    };
    
    try {
      // Scan scripts folder
      const scriptsPath = await join(projectPath, 'scripts');
      if (await exists(scriptsPath)) {
        const scriptEntries = await readDir(scriptsPath);
        files.scripts = scriptEntries
          .filter(entry => entry.name?.endsWith('.ash') || entry.name?.endsWith('.wisp'))
          .map(entry => entry.name!)
          .sort();
      }
      
      // Scan assets folder
      const assetsPath = await join(projectPath, 'assets');
      if (await exists(assetsPath)) {
        const assetEntries = await readDir(assetsPath);
        files.assets = assetEntries
          .filter(entry => {
            const name = entry.name?.toLowerCase() || '';
            return name.endsWith('.png') || name.endsWith('.jpg') || 
                   name.endsWith('.gif') || name.endsWith('.wav') || 
                   name.endsWith('.mp3') || name.endsWith('.json');
          })
          .map(entry => entry.name!)
          .sort();
      }
      
      // Look for config files
      const configEntries = await readDir(projectPath);
      files.config = configEntries
        .filter(entry => {
          const name = entry.name?.toLowerCase() || '';
          return name.endsWith('.yaml') || name.endsWith('.yml') || 
                 name.endsWith('.toml') || name.endsWith('.json');
        })
        .map(entry => entry.name!)
        .sort();
        
    } catch (error) {
      console.warn('Error scanning project files:', error);
    }
    
    return files;
  }

  private async createTemplateFiles(projectPath: string, template: string): Promise<void> {
    const scriptsPath = await join(projectPath, 'scripts');
    
    switch (template) {
      case '2D Platformer':
        await this.createPlatformerTemplate(scriptsPath);
        break;
      case 'Top-down Shooter':
        await this.createShooterTemplate(scriptsPath);
        break;
      case 'Menu System':
        await this.createMenuTemplate(scriptsPath);
        break;
      default:
        await this.createEmptyTemplate(scriptsPath);
        break;
    }
  }

  private async createEmptyTemplate(scriptsPath: string): Promise<void> {
    const mainScript = `; Wisp Editor Project
; Entry point for your application

start:
    ; Initialize your application here
    call init
    
main_loop:
    ; Main game/application loop
    call update
    call render
    
    ; Continue loop
    jmp main_loop

init:
    ; Setup code here
    ret

update:
    ; Update logic here
    ret

render:
    ; Rendering code here
    ret

halt:
    ; Clean shutdown
    trap exit
`;
    
    await writeTextFile(await join(scriptsPath, 'main.ash'), mainScript);
  }

  private async createPlatformerTemplate(scriptsPath: string): Promise<void> {
    const mainScript = `; 2D Platformer Template
; Physics-based side-scrolling game

start:
    call init_game
    
game_loop:
    call handle_input
    call update_physics
    call update_entities
    call render_frame
    jmp game_loop

init_game:
    ; Initialize player and world
    mov r1, 100        ; player x
    mov r2, 200        ; player y
    mov r3, 0          ; velocity x
    mov r4, 0          ; velocity y
    ret

handle_input:
    trap read_input
    ; Process keyboard input for movement
    ret

update_physics:
    ; Apply gravity and collision detection
    add r4, 1          ; gravity
    ret

update_entities:
    ; Update player and enemies
    add r1, r3         ; update x position
    add r2, r4         ; update y position
    ret

render_frame:
    trap clear_screen
    ; Draw player and world
    trap present
    ret
`;
    
    await writeTextFile(await join(scriptsPath, 'main.ash'), mainScript);
  }

  private async createShooterTemplate(scriptsPath: string): Promise<void> {
    const mainScript = `; Top-down Shooter Template
; Arcade-style space shooter

start:
    call init_shooter
    
game_loop:
    call handle_input
    call update_player
    call update_enemies
    call update_bullets
    call check_collisions
    call render_frame
    jmp game_loop

init_shooter:
    ; Initialize player ship
    mov r1, 400        ; player x (center)
    mov r2, 500        ; player y (bottom)
    ret

handle_input:
    trap read_input
    ; Process movement and shooting
    ret

update_player:
    ; Update player ship position
    ret

update_enemies:
    ; Spawn and move enemies
    ret

update_bullets:
    ; Move bullets and clean up
    ret

check_collisions:
    ; Bullet-enemy and enemy-player collisions
    ret

render_frame:
    trap clear_screen
    ; Draw player, enemies, bullets, UI
    trap present
    ret
`;
    
    await writeTextFile(await join(scriptsPath, 'main.ash'), mainScript);
  }

  private async createMenuTemplate(scriptsPath: string): Promise<void> {
    const mainScript = `; Menu System Template
; UI-focused navigation system

start:
    call init_menu
    
menu_loop:
    call handle_menu_input
    call update_menu
    call render_menu
    jmp menu_loop

init_menu:
    ; Initialize menu system
    mov r1, 0          ; current menu item
    mov r2, 3          ; total menu items
    ret

handle_menu_input:
    trap read_input
    ; Process up/down/select input
    ret

update_menu:
    ; Update menu animations/state
    ret

render_menu:
    trap clear_screen
    ; Draw menu items and selection
    call draw_title
    call draw_menu_items
    call draw_selection
    trap present
    ret

draw_title:
    ; Draw game/app title
    ret

draw_menu_items:
    ; Draw menu options
    ret

draw_selection:
    ; Draw selection indicator
    ret
`;
    
    await writeTextFile(await join(scriptsPath, 'main.ash'), mainScript);
  }

  async saveProjectConfig(projectPath: string, config: Partial<ProjectConfig>): Promise<void> {
    try {
      const configPath = await join(projectPath, 'wisp-project.yaml');
      let existingConfig = DEFAULT_PROJECT_CONFIG;
      
      if (await exists(configPath)) {
        const configText = await readTextFile(configPath);
        existingConfig = yaml.load(configText) as ProjectConfig;
      }
      
      const updatedConfig = { ...existingConfig, ...config };
      await writeTextFile(configPath, yaml.dump(updatedConfig, { indent: 2 }));
    } catch (error) {
      console.error('Failed to save project config:', error);
    }
  }

  async loadProjectConfig(projectPath: string): Promise<ProjectConfig> {
    try {
      const configPath = await join(projectPath, 'wisp-project.yaml');
      
      if (await exists(configPath)) {
        const configText = await readTextFile(configPath);
        const loadedConfig = yaml.load(configText) as Partial<ProjectConfig>;
        return { ...DEFAULT_PROJECT_CONFIG, ...loadedConfig };
      }
      
      return DEFAULT_PROJECT_CONFIG;
    } catch (error) {
      console.error('Failed to load project config:', error);
      return DEFAULT_PROJECT_CONFIG;
    }
  }

  async checkProjectExists(projectPath: string): Promise<boolean> {
    try {
      return await exists(projectPath) && 
             await exists(await join(projectPath, 'scripts'));
    } catch (error) {
      console.error('Error checking project existence:', error);
      return false;
    }
  }

  private generateBoardHeader(boardId: string): string {
    // Generate board-specific header based on board ID
    const boardConfigs: Record<string, string> = {
      'esp32-c6-lcd-1.47': `#ifndef BOARD_CONFIG_H
#define BOARD_CONFIG_H

// ESP32-C6 LCD 1.47" Board Configuration
#define BOARD_NAME "ESP32-C6 LCD 1.47\""
#define MCU_TYPE "ESP32-C6FH4"
#define CPU_FREQUENCY 160000000  // 160MHz
#define FLASH_SIZE 4194304       // 4MB
#define SRAM_SIZE 524288         // 512KB
#define LPRAM_SIZE 16384         // 16KB

// Display Configuration
#define DISPLAY_WIDTH 172
#define DISPLAY_HEIGHT 320
#define DISPLAY_COLOR_DEPTH 16
#define DISPLAY_TYPE "LCD RGB565"

// Connectivity
#define WIFI_ENABLED 1
#define WIFI_VERSION 6           // WiFi 6
#define BLUETOOTH_ENABLED 1
#define BLUETOOTH_CLASSIC 0
#define BLUETOOTH_LE 1
#define BLUETOOTH_VERSION 50     // 5.0

#endif // BOARD_CONFIG_H`,
      'esp32-s3-devkit': `#ifndef BOARD_CONFIG_H
#define BOARD_CONFIG_H

// ESP32-S3 DevKit Board Configuration
#define BOARD_NAME "ESP32-S3 DevKit"
#define MCU_TYPE "ESP32-S3"
#define CPU_FREQUENCY 240000000  // 240MHz
#define FLASH_SIZE 8388608       // 8MB
#define SRAM_SIZE 524288         // 512KB
#define PSRAM_SIZE 8388608       // 8MB

// Connectivity
#define WIFI_ENABLED 1
#define WIFI_VERSION 4           // WiFi 4
#define BLUETOOTH_ENABLED 1
#define BLUETOOTH_CLASSIC 1
#define BLUETOOTH_LE 1
#define BLUETOOTH_VERSION 42     // 4.2

#endif // BOARD_CONFIG_H`,
      'esp32-pico-d4': `#ifndef BOARD_CONFIG_H
#define BOARD_CONFIG_H

// ESP32 PICO-D4 Board Configuration
#define BOARD_NAME "ESP32 PICO-D4"
#define MCU_TYPE "ESP32 PICO-D4"
#define CPU_FREQUENCY 240000000  // 240MHz
#define FLASH_SIZE 4194304       // 4MB
#define SRAM_SIZE 327680         // 320KB

// Connectivity
#define WIFI_ENABLED 1
#define WIFI_VERSION 4           // WiFi 4
#define BLUETOOTH_ENABLED 1
#define BLUETOOTH_CLASSIC 1
#define BLUETOOTH_LE 1
#define BLUETOOTH_VERSION 42     // 4.2

#endif // BOARD_CONFIG_H`
    };

    return boardConfigs[boardId] || `#ifndef BOARD_CONFIG_H
#define BOARD_CONFIG_H

// Custom Board Configuration
#define BOARD_NAME "Custom Board"
#define MCU_TYPE "Unknown"

#endif // BOARD_CONFIG_H`;
  }

  private async verifyFileWritten(filePath: string, expectedContent: string, maxRetries: number = 3, delayMs: number = 100): Promise<void> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Verifying file ${filePath} (attempt ${attempt}/${maxRetries})`);
        
        // Check if file exists
        const fileExists = await exists(filePath);
        if (!fileExists) {
          if (attempt === maxRetries) {
            throw new Error(`File ${filePath} does not exist after ${maxRetries} attempts`);
          }
          console.warn(`File ${filePath} does not exist, retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
          continue;
        }
        
        // Try to read the file content
        const actualContent = await readTextFile(filePath);
        
        // Verify content matches (normalize line endings)
        const normalizeContent = (content: string) => content.replace(/\r\n/g, '\n').trim();
        const expectedNormalized = normalizeContent(expectedContent);
        const actualNormalized = normalizeContent(actualContent);
        
        if (actualNormalized === expectedNormalized) {
          console.log(`File ${filePath} verified successfully`);
          return;
        } else {
          if (attempt === maxRetries) {
            throw new Error(`File content verification failed for ${filePath}. Expected length: ${expectedNormalized.length}, actual length: ${actualNormalized.length}`);
          }
          console.warn(`File content mismatch for ${filePath}, retrying in ${delayMs}ms...`);
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(`File verification failed for ${filePath}: ${String(error)}`);
        }
        console.warn(`Error verifying file ${filePath} (attempt ${attempt}/${maxRetries}):`, error);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  private generateReadme(projectName: string, template?: string, board?: string): string {
    return `# ${projectName}

A Wisp Editor project created for ESP32 development.

## Project Details

- **Template**: ${template || 'Empty Project'}
- **Target Board**: ${board || 'Unknown'}
- **Created**: ${new Date().toLocaleDateString()}

## Getting Started

1. Open this project in Wisp Editor
2. Modify the scripts in the \`scripts/\` folder
3. Add assets to the \`assets/\` folder
4. Build and deploy to your ESP32 board

## Project Structure

\`\`\`
${projectName}/
├── scripts/           # Wisp assembly scripts
│   └── main.ash      # Main application entry point
├── assets/           # Sprites, audio, and other assets
├── build/            # Build output (generated)
├── board.h           # Board-specific configuration
├── wisp-project.yaml # Project configuration
└── README.md         # This file
\`\`\`

## Building

Use the Wisp Editor build system to compile your scripts and deploy to your ESP32 board.

## Documentation

For more information about Wisp Editor and the Wisp assembly language, visit the documentation.
`;
  }
}

export const projectService = new ProjectService();
