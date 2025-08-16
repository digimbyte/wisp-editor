import React from 'react';
import { SpriteCreationDialog } from './SpriteCreationDialog';
import { BoardConfigDialog } from './BoardConfigDialog';
import { ProjectWizard } from '../ProjectWizard/ProjectWizard';
import type { 
  SpriteType, 
  BoardDefinition,
  ProjectCreationStep,
  BoardColumn
} from '../../types';

interface DialogManagerProps {
  // Sprite Dialog
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
  onDataChange: (data: any) => void;
  onImportSpriteFile: () => void;
  onCreateSprite: () => void;

  // Board Config Dialog
  showBoardConfigDialog: boolean;
  boardConfigMode: 'import' | 'manual' | 'edit';
  newBoardDefinition: Partial<BoardDefinition>;
  importedBoardFile: string;
  onCloseBoardConfigDialog: () => void;
  onBoardConfigModeChange: (mode: 'import' | 'manual' | 'edit') => void;
  setNewBoardDefinition: (definition: Partial<BoardDefinition>) => void;
  setImportedBoardFile: (file: string) => void;
  onImportBoard: () => void;
  onAddBoard: () => void;

  // Project Wizard Dialog
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
  onOpenBoardConfigDialog: (mode: 'import' | 'manual') => void;
  onEditCustomBoard: () => void;
  onCreateProject: () => void;
  onCloseProjectWizard: () => void;
  log: string;
  getSortedBoards: () => BoardDefinition[];
  handleColumnSort: (column: string) => void;

  // Common
  buttonStyle: React.CSSProperties;
}

export const DialogManager: React.FC<DialogManagerProps> = ({
  // Sprite Dialog props
  showSpriteDialog,
  spriteDialogMode,
  newSpriteData,
  isCreatingSprite,
  onCloseSpriteDialog,
  onSpriteDialogModeChange,
  onDataChange,
  onImportSpriteFile,
  onCreateSprite,

  // Board Config Dialog props
  showBoardConfigDialog,
  boardConfigMode,
  newBoardDefinition,
  importedBoardFile,
  onCloseBoardConfigDialog,
  setNewBoardDefinition,
  onImportBoard,
  onAddBoard,

  // Project Wizard Dialog props
  showProjectWizard,
  projectName,
  setProjectName,
  projectPath,
  setProjectPath,
  selectedTemplate,
  setSelectedTemplate,
  selectedBoard,
  setSelectedBoard,
  projectCreationStep,
  setProjectCreationStep,
  isCreatingProject,
  availableBoards,
  boardColumns,
  setBoardColumns,
  boardSortColumn,
  setBoardSortColumn,
  boardSortDirection,
  setBoardSortDirection,
  showColumnManager,
  setShowColumnManager,
  onOpenBoardConfigDialog,
  onEditCustomBoard,
  onCreateProject,
  onCloseProjectWizard,
  log,
  getSortedBoards,
  handleColumnSort,

  // Common props
  buttonStyle
}) => {
  return (
    <>
      {/* Sprite Creation Dialog */}
      <SpriteCreationDialog
        show={showSpriteDialog}
        mode={spriteDialogMode}
        spriteData={newSpriteData}
        isCreating={isCreatingSprite}
        onClose={onCloseSpriteDialog}
        onModeChange={onSpriteDialogModeChange}
        onDataChange={onDataChange}
        onImportFile={onImportSpriteFile}
        onCreate={onCreateSprite}
        buttonStyle={buttonStyle}
      />
      
      {/* Board Config Dialog */}
      <BoardConfigDialog
        show={showBoardConfigDialog}
        mode={boardConfigMode}
        onClose={onCloseBoardConfigDialog}
        onImport={onImportBoard}
        onAddCustomBoard={onAddBoard}
        newBoardDefinition={newBoardDefinition}
        setNewBoardDefinition={setNewBoardDefinition}
        importedBoardFile={importedBoardFile}
        buttonStyle={buttonStyle}
      />

      {/* Project Wizard Dialog */}
      <ProjectWizard
        show={showProjectWizard}
        onClose={onCloseProjectWizard}
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
        log={log}
        getSortedBoards={getSortedBoards}
        handleColumnSort={handleColumnSort}
        buttonStyle={buttonStyle}
      />
    </>
  );
};
