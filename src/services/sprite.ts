import { join } from '@tauri-apps/api/path';
import { 
  writeTextFile, 
  readTextFile,
  writeFile, 
  readFile,
  mkdir, 
  exists, 
  readDir,
  remove
} from '@tauri-apps/plugin-fs';
import * as yaml from 'js-yaml';

export interface SpriteAsset {
  id: string;
  name: string;
  type: 'background' | 'world tile' | 'entity' | 'interface' | 'font';
  width: number;
  height: number;
  frames: number;
  animationSpeed?: number;
  tileSizeX?: number;
  tileSizeY?: number;
  filePath?: string;
  code?: string;
}

export interface SpriteMetadata {
  id: string;
  name: string;
  type: string;
  width: number;
  height: number;
  frames: number;
  animationSpeed?: number;
  tileSizeX?: number;
  tileSizeY?: number;
  created: string;
  modified: string;
  tags: string[];
  description?: string;
}

class SpriteService {
  
  async createSpriteDirectories(projectPath: string): Promise<void> {
    try {
      const assetsPath = await join(projectPath, 'assets');
      const spritesPath = await join(assetsPath, 'sprites');
      const atlasPath = await join(assetsPath, 'atlas');
      const spritesAtlasPath = await join(atlasPath, 'sprites');
      const audioAtlasPath = await join(atlasPath, 'audio');
      
      // Create main assets directory structure
      await mkdir(assetsPath, { recursive: true });
      
      // Create sprite directories
      await mkdir(spritesPath, { recursive: true });
      await mkdir(await join(spritesPath, 'background'), { recursive: true });
      await mkdir(await join(spritesPath, 'world-tile'), { recursive: true });
      await mkdir(await join(spritesPath, 'entity'), { recursive: true });
      await mkdir(await join(spritesPath, 'interface'), { recursive: true });
      await mkdir(await join(spritesPath, 'font'), { recursive: true });
      
      // Create atlas directories
      await mkdir(atlasPath, { recursive: true });
      await mkdir(spritesAtlasPath, { recursive: true });
      await mkdir(audioAtlasPath, { recursive: true });
      
      // Create audio directories
      const audioPath = await join(assetsPath, 'audio');
      await mkdir(audioPath, { recursive: true });
      await mkdir(await join(audioPath, 'music'), { recursive: true });
      await mkdir(await join(audioPath, 'burst'), { recursive: true });
      await mkdir(await join(audioPath, 'cries'), { recursive: true });
      
      console.log('Sprite and audio directories created successfully');
    } catch (error) {
      console.error('Failed to create sprite directories:', error);
      throw error;
    }
  }

  async createSprite(
    projectPath: string, 
    spriteData: Omit<SpriteAsset, 'id'>, 
    imageData?: Uint8Array
  ): Promise<SpriteAsset> {
    try {
      // Validate sprite dimensions - enforce 1024px hard limit
      if (spriteData.width > 1024 || spriteData.height > 1024) {
        throw new Error(`Sprite dimensions cannot exceed 1024px. Requested: ${spriteData.width}×${spriteData.height}`);
      }
      
      if (spriteData.width < 1 || spriteData.height < 1) {
        throw new Error('Sprite dimensions must be at least 1px');
      }
      
      // Clamp dimensions to safe range (defensive programming)
      const clampedSpriteData = {
        ...spriteData,
        width: Math.min(Math.max(spriteData.width, 1), 1024),
        height: Math.min(Math.max(spriteData.height, 1), 1024)
      };
      
      // Ensure sprite directories exist
      await this.createSpriteDirectories(projectPath);
      
      // Generate unique ID
      const spriteId = `sprite-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create sprite asset using clamped dimensions
      const sprite: SpriteAsset = {
        id: spriteId,
        ...clampedSpriteData
      };
      
      // Determine folder path based on sprite type
      const typeFolderMap: Record<string, string> = {
        'background': 'background',
        'world tile': 'world-tile',
        'entity': 'entity',
        'interface': 'interface',
        'font': 'font'
      };
      
      const typeFolder = typeFolderMap[sprite.type] || 'entity';
      const spriteFolderPath = await join(projectPath, 'assets', 'sprites', typeFolder);
      const atlasPath = await join(projectPath, 'assets', 'atlas', 'sprites');
      
      // Generate file names
      const safeFileName = sprite.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const yamlFileName = `${safeFileName}.yaml`;
      const sprFileName = `${safeFileName}.spr`;
      const pngFileName = `${spriteId}.png`;
      
      // Create metadata
      const metadata: SpriteMetadata = {
        id: sprite.id,
        name: sprite.name,
        type: sprite.type,
        width: sprite.width,
        height: sprite.height,
        frames: sprite.frames,
        animationSpeed: sprite.animationSpeed,
        tileSizeX: sprite.tileSizeX,
        tileSizeY: sprite.tileSizeY,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
        tags: [],
        description: `${sprite.type} sprite: ${sprite.name}`
      };
      
      // Write YAML metadata file
      const yamlPath = await join(spriteFolderPath, yamlFileName);
      const yamlContent = yaml.dump(metadata, { 
        indent: 2,
        lineWidth: 120,
        noCompatMode: true 
      });
      await writeTextFile(yamlPath, yamlContent);
      
      // Create sprite data file (.spr)
      const sprPath = await join(spriteFolderPath, sprFileName);
      let spriteFileData: Uint8Array;
      
      if (imageData) {
        // If we have image data, use it
        spriteFileData = imageData;
      } else {
        // Create empty sprite data (blank canvas)
        const pixelCount = sprite.width * sprite.height * sprite.frames;
        const bytesPerPixel = 4; // RGBA
        spriteFileData = new Uint8Array(pixelCount * bytesPerPixel);
        
        // Fill with transparent pixels (0,0,0,0) - already initialized to 0
        // For a white background, uncomment the following:
        // for (let i = 0; i < spriteFileData.length; i += 4) {
        //   spriteFileData[i] = 255;     // R
        //   spriteFileData[i + 1] = 255; // G
        //   spriteFileData[i + 2] = 255; // B
        //   spriteFileData[i + 3] = 255; // A
        // }
      }
      
      await writeFile(sprPath, spriteFileData);
      
      // Create atlas PNG file (optimized version for ESP32)
      const atlasPngPath = await join(atlasPath, pngFileName);
      
      if (imageData) {
        // If importing an image, save it to atlas
        await writeFile(atlasPngPath, imageData);
      } else {
        // Create a placeholder PNG (minimal PNG structure)
        const placeholderPng = this.createPlaceholderPNG(sprite.width, sprite.height);
        await writeFile(atlasPngPath, placeholderPng);
      }
      
      console.log(`Created sprite: ${sprite.name}`);
      console.log(`- YAML: ${yamlPath}`);
      console.log(`- SPR: ${sprPath}`);
      console.log(`- PNG: ${atlasPngPath}`);
      
      return sprite;
    } catch (error) {
      console.error('Failed to create sprite:', error);
      throw error;
    }
  }

  async loadSprites(projectPath: string): Promise<SpriteAsset[]> {
    return this.loadSpritesFromProject(projectPath);
  }

  async loadSpritesFromProject(projectPath: string): Promise<SpriteAsset[]> {
    try {
      const sprites: SpriteAsset[] = [];
      const spritesPath = await join(projectPath, 'assets', 'sprites');
      
      if (!(await exists(spritesPath))) {
        console.log('No sprites folder found, creating directories...');
        await this.createSpriteDirectories(projectPath);
        return sprites;
      }
      
      // Load sprites from each category folder
      const categories = ['background', 'world-tile', 'entity', 'interface', 'font'];
      
      for (const category of categories) {
        const categoryPath = await join(spritesPath, category);
        if (await exists(categoryPath)) {
          const categorySprites = await this.loadSpritesFromCategory(categoryPath, category);
          sprites.push(...categorySprites);
        }
      }
      
      console.log(`Loaded ${sprites.length} sprites from project`);
      return sprites;
    } catch (error) {
      console.error('Failed to load sprites from project:', error);
      return [];
    }
  }

  private async loadSpritesFromCategory(categoryPath: string, category: string): Promise<SpriteAsset[]> {
    try {
      const sprites: SpriteAsset[] = [];
      
      const entries = await readDir(categoryPath);
      const yamlFiles = entries.filter(entry => entry.name?.endsWith('.yaml') || entry.name?.endsWith('.yml'));
      
      for (const yamlFile of yamlFiles) {
        try {
          const yamlPath = await join(categoryPath, yamlFile.name!);
          const yamlContent = await readTextFile(yamlPath);
          const metadata = yaml.load(yamlContent) as SpriteMetadata;
          
          const sprite: SpriteAsset = {
            id: metadata.id || `sprite-${Date.now()}`,
            name: metadata.name,
            type: this.normalizeSpriteType(category),
            width: metadata.width,
            height: metadata.height,
            frames: metadata.frames,
            animationSpeed: metadata.animationSpeed,
            tileSizeX: metadata.tileSizeX,
            tileSizeY: metadata.tileSizeY,
            filePath: yamlPath
          };
          
          sprites.push(sprite);
        } catch (error) {
          console.warn(`Failed to load sprite from ${yamlFile.name}:`, error);
        }
      }
      
      return sprites;
    } catch (error) {
      console.error(`Failed to load sprites from category ${category}:`, error);
      return [];
    }
  }

  private normalizeSpriteType(category: string): SpriteAsset['type'] {
    const typeMap: Record<string, SpriteAsset['type']> = {
      'background': 'background',
      'world-tile': 'world tile',
      'entity': 'entity',
      'interface': 'interface',
      'font': 'font'
    };
    
    return typeMap[category] || 'entity';
  }

  async importSprite(
    projectPath: string,
    spriteData: Omit<SpriteAsset, 'id'> & { importPath?: string }
  ): Promise<SpriteAsset> {
    try {
      if (!spriteData.importPath) {
        throw new Error('Import path is required for sprite import');
      }
      
      // Read the image file
      const imageData = await readFile(spriteData.importPath);
      
      // Remove importPath from spriteData before creating sprite
      const { importPath, ...cleanSpriteData } = spriteData;
      
      // Create sprite with image data
      return await this.createSprite(projectPath, cleanSpriteData, imageData);
    } catch (error) {
      console.error('Failed to import sprite:', error);
      throw error;
    }
  }

  private createPlaceholderPNG(width: number, height: number): Uint8Array {
    // Create a minimal PNG file structure for a transparent image
    // This is a very basic implementation - in a real application you'd use a proper PNG library
    
    // PNG signature
    const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // IHDR chunk (image header)
    const ihdrData = new Uint8Array(13);
    const view = new DataView(ihdrData.buffer);
    view.setUint32(0, width, false);      // Width
    view.setUint32(4, height, false);     // Height
    ihdrData[8] = 8;                      // Bit depth
    ihdrData[9] = 6;                      // Color type (RGBA)
    ihdrData[10] = 0;                     // Compression method
    ihdrData[11] = 0;                     // Filter method
    ihdrData[12] = 0;                     // Interlace method
    
    // For now, return a very basic placeholder
    // In a real implementation, you'd properly encode the PNG format
    const totalSize = signature.length + 100; // Rough estimate
    const placeholder = new Uint8Array(totalSize);
    placeholder.set(signature, 0);
    
    // This is a minimal placeholder - a proper PNG encoder would be needed for production
    return placeholder;
  }

  async deleteSprite(projectPath: string, spriteId: string, spriteName: string, spriteType: SpriteAsset['type']): Promise<void> {
    try {
      const typeFolderMap: Record<string, string> = {
        'background': 'background',
        'world tile': 'world-tile',
        'entity': 'entity',
        'interface': 'interface',
        'font': 'font'
      };
      
      const typeFolder = typeFolderMap[spriteType] || 'entity';
      const spriteFolderPath = await join(projectPath, 'assets', 'sprites', typeFolder);
      const atlasPath = await join(projectPath, 'assets', 'atlas', 'sprites');
      
      const safeFileName = spriteName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const yamlFileName = `${safeFileName}.yaml`;
      const sprFileName = `${safeFileName}.spr`;
      const pngFileName = `${spriteId}.png`;
      
      // Delete files
      try {
        await remove(await join(spriteFolderPath, yamlFileName));
      } catch (error) {
        console.warn(`Failed to delete YAML file: ${error}`);
      }
      
      try {
        await remove(await join(spriteFolderPath, sprFileName));
      } catch (error) {
        console.warn(`Failed to delete SPR file: ${error}`);
      }
      
      try {
        await remove(await join(atlasPath, pngFileName));
      } catch (error) {
        console.warn(`Failed to delete PNG file: ${error}`);
      }
      
      console.log(`Deleted sprite: ${spriteName}`);
    } catch (error) {
      console.error('Failed to delete sprite:', error);
      throw error;
    }
  }

  async refreshSprites(projectPath: string): Promise<SpriteAsset[]> {
    // Same as loadSpritesFromProject - refresh means reload from disk
    return this.loadSpritesFromProject(projectPath);
  }

async getSpriteData(projectPath: string, _spriteId: string, spriteName: string, spriteType: SpriteAsset['type']): Promise<Uint8Array> {
    try {
      const typeFolderMap: Record<string, string> = {
        'background': 'background',
        'world tile': 'world-tile',
        'entity': 'entity',
        'interface': 'interface',
        'font': 'font'
      };
      
      const typeFolder = typeFolderMap[spriteType] || 'entity';
      const spriteFolderPath = await join(projectPath, 'assets', 'sprites', typeFolder);
      
      const safeFileName = spriteName.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const sprFileName = `${safeFileName}.spr`;
      const sprPath = await join(spriteFolderPath, sprFileName);
      
      const data = await readFile(sprPath);
      return data;
    } catch (error) {
      console.error('Failed to get sprite data:', error);
      throw error;
    }
  }

  async saveSprite(projectPath: string, sprite: SpriteAsset, pixelData: Uint8Array): Promise<void> {
    try {
      const typeFolderMap: Record<string, string> = {
        'background': 'background',
        'world tile': 'world-tile',
        'entity': 'entity',
        'interface': 'interface',
        'font': 'font'
      };
      
      const typeFolder = typeFolderMap[sprite.type] || 'entity';
      const spriteFolderPath = await join(projectPath, 'assets', 'sprites', typeFolder);
      
      const safeFileName = sprite.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const sprFileName = `${safeFileName}.spr`;
      const sprPath = await join(spriteFolderPath, sprFileName);
      
      // Save the pixel data
      await writeFile(sprPath, pixelData);
      
      // Update metadata with new modified timestamp
      const yamlFileName = `${safeFileName}.yaml`;
      const yamlPath = await join(spriteFolderPath, yamlFileName);
      
      const metadata: SpriteMetadata = {
        id: sprite.id,
        name: sprite.name,
        type: sprite.type,
        width: sprite.width,
        height: sprite.height,
        frames: sprite.frames,
        animationSpeed: sprite.animationSpeed,
        tileSizeX: sprite.tileSizeX,
        tileSizeY: sprite.tileSizeY,
        created: new Date().toISOString(), // We don't have the original created date, so use current
        modified: new Date().toISOString(),
        tags: [],
        description: `${sprite.type} sprite: ${sprite.name}`
      };
      
      const yamlContent = yaml.dump(metadata, { 
        indent: 2,
        lineWidth: 120,
        noCompatMode: true 
      });
      await writeTextFile(yamlPath, yamlContent);
      
      console.log(`Saved sprite: ${sprite.name}`);
    } catch (error) {
      console.error('Failed to save sprite:', error);
      throw error;
    }
  }

  async updateSprite(projectPath: string, sprite: SpriteAsset): Promise<SpriteAsset> {
    try {
      const typeFolderMap: Record<string, string> = {
        'background': 'background',
        'world tile': 'world-tile',
        'entity': 'entity',
        'interface': 'interface',
        'font': 'font'
      };
      
      const typeFolder = typeFolderMap[sprite.type] || 'entity';
      const spriteFolderPath = await join(projectPath, 'assets', 'sprites', typeFolder);
      
      const safeFileName = sprite.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const yamlFileName = `${safeFileName}.yaml`;
      const yamlPath = await join(spriteFolderPath, yamlFileName);
      
      // Update metadata
      const metadata: SpriteMetadata = {
        id: sprite.id,
        name: sprite.name,
        type: sprite.type,
        width: sprite.width,
        height: sprite.height,
        frames: sprite.frames,
        animationSpeed: sprite.animationSpeed,
        tileSizeX: sprite.tileSizeX,
        tileSizeY: sprite.tileSizeY,
        created: new Date().toISOString(), // We don't have the original created date, so use current
        modified: new Date().toISOString(),
        tags: [],
        description: `${sprite.type} sprite: ${sprite.name}`
      };
      
      const yamlContent = yaml.dump(metadata, { 
        indent: 2,
        lineWidth: 120,
        noCompatMode: true 
      });
      await writeTextFile(yamlPath, yamlContent);
      
      console.log(`Updated sprite metadata: ${sprite.name}`);
      return sprite;
    } catch (error) {
      console.error('Failed to update sprite:', error);
      throw error;
    }
  }
}

export const spriteService = new SpriteService();
