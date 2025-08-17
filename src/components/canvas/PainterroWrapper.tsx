import React, { useEffect, useRef, useState } from 'react';
import Painterro from 'painterro';

import { painterroService } from '../../services/painterroService';

export type PainterroTool = 'brush' | 'eraser' | 'line' | 'rect' | 'ellipse' | 'bucket' | 'select' | 'crop';

interface PainterroWrapperProps {
  width: number;
  height: number;
  activeTool?: PainterroTool;
  color?: string;
  brushSize?: number;
  onImageChange?: (dataUrl: string) => void;
  enabled?: boolean; // Controls visibility and interaction
  style?: React.CSSProperties;
  className?: string;
}

export const PainterroWrapper: React.FC<PainterroWrapperProps> = ({
  width,
  height,
  activeTool = 'brush',
  color = '#000000',
  brushSize = 2,
  onImageChange = () => {},
  enabled = false,
  style,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enabled && containerRef.current) {
      console.log('🎨 Showing Painterro in container', containerRef.current);
      painterroService.show(containerRef.current, { 
        width, 
        height, 
        onImageChange 
      });
    } else {
      console.log('🎨 Hiding Painterro');
      painterroService.hide();
    }
    // No return cleanup needed as the service manages the lifecycle
  }, [enabled, width, height, onImageChange]);

  // Pass tool/color/size changes to the service
  useEffect(() => {
    if (enabled) painterroService.setTool(activeTool);
  }, [enabled, activeTool]);

  useEffect(() => {
    if (enabled) painterroService.setColor(color);
  }, [enabled, color]);

  useEffect(() => {
    if (enabled) painterroService.setBrushSize(brushSize);
  }, [enabled, brushSize]);

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
