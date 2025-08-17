import React from 'react';
import { ProjectSelectionView } from './ProjectSelectionView';
import { MainEditorView } from './MainEditorView';
import type {
  WorkspaceTab,
  SpriteType,
  BoardDefinition,
  EditorTab,
  SpriteAsset,
  AudioAsset,
  LayoutPanel,
  DatabaseTable,
  SystemDefinition,
  BoardColumn,
  ProjectCreationStep
} from '../../types';
import type { RecentProject, WispConfig } from '../../services/config';

interface AppStateManagerProps {
  // App State - determines which view to show
  projectDir: string | null;
  
  // Package info
  packageVersion: string;
  
  // Global UI State
  activeWorkspace: WorkspaceTab;
  setActiveWorkspace: (workspace: WorkspaceTab) => void;
  leftPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;
  bottomPanelHeight: number;
  setBottomPanelHeight: (height: number) => void;
  log: string;
  setLog: (log: string) => void;
  config: WispConfig | null;
  
  // Project Hub state (Project Selection View)
  recentProjects: RecentProject[];
  onStartProjectWizard: () => void;
  onOpenExistingProject: () => Promise<void>;
  onOpenProject: (path: string) => Promise<void>;
  onRemoveRecentProject: (path: string) => void;
  formatLastOpened: (timestamp: number) => string;
  
  // Main Editor state (Main Editor View)
  // Top Menu props
  onNewProject: () => void;
  onAddNewFile: () => void;
  onCloseProject: () => Promise<void>;
  onBuildProject: () => Promise<void>;
  onFlashProject: () => Promise<void>;
  onCleanBuild: () => Promise<void>;
  showFileMenu: boolean;
  setShowFileMenu: (show: boolean) => void;
  showEditMenu: boolean;
  setShowEditMenu: (show: boolean) => void;
  showBuildMenu: boolean;
  setShowBuildMenu: (show: boolean) => void;
  
  // Asset Management
  sprites: SpriteAsset[];
  selectedSprite: string;
  onSpriteSelect: (id: string) => void;
  audioAssets: AudioAsset[];
  selectedAudio: string;
  onAudioSelect: (id: string) => void;
  editorTabs: EditorTab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  systems: SystemDefinition[];
  onOpenSpriteDialog: (mode: 'create' | 'import') => void;
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', name: string, path: string, category?: string) => void;
  
  // Code Workspace
  addNewTab: () => void;
  closeTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  activeTab: EditorTab | undefined;
  
  // Sprite Workspace
  spriteEditorMode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot';
  setSpriteEditorMode: (mode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot') => void;
  canvasView: '2d' | '3d';
  setCanvasView: (view: '2d' | '3d') => void;
  openSpriteDialog: (mode: 'create' | 'import') => void;
  
  // Paint tool state
  activePaintTool: string;
  setActivePaintTool: (tool: string) => void;
  paintColor: string;
  setPaintColor: (color: string) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  
  // Layout Workspace
  layoutPanels: LayoutPanel[];
  isPlayMode: boolean;
  setIsPlayMode: (play: boolean) => void;
  
  // Database Workspace
  databases: DatabaseTable[];
  selectedDatabase: string;
  setSelectedDatabase: (id: string) => void;
  
  // Right Panel
  activeColorTab: 'picker' | 'custom' | 'common' | 'variations';
  setActiveColorTab: (tab: 'picker' | 'custom' | 'common' | 'variations') => void;
  showLutManager: boolean;
  setShowLutManager: (show: boolean) => void;
  
  // Dialog Manager - Sprite Dialog
  showSpriteDialog: boolean;
  spriteDialogMode: 'create' | 'import';
  newSpriteData: {
    name: string;
    type: SpriteType;
    width: number;
    height: number;
    frames: number;
    animationSpeed: number;
    importPath: string;
  };
  isCreatingSprite: boolean;
  onCloseSpriteDialog: () => void;
  onSpriteDialogModeChange: (mode: 'create' | 'import') => void;
  onSpriteDataChange: (data: any) => void;
  onImportSpriteFile: (file: FileList | null) => Promise<void>;
  onCreateSprite: () => Promise<void>;
  
  // Dialog Manager - Board Config Dialog
  showBoardConfigDialog: boolean;
  boardConfigMode: 'import' | 'manual' | 'edit';
  newBoardDefinition: Partial<BoardDefinition>;
  importedBoardFile: string;
  onCloseBoardConfigDialog: () => void;
  onBoardConfigModeChange: (mode: 'import' | 'manual' | 'edit') => void;
  onBoardDefinitionChange: (definition: Partial<BoardDefinition>) => void;
  onImportedBoardFileChange: (file: string) => void;
  onImportBoard: () => Promise<void>;
  onAddBoard: () => Promise<void>;
  
  // Dialog Manager - Project Wizard Dialog
  showProjectWizard: boolean;
  projectName: string;
  setProjectName: (name: string) => void;
  projectPath: string;
  setProjectPath: (path: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
  projectCreationStep: ProjectCreationStep;
  setProjectCreationStep: (step: ProjectCreationStep) => void;
  isCreatingProject: boolean;
  availableBoards: BoardDefinition[];
  boardColumns: BoardColumn[];
  setBoardColumns: (columns: BoardColumn[]) => void;
  boardSortColumn: string;
  setBoardSortColumn: (column: string) => void;
  boardSortDirection: 'asc' | 'desc';
  setBoardSortDirection: (direction: 'asc' | 'desc') => void;
  showColumnManager: boolean;
  setShowColumnManager: (show: boolean) => void;
  onOpenBoardConfigDialog: (mode?: 'import' | 'manual' | 'edit', board?: BoardDefinition) => void;
  onEditCustomBoard: (board: BoardDefinition) => void;
  onCreateProject: () => Promise<void>;
  onCloseProjectWizard: () => void;
  getSortedBoards: () => BoardDefinition[];
  handleColumnSort: (columnId: string) => void;
  
  // Common styles
  buttonStyle: React.CSSProperties;
  tabStyle: React.CSSProperties;
  activeTabStyle: React.CSSProperties;
  panelStyle: React.CSSProperties;
  panelHeaderStyle: React.CSSProperties;
}

export const AppStateManager: React.FC<AppStateManagerProps> = (props) => {
  const { projectDir } = props;

  // Redirect: This component is now a thin wrapper.
  // Selection/creation and editor rendering are delegated to shells.
  if (!projectDir) {
    return (
      <ProjectSelectionView
        packageVersion={props.packageVersion}
        onStartProjectWizard={props.onStartProjectWizard}
        onOpenExistingProject={props.onOpenExistingProject}
        recentProjects={props.recentProjects}
        onOpenProject={props.onOpenProject}
        onRemoveRecentProject={props.onRemoveRecentProject}
        formatLastOpened={props.formatLastOpened}
        
        // Dialog Manager props - Sprite Dialog
        showSpriteDialog={props.showSpriteDialog}
        spriteDialogMode={props.spriteDialogMode}
        newSpriteData={props.newSpriteData}
        isCreatingSprite={props.isCreatingSprite}
        onCloseSpriteDialog={props.onCloseSpriteDialog}
        onSpriteDialogModeChange={props.onSpriteDialogModeChange}
        onSpriteDataChange={props.onSpriteDataChange}
        onImportSpriteFile={props.onImportSpriteFile}
        onCreateSprite={props.onCreateSprite}
        
        // Dialog Manager props - Board Config Dialog
        showBoardConfigDialog={props.showBoardConfigDialog}
        boardConfigMode={props.boardConfigMode}
        newBoardDefinition={props.newBoardDefinition}
        importedBoardFile={props.importedBoardFile}
        onCloseBoardConfigDialog={props.onCloseBoardConfigDialog}
        onBoardConfigModeChange={props.onBoardConfigModeChange}
        onBoardDefinitionChange={props.onBoardDefinitionChange}
        onImportedBoardFileChange={props.onImportedBoardFileChange}
        onImportBoard={props.onImportBoard}
        onAddBoard={props.onAddBoard}
        
        // Dialog Manager props - Project Wizard Dialog
        showProjectWizard={props.showProjectWizard}
        projectName={props.projectName}
        setProjectName={props.setProjectName}
        projectPath={props.projectPath}
        setProjectPath={props.setProjectPath}
        selectedTemplate={props.selectedTemplate}
        setSelectedTemplate={props.setSelectedTemplate}
        selectedBoard={props.selectedBoard}
        setSelectedBoard={props.setSelectedBoard}
        projectCreationStep={props.projectCreationStep}
        setProjectCreationStep={props.setProjectCreationStep}
        isCreatingProject={props.isCreatingProject}
        availableBoards={props.availableBoards}
        boardColumns={props.boardColumns}
        setBoardColumns={props.setBoardColumns}
        boardSortColumn={props.boardSortColumn}
        setBoardSortColumn={props.setBoardSortColumn}
        boardSortDirection={props.boardSortDirection}
        setBoardSortDirection={props.setBoardSortDirection}
        showColumnManager={props.showColumnManager}
        setShowColumnManager={props.setShowColumnManager}
        onOpenBoardConfigDialog={props.onOpenBoardConfigDialog}
        onEditCustomBoard={props.onEditCustomBoard}
        onCreateProject={props.onCreateProject}
        onCloseProjectWizard={props.onCloseProjectWizard}
        log={props.log}
        getSortedBoards={props.getSortedBoards}
        handleColumnSort={props.handleColumnSort}
        
        buttonStyle={props.buttonStyle}
      />
    );
  }

  // Main Editor View - Show when project is open
  return (
    <MainEditorView
      packageVersion={props.packageVersion}
      
      // UI State
      activeWorkspace={props.activeWorkspace}
      setActiveWorkspace={props.setActiveWorkspace}
      leftPanelWidth={props.leftPanelWidth}
      setLeftPanelWidth={props.setLeftPanelWidth}
      rightPanelWidth={props.rightPanelWidth}
      setRightPanelWidth={props.setRightPanelWidth}
      bottomPanelHeight={props.bottomPanelHeight}
      setBottomPanelHeight={props.setBottomPanelHeight}
      log={props.log}
      setLog={props.setLog}
      config={props.config}
      
      // Top Menu props
      onNewProject={props.onNewProject}
      onOpenProject={props.onOpenExistingProject}
      onAddNewFile={props.onAddNewFile}
      onCloseProject={props.onCloseProject}
      onBuildProject={props.onBuildProject}
      onFlashProject={props.onFlashProject}
      onCleanBuild={props.onCleanBuild}
      showFileMenu={props.showFileMenu}
      setShowFileMenu={props.setShowFileMenu}
      showEditMenu={props.showEditMenu}
      setShowEditMenu={props.setShowEditMenu}
      showBuildMenu={props.showBuildMenu}
      setShowBuildMenu={props.setShowBuildMenu}
      
      // Left Panel props
      sprites={props.sprites}
      selectedSprite={props.selectedSprite}
      onSpriteSelect={props.onSpriteSelect}
      audioAssets={props.audioAssets}
      selectedAudio={props.selectedAudio}
      onAudioSelect={props.onAudioSelect}
      editorTabs={props.editorTabs}
      activeTabId={props.activeTabId}
      setActiveTabId={props.setActiveTabId}
      systems={props.systems}
      onOpenSpriteDialog={props.onOpenSpriteDialog}
      onContextMenu={props.onContextMenu}
      
      // Code Workspace props
      addNewTab={props.addNewTab}
      closeTab={props.closeTab}
      updateTabContent={props.updateTabContent}
      activeTab={props.activeTab}
      
      // Sprite Workspace props
      spriteEditorMode={props.spriteEditorMode}
      setSpriteEditorMode={props.setSpriteEditorMode}
      canvasView={props.canvasView}
      setCanvasView={props.setCanvasView}
      openSpriteDialog={props.openSpriteDialog}
      
      // Paint tool state props
      activePaintTool={props.activePaintTool}
      setActivePaintTool={props.setActivePaintTool}
      paintColor={props.paintColor}
      setPaintColor={props.setPaintColor}
      brushSize={props.brushSize}
      setBrushSize={props.setBrushSize}
      
      // Layout Workspace props
      layoutPanels={props.layoutPanels}
      isPlayMode={props.isPlayMode}
      setIsPlayMode={props.setIsPlayMode}
      
      // Database Workspace props
      databases={props.databases}
      selectedDatabase={props.selectedDatabase}
      setSelectedDatabase={props.setSelectedDatabase}
      
      // Right Panel props
      activeColorTab={props.activeColorTab}
      setActiveColorTab={props.setActiveColorTab}
      showLutManager={props.showLutManager}
      setShowLutManager={props.setShowLutManager}
      
      // Dialog Manager props - Sprite Dialog
      showSpriteDialog={props.showSpriteDialog}
      spriteDialogMode={props.spriteDialogMode}
      newSpriteData={props.newSpriteData}
      isCreatingSprite={props.isCreatingSprite}
      onCloseSpriteDialog={props.onCloseSpriteDialog}
      onSpriteDialogModeChange={props.onSpriteDialogModeChange}
      onSpriteDataChange={props.onSpriteDataChange}
      onImportSpriteFile={props.onImportSpriteFile}
      onCreateSprite={props.onCreateSprite}
      
      // Dialog Manager props - Board Config Dialog
      showBoardConfigDialog={props.showBoardConfigDialog}
      boardConfigMode={props.boardConfigMode}
      newBoardDefinition={props.newBoardDefinition}
      importedBoardFile={props.importedBoardFile}
      onCloseBoardConfigDialog={props.onCloseBoardConfigDialog}
      onBoardConfigModeChange={props.onBoardConfigModeChange}
      onBoardDefinitionChange={props.onBoardDefinitionChange}
      onImportedBoardFileChange={props.onImportedBoardFileChange}
      onImportBoard={props.onImportBoard}
      onAddBoard={props.onAddBoard}
      
      // Dialog Manager props - Project Wizard Dialog
      showProjectWizard={props.showProjectWizard}
      projectName={props.projectName}
      setProjectName={props.setProjectName}
      projectPath={props.projectPath}
      setProjectPath={props.setProjectPath}
      selectedTemplate={props.selectedTemplate}
      setSelectedTemplate={props.setSelectedTemplate}
      selectedBoard={props.selectedBoard}
      setSelectedBoard={props.setSelectedBoard}
      projectCreationStep={props.projectCreationStep}
      setProjectCreationStep={props.setProjectCreationStep}
      isCreatingProject={props.isCreatingProject}
      availableBoards={props.availableBoards}
      boardColumns={props.boardColumns}
      setBoardColumns={props.setBoardColumns}
      boardSortColumn={props.boardSortColumn}
      setBoardSortColumn={props.setBoardSortColumn}
      boardSortDirection={props.boardSortDirection}
      setBoardSortDirection={props.setBoardSortDirection}
      showColumnManager={props.showColumnManager}
      setShowColumnManager={props.setShowColumnManager}
      onOpenBoardConfigDialog={props.onOpenBoardConfigDialog}
      onEditCustomBoard={props.onEditCustomBoard}
      onCreateProject={props.onCreateProject}
      onCloseProjectWizard={props.onCloseProjectWizard}
      getSortedBoards={props.getSortedBoards}
      handleColumnSort={props.handleColumnSort}
      
      // Common styles
      buttonStyle={props.buttonStyle}
      tabStyle={props.tabStyle}
      activeTabStyle={props.activeTabStyle}
      panelStyle={props.panelStyle}
      panelHeaderStyle={props.panelHeaderStyle}
    />
  );
};
