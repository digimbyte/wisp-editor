import { appDataDir, join } from '@tauri-apps/api/path';
import { readTextFile, writeTextFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import * as yaml from 'js-yaml';

export interface RecentProject {
  path: string;
  name: string;
  lastOpened: string;
  template?: string;
  board?: string;
}

export interface WispConfig {
  recentProjects: RecentProject[];
  preferences: {
    theme: 'dark' | 'light';
    fontSize: number;
    autoSave: boolean;
    maxRecentProjects: number;
  };
  workspaceSettings: {
    leftPanelWidth: number;
    rightPanelWidth: number;
    bottomPanelHeight: number;
    activeWorkspace: string;
  };
  buildSettings: {
    target: string;
    optimization: string;
  };
}

const DEFAULT_CONFIG: WispConfig = {
  recentProjects: [],
  preferences: {
    theme: 'dark',
    fontSize: 14,
    autoSave: true,
    maxRecentProjects: 10
  },
  workspaceSettings: {
    leftPanelWidth: 250,
    rightPanelWidth: 250,
    bottomPanelHeight: 200,
    activeWorkspace: 'assets'
  },
  buildSettings: {
    target: 'WSBC Bytecode',
    optimization: 'Debug'
  }
};

class ConfigService {
  private config: WispConfig | null = null;
  private configPath: string | null = null;

  async initialize(): Promise<void> {
    try {
      const appDataPath = await appDataDir();
      const configDir = await join(appDataPath, 'wisp-editor');
      this.configPath = await join(configDir, 'config.yaml');

      // Ensure config directory exists
      if (!(await exists(configDir))) {
        await mkdir(configDir, { recursive: true });
      }

      // Load existing config or create default
      await this.loadConfig();
    } catch (error) {
      console.error('Failed to initialize config service:', error);
      this.config = DEFAULT_CONFIG;
    }
  }

  async loadConfig(): Promise<WispConfig> {
    try {
      if (!this.configPath) {
        throw new Error('Config service not initialized');
      }

      if (await exists(this.configPath)) {
        const configText = await readTextFile(this.configPath);
        const loadedConfig = yaml.load(configText) as Partial<WispConfig>;
        
        // Merge with defaults to ensure all properties exist
        this.config = {
          ...DEFAULT_CONFIG,
          ...loadedConfig,
          preferences: {
            ...DEFAULT_CONFIG.preferences,
            ...loadedConfig.preferences
          },
          workspaceSettings: {
            ...DEFAULT_CONFIG.workspaceSettings,
            ...loadedConfig.workspaceSettings
          },
          buildSettings: {
            ...DEFAULT_CONFIG.buildSettings,
            ...loadedConfig.buildSettings
          }
        };
      } else {
        this.config = DEFAULT_CONFIG;
        await this.saveConfig();
      }

      return this.config;
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = DEFAULT_CONFIG;
      return this.config;
    }
  }

  async saveConfig(): Promise<void> {
    try {
      if (!this.configPath || !this.config) {
        throw new Error('Config service not initialized');
      }

      const configText = yaml.dump(this.config, {
        indent: 2,
        lineWidth: 120,
        noRefs: true
      });

      await writeTextFile(this.configPath, configText);
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }

  getConfig(): WispConfig {
    return this.config || DEFAULT_CONFIG;
  }

  async addRecentProject(projectPath: string, template?: string, board?: string): Promise<void> {
    if (!this.config) return;

    const projectName = projectPath.split(/[/\\]/).pop() || projectPath;
    const now = new Date().toISOString();

    // Remove existing entry if it exists
    this.config.recentProjects = this.config.recentProjects.filter(
      project => project.path !== projectPath
    );

    // Add to beginning of list
    this.config.recentProjects.unshift({
      path: projectPath,
      name: projectName,
      lastOpened: now,
      template,
      board
    });

    // Limit to max recent projects
    if (this.config.recentProjects.length > this.config.preferences.maxRecentProjects) {
      this.config.recentProjects = this.config.recentProjects.slice(
        0,
        this.config.preferences.maxRecentProjects
      );
    }

    await this.saveConfig();
  }

  async removeRecentProject(projectPath: string): Promise<void> {
    if (!this.config) return;

    this.config.recentProjects = this.config.recentProjects.filter(
      project => project.path !== projectPath
    );

    await this.saveConfig();
  }

  async updateWorkspaceSettings(settings: Partial<WispConfig['workspaceSettings']>): Promise<void> {
    if (!this.config) return;

    this.config.workspaceSettings = {
      ...this.config.workspaceSettings,
      ...settings
    };

    await this.saveConfig();
  }

  async updatePreferences(preferences: Partial<WispConfig['preferences']>): Promise<void> {
    if (!this.config) return;

    this.config.preferences = {
      ...this.config.preferences,
      ...preferences
    };

    await this.saveConfig();
  }

  async updateBuildSettings(settings: Partial<WispConfig['buildSettings']>): Promise<void> {
    if (!this.config) return;

    this.config.buildSettings = {
      ...this.config.buildSettings,
      ...settings
    };

    await this.saveConfig();
  }

  // Utility methods
  getRecentProjects(): RecentProject[] {
    return this.config?.recentProjects || [];
  }

  getWorkspaceSettings(): WispConfig['workspaceSettings'] {
    return this.config?.workspaceSettings || DEFAULT_CONFIG.workspaceSettings;
  }

  getPreferences(): WispConfig['preferences'] {
    return this.config?.preferences || DEFAULT_CONFIG.preferences;
  }

  getBuildSettings(): WispConfig['buildSettings'] {
    return this.config?.buildSettings || DEFAULT_CONFIG.buildSettings;
  }
}

// Export singleton instance
export const configService = new ConfigService();
