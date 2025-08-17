import { painterroService } from '../services/painterroService';

import React, { useState, useEffect, useCallback } from 'react';
import { AppStateManager } from './views/AppStateManager';
import { useProjectManager } from '../hooks/useProjectManager';
import { useBuildAndTabManager } from '../hooks/useBuildAndTabManager';
import { useSpriteManager } from '../hooks/useSpriteManager';
import { useContextMenuManager } from '../hooks/useContextMenuManager';
import { useBoardConfigManager } from '../hooks/useBoardConfigManager';
import { configService } from '../services/config';
import { componentStyles, theme } from '../theme';
import type {
  WorkspaceTab,
  AudioAsset,
  LayoutPanel,
  DatabaseTable,
  SystemDefinition
} from '../types';
import type { RecentProject, WispConfig } from '../services/config';
import type { PainterroTool } from './canvas/PainterroWrapper';

export const MainApp: React.FC = () => {
  // Core app state
  const [packageVersion] = useState('0.1.0');
  const [log, setLog] = useState('Welcome to Wisp Editor! Create or open a project to get started.');
  const [config, setConfig] = useState<WispConfig | null>(null);

  // Global UI State
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceTab>('sprites');
  const [leftPanelWidth, setLeftPanelWidth] = useState(250);
  const [rightPanelWidth, setRightPanelWidth] = useState(250);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);

  // Menu states
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showEditMenu, setShowEditMenu] = useState(false);
  const [showBuildMenu, setShowBuildMenu] = useState(false);

  // Asset Management - placeholders
  const [audioAssets, setAudioAssets] = useState<AudioAsset[]>([]);
  const [selectedAudio, setSelectedAudio] = useState('');
  const [systems, _setSystems] = useState<SystemDefinition[]>([]);

  // Sprite Workspace state
  const [spriteEditorMode, setSpriteEditorMode] = useState<'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot'>('brush');
  const [canvasView, setCanvasView] = useState<'2d' | '3d'>('2d');
  
  // Paint tool state
  const [activePaintTool, setActivePaintTool] = useState<PainterroTool>('brush');
  const [paintColor, setPaintColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);

  // Layout Workspace state
  const [layoutPanels, _setLayoutPanels] = useState<LayoutPanel[]>([]);
  const [isPlayMode, setIsPlayMode] = useState(false);

  // Database Workspace state
  const [databases, _setDatabases] = useState<DatabaseTable[]>([]);
  const [selectedDatabase, setSelectedDatabase] = useState('1');

  // Right Panel state
  const [activeColorTab, setActiveColorTab] = useState<'picker' | 'custom' | 'common' | 'variations'>('picker');
  const [showLutManager, setShowLutManager] = useState(false);

  // Recent projects state
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);

  // Initialize hooks with state setters
  const {
    editorTabs,
    activeTabId,
    addNewTab,
    closeTab,
    updateTabContent,
    setEditorTabs,
    setActiveTabId,
    buildProject,
    flashProject,
    cleanBuild
  } = useBuildAndTabManager();

  const {
    sprites,
    selectedSprite,
    showSpriteDialog,
    spriteDialogMode,
    isCreatingSprite,
    newSpriteData,
    setSprites,
    setSelectedSprite,
    openSpriteDialog,
    closeSpriteDialog,
    setSpriteDialogMode,
    setIsCreatingSprite,
    setNewSpriteData,
    setShowSpriteDialog,
    importSpriteFile,
    createSpriteFromDialog
} = useSpriteManager(setLog, (w: string) => setActiveWorkspace(w as WorkspaceTab));

  const {
    handleContextMenu,
    setContextMenu
  } = useContextMenuManager();

  const {
    availableBoards,
    showBoardConfigDialog,
    boardConfigMode,
    newBoardDefinition,
    importedBoardFile,
    boardSortColumn,
    boardSortDirection,
    boardColumns,
    showColumnManager,
    openBoardConfigDialog,
    closeBoardConfigDialog,
    addCustomBoard,
    editCustomBoard,
    getSortedBoards,
    handleColumnSort,
    setNewBoardDefinition,
    setImportedBoardFile,
    setBoardColumns,
    setShowColumnManager,
    importBoardDefinition,
    setBoardSortColumn,
    setBoardSortDirection
  } = useBoardConfigManager((boardId: string) => setSelectedBoard(boardId));

  const {
    projectDir,
    showProjectWizard,
    projectCreationStep,
    selectedTemplate,
    selectedBoard,
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
    setSelectedBoard,
    setProjectName,
    setProjectPath
  } = useProjectManager(
    setLog,
    setEditorTabs,
    setActiveTabId,
    setSprites,
    setSelectedSprite,
    setAudioAssets,
    setSelectedAudio,
    setSelectedDatabase,
    setRecentProjects,
    setShowSpriteDialog,
    setSpriteDialogMode,
    setIsCreatingSprite,
    setNewSpriteData,
    (_show: boolean) => {}, // setShowBoardConfigDialog placeholder
    setNewBoardDefinition,
    setImportedBoardFile,
    setContextMenu
  );

  // Initialize services and load config
  useEffect(() => {
    const initialize = async () => {
      try {
        // Initialize Painterro service first
        painterroService.init();
        
        // Then load app config
        await configService.initialize();
        const loadedConfig = configService.getConfig();
        setConfig(loadedConfig);
        setRecentProjects(loadedConfig.recentProjects || []);
        
        // Apply workspace settings
        const { workspaceSettings } = loadedConfig;
        setLeftPanelWidth(workspaceSettings.leftPanelWidth);
        setRightPanelWidth(workspaceSettings.rightPanelWidth);
        setBottomPanelHeight(workspaceSettings.bottomPanelHeight);
        setActiveWorkspace(workspaceSettings.activeWorkspace as WorkspaceTab);
      } catch (error) {
        console.error('Failed to initialize config:', error);
        setLog('Warning: Failed to load configuration. Using defaults.');
      }
    };

    initialize();
  }, []);

  // Get active tab
  const activeTab = editorTabs.find(tab => tab.id === activeTabId);

  // Theme-based styles
  const buttonStyle: React.CSSProperties = {
    ...componentStyles.button.base,
    fontSize: theme.typography.buttonSmall.fontSize,
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`
  };

  const tabStyle: React.CSSProperties = {
    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    color: theme.colors.text.primary,
    fontSize: theme.typography.buttonSmall.fontSize,
    cursor: 'pointer',
    borderBottom: 'none',
    transition: `all ${theme.animation.normal} ease`
  };

  const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    background: theme.colors.surfaceAccent,
    borderColor: theme.colors.primary
  };

  const panelStyle: React.CSSProperties = {
    ...componentStyles.panel.base
  };

  const panelHeaderStyle: React.CSSProperties = {
    ...componentStyles.panel.header
  };

  // Additional handlers
  const onNewProject = useCallback(() => {
    startProjectWizard();
  }, [startProjectWizard]);

  const onAddNewFile = useCallback(() => {
    addNewTab();
  }, [addNewTab]);

  const onCloseProject = useCallback(async () => {
    closeProject();
  }, [closeProject]);

  const onBuildProject = useCallback(async () => {
    buildProject();
  }, [buildProject]);

  const onFlashProject = useCallback(async () => {
    flashProject();
  }, [flashProject]);

  const onCleanBuild = useCallback(async () => {
    cleanBuild();
  }, [cleanBuild]);

  const onSpriteSelect = useCallback((id: string) => {
    setSelectedSprite(id);
  }, [setSelectedSprite]);

  const onAudioSelect = useCallback((id: string) => {
    setSelectedAudio(id);
  }, [setSelectedAudio]);

  const onOpenSpriteDialog = useCallback((mode?: 'create' | 'import') => {
    openSpriteDialog(mode);
  }, [openSpriteDialog]);

  const onContextMenu = useCallback((e: React.MouseEvent, type: 'folder' | 'file', name: string, path: string, category?: string) => {
    handleContextMenu(e, type, name, path, category);
  }, [handleContextMenu]);

  const openSpriteDialogHandler = useCallback((mode: 'create' | 'import') => {
    openSpriteDialog(mode);
  }, [openSpriteDialog]);

  const onStartProjectWizard = useCallback(() => {
    startProjectWizard();
  }, [startProjectWizard]);

  const onOpenExistingProject = useCallback(async () => {
    await openExistingProject();
  }, [openExistingProject]);

  const onOpenProject = useCallback(async (path: string) => {
    await openProject(path);
  }, [openProject]);

  const onRemoveRecentProject = useCallback((path: string) => {
    removeRecentProject(path, { stopPropagation: () => {} } as React.MouseEvent);
  }, [removeRecentProject]);

  const onCloseSpriteDialog = useCallback(() => {
    closeSpriteDialog();
  }, [closeSpriteDialog]);

  const onSpriteDialogModeChange = useCallback((mode: 'create' | 'import') => {
    setSpriteDialogMode(mode);
  }, [setSpriteDialogMode]);

  const onSpriteDataChange = useCallback((data: any) => {
    setNewSpriteData(data);
  }, [setNewSpriteData]);

  const onImportSpriteFile = useCallback(async () => {
    await importSpriteFile();
  }, [importSpriteFile]);

  const onCreateSprite = useCallback(async () => {
    await createSpriteFromDialog(projectDir, activeWorkspace);
  }, [createSpriteFromDialog, projectDir, activeWorkspace]);

  const onCloseBoardConfigDialog = useCallback(() => {
    closeBoardConfigDialog();
  }, [closeBoardConfigDialog]);

  const onBoardConfigModeChange = useCallback((_mode: 'import' | 'manual' | 'edit') => {
    // Handle mode change if needed
  }, []);

  const onBoardDefinitionChange = useCallback((definition: any) => {
    setNewBoardDefinition(definition);
  }, [setNewBoardDefinition]);

  const onImportedBoardFileChange = useCallback((file: string) => {
    setImportedBoardFile(file);
  }, [setImportedBoardFile]);

  const onImportBoard = useCallback(async () => {
    await importBoardDefinition();
  }, [importBoardDefinition]);

  const onAddBoard = useCallback(async () => {
    addCustomBoard();
  }, [addCustomBoard]);

  const onOpenBoardConfigDialog = useCallback((mode?: 'import' | 'manual' | 'edit') => {
    // Map 'edit' to 'manual' since the hook only supports 'import' and 'manual'
    const supportedMode = mode === 'edit' ? 'manual' : (mode || 'import');
    openBoardConfigDialog(supportedMode);
  }, [openBoardConfigDialog]);

  const onEditCustomBoard = useCallback(() => {
    editCustomBoard(selectedBoard);
  }, [editCustomBoard, selectedBoard]);

  const onCreateProject = useCallback(async () => {
    await createProjectWithWizard();
  }, [createProjectWithWizard]);

  const onCloseProjectWizard = useCallback(() => {
    cancelProjectWizard();
  }, [cancelProjectWizard]);

  return (
    
    <AppStateManager
      // App State
      projectDir={projectDir}
      packageVersion={packageVersion}
      
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
      onStartProjectWizard={onStartProjectWizard}
      onOpenExistingProject={onOpenExistingProject}
      onOpenProject={onOpenProject}
      onRemoveRecentProject={onRemoveRecentProject}
      formatLastOpened={(ts: number) => formatLastOpened(String(ts))}
      
      // Main Editor state (Main Editor View)
      onNewProject={onNewProject}
      onAddNewFile={onAddNewFile}
      onCloseProject={onCloseProject}
      onBuildProject={onBuildProject}
      onFlashProject={onFlashProject}
      onCleanBuild={onCleanBuild}
      showFileMenu={showFileMenu}
      setShowFileMenu={setShowFileMenu}
      showEditMenu={showEditMenu}
      setShowEditMenu={setShowEditMenu}
      showBuildMenu={showBuildMenu}
      setShowBuildMenu={setShowBuildMenu}
      
      // Asset Management
      sprites={sprites}
      selectedSprite={selectedSprite}
      onSpriteSelect={onSpriteSelect}
      audioAssets={audioAssets}
      selectedAudio={selectedAudio}
      onAudioSelect={onAudioSelect}
      editorTabs={editorTabs}
      activeTabId={activeTabId}
      setActiveTabId={setActiveTabId}
      systems={systems}
      onOpenSpriteDialog={onOpenSpriteDialog}
      onContextMenu={onContextMenu}
      
      // Code Workspace
      addNewTab={addNewTab}
      closeTab={(tabId: string) => closeTab(tabId, { stopPropagation: () => {} } as React.MouseEvent)}
      updateTabContent={updateTabContent}
      activeTab={activeTab}
      
      // Sprite Workspace
      spriteEditorMode={spriteEditorMode}
      setSpriteEditorMode={setSpriteEditorMode}
      canvasView={canvasView}
      setCanvasView={setCanvasView}
      openSpriteDialog={openSpriteDialogHandler}
      
      // Paint tool state
      activePaintTool={activePaintTool}
      setActivePaintTool={setActivePaintTool}
      paintColor={paintColor}
      setPaintColor={setPaintColor}
      brushSize={brushSize}
      setBrushSize={setBrushSize}
      
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
      onCloseSpriteDialog={onCloseSpriteDialog}
      onSpriteDialogModeChange={onSpriteDialogModeChange}
      onSpriteDataChange={onSpriteDataChange}
      onImportSpriteFile={onImportSpriteFile}
      onCreateSprite={onCreateSprite}
      
      // Dialog Manager - Board Config Dialog
      showBoardConfigDialog={showBoardConfigDialog}
      boardConfigMode={boardConfigMode}
      newBoardDefinition={newBoardDefinition}
      importedBoardFile={importedBoardFile}
      onCloseBoardConfigDialog={onCloseBoardConfigDialog}
      onBoardConfigModeChange={onBoardConfigModeChange}
      onBoardDefinitionChange={onBoardDefinitionChange}
      onImportedBoardFileChange={onImportedBoardFileChange}
      onImportBoard={onImportBoard}
      onAddBoard={onAddBoard}
      
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
      onOpenBoardConfigDialog={onOpenBoardConfigDialog}
      onEditCustomBoard={onEditCustomBoard}
      onCreateProject={onCreateProject}
      onCloseProjectWizard={onCloseProjectWizard}
      getSortedBoards={getSortedBoards}
      handleColumnSort={handleColumnSort}
      
      // Common styles
      buttonStyle={buttonStyle}
      tabStyle={tabStyle}
      activeTabStyle={activeTabStyle}
      panelStyle={panelStyle}
      panelHeaderStyle={panelHeaderStyle}
        />
  );
};
