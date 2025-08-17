import Painterro from 'painterro';
import type { PainterroTool } from '../components/canvas/PainterroWrapper';

class PainterroService {
  private painterroInstance: any = null;
  private offScreenContainer: HTMLDivElement | null = null;
  private currentHostContainer: HTMLDivElement | null = null;
  private onImageChangeCallback: ((dataUrl: string) => void) | null = null;

  init() {
    if (this.painterroInstance) {
      return;
    }

    // 1. Create a hidden, off-screen container for Painterro
    this.offScreenContainer = document.createElement('div');
    this.offScreenContainer.id = 'wisp-painterro-offscreen-container';
    this.offScreenContainer.style.position = 'absolute';
    this.offScreenContainer.style.top = '-9999px';
    this.offScreenContainer.style.left = '-9999px';
    this.offScreenContainer.style.width = '1px';
    this.offScreenContainer.style.height = '1px';
    this.offScreenContainer.style.overflow = 'hidden';
    document.body.appendChild(this.offScreenContainer);

    console.log('🎨 [PainterroService] Initializing Painterro in off-screen container...');

    try {
        this.painterroInstance = Painterro({
            // Do not provide an ID, let it be managed internally
            hiddenTools: [], // Hide default toolbar
            saveByEnter: false,
            closeOnSave: false,
            transparentImage: true,
            // Generic save handler that uses a callback
            saveHandler: (image: any, done: () => void) => {
                try {
                    const dataUrl = image.asDataURL('image/png');
                    if (this.onImageChangeCallback) {
                        this.onImageChangeCallback(dataUrl);
                    }
                } catch (e) {
                    console.error('❌ [PainterroService] Error in save handler:', e);
                }
                // We don't call done() to keep it open
            },
            onInit: (instance: any) => {
                console.log('✅ [PainterroService] Painterro instance initialized successfully off-screen.');
                // The instance is ready but not shown yet
            },
            onError: (err: any) => {
                console.error('❌ [PainterroService] Critical initialization error:', err);
            },
        });
        // Immediately show it in the offscreen container to complete init
        this.painterroInstance.show(this.offScreenContainer);

    } catch (error) {
        console.error('❌ [PainterroService] Failed to construct Painterro:', error);
    }
  }

  show(hostContainer: HTMLDivElement, options: { 
    width: number; 
    height: number;
    onImageChange: (dataUrl: string) => void;
  }) {
    if (!this.painterroInstance || !hostContainer) {
      console.warn('⚠️ [PainterroService] Cannot show, instance or host container not ready.');
      return;
    }

    console.log(`🎨 [PainterroService] Showing and reparenting Painterro into host container.`);
    this.currentHostContainer = hostContainer;
    this.onImageChangeCallback = options.onImageChange;

    // Move the painterro root element to the new host
    const painterroRoot = this.painterroInstance.root_el;
    if (painterroRoot) {
        hostContainer.appendChild(painterroRoot);
        // Resize the instance to fit the new container
        this.painterroInstance.resize(options.width, options.height);
    } else {
        console.error('❌ [PainterroService] Painterro root element not found for reparenting.');
    }
  }

  hide() {
    if (!this.painterroInstance || !this.currentHostContainer || !this.offScreenContainer) {
      return;
    }
    
    console.log('🎨 [PainterroService] Hiding and returning Painterro to off-screen container.');
    const painterroRoot = this.painterroInstance.root_el;
    if (painterroRoot) {
        // Move back to the off-screen container to keep it alive
        this.offScreenContainer.appendChild(painterroRoot);
    }
    
    this.currentHostContainer = null;
    this.onImageChangeCallback = null;
  }
  
  setTool(tool: PainterroTool) {
    if (this.painterroInstance) this.painterroInstance.tool = tool;
  }

  setColor(color: string) {
    if (this.painterroInstance) this.painterroInstance.color = color;
  }

  setBrushSize(size: number) {
    if (this.painterroInstance) this.painterroInstance.lineWidth = size;
  }
}

// Export a singleton instance
export const painterroService = new PainterroService();
''
