import React from 'react';
import { TopMenu } from '../layout/TopMenu';
import { LeftPanel } from '../layout/LeftPanel';
import { RightPanel } from '../layout/RightPanel';
import { SpriteWorkspace } from '../workspaces/SpriteWorkspace';
import { CodeWorkspace } from '../workspaces/CodeWorkspace';
import { AudioWorkspace } from '../workspaces/AudioWorkspace';
import { LayoutWorkspace } from '../workspaces/LayoutWorkspace';
import { DatabaseWorkspace } from '../workspaces/DatabaseWorkspace';
import { DialogManager } from '../dialogs/DialogManager';
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
import type { WispConfig } from '../../services/config';

interface MainEditorViewProps {
  // Package info
  packageVersion: string;
  
  // UI State
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
  
  // Config
  config: WispConfig | null;
  
  // Top Menu props
  onNewProject: () => void;
  onOpenProject: () => Promise<void>;
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
  
  // Left Panel props
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
  
  // Code Workspace props
  addNewTab: () => void;
  closeTab: (tabId: string) => void;
  updateTabContent: (tabId: string, content: string) => void;
  activeTab: EditorTab | undefined;
  
  // Sprite Workspace props
  spriteEditorMode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot';
  setSpriteEditorMode: (mode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot') => void;
  canvasView: '2d' | '3d';
  setCanvasView: (view: '2d' | '3d') => void;
  openSpriteDialog: (mode: 'create' | 'import') => void;
  
  // Layout Workspace props
  layoutPanels: LayoutPanel[];
  isPlayMode: boolean;
  setIsPlayMode: (play: boolean) => void;
  
  // Database Workspace props
  databases: DatabaseTable[];
  selectedDatabase: string;
  setSelectedDatabase: (id: string) => void;
  
  // Right Panel props
  activeColorTab: 'picker' | 'custom' | 'common' | 'variations';
  setActiveColorTab: (tab: 'picker' | 'custom' | 'common' | 'variations') => void;
  showLutManager: boolean;
  setShowLutManager: (show: boolean) => void;
  
  // Dialog Manager props - Sprite Dialog
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
  
  // Dialog Manager props - Board Config Dialog
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
  
  // Dialog Manager props - Project Wizard Dialog
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

export const MainEditorView: React.FC<MainEditorViewProps> = (props) => {
  const {
    packageVersion,
    activeWorkspace,
    setActiveWorkspace,
    leftPanelWidth,
    setLeftPanelWidth,
    rightPanelWidth,
    setRightPanelWidth,
    bottomPanelHeight,
    setBottomPanelHeight,
    log,
    setLog,
    config,
    buttonStyle,
    tabStyle,
    activeTabStyle,
    panelStyle,
    panelHeaderStyle
  } = props;

  // Handle workspace saving when switching
  const handleWorkspaceChange = (newWorkspace: WorkspaceTab) => {
    setActiveWorkspace(newWorkspace);
    // Save the active workspace to storage immediately
    if (config) {
      // This would need to be passed down from App or handled via a service
      // For now, we'll just change the workspace
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#0f1115",
      color: "#e6e6e6",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden"
    }}>
      {/* Top Menu Bar */}
      <TopMenu
        version={packageVersion}
        onNewProject={props.onNewProject}
        onOpenProject={props.onOpenProject}
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
        buttonStyle={buttonStyle}
      />

      {/* Main Layout */}
      <div style={{ 
        flex: 1, 
        display: "flex", 
        minHeight: 0 // Important: allows flex child to shrink below content size
      }}>
        
        {/* Left Panel - Workspace-Specific Explorer */}
        <LeftPanel
          activeWorkspace={activeWorkspace}
          leftPanelWidth={leftPanelWidth}
          setLeftPanelWidth={setLeftPanelWidth}
          sprites={props.sprites}
          selectedSprite={props.selectedSprite}
          setSelectedSprite={props.onSpriteSelect}
          audioAssets={props.audioAssets}
          selectedAudio={props.selectedAudio}
          setSelectedAudio={props.onAudioSelect}
          editorTabs={props.editorTabs}
          activeTabId={props.activeTabId}
          setActiveTabId={props.setActiveTabId}
          systems={props.systems}
          openSpriteDialog={(m?: 'create' | 'import') => props.onOpenSpriteDialog(m ?? 'create')}
          handleContextMenu={(e, type, name, path, category) => props.onContextMenu(e, type as 'file' | 'folder', name, path, category)}
        />

        {/* Center Panel - Workspace */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          
          {/* Workspace Tabs */}
          <div style={{
            height: "40px",
            background: "#1a1d23",
            borderBottom: "1px solid #2a2d36",
            display: "flex",
            alignItems: "stretch"
          }}>
            {[{id: 'sprites', label: '🎨 Sprites', icon: '🎨'}, 
              {id: 'audio', label: '🔊 Audio', icon: '🔊'}, 
              {id: 'layout', label: '🏗️ Layout', icon: '🏗️'}, 
              {id: 'database', label: '🗄️ Database', icon: '🗄️'},
              {id: 'code', label: '⚙️ Systems', icon: '⚙️'}].map(workspace => (
              <button
                key={workspace.id}
                style={{
                  ...tabStyle,
                  height: "100%",
                  padding: "0 20px",
                  fontSize: "14px",
                  fontWeight: "600",
                  ...(activeWorkspace === workspace.id ? {
                    background: "#2b6cff",
                    color: "#ffffff",
                    borderBottom: "3px solid #4d8aff"
                  } : {})
                }}
                onClick={() => handleWorkspaceChange(workspace.id as WorkspaceTab)}
              >
                <span>{workspace.label}</span>
              </button>
            ))}
          </div>

          {/* Workspace Content */}
          <div style={{ flex: 1, background: "#1e2128", overflow: "hidden" }}>
            
            {/* CODE WORKSPACE */}
            {activeWorkspace === 'code' && (
              <CodeWorkspace
                editorTabs={props.editorTabs}
                activeTabId={props.activeTabId}
                activeTab={props.activeTab}
                onTabSelect={props.setActiveTabId}
                onCloseTab={(tabId) => props.closeTab(tabId)}
                onAddNewTab={props.addNewTab}
                onUpdateContent={(content) => props.updateTabContent(props.activeTabId, content)}
                tabStyle={tabStyle}
                activeTabStyle={activeTabStyle}
              />
            )}
            
            {/* SPRITES WORKSPACE */}
            {activeWorkspace === 'sprites' && (
              <SpriteWorkspace
                sprites={props.sprites}
                selectedSprite={props.selectedSprite}
                spriteEditorMode={props.spriteEditorMode}
                canvasView={props.canvasView}
                onSpriteEditorModeChange={props.setSpriteEditorMode}
                onCanvasViewChange={props.setCanvasView}
                onOpenSpriteDialog={(mode) => props.onOpenSpriteDialog(mode ?? 'create')}
                buttonStyle={buttonStyle}
              />
            )}
            
            {activeWorkspace === 'audio' && (
              <AudioWorkspace
                audioAssets={props.audioAssets}
                selectedAudio={props.selectedAudio}
                onAudioSelect={props.onAudioSelect}
                buttonStyle={buttonStyle}
              />
            )}
            
            {/* LAYOUT WORKSPACE */}
            {activeWorkspace === 'layout' && (
              <LayoutWorkspace
                layoutPanels={props.layoutPanels}
                isPlayMode={props.isPlayMode}
                onTogglePlayMode={() => props.setIsPlayMode(!props.isPlayMode)}
                buttonStyle={buttonStyle}
              />
            )}
            
            {/* DATABASE WORKSPACE */}
            {activeWorkspace === 'database' && (
              <DatabaseWorkspace
                databases={props.databases}
                selectedDatabase={props.selectedDatabase}
                onDatabaseSelect={props.setSelectedDatabase}
                buttonStyle={buttonStyle}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Properties */}
        <RightPanel
          activeWorkspace={activeWorkspace}
          rightPanelWidth={rightPanelWidth}
          setRightPanelWidth={setRightPanelWidth}
          sprites={props.sprites}
          selectedSprite={props.selectedSprite}
          activeTab={props.activeTab}
          activeColorTab={props.activeColorTab}
          setActiveColorTab={props.setActiveColorTab}
          showLutManager={props.showLutManager}
          setShowLutManager={props.setShowLutManager}
          spriteEditorMode={props.spriteEditorMode}
        />
      </div>

      {/* Bottom Panel - Console */}
      <div style={{ 
        ...panelStyle, 
        height: `${bottomPanelHeight}px`, 
        minHeight: "120px",
        maxHeight: "50vh", // Prevent console from taking more than half the viewport
        borderTop: "1px solid #2a2d36",
        borderLeft: "none",
        borderRight: "none",
        borderBottom: "none"
      }}>
        <div style={panelHeaderStyle}>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span>💻 Console</span>
            <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }} onClick={() => setLog("")}>Clear</button>
            <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px", background: "#2b6cff" }} onClick={() => alert("Build clicked")}>Build</button>
          </div>
          <span style={{ cursor: "pointer" }} onClick={() => setBottomPanelHeight(bottomPanelHeight === 200 ? 300 : 200)}>⚙️</span>
        </div>
        <div style={{ 
          flex: 1, 
          padding: "8px 12px", 
          fontFamily: "'Consolas', 'Monaco', monospace", 
          fontSize: "12px", 
          overflow: "auto",
          whiteSpace: "pre-wrap" as const
        }}>
          {log}
        </div>
      </div>
      
      {/* All Dialogs are managed by DialogManager */}
      <DialogManager
        // Sprite Dialog props
        showSpriteDialog={props.showSpriteDialog}
        spriteDialogMode={props.spriteDialogMode}
        newSpriteData={props.newSpriteData}
        isCreatingSprite={props.isCreatingSprite}
        onCloseSpriteDialog={props.onCloseSpriteDialog}
        onSpriteDialogModeChange={props.onSpriteDialogModeChange}
        onDataChange={props.onSpriteDataChange}
        onImportSpriteFile={() => props.onImportSpriteFile(null)}
        onCreateSprite={props.onCreateSprite}
        
        // Board Config Dialog props
        showBoardConfigDialog={props.showBoardConfigDialog}
        boardConfigMode={props.boardConfigMode}
        newBoardDefinition={props.newBoardDefinition}
        importedBoardFile={props.importedBoardFile}
        onCloseBoardConfigDialog={props.onCloseBoardConfigDialog}
        onBoardConfigModeChange={props.onBoardConfigModeChange}
        onImportBoard={props.onImportBoard}
        onAddBoard={props.onAddBoard}
        setNewBoardDefinition={props.onBoardDefinitionChange}
        setImportedBoardFile={props.onImportedBoardFileChange}
        
        // Project Wizard Dialog props (even in main editor, wizard can be opened)
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
        onEditCustomBoard={() => props.onEditCustomBoard({} as any)}
        onCreateProject={props.onCreateProject}
        onCloseProjectWizard={props.onCloseProjectWizard}
        log={log}
        getSortedBoards={props.getSortedBoards}
        handleColumnSort={props.handleColumnSort}
        
        // Common props
        buttonStyle={buttonStyle}
      />
    </div>
  );
};
