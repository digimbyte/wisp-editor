import React from 'react';
import { ToolButton, PAINT_TOOLS, PainterroTool } from '../canvas/PainterroWrapper';

interface DrawingToolsProps {
  activeTool?: PainterroTool;
  onSelectTool?: (tool: PainterroTool) => void;
  brushSize?: number;
  onBrushSizeChange?: (size: number) => void;
  currentColor?: string;
}

const baseButton: React.CSSProperties = {
  padding: '6px 12px',
  background: '#1d2330',
  border: '1px solid #2a3348',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#e6e6e6',
  fontSize: '13px',
  fontWeight: 500
};

export const DrawingTools: React.FC<DrawingToolsProps> = ({ 
  activeTool = 'brush', 
  onSelectTool, 
  brushSize = 2, 
  onBrushSizeChange,
  currentColor = '#000000' 
}) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', color: '#e6e6e6', fontWeight: '600' }}>Paint Tools</div>
      
      {/* Tool Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: '6px',
        marginBottom: '16px' 
      }}>
        {PAINT_TOOLS.map((tool) => (
          <ToolButton
            key={tool.tool}
            tool={tool.tool}
            isActive={activeTool === tool.tool}
            onClick={() => onSelectTool?.(tool.tool)}
            icon={tool.icon}
            label={tool.label}
          />
        ))}
      </div>
      
      {/* Brush Size */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '11px', marginBottom: '6px', color: '#e6e6e6', fontWeight: '600' }}>Brush Size</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => onBrushSizeChange?.(Number(e.target.value))}
            style={{
              flex: 1,
              accentColor: '#4078ff',
              height: '4px'
            }}
          />
          <span style={{ 
            minWidth: '20px', 
            textAlign: 'center', 
            fontSize: '10px',
            color: '#e6e6e6',
            background: '#252832',
            padding: '2px 6px',
            borderRadius: '3px',
            border: '1px solid #3a3d46'
          }}>
            {brushSize}px
          </span>
        </div>
      </div>
      
      {/* Current Color Display */}
      <div>
        <div style={{ fontSize: '11px', marginBottom: '6px', color: '#e6e6e6', fontWeight: '600' }}>Active Color</div>
        <div style={{
          width: '100%',
          height: '32px',
          backgroundColor: currentColor,
          border: '2px solid #3a3d46',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: currentColor === '#000000' ? '#fff' : '#000',
          fontSize: '9px',
          fontWeight: '600'
        }}>
          {currentColor}
        </div>
      </div>
    </div>
  );
};

