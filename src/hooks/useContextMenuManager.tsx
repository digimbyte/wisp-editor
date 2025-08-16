import { useState } from 'react';

export interface ContextMenuState {
  contextMenu: { 
    x: number; 
    y: number; 
    type: 'folder' | 'file'; 
    name?: string; 
    path?: string; 
    category?: string; 
  } | null;
}

export interface ContextMenuActions {
  handleContextMenu: (e: React.MouseEvent, type: 'folder' | 'file' | 'bundle', name: string, path: string, category?: string) => void;
  handleContextMenuAction: (action: string) => void;
  setContextMenu: (menu: { x: number; y: number; type: 'folder' | 'file'; name?: string; path?: string; category?: string } | null) => void;
}

export interface ContextMenuManagerHook extends ContextMenuState, ContextMenuActions {}

export function useContextMenuManager(): ContextMenuManagerHook {
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ 
    x: number; 
    y: number; 
    type: 'folder' | 'file'; 
    name?: string; 
    path?: string; 
    category?: string; 
  } | null>(null);

  // Context menu handler - uses HTML/CSS fallback
  const handleContextMenu = (e: React.MouseEvent, type: 'folder' | 'file' | 'bundle', name: string, path: string, category?: string) => {
    console.log('🔍 Context menu triggered for:', { type, name, path });
    e.preventDefault();
    e.stopPropagation();
    
    // Show HTML context menu
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      type: type as 'folder' | 'file',
      name,
      path,
      category
    });
  };
  
  const handleContextMenuAction = (action: string) => {
    if (!contextMenu) return;
    
    const target = {
      name: contextMenu.name || 'Unknown',
      path: contextMenu.path || '',
      category: contextMenu.category
    };
    
    console.log('🎯 Context menu action:', action, 'for:', target);
    
    switch (action) {
      case 'createFolder':
        // TODO: Implement folder creation
        console.log(`Creating new folder in: ${target.name}`);
        alert(`Creating new folder in: ${target.name}`);
        break;
      case 'createFile':
        // TODO: Implement file creation
        console.log(`Creating new file in: ${target.name}`);
        alert(`Creating new file in: ${target.name}`);
        break;
      case 'rename':
        const newName = prompt(`Rename ${target.name} to:`, target.name);
        if (newName && newName.trim()) {
          // TODO: Implement rename functionality
          console.log(`Renaming ${target.name} to ${newName.trim()}`);
          alert(`Renaming ${target.name} to ${newName.trim()}`);
        }
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete ${target.name}?`)) {
          // TODO: Implement delete functionality
          console.log(`Deleting: ${target.name}`);
          alert(`Deleting: ${target.name}`);
        }
        break;
      case 'copy':
        // TODO: Implement copy functionality
        console.log(`Copying: ${target.name}`);
        alert(`Copying: ${target.name}`);
        break;
      case 'cut':
        // TODO: Implement cut functionality
        console.log(`Cutting: ${target.name}`);
        alert(`Cutting: ${target.name}`);
        break;
      case 'paste':
        // TODO: Implement paste functionality
        console.log(`Pasting into: ${target.name}`);
        alert(`Pasting into: ${target.name}`);
        break;
      case 'duplicate':
        // TODO: Implement duplicate functionality
        console.log(`Duplicating: ${target.name}`);
        alert(`Duplicating: ${target.name}`);
        break;
      case 'openInNewTab':
        // TODO: Implement open in new tab
        console.log(`Opening ${target.name} in new tab`);
        alert(`Opening ${target.name} in new tab`);
        break;
      case 'openInExplorer':
        // TODO: Implement reveal in file explorer
        console.log(`Opening ${target.name} in file explorer`);
        alert(`Opening ${target.name} in file explorer`);
        break;
      case 'properties':
        // TODO: Implement properties dialog
        console.log(`Properties of: ${target.name}`);
        alert(`Properties of: ${target.name}`);
        break;
      default:
        console.log(`Unknown action: ${action}`);
        alert(`Unknown action: ${action}`);
    }
    
    // Close context menu after action
    setContextMenu(null);
  };

  return {
    // State
    contextMenu,
    
    // Actions
    handleContextMenu,
    handleContextMenuAction,
    setContextMenu
  };
}
