import { useState } from 'react';
import { configService, type RecentProject } from '../services/config';
import { projectService, type ProjectStructure } from '../services/project';
import { spriteService } from '../services/sprite';
import { join } from '@tauri-apps/api/path';
import { readTextFile } from '@tauri-apps/plugin-fs';
import type { EditorTab, SpriteAsset, ProjectCreationStep } from '../types';

export interface ProjectManagerState {
  projectDir: string;
  currentProject: ProjectStructure | null;
  recentProjects: RecentProject[];
  
  // Project Creation Wizard State
  showProjectWizard: boolean;
  projectCreationStep: ProjectCreationStep;
  selectedTemplate: string;
  selectedBoard: string;
  projectName: string;
  projectPath: string;
  isCreatingProject: boolean;
}

export interface ProjectManagerActions {
  openProject: (projectPath: string) => Promise<void>;
  startProjectWizard: (template?: string) => void;
  createProjectWithWizard: () => Promise<void>;
  cancelProjectWizard: () => void;
  openExistingProject: () => Promise<void>;
  closeProject: () => void;
  removeRecentProject: (projectPath: string, e: React.MouseEvent) => Promise<void>;
  formatLastOpened: (lastOpened: string) => string;
  
  // State setters for project wizard
  setProjectCreationStep: (step: ProjectCreationStep) => void;
  setSelectedTemplate: (template: string) => void;
  setSelectedBoard: (board: string) => void;
  setProjectName: (name: string) => void;
  setProjectPath: (path: string) => void;
}

export interface ProjectManagerHook extends ProjectManagerState, ProjectManagerActions {}

export function useProjectManager(
  setLog: (logOrUpdater: string | ((prev: string) => string)) => void,
  setEditorTabs: (tabs: EditorTab[]) => void,
  setActiveTabId: (id: string) => void,
  setSprites: (sprites: SpriteAsset[]) => void,
  setSelectedSprite: (id: string) => void,
  setAudioAssets: (assets: any[]) => void,
  setSelectedAudio: (id: string) => void,
  setSelectedDatabase: (id: string) => void,
  setRecentProjects: (projects: RecentProject[]) => void,
  // Sprite dialog state setters
  setShowSpriteDialog: (show: boolean) => void,
  setSpriteDialogMode: (mode: 'create' | 'import') => void,
  setIsCreatingSprite: (creating: boolean) => void,
  setNewSpriteData: (data: any) => void,
  // Board config dialog state setters
  setShowBoardConfigDialog: (show: boolean) => void,
  setNewBoardDefinition: (def: any) => void,
  setImportedBoardFile: (file: string) => void,
  setContextMenu: (menu: any) => void
): ProjectManagerHook {
  
  // Project state
  const [projectDir, setProjectDir] = useState<string>('');
  const [currentProject, setCurrentProject] = useState<ProjectStructure | null>(null);
  const [recentProjects, setRecentProjectsState] = useState<RecentProject[]>([]);
  
  // Project Creation Wizard State
  const [showProjectWizard, setShowProjectWizard] = useState(false);
  const [projectCreationStep, setProjectCreationStep] = useState<ProjectCreationStep>('setup');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('Empty Project');
  const [selectedBoard, setSelectedBoard] = useState<string>('');
  const [projectName, setProjectName] = useState('');
  const [projectPath, setProjectPath] = useState('');
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  // Update both local state and parent state for recent projects
  const updateRecentProjects = (projects: RecentProject[]) => {
    setRecentProjectsState(projects);
    setRecentProjects(projects);
  };

  const openProject = async (projectPath: string) => {
    console.log('openProject called with path:', projectPath);
    setLog(`Loading project: ${projectPath}`);
    
    // Verify project exists
    console.log('Checking if project exists...');
    const projectExists = await projectService.checkProjectExists(projectPath);
    console.log('Project exists:', projectExists);
    if (!projectExists) {
      const errorMsg = `Project not found at ${projectPath}`;
      console.error(errorMsg);
      setLog(errorMsg);
      // Remove from recent projects if it doesn't exist
      await configService.removeRecentProject(projectPath);
      updateRecentProjects(configService.getRecentProjects());
      throw new Error(errorMsg);
    }
    
    // Load project structure
    console.log('Loading project structure...');
    const project = await projectService.loadProject(projectPath);
    console.log('Project loaded:', project);
    if (!project) {
      const errorMsg = `Failed to load project from ${projectPath}`;
      console.error(errorMsg);
      setLog(errorMsg);
      throw new Error(errorMsg);
    }
    
    setCurrentProject(project);
    console.log('Setting projectDir to:', projectPath);
    setProjectDir(projectPath);
    
    // Load script files as editor tabs
    const tabs: EditorTab[] = [];
    for (const scriptFile of project.files.scripts) {
      try {
        const scriptPath = await join(projectPath, 'scripts', scriptFile);
        const content = await readTextFile(scriptPath);
        tabs.push({
          id: scriptFile,
          title: scriptFile,
          content,
          filePath: `scripts/${scriptFile}`,
          modified: false
        });
      } catch (error) {
        console.warn(`Failed to load script file ${scriptFile}:`, error);
      }
    }
    
    setEditorTabs(tabs);
    if (tabs.length > 0) {
      setActiveTabId(tabs[0].id);
    }
    
    // Load sprites from the project
    try {
      console.log('Loading sprites from project...');
      const loadedSprites = await spriteService.loadSprites(projectPath);
      console.log('Loaded sprites:', loadedSprites);
      setSprites(loadedSprites);
      setLog(prev => prev + `\\nLoaded ${loadedSprites.length} sprites from project`);
    } catch (error) {
      console.warn('Failed to load sprites:', error);
      setLog(prev => prev + `\\nWarning: Could not load sprites - ${String(error)}`);
    }
    
    // Add to recent projects
    await configService.addRecentProject(
      projectPath, 
      project.template, 
      project.board
    );
    updateRecentProjects(configService.getRecentProjects());
    
    setLog(`Project loaded: ${project.name} from ${projectPath}`);
    console.log('openProject completed successfully, projectDir should be set to:', projectPath);
  };

  const startProjectWizard = (template: string = '') => {
    setSelectedTemplate(template || 'Empty Project');
    setProjectCreationStep('setup');
    setShowProjectWizard(true);
  };

  const createProjectWithWizard = async () => {
    // Debug logging to identify missing fields
    console.log('Project creation validation:');
    console.log('- projectName:', projectName, 'isEmpty:', !projectName);
    console.log('- projectPath:', projectPath, 'isEmpty:', !projectPath);
    console.log('- selectedBoard:', selectedBoard, 'isEmpty:', !selectedBoard);
    
    if (!projectName || !projectPath || !selectedBoard) {
      const missingFields = [];
      if (!projectName) missingFields.push('Project Name');
      if (!projectPath) missingFields.push('Project Path');
      if (!selectedBoard) missingFields.push('Board Selection');
      
      const errorMsg = `Please fill in all required fields. Missing: ${missingFields.join(', ')}`;
      console.error(errorMsg);
      alert(errorMsg);
      return;
    }
    
    setIsCreatingProject(true);
    
    try {
      setLog(`Creating project: ${projectName}`);
      setLog(`Project path: ${projectPath}`);
      setLog(`Template: ${selectedTemplate}`);
      setLog(`Board: ${selectedBoard}`);
      
      const success = await projectService.createProject(
        projectPath,
        projectName,
        selectedTemplate,
        selectedBoard
      );
      
      if (success) {
        const fullPath = await join(projectPath, projectName);
        setLog(`Project created successfully at: ${fullPath}`);
        
        // Add delay to ensure file system operations are complete
        setLog(`Waiting for file system to stabilize...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          setLog(`Attempting to open project at: ${fullPath}`);
          console.log('About to call openProject with path:', fullPath);
          console.log('Current projectDir state before openProject:', projectDir);
          
          await openProject(fullPath);
          
          console.log('openProject completed without throwing');
          setLog(`✅ Project opened successfully!`);
          
          // Automatically close the project wizard dialog after successful creation
          setTimeout(() => {
            setLog(`Project is ready for editing.`);
            setShowProjectWizard(false);
            // Reset wizard state
            setProjectCreationStep('setup');
            setSelectedTemplate('Empty Project');
            setSelectedBoard('');
            setProjectName('');
            setProjectPath('');
          }, 1000); // Give user time to see the success message
          
        } catch (openError) {
          console.error('Failed to open project after creation:', openError);
          setLog(`❌ Failed to open project: ${String(openError)}`);
          setLog(`The project was created successfully but couldn't be opened automatically.`);
          setLog(`You can try closing this dialog and opening the project manually.`);
        }
      } else {
        const errorMsg = 'Failed to create project. Check console for details.';
        alert(errorMsg);
        setLog(errorMsg);
      }
    } catch (error) {
      console.error('Error creating project:', error);
      const errorMsg = `Error creating project: ${String(error)}`;
      alert(errorMsg);
      setLog(errorMsg);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const cancelProjectWizard = () => {
    setShowProjectWizard(false);
    setProjectCreationStep('setup');
    setSelectedTemplate('Empty Project');
    setSelectedBoard('');
    setProjectName('');
    setProjectPath('');
  };

  const openExistingProject = async () => {
    try {
      const selectedPath = await projectService.openProjectDialog();
      if (selectedPath) {
        await openProject(selectedPath);
      }
    } catch (error) {
      console.error('Failed to open project dialog:', error);
      setLog('Error opening project dialog: ' + String(error));
    }
  };

  const closeProject = () => {
    // Reset all project-related state
    setProjectDir('');
    setCurrentProject(null);
    setSprites([]);
    setSelectedSprite('');
    setAudioAssets([]);
    setSelectedAudio('');
    setEditorTabs([]);
    setActiveTabId('');
    setSelectedDatabase('1');

    // Reset project creation wizard state
    setShowProjectWizard(false);
    setProjectCreationStep('setup');
    setSelectedTemplate('Empty Project');
    setSelectedBoard('');
    setProjectName('');
    setProjectPath('');
    setIsCreatingProject(false);

    // Reset sprite dialog state
    setShowSpriteDialog(false);
    setSpriteDialogMode('create');
    setIsCreatingSprite(false);
    setNewSpriteData({
      name: '',
      type: 'background',
      width: 32,
      height: 32,
      frames: 1,
      animationSpeed: 10,
      importPath: ''
    });

    // Reset other dialog states
    setShowBoardConfigDialog(false);
    setNewBoardDefinition({});
    setImportedBoardFile('');
    setContextMenu(null);

    // Clear log
    setLog('Project closed. Ready to create or open a project.');
  };

  const removeRecentProject = async (projectPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await configService.removeRecentProject(projectPath);
      updateRecentProjects(configService.getRecentProjects());
    } catch (error) {
      console.error('Failed to remove recent project:', error);
    }
  };

  const formatLastOpened = (lastOpened: string): string => {
    try {
      const date = new Date(lastOpened);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  return {
    // State
    projectDir,
    currentProject,
    recentProjects,
    showProjectWizard,
    projectCreationStep,
    selectedTemplate,
    selectedBoard,
    projectName,
    projectPath,
    isCreatingProject,
    
    // Actions
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
  };
}
