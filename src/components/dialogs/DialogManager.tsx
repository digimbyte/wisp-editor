import React from 'react';
import { SpriteCreationDialog } from './SpriteCreationDialog';
import { BoardConfigDialog } from './BoardConfigDialog';
import { ProjectWizard } from '../ProjectWizard';
import type { 
  SpriteType, 
  BoardDefinition, 
  RecentProject 
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
  onSpriteDataChange: (data: any) => void;
  onImportSpriteFile: () => void;
  onCreateSprite: () => void;

  // Board Config Dialog
  showBoardConfigDialog: boolean;
  boardConfigMode: 'import' | 'manual' | 'edit';
  newBoardDefinition: Partial<BoardDefinition>;
  importedBoardFile: string;
  onCloseBoardConfigDialog: () => void;
  onBoardConfigModeChange: (mode: 'import' | 'manual' | 'edit') => void;
  onBoardDefinitionChange: (definition: Partial<BoardDefinition>) => void;
  onImportedBoardFileChange: (file: string) => void;
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
  projectCreationStep: number;
  setProjectCreationStep: (step: number) => void;
  isCreatingProject: boolean;
  availableBoards: BoardDefinition[];
  boardColumns: any[];
  setBoardColumns: (columns: any[]) => void;
  boardSortColumn: string;
  setBoardSortColumn: (column: string) => void;
  boardSortDirection: 'asc' | 'desc';
  setBoardSortDirection: (direction: 'asc' | 'desc') => void;
  showColumnManager: boolean;
  setShowColumnManager: (show: boolean) => void;
  onOpenBoardConfigDialog: () => void;
  onEditCustomBoard: (board: BoardDefinition) => void;
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
  onSpriteDataChange,
  onImportSpriteFile,
  onCreateSprite,

  // Board Config Dialog props
  showBoardConfigDialog,
  boardConfigMode,
  newBoardDefinition,
  importedBoardFile,
  onCloseBoardConfigDialog,
  onBoardConfigModeChange,
  onBoardDefinitionChange,
  onImportedBoardFileChange,
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
        onSpriteDataChange={onSpriteDataChange}
        onImportFile={onImportSpriteFile}
        onCreate={onCreateSprite}
        buttonStyle={buttonStyle}
      />
      
      {/* Board Config Dialog */}
      <BoardConfigDialog
        show={showBoardConfigDialog}
        mode={boardConfigMode}
        boardDefinition={newBoardDefinition}
        importedFile={importedBoardFile}
        onClose={onCloseBoardConfigDialog}
        onModeChange={onBoardConfigModeChange}
        onBoardDefinitionChange={onBoardDefinitionChange}
        onImportedFileChange={onImportedBoardFileChange}
        onImportBoard={onImportBoard}
        onAddBoard={onAddBoard}
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
