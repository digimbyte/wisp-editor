import React from 'react';
import { ProjectHub } from '../ProjectHub';
import { DialogManager } from '../dialogs/DialogManager';
import type { 
  BoardDefinition, 
  SpriteType,
  BoardColumn,
  ProjectCreationStep 
} from '../../types';
import type { RecentProject } from '../../services/config';

interface ProjectSelectionViewProps {
  // Package info
  packageVersion: string;
  
  // Project Hub props
  onStartProjectWizard: () => void;
  onOpenExistingProject: () => Promise<void>;
  recentProjects: RecentProject[];
  onOpenProject: (path: string) => Promise<void>;
  onRemoveRecentProject: (path: string) => void;
  formatLastOpened: (timestamp: number) => string;
  
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
  log: string;
  getSortedBoards: () => BoardDefinition[];
  handleColumnSort: (columnId: string) => void;
  
  // Common props
  buttonStyle: React.CSSProperties;
}

export const ProjectSelectionView: React.FC<ProjectSelectionViewProps> = (props) => {
  return (
    <>
      <ProjectHub
        packageVersion={props.packageVersion}
        onStartProjectWizard={props.onStartProjectWizard}
        onOpenExistingProject={props.onOpenExistingProject}
        recentProjects={props.recentProjects}
        onOpenProject={props.onOpenProject}
        onRemoveRecentProject={(path: string, _e: React.MouseEvent) => {
          props.onRemoveRecentProject(path);
          return Promise.resolve();
        }}
        formatLastOpened={(ts) => props.formatLastOpened(ts as unknown as number)}
      />
      
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
        
        // Project Wizard Dialog props
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
        log={props.log}
        getSortedBoards={props.getSortedBoards}
        handleColumnSort={props.handleColumnSort}
        
        // Common props
        buttonStyle={props.buttonStyle}
      />
    </>
  );
};
