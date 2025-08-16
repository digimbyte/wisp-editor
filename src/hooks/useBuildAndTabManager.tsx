import { useState } from 'react';
import type { EditorTab } from '../types';

export interface TabManagerState {
  editorTabs: EditorTab[];
  activeTabId: string;
}

export interface TabManagerActions {
  addNewTab: () => void;
  closeTab: (tabId: string, e: React.MouseEvent) => void;
  updateTabContent: (content: string) => void;
  setEditorTabs: (tabs: EditorTab[]) => void;
  setActiveTabId: (id: string) => void;
}

export interface BuildManagerActions {
  buildProject: () => void;
  flashProject: () => void;
  cleanBuild: () => void;
}

export interface BuildAndTabManagerHook extends TabManagerState, TabManagerActions, BuildManagerActions {}

export function useBuildAndTabManager(): BuildAndTabManagerHook {
  
  const [editorTabs, setEditorTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');

  const addNewTab = () => {
    const newId = (Date.now()).toString();
    const newTab: EditorTab = {
      id: newId,
      title: `untitled-${editorTabs.length + 1}.ash`,
      content: '; New Wisp script\\nstart:\\n  ; Your code here\\n  halt',
      modified: false
    };
    setEditorTabs([...editorTabs, newTab]);
    setActiveTabId(newId);
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = editorTabs.filter(tab => tab.id !== tabId);
    setEditorTabs(newTabs);
    if (activeTabId === tabId && newTabs.length > 0) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  const updateTabContent = (content: string) => {
    setEditorTabs(tabs => tabs.map(tab => 
      tab.id === activeTabId 
        ? { ...tab, content, modified: true }
        : tab
    ));
  };

  // Build operations
  const buildProject = () => {
    alert('Building project...');
  };
  
  const flashProject = () => {
    alert('Flashing to device...');
  };
  
  const cleanBuild = () => {
    alert('Cleaning build...');
  };

  return {
    // Tab Manager State
    editorTabs,
    activeTabId,
    
    // Tab Manager Actions
    addNewTab,
    closeTab,
    updateTabContent,
    setEditorTabs,
    setActiveTabId,
    
    // Build Manager Actions
    buildProject,
    flashProject,
    cleanBuild
  };
}
