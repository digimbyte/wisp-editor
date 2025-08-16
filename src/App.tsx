import React, { useState, useEffect } from "react";
import packageJson from '../package.json';
import { configService, type RecentProject, type WispConfig } from './services/config';
import { projectService, type ProjectStructure } from './services/project';
import type {
  WorkspaceTab,
  SpriteType,
  BoardDefinition,
  EditorTab,
  SpriteAsset,
  AudioAsset,
  EntityDefinition,
  LayoutPanel,
  DatabaseTable,
  SystemDefinition,
  ComponentDefinition
} from './types';

import { useProjectManager } from './hooks/useProjectManager';
import { useBoardConfigManager } from './hooks/useBoardConfigManager';
import { useSpriteManager } from './hooks/useSpriteManager';
import { useContextMenuManager } from './hooks/useContextMenuManager';
import { useBuildAndTabManager } from './hooks/useBuildAndTabManager';

// Components
import { AppStateManager } from './components/views/AppStateManager';



export default function App() {
  // Add global CSS to disable text selection on UI elements and global context menu
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Context menu animations */
      .context-menu {
        animation: contextMenuFadeIn 0.15s ease-out;
        transform-origin: top left;
      }
      
      @keyframes contextMenuFadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .context-menu-item {
        transition: background-color 0.1s ease;
      }
    `;
    document.head.appendChild(style);
    
    // Disable default right-click context menu globally, but allow custom context menus
    const handleGlobalContextMenu = (e: MouseEvent) => {
      // Only prevent default if the target doesn't have a custom context menu handler
      const target = e.target as HTMLElement;
      
      // Check if we can find a custom context menu handler by traversing up the DOM
      const hasCustomContextMenu = target.closest('[data-context-menu="true"]');
      
      if (!hasCustomContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      
      // If we found a custom context menu, let it handle the event
      return true;
    };
    
    document.addEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
    
    return () => {
      document.head.removeChild(style);
      document.removeEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
    };
  }, []);

  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceTab>('sprites');
  const [config, setConfig] = useState<WispConfig | null>(null);
  const [log, setLog] = useState<string>("Initializing Wisp Editor...");
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  const [isLoading, setIsLoading] = useState(true);
  
  // Asset Management State
const [entities] = useState<EntityDefinition[]>([]);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  
  // Audio Management State
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [selectedAudio, setSelectedAudio] = useState<string>('');
  
  // App-level state that needs to be shared with hooks
  const [sprites, setSprites] = useState<SpriteAsset[]>([]);
  const [selectedSprite, setSelectedSprite] = useState<string>('');
  const [editorTabs, setEditorTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('');
  
  // Sprite dialog state
  const [showSpriteDialog, setShowSpriteDialog] = useState(false);
  const [spriteDialogMode, setSpriteDialogMode] = useState<'create' | 'import'>('create');
  const [newSpriteData, setNewSpriteData] = useState({
    name: '',
    type: 'background' as SpriteType,
    width: 32,
    height: 32,
    frames: 1,
    animationSpeed: 10,
    importPath: ''
  });
  const [isCreatingSprite, setIsCreatingSprite] = useState(false);
  
  // Board config state
  const [showBoardConfigDialog, setShowBoardConfigDialog] = useState(false);
  const [boardConfigMode, setBoardConfigMode] = useState<'import' | 'manual' | 'edit'>('manual');
  const [newBoardDefinition, setNewBoardDefinition] = useState<Partial<BoardDefinition>>({});
  const [importedBoardFile, setImportedBoardFile] = useState('');
  
  // Board UI state
  const [boardColumns, setBoardColumns] = useState([
    { id: 'name', label: 'Board Name', visible: true, width: 200 },
    { id: 'brand', label: 'Brand', visible: true, width: 120 },
    { id: 'architecture', label: 'Architecture', visible: true, width: 100 },
    { id: 'flash', label: 'Flash', visible: true, width: 80 },
    { id: 'sram', label: 'SRAM', visible: true, width: 80 },
    { id: 'psram', label: 'PSRAM', visible: false, width: 80 },
    { id: 'lpram', label: 'LP RAM', visible: false, width: 80 },
    { id: 'wifi', label: 'WiFi', visible: true, width: 80 },
    { id: 'btc', label: 'BT Classic', visible: false, width: 90 },
    { id: 'ble', label: 'BT LE', visible: true, width: 70 },
    { id: 'pixels', label: 'Display', visible: false, width: 100 }
  ]);
  const [boardSortColumn, setBoardSortColumn] = useState<string>('name');
  const [boardSortDirection, setBoardSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showColumnManager, setShowColumnManager] = useState(false);
  
  // Context menu state
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    type: 'folder' | 'file';
    name: string;
    path: string;
    category?: string;
  } | null>(null);

  // Initialize extracted service hooks
  const projectManager = useProjectManager(
    setLog,
    setEditorTabs,
    setActiveTabId,
    setSprites,
    setSelectedSprite,
    setAudioAssets,
    setSelectedAudio,
    (id: string) => setSelectedDatabase(id),
    setRecentProjects,
    setShowSpriteDialog,
    setSpriteDialogMode,
    setIsCreatingSprite,
    setNewSpriteData,
    setShowBoardConfigDialog,
    setNewBoardDefinition,
    setImportedBoardFile,
    setContextMenu
  );
  
  // Need to declare selectedBoard before using in boardConfigManager
  const [selectedBoard, setSelectedBoard] = useState<string>('');

  // Board Definitions - Sample data with separated SRAM types
  const [availableBoards, setAvailableBoards] = useState<BoardDefinition[]>([
    {
      id: 'esp32-c6-lcd-1.47',
      name: 'ESP32-C6 LCD 1.47"',
      architecture: 'RISC-V',
      mcu: 'ESP32-C6FH4',
      frequency: '160MHz',
      flash: '4MB',
      sram: '512KB',
      lpram: '16KB',
      display: {
        width: 172,
        height: 320,
        colorDepth: 16,
        type: 'LCD RGB565'
      },
      connectivity: ['WiFi 6', 'Bluetooth 5.0 LE'],
      wifi: 'WiFi 6',
      bluetooth: {
        classic: false,
        le: true,
        version: '5.0'
      },
      configFile: 'esp32-c6_config.h',
      description: 'ESP32-C6 with 1.47" LCD display, dual RISC-V cores, WiFi 6 and Bluetooth LE',
      verified: true
    },
    {
      id: 'esp32-s3-devkit',
      name: 'ESP32-S3 DevKit',
      architecture: 'Xtensa',
      mcu: 'ESP32-S3',
      frequency: '240MHz',
      flash: '8MB',
      sram: '512KB',
      psram: '8MB',
      connectivity: ['WiFi', 'Bluetooth Classic + LE'],
      wifi: 'WiFi 4',
      bluetooth: {
        classic: true,
        le: true,
        version: '4.2'
      },
      configFile: 'esp32-s3_config.h',
      description: 'High-performance ESP32-S3 with dual-core Xtensa processor and PSRAM',
      verified: true
    },
    {
      id: 'esp32-pico-d4',
      name: 'ESP32 PICO-D4',
      architecture: 'Xtensa',
      mcu: 'ESP32 PICO-D4',
      frequency: '240MHz',
      flash: '4MB',
      sram: '320KB',
      connectivity: ['WiFi', 'Bluetooth Classic + LE'],
      wifi: 'WiFi 4',
      bluetooth: {
        classic: true,
        le: true,
        version: '4.2'
      },
      configFile: 'esp32-pico_config.h',
      description: 'Compact ESP32 module with integrated flash memory',
      verified: true
    },
    {
      id: 'custom-board',
      name: 'Custom Board Definition',
      architecture: 'Custom',
      mcu: 'User Defined',
      frequency: 'Variable',
      flash: 'Variable',
      sram: 'Variable',
      connectivity: ['User Defined'],
      wifi: 'Variable',
      bluetooth: {
        classic: false,
        le: false,
        version: 'Unknown'
      },
      configFile: 'custom_config.h',
      description: 'Import or create a custom board configuration',
      verified: false
    }
  ]);

  const boardConfigManager = useBoardConfigManager(
    setLog,
    availableBoards,
    setAvailableBoards,
    selectedBoard,
    setSelectedBoard,
    showBoardConfigDialog,
    setShowBoardConfigDialog,
    boardConfigMode,
    setBoardConfigMode,
    newBoardDefinition,
    setNewBoardDefinition,
    importedBoardFile,
    setImportedBoardFile,
    boardSortColumn,
    setBoardSortColumn,
    boardSortDirection,
    setBoardSortDirection
  );
  
  
  const contextMenuManager = useContextMenuManager(
    contextMenu,
    setContextMenu
  );
  
  const buildAndTabManager = useBuildAndTabManager(
    editorTabs,
    setEditorTabs,
    activeTabId,
    setActiveTabId,
    setLog
  );
  
  // Extract state and handlers from all hooks
  const {
    projectDir,
    currentProject,
    showProjectWizard,
    projectCreationStep,
    selectedTemplate,
    // selectedBoard, // Remove this line since we declare it above
    projectName,
    projectPath,
    isCreatingProject,
    openProject,
    startProjectWizard,
    createProjectWithWizard,
    cancelProjectWizard,
    openExistingProject,
    closeProject,
    removeRecentProject,
    formatLastOpened,
    setProjectCreationStep,
    setSelectedTemplate,
    // setSelectedBoard: setSelectedBoardFromManager, // We'll use the local setSelectedBoard
    setProjectName,
    setProjectPath
  } = projectManager;
  
  const {
    openBoardConfigDialog,
    closeBoardConfigDialog,
    importBoardDefinition,
    addCustomBoard,
    editCustomBoard,
    getSortedBoards,
    handleColumnSort
  } = boardConfigManager;
  
  
  const {
    handleContextMenu: contextMenuHandler,
    handleContextMenuAction
  } = contextMenuManager;
  
  const {
    buildProject,
    flashProject,
    cleanBuild,
    addNewTab,
    closeTab,
    updateTabContent
  } = buildAndTabManager;
  
  // Initialize sprite manager after projectDir is available
  const spriteManager = useSpriteManager(
    projectDir,
    sprites,
    setSprites,
    selectedSprite,
    setSelectedSprite,
    setLog,
    showSpriteDialog,
    setShowSpriteDialog,
    spriteDialogMode,
    setSpriteDialogMode,
    newSpriteData,
    setNewSpriteData,
    isCreatingSprite,
    setIsCreatingSprite,
    activeWorkspace,
    setActiveWorkspace
  );
  
  const {
    refreshSprites,
    saveSprite,
    loadSpriteData,
    deleteSprite,
    updateSprite,
    openSpriteDialog,
    closeSpriteDialog,
    importSpriteFile,
    createSpriteFromDialog
  } = spriteManager;
  
  // Layout/World State
  const [layoutPanels] = useState<LayoutPanel[]>([
    { id: '1', name: 'MainUI', x: 0, y: 0, width: 800, height: 600, type: 'ui', content: {} },
    { id: '2', name: 'GameWorld', x: 0, y: 0, width: 1024, height: 768, type: 'world', content: {} }
  ]);
  const [isPlayMode, setIsPlayMode] = useState(false);
  
  // Database State
  const [databases] = useState<DatabaseTable[]>([
    {
      id: '1', name: 'GameItems', type: 'sqlite',
      columns: [
        { name: 'id', type: 'uint32', nullable: false },
        { name: 'name', type: 'string', nullable: false },
        { name: 'damage', type: 'int16', nullable: true, defaultValue: 0 },
        { name: 'price', type: 'float', nullable: false }
      ],
      data: [
        { id: 1, name: 'Sword', damage: 10, price: 25.50 },
        { id: 2, name: 'Shield', damage: 0, price: 15.00 }
      ]
    },
    {
      id: '2', name: 'PlayerStats', type: 'json',
      columns: [
        { name: 'playerId', type: 'uint32', nullable: false },
        { name: 'level', type: 'uint8', nullable: false },
        { name: 'experience', type: 'uint32', nullable: false },
        { name: 'isActive', type: 'bool', nullable: false }
      ],
      data: [
        { playerId: 1, level: 5, experience: 1250, isActive: true }
      ]
    }
  ]);
  const [selectedDatabase, setSelectedDatabase] = useState<string>('1');
  
  // ECS/DOTS System State
  const [systems] = useState<SystemDefinition[]>([
    {
      id: '1', name: 'InputSystem', type: 'input', executionOrder: 'early', priority: 10, enabled: true,
      script: '; Input processing system\nprocess_input:\n  trap read_input\n  ; Process keyboard/gamepad\n  ret'
    },
    {
      id: '2', name: 'MovementSystem', type: 'movement', executionOrder: 'update', priority: 20, enabled: true,
      script: '; Movement system\nupdate_movement:\n  ; Apply velocity to position\n  ; Handle collision responses\n  ret'
    },
    {
      id: '3', name: 'CollisionSystem', type: 'collision', executionOrder: 'update', priority: 30, enabled: true,
      script: '; Collision detection\ncheck_collisions:\n  ; Broad phase: spatial grid\n  ; Narrow phase: AABB/pixel\n  ret'
    },
    {
      id: '4', name: 'RenderSystem', type: 'render', executionOrder: 'render', priority: 100, enabled: true,
      script: '; Rendering system\nrender_frame:\n  trap clear_screen\n  ; Draw sprites in Z-order\n  trap present\n  ret'
    }
  ]);
  const [components] = useState<ComponentDefinition[]>([
    {
      id: '1', name: 'Transform', type: 'transform',
      properties: { x: 'float', y: 'float', rotation: 'float', scaleX: 'float', scaleY: 'float' }
    },
    {
      id: '2', name: 'SpriteRenderer', type: 'sprite',
      properties: { spriteId: 'string', layer: 'int8', visible: 'bool' }
    },
    {
      id: '3', name: 'BoxCollider', type: 'collider',
      properties: { width: 'float', height: 'float', isTrigger: 'bool', solid: 'bool' }
    },
    {
      id: '4', name: 'RigidBody', type: 'rigidbody',
      properties: { velocityX: 'float', velocityY: 'float', mass: 'float' }
    }
  ]);
  // Removed unused selectedSystem state
  
  
  // Menu state
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showBuildMenu, setShowBuildMenu] = useState(false);
  
  // Context menu state
  
  // Sprite creation dialog state
  
  // Sprite editor state - moved to top level to avoid Rules of Hooks violation
  const [spriteEditorMode, setSpriteEditorMode] = useState<'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot'>('brush');
  const [canvasView, setCanvasView] = useState<'2d' | '3d'>('2d');
  
  // Color picker and LUT management state
  const [showLutManager, setShowLutManager] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState<'picker' | 'custom' | 'common' | 'variations'>('picker');
  
  // Context menu handlers from the hook
  const handleContextMenu = contextMenuHandler;
  

  const activeTab = editorTabs.find(tab => tab.id === activeTabId);

  // Common styles
  const buttonStyle = {
    padding: "6px 12px",
    background: "#1d2330",
    border: "1px solid #2a3348",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#e6e6e6",
    fontSize: "13px",
    fontWeight: "500" as const
  };

  const tabStyle = {
    padding: "8px 16px",
    background: "#1a1d23",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    color: "#a0a0a0",
    fontSize: "13px",
    display: "flex",
    alignItems: "center",
    gap: "6px"
  };

  const activeTabStyle = {
    ...tabStyle,
    background: "#252832",
    borderBottomColor: "#2b6cff",
    color: "#e6e6e6"
  };

  const panelStyle = {
    background: "#1a1d23",
    border: "1px solid #2a2d36",
    display: "flex",
    flexDirection: "column" as const
  };

  const panelHeaderStyle = {
    padding: "8px 12px",
    background: "#252832",
    borderBottom: "1px solid #2a2d36",
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#e6e6e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

  // Tab management functions (addNewTab, closeTab) are now provided by the useBuildAndTabManager hook

  // Initialize the app
  useEffect(() => {
    const initApp = async () => {
      try {
        setLog('Initializing configuration...');
        await configService.initialize();
        const loadedConfig = configService.getConfig();
        setConfig(loadedConfig);
        
        // Load recent projects
        const recentProjectsList = configService.getRecentProjects();
        setRecentProjects(recentProjectsList);
        
        // Apply workspace settings
        const workspaceSettings = configService.getWorkspaceSettings();
        setLeftPanelWidth(workspaceSettings.leftPanelWidth);
        setRightPanelWidth(workspaceSettings.rightPanelWidth);
        setBottomPanelHeight(workspaceSettings.bottomPanelHeight);
        // Use saved workspace or default to 'sprites'
        setActiveWorkspace((workspaceSettings.activeWorkspace as WorkspaceTab) || 'sprites');
        
        setLog('Wisp Editor ready!');
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize app:', error);
        setLog('Failed to initialize app: ' + String(error));
        setIsLoading(false);
      }
    };
    
    initApp();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowEditMenu(false);
      setShowBuildMenu(false);
      setContextMenu(null);
    };

    if (showFileMenu || showEditMenu || showBuildMenu || contextMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => {
        document.removeEventListener('click', handleClickOutside);
      };
    }
  }, [showFileMenu, showEditMenu, showBuildMenu, contextMenu]);

  // Save workspace settings when they change
  useEffect(() => {
    if (!isLoading && config) {
      configService.updateWorkspaceSettings({
        leftPanelWidth,
        rightPanelWidth,
        bottomPanelHeight,
        activeWorkspace
      });
    }
  }, [leftPanelWidth, rightPanelWidth, bottomPanelHeight, activeWorkspace, isLoading, config]);

  // Tab management functions are now provided by the useBuildAndTabManager hook

  // Project management functions are now provided by the useProjectManager hook

  // Board management functions are now provided by the useBoardConfigManager hook

  // Project handlers are now provided by the hooks

  // Build and project functions are now provided by the useBuildAndTabManager hook

  // Utility functions (removeRecentProject, formatLastOpened) are now provided by the useProjectManager hook

  // Sprite management functions are now provided by the useSpriteManager hook


  // Use AppStateManager to handle view transitions
  return (
    <AppStateManager
      // App State - determines which view to show
      projectDir={projectDir}
      
      // Package info
      packageVersion={packageJson.version}
      
      // Global UI State
      activeWorkspace={activeWorkspace}
      setActiveWorkspace={setActiveWorkspace}
      leftPanelWidth={leftPanelWidth}
      setLeftPanelWidth={setLeftPanelWidth}
      rightPanelWidth={rightPanelWidth}
      setRightPanelWidth={setRightPanelWidth}
      bottomPanelHeight={bottomPanelHeight}
      setBottomPanelHeight={setBottomPanelHeight}
      log={log}
      setLog={setLog}
      config={config}
      
      // Project Hub state (Project Selection View)
      recentProjects={recentProjects}
      onStartProjectWizard={startProjectWizard}
      onOpenExistingProject={openExistingProject}
      onOpenProject={openProject}
      onRemoveRecentProject={removeRecentProject}
      formatLastOpened={formatLastOpened}
      
      // Main Editor state (Main Editor View)
      onNewProject={startProjectWizard}
      onAddNewFile={addNewTab}
      onCloseProject={closeProject}
      onBuildProject={buildProject}
      onFlashProject={flashProject}
      onCleanBuild={cleanBuild}
      showFileMenu={showFileMenu}
      setShowFileMenu={setShowFileMenu}
      showEditMenu={showEditMenu}
      setShowEditMenu={setShowEditMenu}
      showBuildMenu={showBuildMenu}
      setShowBuildMenu={setShowBuildMenu}
      
      // Asset Management
      sprites={sprites}
      selectedSprite={selectedSprite}
      onSpriteSelect={setSelectedSprite}
      audioAssets={audioAssets}
      selectedAudio={selectedAudio}
      onAudioSelect={setSelectedAudio}
      editorTabs={editorTabs}
      activeTabId={activeTabId}
      setActiveTabId={setActiveTabId}
      systems={systems}
      onOpenSpriteDialog={() => openSpriteDialog('create')}
      onContextMenu={handleContextMenu}
      
      // Code Workspace
      addNewTab={addNewTab}
      closeTab={closeTab}
      updateTabContent={updateTabContent}
      activeTab={activeTab}
      
      // Sprite Workspace
      spriteEditorMode={spriteEditorMode}
      setSpriteEditorMode={setSpriteEditorMode}
      canvasView={canvasView}
      setCanvasView={setCanvasView}
      openSpriteDialog={openSpriteDialog}
      
      // Layout Workspace
      layoutPanels={layoutPanels}
      isPlayMode={isPlayMode}
      setIsPlayMode={setIsPlayMode}
      
      // Database Workspace
      databases={databases}
      selectedDatabase={selectedDatabase}
      setSelectedDatabase={setSelectedDatabase}
      
      // Right Panel
      activeColorTab={activeColorTab}
      setActiveColorTab={setActiveColorTab}
      showLutManager={showLutManager}
      setShowLutManager={setShowLutManager}
      
      // Dialog Manager - Sprite Dialog
      showSpriteDialog={showSpriteDialog}
      spriteDialogMode={spriteDialogMode}
      newSpriteData={newSpriteData}
      isCreatingSprite={isCreatingSprite}
      onCloseSpriteDialog={closeSpriteDialog}
      onSpriteDialogModeChange={setSpriteDialogMode}
      onSpriteDataChange={setNewSpriteData}
      onImportSpriteFile={importSpriteFile}
      onCreateSprite={createSpriteFromDialog}
      
      // Dialog Manager - Board Config Dialog
      showBoardConfigDialog={showBoardConfigDialog}
      boardConfigMode={boardConfigMode}
      newBoardDefinition={newBoardDefinition}
      importedBoardFile={importedBoardFile}
      onCloseBoardConfigDialog={() => setShowBoardConfigDialog(false)}
      onBoardConfigModeChange={setBoardConfigMode}
      onBoardDefinitionChange={setNewBoardDefinition}
      onImportedBoardFileChange={setImportedBoardFile}
      onImportBoard={importBoardDefinition}
      onAddBoard={addCustomBoard}
      
      // Dialog Manager - Project Wizard Dialog
      showProjectWizard={showProjectWizard}
      projectName={projectName}
      setProjectName={setProjectName}
      projectPath={projectPath}
      setProjectPath={setProjectPath}
      selectedTemplate={selectedTemplate}
      setSelectedTemplate={setSelectedTemplate}
      selectedBoard={selectedBoard}
      setSelectedBoard={setSelectedBoard}
      projectCreationStep={projectCreationStep}
      setProjectCreationStep={setProjectCreationStep}
      isCreatingProject={isCreatingProject}
      availableBoards={availableBoards}
      boardColumns={boardColumns}
      setBoardColumns={setBoardColumns}
      boardSortColumn={boardSortColumn}
      setBoardSortColumn={setBoardSortColumn}
      boardSortDirection={boardSortDirection}
      setBoardSortDirection={setBoardSortDirection}
      showColumnManager={showColumnManager}
      setShowColumnManager={setShowColumnManager}
      onOpenBoardConfigDialog={openBoardConfigDialog}
      onEditCustomBoard={editCustomBoard}
      onCreateProject={createProjectWithWizard}
      onCloseProjectWizard={cancelProjectWizard}
      getSortedBoards={getSortedBoards}
      handleColumnSort={handleColumnSort}
      
      // Common styles
      buttonStyle={buttonStyle as React.CSSProperties}
      tabStyle={tabStyle as React.CSSProperties}
      activeTabStyle={activeTabStyle as React.CSSProperties}
      panelStyle={panelStyle as React.CSSProperties}
      panelHeaderStyle={panelHeaderStyle as React.CSSProperties}
    />
  );
}
