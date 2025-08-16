import { useState } from 'react';
import { spriteService } from '../services/sprite';
import type { SpriteAsset, SpriteType } from '../types';

export interface SpriteManagerState {
  sprites: SpriteAsset[];
  selectedSprite: string;
  
  // Sprite creation dialog state
  showSpriteDialog: boolean;
  spriteDialogMode: 'create' | 'import';
  isCreatingSprite: boolean;
  newSpriteData: {
    name: string;
    type: SpriteType;
    width: number;
    height: number;
    frames: number;
    animationSpeed: number;
    importPath: string;
  };
}

export interface SpriteManagerActions {
  refreshSprites: (projectDir: string) => Promise<void>;
  saveSprite: (projectDir: string, sprite: SpriteAsset, pixelData: Uint8Array) => Promise<void>;
  loadSpriteData: (projectDir: string, sprite: SpriteAsset) => Promise<Uint8Array | null>;
  deleteSprite: (projectDir: string, sprite: SpriteAsset) => Promise<void>;
  updateSprite: (projectDir: string, sprite: SpriteAsset) => Promise<SpriteAsset>;
  
  // Dialog actions
  openSpriteDialog: (mode?: 'create' | 'import') => void;
  closeSpriteDialog: () => void;
  importSpriteFile: () => Promise<void>;
  createSpriteFromDialog: (projectDir: string, activeWorkspace: string) => Promise<void>;
  
  // State setters
  setSprites: (sprites: SpriteAsset[]) => void;
  setSelectedSprite: (id: string) => void;
  setSpriteDialogMode: (mode: 'create' | 'import') => void;
  setIsCreatingSprite: (creating: boolean) => void;
  setNewSpriteData: (data: any) => void;
  setShowSpriteDialog: (show: boolean) => void;
}

export interface SpriteManagerHook extends SpriteManagerState, SpriteManagerActions {}

export function useSpriteManager(
  setLog: (logOrUpdater: string | ((prev: string) => string)) => void,
  setActiveWorkspace: (workspace: string) => void
): SpriteManagerHook {
  
  const [sprites, setSprites] = useState<SpriteAsset[]>([]);
  const [selectedSprite, setSelectedSprite] = useState<string>('');
  
  // Sprite creation dialog state
  const [showSpriteDialog, setShowSpriteDialog] = useState(false);
  const [spriteDialogMode, setSpriteDialogMode] = useState<'create' | 'import'>('create');
  const [isCreatingSprite, setIsCreatingSprite] = useState(false);
  const [newSpriteData, setNewSpriteData] = useState({
    name: '',
    type: 'background' as SpriteType,
    width: 32,
    height: 32,
    frames: 1,
    animationSpeed: 10,
    importPath: ''
  });

  // Function to refresh sprites from disk
  const refreshSprites = async (projectDir: string) => {
    if (!projectDir) return;
    
    try {
      const refreshedSprites = await spriteService.refreshSprites(projectDir);
      setSprites(refreshedSprites);
      setLog(prev => prev + `\\nRefreshed ${refreshedSprites.length} sprites from disk`);
    } catch (error) {
      console.error('Failed to refresh sprites:', error);
      setLog(prev => prev + `\\nError refreshing sprites: ${String(error)}`);
    }
  };
  
  // Function to save sprite changes
  const saveSprite = async (projectDir: string, sprite: SpriteAsset, pixelData: Uint8Array) => {
    if (!projectDir) return;
    
    try {
      await spriteService.saveSprite(projectDir, sprite, pixelData);
      // Update the sprite in state to reflect changes
      setSprites(prevSprites => 
        prevSprites.map(s => s.id === sprite.id ? sprite : s)
      );
      setLog(prev => prev + `\\nSaved sprite: ${sprite.name}`);
    } catch (error) {
      console.error('Failed to save sprite:', error);
      setLog(prev => prev + `\\nError saving sprite: ${String(error)}`);
    }
  };
  
  // Function to load sprite pixel data
  const loadSpriteData = async (projectDir: string, sprite: SpriteAsset): Promise<Uint8Array | null> => {
    if (!projectDir) return null;
    
    try {
      return await spriteService.getSpriteData(projectDir, sprite.id, sprite.name, sprite.type);
    } catch (error) {
      console.error('Failed to load sprite data:', error);
      setLog(prev => prev + `\\nError loading sprite data: ${String(error)}`);
      return null;
    }
  };
  
  // Function to delete sprite
  const deleteSprite = async (projectDir: string, sprite: SpriteAsset) => {
    if (!projectDir) return;
    
    if (!confirm(`Are you sure you want to delete sprite "${sprite.name}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      await spriteService.deleteSprite(projectDir, sprite.id, sprite.name, sprite.type);
      // Remove from state
      setSprites(prevSprites => prevSprites.filter(s => s.id !== sprite.id));
      // Clear selection if deleted sprite was selected
      if (selectedSprite === sprite.id) {
        setSelectedSprite('');
      }
      setLog(prev => prev + `\\nDeleted sprite: ${sprite.name}`);
    } catch (error) {
      console.error('Failed to delete sprite:', error);
      setLog(prev => prev + `\\nError deleting sprite: ${String(error)}`);
    }
  };
  
  // Function to update sprite metadata
  const updateSprite = async (projectDir: string, sprite: SpriteAsset): Promise<SpriteAsset> => {
    if (!projectDir) return sprite;
    
    try {
      const updatedSprite = await spriteService.updateSprite(projectDir, sprite);
      // Update the sprite in state
      setSprites(prevSprites => 
        prevSprites.map(s => s.id === sprite.id ? updatedSprite : s)
      );
      setLog(prev => prev + `\\nUpdated sprite metadata: ${sprite.name}`);
      return updatedSprite;
    } catch (error) {
      console.error('Failed to update sprite:', error);
      setLog(prev => prev + `\\nError updating sprite: ${String(error)}`);
      return sprite;
    }
  };

  // Function to open sprite creation dialog
  const openSpriteDialog = (mode: 'create' | 'import' = 'create') => {
    setSpriteDialogMode(mode);
    setNewSpriteData({
      name: `Sprite ${sprites.length + 1}`,
      type: 'background',
      width: 32,
      height: 32,
      frames: 1,
      animationSpeed: 10,
      importPath: ''
    });
    setShowSpriteDialog(true);
    // Switch to sprites workspace if not already there
    setActiveWorkspace('sprites');
  };
  
  // Function to close sprite dialog
  const closeSpriteDialog = () => {
    setShowSpriteDialog(false);
    setNewSpriteData({
      name: '',
      type: 'background',
      width: 32,
      height: 32,
      frames: 1,
      animationSpeed: 10,
      importPath: ''
    });
  };
  
  // Function to import sprite file
  const importSpriteFile = async () => {
    try {
      const { dialogService } = await import('../services/dialog');
      const selectedFile = await dialogService.selectFile([
        { name: 'Image Files', extensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp'] },
        { name: 'All Files', extensions: ['*'] }
      ]);
      if (selectedFile) {
        setNewSpriteData({
          ...newSpriteData,
          importPath: selectedFile,
          name: newSpriteData.name || selectedFile.split(/[\\\/]/).pop()?.replace(/\.[^/.]+$/, '') || 'Imported Sprite'
        });
      }
    } catch (error) {
      console.error('Failed to import sprite file:', error);
      alert('Failed to import sprite file: ' + String(error));
    }
  };
  
  // Function to create sprite from dialog
  const createSpriteFromDialog = async (projectDir: string, activeWorkspace: string) => {
    if (!newSpriteData.name) {
      alert('Please provide a sprite name');
      return;
    }
    
    if (spriteDialogMode === 'import' && !newSpriteData.importPath) {
      alert('Please select a file to import');
      return;
    }
    
    if (!projectDir) {
      alert('No project is currently open. Please create or open a project first.');
      return;
    }
    
    setIsCreatingSprite(true);
    
    try {
      const spriteData = {
        name: newSpriteData.name,
        type: newSpriteData.type,
        width: newSpriteData.width,
        height: newSpriteData.height,
        frames: newSpriteData.frames,
        animationSpeed: newSpriteData.animationSpeed,
        importPath: spriteDialogMode === 'import' ? newSpriteData.importPath : undefined
      };
      
      // Use the sprite service to create the actual files
      let createdSprite;
      if (spriteDialogMode === 'import') {
        createdSprite = await spriteService.importSprite(projectDir, spriteData);
      } else {
        createdSprite = await spriteService.createSprite(projectDir, spriteData);
      }
      
      // Update the sprites state with the newly created sprite
      setSprites([...sprites, createdSprite]);
      setSelectedSprite(createdSprite.id);
      
      // Show success message in log
      setLog(prev => prev + `\\nSprite ${spriteDialogMode === 'import' ? 'imported' : 'created'}: ${createdSprite.name} (${createdSprite.type})`);
      if (spriteDialogMode === 'import') {
        setLog(prev => prev + `\\nImported from: ${newSpriteData.importPath}`);
      }
      setLog(prev => prev + `\\nFiles created: ${createdSprite.name.toLowerCase().replace(/\\s+/g, '_')}.yaml, atlas/${createdSprite.id}.png`);
      
      closeSpriteDialog();
    } catch (error) {
      console.error('Failed to create sprite:', error);
      const errorMessage = `Failed to ${spriteDialogMode === 'import' ? 'import' : 'create'} sprite: ${String(error)}`;
      alert(errorMessage);
      setLog(prev => prev + `\\nError: ${errorMessage}`);
    } finally {
      setIsCreatingSprite(false);
    }
  };

  return {
    // State
    sprites,
    selectedSprite,
    showSpriteDialog,
    spriteDialogMode,
    isCreatingSprite,
    newSpriteData,
    
    // Actions
    refreshSprites,
    saveSprite,
    loadSpriteData,
    deleteSprite,
    updateSprite,
    openSpriteDialog,
    closeSpriteDialog,
    importSpriteFile,
    createSpriteFromDialog,
    
    // State setters
    setSprites,
    setSelectedSprite,
    setSpriteDialogMode,
    setIsCreatingSprite,
    setNewSpriteData,
    setShowSpriteDialog
  };
}
