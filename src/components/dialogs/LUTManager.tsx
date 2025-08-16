import React from 'react';

interface LUTManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LUTManager: React.FC<LUTManagerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const buttonStyle = {
    padding: "6px 12px",
    background: "#1d2330",
    border: "1px solid #2a3348",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#e6e6e6",
    fontSize: "13px",
    fontWeight: "500" as const
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1003
    }}>
      <div style={{
        background: "#1a1d23",
        border: "1px solid #2a2d36",
        borderRadius: "8px",
        width: "600px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)"
      }}>
        {/* Dialog Header */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderBottom: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ 
            margin: 0, 
            fontSize: "16px", 
            fontWeight: "600",
            color: "#e6e6e6",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>🎬</span>
            <span>Animated Texture LUT Manager</span>
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "4px",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#ffffff";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "none";
              e.currentTarget.style.color = "#888";
            }}
          >
            ×
          </button>
        </div>
        
        {/* Dialog Content - Scrollable */}
        <div style={{
          flex: 1,
          padding: "20px 24px",
          overflow: "auto"
        }}>
          <div style={{ 
            fontSize: "13px", 
            color: "#ccc", 
            marginBottom: "16px",
            lineHeight: 1.4
          }}>
            Color lookup tables (LUTs) for animated textures. Each channel cycles through colors over time to create dynamic texture effects.
          </div>

          {/* 5 LUT Channels for Animated Textures - All Empty by Default */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
            {[0, 1, 2, 3, 4].map(channelIndex => {
              return (
                <div key={channelIndex} style={{
                  padding: "8px",
                  background: "#252832",
                  border: "1px solid #2a2d36",
                  borderRadius: "4px"
                }}>
                  <div style={{ 
                    fontSize: "11px", 
                    color: "#e6e6e6", 
                    marginBottom: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}>
                    <span style={{ fontWeight: "600" }}>Channel {channelIndex}</span>
                    <span style={{ fontSize: "10px", color: "#888" }}>Empty</span>
                  </div>
                  
                  <div style={{
                    width: "100%",
                    height: "24px",
                    background: "#1a1d23",
                    border: "2px dashed #3a3d46",
                    borderRadius: "4px",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s"
                  }}
                  onClick={() => {
                    console.log(`Add colors to LUT Channel ${channelIndex}`);
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#2b6cff";
                    e.currentTarget.style.background = "#1e2128";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#3a3d46";
                    e.currentTarget.style.background = "#1a1d23";
                  }}
                  title="Click to add animated texture colors to this channel"
                  >
                    <div style={{
                      color: "#666",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}>
                      <span style={{ fontSize: "16px" }}>+</span>
                      <span>Add Animation Colors</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Dialog Actions */}
          <div style={{ 
            display: "flex", 
            gap: "12px",
            justifyContent: "center",
            marginTop: "20px",
            paddingTop: "16px",
            borderTop: "1px solid #2a2d36"
          }}>
            <button style={{
              ...buttonStyle,
              padding: "10px 16px",
              fontSize: "13px",
              background: "#22cc22",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>💾</span>
              <span>Save LUTs</span>
            </button>
            <button style={{
              ...buttonStyle,
              padding: "10px 16px",
              fontSize: "13px",
              background: "#2b6cff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>📥</span>
              <span>Import</span>
            </button>
            <button style={{
              ...buttonStyle,
              padding: "10px 16px",
              fontSize: "13px",
              background: "#ff8800",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <span>🔄</span>
              <span>Reset All</span>
            </button>
          </div>
        </div>
        
        {/* Dialog Footer */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderTop: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "flex-end",
          gap: "12px"
        }}>
          <button
            onClick={onClose}
            style={{
              ...buttonStyle,
              padding: "8px 16px",
              fontSize: "13px",
              borderRadius: "6px",
              fontWeight: "600"
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              console.log('Apply LUT changes');
              onClose();
            }}
            style={{
              ...buttonStyle,
              padding: "8px 16px",
              fontSize: "13px",
              background: "#2b6cff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "600"
            }}
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
