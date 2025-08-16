// Panel and workspace types
export type PanelType = 'editor' | 'explorer' | 'console' | 'preview' | 'properties';
export type WorkspaceTab = 'sprites' | 'layout' | 'database' | 'code' | 'audio';

// Asset types
export type SpriteType = 'background' | 'world tile' | 'entity' | 'interface' | 'font';
export type AudioType = 'music' | 'burst' | 'cries';

// Data types
export type DatabaseType = 'sqlite' | 'json' | 'csv' | 'binary';
export type DataType = 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'float' | 'double' | 'string' | 'bool' | 'blob';

// System types
export type SystemType = 'input' | 'movement' | 'collision' | 'render' | 'audio' | 'logic' | 'network';
export type ComponentType = 'transform' | 'sprite' | 'collider' | 'rigidbody' | 'script' | 'audio' | 'input';
export type ExecutionOrder = 'early' | 'update' | 'late' | 'render';

// Project creation
export type ProjectCreationStep = 'setup' | 'board' | 'assets';

// Board interfaces
export interface BoardDefinition {
  id: string;
  name: string;
  architecture: string;
  mcu: string;
  frequency: string;
  flash: string;
  sram: string;
  psram?: string;
  lpram?: string;
  display?: {
    width: number;
    height: number;
    colorDepth: number;
    type: string;
  };
  connectivity: string[];
  wifi?: string;
  bluetooth?: {
    classic?: boolean;
    le?: boolean;
    version?: string;
  };
  configFile: string;
  description: string;
  verified: boolean;
}

export interface BoardColumn {
  key: string;
  label: string;
  visible: boolean;
  width: string;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
}

// Editor interfaces
export interface EditorTab {
  id: string;
  title: string;
  content: string;
  filePath?: string;
  modified: boolean;
}

// Asset interfaces
export interface SpriteAsset {
  id: string;
  name: string;
  type: SpriteType;
  width: number;
  height: number;
  frames: number;
  animationSpeed?: number;
  tileSizeX?: number;
  tileSizeY?: number;
  filePath?: string;
  code?: string; // Attached behavior code
}

export interface AudioAsset {
  id: string;
  name: string;
  type: AudioType;
  duration?: number; // in seconds
  sampleRate?: number; // Hz (e.g., 44100, 22050)
  channels: 'mono' | 'stereo';
  volume: number; // 0-100
  loop: boolean;
  filePath?: string;
  generated?: boolean; // true for cries that are procedurally generated
}

export interface EntityDefinition {
  id: string;
  name: string;
  sprite: string; // sprite asset id
  properties: Record<string, any>;
  behaviors: string[]; // code asset ids
}

// Layout interfaces
export interface LayoutPanel {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ui' | 'world';
  content: any;
}

// Database interfaces
export interface DatabaseTable {
  id: string;
  name: string;
  type: DatabaseType;
  columns: DatabaseColumn[];
  data: Record<string, any>[];
}

export interface DatabaseColumn {
  name: string;
  type: DataType;
  nullable: boolean;
  defaultValue?: any;
}

// System interfaces
export interface SystemDefinition {
  id: string;
  name: string;
  type: SystemType;
  executionOrder: ExecutionOrder;
  priority: number; // Lower = earlier execution
  script: string;
  enabled: boolean;
}

export interface ComponentDefinition {
  id: string;
  name: string;
  type: ComponentType;
  properties: Record<string, any>;
  script?: string;
}
