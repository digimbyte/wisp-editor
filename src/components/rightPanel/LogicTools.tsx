import React from 'react';

export const LogicTools: React.FC = () => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>
        ⚙️ Logic Tools
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Script Type:
        </label>
        <select style={{ 
          width: "100%", 
          padding: "4px", 
          background: "#2a2d36", 
          border: "1px solid #3a3d46", 
          color: "#e6e6e6",
          fontSize: "11px"
        }}>
          <option>OnCreate</option>
          <option>OnUpdate</option>
          <option>OnCollision</option>
          <option>OnTrigger</option>
          <option>OnDestroy</option>
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Script Name:
        </label>
        <input 
          type="text"
          placeholder="player_logic"
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
          Variables:
        </label>
        <div style={{ 
          background: "#1a1d23", 
          border: "1px solid #3a3d46", 
          minHeight: "60px", 
          padding: "4px",
          fontSize: "10px",
          color: "#b0b0b0"
        }}>
          <div>health: int = 100</div>
          <div>speed: float = 5.0</div>
        </div>
      </div>

      <div style={{ marginBottom: "12px" }}>
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
            Add Variable
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
            Edit Script
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
          Auto-compile on save
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
          Attach Script
        </button>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <button style={{
          width: "100%",
          padding: "6px",
          background: "#22c55e",
          border: "none",
          color: "white",
          fontSize: "11px",
          cursor: "pointer",
          borderRadius: "3px"
        }}>
          Test Logic
        </button>
      </div>
    </div>
  );
};
