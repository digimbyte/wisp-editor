import { open } from '@tauri-apps/plugin-dialog';
import { invoke } from '@tauri-apps/api/core';

export class DialogService {
  
  async selectDirectory(): Promise<string | null> {
    // Method 1: Try the Tauri plugin approach
    try {
      console.log('Attempting plugin-based directory selection...');
      const result = await open({
        directory: true,
        multiple: false,
        title: 'Select Directory to Save Project'
      });
      
      if (result) {
        console.log('Plugin dialog result:', result);
        return result as string;
      }
      return null;
    } catch (pluginError) {
      console.warn('Plugin dialog failed:', pluginError);
      
        // Method 2: Try the native Tauri command
        try {
          console.log('Attempting native command directory selection...');
          const result = await invoke<string | null>('pick_directory');
          console.log('Native command result:', result);
          return result;
      } catch (commandError) {
        console.warn('Native command failed:', commandError);
        
        // Method 3: HTML5 file input fallback (limited but works)
        return this.htmlDirectoryFallback();
      }
    }
  }
  
  private async htmlDirectoryFallback(): Promise<string | null> {
    return new Promise((resolve) => {
      console.log('Using HTML5 directory picker fallback...');
      
      // Create a temporary file input
      const input = document.createElement('input');
      input.type = 'file';
      // @ts-ignore - webkitdirectory is not in the standard types but works in browsers
      input.webkitdirectory = true;
      input.multiple = true;
      input.style.display = 'none';
      
      input.onchange = (event) => {
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const file = target.files[0];
          // Extract directory path from the file path
          const fullPath = file.webkitRelativePath || file.name;
          const dirPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
          console.log('HTML5 fallback result:', dirPath);
          resolve(dirPath || 'Selected Directory');
        } else {
          resolve(null);
        }
        document.body.removeChild(input);
      };
      
      input.oncancel = () => {
        resolve(null);
        document.body.removeChild(input);
      };
      
      document.body.appendChild(input);
      input.click();
    });
  }
  
  async selectFile(filters?: { name: string; extensions: string[] }[]): Promise<string | null> {
    try {
      console.log('Attempting file selection...');
      const result = await open({
        directory: false,
        multiple: false,
        filters: filters,
        title: 'Select File'
      });
      
      if (result) {
        console.log('File dialog result:', result);
        return result as string;
      }
      return null;
    } catch (error) {
      console.warn('File dialog failed:', error);
      return null;
    }
  }
  
  async selectFiles(filters?: { name: string; extensions: string[] }[]): Promise<string[] | null> {
    try {
      console.log('Attempting multiple file selection...');
      const result = await open({
        directory: false,
        multiple: true,
        filters: filters,
        title: 'Select Files'
      });
      
      if (result) {
        console.log('Multiple file dialog result:', result);
        return result as string[];
      }
      return null;
    } catch (error) {
      console.warn('Multiple file dialog failed:', error);
      return null;
    }
  }
}

export const dialogService = new DialogService();
