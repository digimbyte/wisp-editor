import React from 'react';

export const PivotTools: React.FC = () => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>
        📍 Pivot Tools
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Pivot Point:
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
          <div>
            <label style={{ fontSize: "10px", color: "#b0b0b0" }}>X:</label>
            <input 
              type="number"
              defaultValue="16"
              style={{ 
                width: "100%", 
                padding: "2px 4px", 
                background: "#2a2d36", 
                border: "1px solid #3a3d46", 
                color: "#e6e6e6",
                fontSize: "11px"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "10px", color: "#b0b0b0" }}>Y:</label>
            <input 
              type="number"
              defaultValue="16"
              style={{ 
                width: "100%", 
                padding: "2px 4px", 
                background: "#2a2d36", 
                border: "1px solid #3a3d46", 
                color: "#e6e6e6",
                fontSize: "11px"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Quick Presets:
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", fontSize: "8px" }}>
          <button style={{
            padding: "4px 2px",
            background: "#3a3d46",
            border: "1px solid #4a4d56",
            color: "#e6e6e6",
            cursor: "pointer"
          }}>
            Top-Left
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Top
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Top-Right
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Left
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Center
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Right
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Bottom-Left
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Bottom
          </button>
          <button style={{
            padding: "4px 2px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            cursor: "pointer"
          }}>
            Bottom-Right
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b0b0b0" }}>
          <input 
            type="checkbox" 
            defaultChecked
            style={{ 
              accentColor: "#6366f1",
              transform: "scale(0.8)"
            }}
          />
          Show pivot in preview
        </label>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b0b0b0" }}>
          <input 
            type="checkbox" 
            style={{ 
              accentColor: "#6366f1",
              transform: "scale(0.8)"
            }}
          />
          Snap to pixel grid
        </label>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <button style={{
          width: "100%",
          padding: "6px",
          background: "#4f46e5",
          border: "none",
          color: "white",
          fontSize: "11px",
          cursor: "pointer",
          borderRadius: "3px"
        }}>
          Apply Pivot Point
        </button>
      </div>
    </div>
  );
};
