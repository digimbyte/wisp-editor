import React from 'react';
import { BoardDefinition } from '../../types';

interface BoardConfigDialogProps {
  show: boolean;
  mode: 'import' | 'manual' | 'edit';
  onClose: () => void;
  onImport: () => void;
  onAddCustomBoard: () => void;
  newBoardDefinition: Partial<BoardDefinition>;
  setNewBoardDefinition: (board: Partial<BoardDefinition>) => void;
  importedBoardFile: string;
  buttonStyle: React.CSSProperties;
}

export const BoardConfigDialog: React.FC<BoardConfigDialogProps> = ({
  show,
  mode,
  onClose,
  onImport,
  onAddCustomBoard,
  newBoardDefinition,
  setNewBoardDefinition,
  importedBoardFile,
  buttonStyle
}) => {
  if (!show) return null;

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
      zIndex: 1001
    }}>
      <div style={{
        background: "#1a1d23",
        border: "1px solid #2a2d36",
        borderRadius: "8px",
        width: "600px",
        maxHeight: "90vh",
        maxWidth: "90vw",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderBottom: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>
            🔧 Board Configuration
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: "18px",
              cursor: "pointer",
              padding: "4px"
            }}
          >×</button>
        </div>
        
        {/* Content */}
        <div style={{ 
          flex: 1, 
          padding: "16px 24px", 
          overflow: "auto",
          minHeight: 0
        }}>
          {mode === 'import' && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                  Import Board Configuration File
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={importedBoardFile}
                    readOnly
                    placeholder="Select a board configuration file..."
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px"
                    }}
                  />
                  <button
                    onClick={onImport}
                    style={{
                      ...buttonStyle,
                      padding: "8px 12px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    📁 Browse
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'manual' && (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                  Board Name *
                </label>
                <input
                  type="text"
                  value={newBoardDefinition.name || ''}
                  onChange={(e) => setNewBoardDefinition({...newBoardDefinition, name: e.target.value})}
                  placeholder="My Custom Board"
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    background: "#252832",
                    border: "1px solid #2a2d36",
                    borderRadius: "4px",
                    color: "#e6e6e6",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                    Architecture
                  </label>
                  <select
                    value={newBoardDefinition.architecture || ''}
                    onChange={(e) => setNewBoardDefinition({...newBoardDefinition, architecture: e.target.value})}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  >
                    <option value="">Select Architecture</option>
                    <option value="Xtensa">Xtensa</option>
                    <option value="RISC-V">RISC-V</option>
                    <option value="ARM">ARM</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                    MCU
                  </label>
                  <input
                    type="text"
                    value={newBoardDefinition.mcu || ''}
                    onChange={(e) => setNewBoardDefinition({...newBoardDefinition, mcu: e.target.value})}
                    placeholder="ESP32-S3"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                    Flash
                  </label>
                  <input
                    type="text"
                    value={newBoardDefinition.flash || ''}
                    onChange={(e) => setNewBoardDefinition({...newBoardDefinition, flash: e.target.value})}
                    placeholder="8MB"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                    SRAM
                  </label>
                  <input
                    type="text"
                    value={newBoardDefinition.sram || ''}
                    onChange={(e) => setNewBoardDefinition({...newBoardDefinition, sram: e.target.value})}
                    placeholder="512KB"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>
                    Frequency
                  </label>
                  <input
                    type="text"
                    value={newBoardDefinition.frequency || ''}
                    onChange={(e) => setNewBoardDefinition({...newBoardDefinition, frequency: e.target.value})}
                    placeholder="240MHz"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderTop: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button
            onClick={onClose}
            style={buttonStyle}
          >
            Cancel
          </button>
          
          <button
            onClick={onAddCustomBoard}
            disabled={mode === 'manual' && !newBoardDefinition.name}
            style={{
              ...buttonStyle,
              background: "#22cc22",
              border: "none",
              opacity: (mode === 'manual' && !newBoardDefinition.name) ? 0.5 : 1,
              cursor: (mode === 'manual' && !newBoardDefinition.name) ? "not-allowed" : "pointer"
            }}
          >
            {mode === 'import' ? '📥 Import Board' : '🔧 Create Board'}
          </button>
        </div>
      </div>
    </div>
  );
};
