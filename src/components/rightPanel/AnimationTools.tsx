import React from 'react';

export const AnimationTools: React.FC = () => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>
        🎬 Animation Tools
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Animation Name:
        </label>
        <input 
          type="text"
          placeholder="idle"
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
          Frame Duration (ms):
        </label>
        <input 
          type="number"
          defaultValue="100"
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
        <label style={{ display: "flex", alignItems: "center", gap: "8px", color: "#b0b0b0" }}>
          <input 
            type="checkbox" 
            style={{ 
              accentColor: "#6366f1",
              transform: "scale(0.8)"
            }}
          />
          Loop animation
        </label>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ color: "#b0b0b0", marginBottom: "4px", fontSize: "11px" }}>
          Frames: 0
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
            Add Frame
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
            Delete Frame
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <div style={{ color: "#b0b0b0", marginBottom: "4px", fontSize: "11px" }}>
          Preview:
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button style={{
            padding: "4px 8px",
            background: "#22c55e",
            border: "none",
            color: "white",
            fontSize: "10px",
            cursor: "pointer",
            borderRadius: "2px"
          }}>
            ▶
          </button>
          <button style={{
            padding: "4px 8px",
            background: "#ef4444",
            border: "none",
            color: "white",
            fontSize: "10px",
            cursor: "pointer",
            borderRadius: "2px"
          }}>
            ⏹
          </button>
          <span style={{ fontSize: "10px", color: "#b0b0b0" }}>Frame 1/1</span>
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
          Create Animation
        </button>
      </div>
    </div>
  );
};
