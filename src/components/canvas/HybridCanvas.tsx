import React, { useState, useCallback } from 'react';
import { InfiniteCanvas } from './InfiniteCanvas';
import { PainterroWrapper, PainterroTool } from './PainterroWrapper';

interface HybridCanvasProps {
  spriteWidth: number;
  spriteHeight: number;
  activeTool?: PainterroTool;
  color?: string;
  brushSize?: number;
  onImageChange?: (dataUrl: string) => void;
  onPixelClick?: (x: number, y: number) => void;
  showPainterro?: boolean;
}

export const HybridCanvas: React.FC<HybridCanvasProps> = ({
  spriteWidth,
  spriteHeight,
  activeTool = 'brush',
  color = '#000000',
  brushSize = 2,
  onImageChange,
  onPixelClick,
  showPainterro = false
}) => {
  const [currentMode, setCurrentMode] = useState<'grid' | 'painterro'>(showPainterro ? 'painterro' : 'grid');

  const handlePixelClick = useCallback((x: number, y: number) => {
    if (onPixelClick) {
      onPixelClick(x, y);
    }
    console.log(`Pixel clicked at: ${x}, ${y}`);
  }, [onPixelClick]);

  const handleImageChange = useCallback((dataUrl: string) => {
    if (onImageChange) {
      onImageChange(dataUrl);
    }
    console.log('Image changed in Painterro');
  }, [onImageChange]);

  // Mode toggle function
  const toggleMode = () => {
    setCurrentMode(prev => prev === 'grid' ? 'painterro' : 'grid');
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      position: 'relative',
      background: '#1e2128' 
    }}>
      {/* Mode toggle button */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 10,
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={toggleMode}
          style={{
            padding: '8px 16px',
            background: currentMode === 'grid' ? 'rgba(64, 120, 255, 0.2)' : 'rgba(255,255,255,0.1)',
            border: currentMode === 'grid' ? '2px solid #4078ff' : '1px solid #3a3d46',
            borderRadius: '6px',
            color: currentMode === 'grid' ? '#4078ff' : '#e6e6e6',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          🎯 Grid Mode
        </button>
        <button
          onClick={toggleMode}
          style={{
            padding: '8px 16px',
            background: currentMode === 'painterro' ? 'rgba(64, 120, 255, 0.2)' : 'rgba(255,255,255,0.1)',
            border: currentMode === 'painterro' ? '2px solid #4078ff' : '1px solid #3a3d46',
            borderRadius: '6px',
            color: currentMode === 'painterro' ? '#4078ff' : '#e6e6e6',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          🎨 Paint Mode
        </button>
      </div>

      {/* Canvas content */}
      {currentMode === 'grid' ? (
        <InfiniteCanvas
          spriteWidth={spriteWidth}
          spriteHeight={spriteHeight}
          onPixelClick={handlePixelClick}
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%',
          padding: '60px 20px 20px 20px' // Top padding to avoid toggle buttons
        }}>
          {/* Painterro Error Boundary */}
          <div style={{ 
            width: '100%',
            height: '100%',
            minHeight: '400px',
            position: 'relative'
          }}>
            <PainterroWrapper
              width={spriteWidth}
              height={spriteHeight}
              activeTool={activeTool}
              color={color}
              brushSize={brushSize}
              onImageChange={handleImageChange}
              style={{
                border: '1px solid #3a3d46',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '300px'
              }}
            />
          </div>
        </div>
      )}

      {/* Info overlay */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        background: 'rgba(42, 45, 54, 0.9)',
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #3a3d46',
        color: '#e6e6e6',
        fontSize: '12px',
        fontWeight: '500',
        userSelect: 'none',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }}>
        {currentMode === 'grid' ? '🎯 Grid Mode' : '🎨 Paint Mode'} • {spriteWidth}×{spriteHeight}px
        {currentMode === 'painterro' && (
          <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.8 }}>
            Tool: {activeTool} • Color: {color} • Size: {brushSize}
          </div>
        )}
      </div>
    </div>
  );
};
