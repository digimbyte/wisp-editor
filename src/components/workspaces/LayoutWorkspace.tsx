import React from 'react';
import type { LayoutPanel } from '../../types';

interface LayoutWorkspaceProps {
  layoutPanels: LayoutPanel[];
  isPlayMode: boolean;
  onTogglePlayMode: () => void;
  buttonStyle: React.CSSProperties;
}

export function LayoutWorkspace({
  layoutPanels,
  isPlayMode,
  onTogglePlayMode,
  buttonStyle
}: LayoutWorkspaceProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Layout Toolbar */}
      <div style={{ 
        height: "40px", 
        borderBottom: "1px solid #2a2d36", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 16px", 
        gap: "12px" 
      }}>
        <button 
          style={{
            ...buttonStyle, 
            background: isPlayMode ? "#ff4444" : "#22cc22",
            border: "none"
          }}
          onClick={onTogglePlayMode}
        >
          {isPlayMode ? '⏹️ Stop' : '▶️ Play'}
        </button>
        <div style={{ width: "1px", height: "20px", background: "#2a2d36" }} />
        <button style={buttonStyle}>🖱️ Select</button>
        <button style={buttonStyle}>📦 UI Panel</button>
        <button style={buttonStyle}>🌍 World Object</button>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: "12px", color: "#888" }}>
          {isPlayMode ? '🔴 PLAY MODE' : '✏️ EDIT MODE'}
        </div>
      </div>
      
      {/* Layout Canvas */}
      <div style={{ flex: 1, display: "flex" }}>
        <div style={{ 
          flex: 1, 
          background: isPlayMode ? "#0a0a0a" : "#1a1d23", 
          position: "relative",
          overflow: "auto"
        }}>
          <div style={{ 
            width: "800px", 
            height: "600px", 
            background: isPlayMode ? "#333" : "#2a2d36", 
            margin: "20px auto",
            border: "1px solid #3a3d46",
            borderRadius: "4px",
            position: "relative"
          }}>
            {layoutPanels.map(panel => (
              <div key={panel.id} style={{
                position: "absolute",
                left: `${panel.x}px`,
                top: `${panel.y}px`,
                width: `${panel.width}px`,
                height: `${panel.height}px`,
                border: isPlayMode ? "none" : "1px dashed #666",
                background: panel.type === 'ui' ? 'rgba(100,150,255,0.1)' : 'rgba(100,255,150,0.1)',
                fontSize: "12px",
                padding: "4px",
                color: "#ccc"
              }}>
                {panel.name} ({panel.type})
              </div>
            ))}
          </div>
        </div>
        
        {/* Layout Hierarchy */}
        <div style={{ width: "200px", borderLeft: "1px solid #2a2d36", padding: "16px" }}>
          <h4 style={{ margin: "0 0 12px 0", fontSize: "14px" }}>Hierarchy</h4>
          {layoutPanels.map(panel => (
            <div key={panel.id} style={{
              padding: "6px 8px",
              marginBottom: "2px",
              background: "#252832",
              borderRadius: "3px",
              cursor: "pointer",
              fontSize: "12px"
            }}>
              {panel.type === 'ui' ? '🖼️' : '🌍'} {panel.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
