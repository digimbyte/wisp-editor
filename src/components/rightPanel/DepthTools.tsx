import React from 'react';

export const DepthTools: React.FC = () => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>
        📐 Depth Tools
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Z-Index:
        </label>
        <input 
          type="number"
          defaultValue="0"
          style={{ 
            width: "100%", 
            padding: "4px", 
            background: "#2a2d36", 
            border: "1px solid #3a3d46", 
            color: "#e6e6e6",
            fontSize: "11px"
          }}
        />
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Layer:
        </label>
        <select style={{ 
          width: "100%", 
          padding: "4px", 
          background: "#2a2d36", 
          border: "1px solid #3a3d46", 
          color: "#e6e6e6",
          fontSize: "11px"
        }}>
          <option>Background</option>
          <option>Midground</option>
          <option>Foreground</option>
          <option>UI</option>
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Depth Offset:
        </label>
        <input 
          type="range"
          min="-100"
          max="100"
          defaultValue="0"
          style={{ 
            width: "100%", 
            accentColor: "#6366f1"
          }}
        />
        <div style={{ textAlign: "center", fontSize: "10px", color: "#b0b0b0" }}>
          0
        </div>
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
          Enable depth sorting
        </label>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ color: "#b0b0b0", marginBottom: "4px", fontSize: "11px" }}>
          Depth Visualization:
        </div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button style={{
            flex: 1,
            padding: "4px 8px",
            background: "#3a3d46",
            border: "1px solid #4a4d56",
            color: "#e6e6e6",
            fontSize: "10px",
            cursor: "pointer"
          }}>
            Show Grid
          </button>
          <button style={{
            flex: 1,
            padding: "4px 8px",
            background: "#2a2d36",
            border: "1px solid #3a3d46",
            color: "#b0b0b0",
            fontSize: "10px",
            cursor: "pointer"
          }}>
            3D View
          </button>
        </div>
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
          Apply Depth Changes
        </button>
      </div>
    </div>
  );
};
