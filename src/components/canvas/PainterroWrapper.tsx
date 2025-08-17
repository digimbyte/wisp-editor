import React, { useEffect, useRef, useState } from 'react';
import Painterro from 'painterro';

export type PainterroTool = 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'bucket' | 'select' | 'crop';

interface PainterroWrapperProps {
  width: number;
  height: number;
  activeTool?: PainterroTool;
  color?: string;
  brushSize?: number;
  onImageChange?: (dataUrl: string) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const PainterroWrapper: React.FC<PainterroWrapperProps> = ({
  width,
  height,
  activeTool = 'brush',
  color = '#000000',
  brushSize = 2,
  onImageChange,
  style,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const painterroRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  // Initialize Painterro with proper error handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      console.warn('⚠️ Painterro container not ready');
      return;
    }

    // Add small delay to ensure DOM is fully ready
    const initTimer = setTimeout(() => {
      if (!containerRef.current) {
        console.warn('⚠️ Container ref lost during initialization delay');
        return;
      }

      console.log('🎨 Initializing Painterro...');
      
      let painterroInstance: any = null;
    
    try {
      painterroInstance = Painterro({
        id: 'wisp-painterro-' + Date.now(),
        defaultTool: activeTool,
        defaultColor: color,
        defaultLineWidth: brushSize,
        // Hide the built-in toolbar since we want custom buttons
        hiddenTools: [],
        // Set canvas size
        defaultSize: {
          width: Math.max(width, 400),
          height: Math.max(height, 300)
        },
        // Custom save handler
        saveHandler: (image: any, done: () => void) => {
          try {
            if (onImageChange && image && typeof image.asDataURL === 'function') {
              const dataUrl = image.asDataURL('image/png');
              onImageChange(dataUrl);
            }
          } catch (error) {
            console.error('❌ Error in save handler:', error);
          }
          done();
        },
        // Initialize with proper error handling
        onInit: (inst: any) => {
          painterroRef.current = inst;
          setIsReady(true);
          console.log('✅ Painterro initialized successfully');
        },
        onError: (error: any) => {
          console.error('❌ Painterro error:', error);
        }
      });

      // Show Painterro with error handling
      if (painterroInstance && container) {
        painterroInstance.show(container);
      } else {
        console.error('❌ Failed to create Painterro instance or container missing');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Painterro:', error);
    }

    }, 100); // 100ms delay to ensure DOM is ready

    return () => {
      clearTimeout(initTimer);
      try {
        if (painterroRef.current) {
          painterroRef.current.close();
          painterroRef.current = null;
        }
        setIsReady(false);
      } catch (error) {
        console.error('❌ Error cleaning up Painterro:', error);
      }
    };
  }, [width, height]); // Re-initialize if size changes

  // Update tool when activeTool prop changes
  useEffect(() => {
    if (isReady && painterroRef.current) {
      painterroRef.current.tool = activeTool;
      console.log('🔧 Tool changed to:', activeTool);
    }
  }, [isReady, activeTool]);

  // Update color when color prop changes
  useEffect(() => {
    if (isReady && painterroRef.current) {
      painterroRef.current.color = color;
      console.log('🎨 Color changed to:', color);
    }
  }, [isReady, color]);

  // Update brush size when brushSize prop changes
  useEffect(() => {
    if (isReady && painterroRef.current) {
      painterroRef.current.brushSize = brushSize;
      console.log('📏 Brush size changed to:', brushSize);
    }
  }, [isReady, brushSize]);

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        ...style
      }}
      className={className}
    />
  );
};

// Tool button component for the right panel
interface ToolButtonProps {
  tool: PainterroTool;
  isActive: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  tool,
  isActive,
  onClick,
  icon,
  label
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px',
        background: isActive ? 'rgba(64, 120, 255, 0.2)' : 'rgba(255,255,255,0.05)',
        border: isActive ? '2px solid #4078ff' : '1px solid #3a3d46',
        borderRadius: '8px',
        color: isActive ? '#4078ff' : '#e6e6e6',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        minHeight: '60px'
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        }
      }}
      title={label}
    >
      <span style={{ fontSize: '20px' }}>{icon}</span>
      <span style={{ fontSize: '10px', textAlign: 'center' }}>{label}</span>
    </button>
  );
};

// Predefined tool configurations
export const PAINT_TOOLS: Array<{
  tool: PainterroTool;
  icon: string;
  label: string;
}> = [
  { tool: 'brush', icon: '🖌️', label: 'Brush' },
  { tool: 'eraser', icon: '🧽', label: 'Eraser' },
  { tool: 'line', icon: '📏', label: 'Line' },
  { tool: 'rect', icon: '⬜', label: 'Rectangle' },
  { tool: 'ellipse', icon: '⭕', label: 'Ellipse' },
  { tool: 'bucket', icon: '🪣', label: 'Fill' },
  { tool: 'select', icon: '📦', label: 'Select' },
];
