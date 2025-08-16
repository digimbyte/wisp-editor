import React from 'react';

export const RegionTools: React.FC = () => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>
        🔶 Region Tools
      </div>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Region Type:
        </label>
        <select style={{ 
          width: "100%", 
          padding: "4px", 
          background: "#2a2d36", 
          border: "1px solid #3a3d46", 
          color: "#e6e6e6",
          fontSize: "11px"
        }}>
          <option>Collision</option>
          <option>Trigger</option>
          <option>Damage</option>
          <option>Pickup</option>
        </select>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "4px", color: "#b0b0b0" }}>
          Region Name:
        </label>
        <input 
          type="text"
          placeholder="region_name"
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
          Shape:
        </label>
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
            Rectangle
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
            Circle
          </button>
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
          Visible in editor
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
          Add Region
        </button>
      </div>
    </div>
  );
};
