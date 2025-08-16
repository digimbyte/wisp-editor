import React from 'react';
import type { SpriteType } from '../../types';

interface SpriteCreationDialogProps {
  show: boolean;
  mode: 'create' | 'import';
  isCreating: boolean;
  spriteData: {
    name: string;
    type: SpriteType;
    width: number;
    height: number;
    frames: number;
    animationSpeed: number;
    importPath: string;
  };
  onModeChange: (mode: 'create' | 'import') => void;
  onDataChange: (data: any) => void;
  onImportFile: () => void;
  onCreate: () => void;
  onClose: () => void;
  buttonStyle: React.CSSProperties;
}

export function SpriteCreationDialog({
  show,
  mode,
  isCreating,
  spriteData,
  onModeChange,
  onDataChange,
  onImportFile,
  onCreate,
  onClose,
  buttonStyle
}: SpriteCreationDialogProps) {
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
      zIndex: 1002
    }}>
      <div style={{
        background: "#1a1d23",
        border: "1px solid #2a2d36",
        borderRadius: "8px",
        width: "520px",
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
            {mode === 'create' ? '🎨 Create New Sprite' : '📥 Import Sprite'}
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
        
        {/* Mode Toggle */}
        <div style={{
          padding: "16px 24px",
          background: "#1e2128",
          borderBottom: "1px solid #2a2d36",
          display: "flex",
          gap: "8px"
        }}>
          <button
            onClick={() => onModeChange('create')}
            style={{
              ...buttonStyle,
              background: mode === 'create' ? "#2b6cff" : "#2a2d36",
              border: "none",
              padding: "8px 12px",
              fontSize: "13px",
              flex: 1
            }}
          >
            🎨 Create New
          </button>
          <button
            onClick={() => onModeChange('import')}
            style={{
              ...buttonStyle,
              background: mode === 'import' ? "#2b6cff" : "#2a2d36",
              border: "none",
              padding: "8px 12px",
              fontSize: "13px",
              flex: 1
            }}
          >
            📥 Import File
          </button>
        </div>
        
        {/* Loading Overlay */}
        {isCreating && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(26, 29, 35, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            gap: "20px"
          }}>
            <div style={{
              width: "60px",
              height: "60px",
              border: "4px solid #2a2d36",
              borderTop: "4px solid #2b6cff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            
            <div style={{
              textAlign: "center",
              maxWidth: "300px"
            }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>
                {mode === 'create' ? '🎨 Creating Sprite...' : '📥 Importing Sprite...'}
              </h3>
              
              <div style={{
                background: "#1e2128",
                border: "1px solid #2a2d36",
                borderRadius: "4px",
                padding: "8px 12px",
                fontSize: "12px",
                fontFamily: "'Consolas', 'Monaco', monospace",
                textAlign: "left",
                color: "#ccc"
              }}>
                {mode === 'create' ? (
                  <>
                    <div>• Generating {spriteData.name.toLowerCase().replace(/\s+/g, '_')}.yaml metadata...</div>
                    <div>• Creating atlas/{'{UUID}'}.png for pixel data...</div>
                    <div>• Setting up {spriteData.width}×{spriteData.height} canvas...</div>
                    <div>• Configuring {spriteData.type} properties...</div>
                  </>
                ) : (
                  <>
                    <div>• Processing image file...</div>
                    <div>• Generating {spriteData.name.toLowerCase().replace(/\s+/g, '_')}.yaml metadata...</div>
                    <div>• Creating atlas/{'{UUID}'}.png for pixel data...</div>
                    <div>• Analyzing image dimensions...</div>
                    <div>• Optimizing for ESP32...</div>
                  </>
                )}
              </div>
            </div>
            
            {/* CSS animation */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
        
        {/* Content */}
        <div style={{ 
          flex: 1, 
          padding: "16px 24px", 
          overflow: "auto", 
          minHeight: 0,
          opacity: isCreating ? 0.3 : 1,
          pointerEvents: isCreating ? "none" : "auto"
        }}>
          {mode === 'create' ? (
            <CreateSpriteForm 
              spriteData={spriteData} 
              onDataChange={onDataChange} 
            />
          ) : (
            <ImportSpriteForm 
              spriteData={spriteData} 
              onDataChange={onDataChange}
              onImportFile={onImportFile}
              buttonStyle={buttonStyle}
            />
          )}
        </div>
        
        {/* Footer */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderTop: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: isCreating ? 0.3 : 1,
          pointerEvents: isCreating ? "none" : "auto"
        }}>
          <button
            onClick={onClose}
            disabled={isCreating}
            style={{
              ...buttonStyle,
              opacity: isCreating ? 0.5 : 1,
              cursor: isCreating ? "not-allowed" : "pointer"
            }}
          >
            Cancel
          </button>
          
          <button
            onClick={onCreate}
            disabled={isCreating || !spriteData.name || (mode === 'import' && !spriteData.importPath)}
            style={{
              ...buttonStyle,
              background: isCreating ? "#666" : "#22cc22",
              border: "none",
              opacity: (isCreating || !spriteData.name || (mode === 'import' && !spriteData.importPath)) ? 0.5 : 1,
              cursor: (isCreating || !spriteData.name || (mode === 'import' && !spriteData.importPath)) ? "not-allowed" : "pointer"
            }}
          >
            {isCreating 
              ? (mode === 'create' ? '⏳ Creating...' : '⏳ Importing...')
              : (mode === 'create' ? '🎨 Create Sprite' : '📥 Import Sprite')
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateSpriteForm({ spriteData, onDataChange }: any) {
  return (
    <div>
      {/* Sprite Name */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Sprite Name *</label>
        <input
          type="text"
          value={spriteData.name}
          onChange={(e) => onDataChange({...spriteData, name: e.target.value})}
          placeholder="My Sprite"
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
      
      {/* Sprite Type */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Sprite Type</label>
        <select
          value={spriteData.type}
          onChange={(e) => onDataChange({...spriteData, type: e.target.value as SpriteType})}
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
          <option value="background">Background - Background images</option>
          <option value="world tile">World Tile - World tiles for level building</option>
          <option value="entity">Entity - Game entities (players, enemies, objects)</option>
          <option value="interface">Interface - UI elements and interface graphics</option>
          <option value="font">Font - Font sprites for text rendering</option>
        </select>
      </div>
      
      {/* Size */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
        <div>
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Width (px)</label>
          <input
            type="number"
            value={spriteData.width}
            onChange={(e) => onDataChange({...spriteData, width: parseInt(e.target.value) || 32})}
            min="1"
            max="512"
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
          <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Height (px)</label>
          <input
            type="number"
            value={spriteData.height}
            onChange={(e) => onDataChange({...spriteData, height: parseInt(e.target.value) || 32})}
            min="1"
            max="512"
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
      
      {/* Animation Settings */}
      {(spriteData.type === 'animated' || spriteData.type === 'particle') && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Frames</label>
            <input
              type="number"
              value={spriteData.frames}
              onChange={(e) => onDataChange({...spriteData, frames: parseInt(e.target.value) || 1})}
              min="1"
              max="64"
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
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Speed (fps)</label>
            <input
              type="number"
              value={spriteData.animationSpeed}
              onChange={(e) => onDataChange({...spriteData, animationSpeed: parseInt(e.target.value) || 10})}
              min="1"
              max="60"
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
      )}
    </div>
  );
}

function ImportSpriteForm({ spriteData, onDataChange, onImportFile, buttonStyle }: any) {
  return (
    <div>
      {/* Import File */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Import Image File</label>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={spriteData.importPath}
            readOnly
            placeholder="Select an image file to import..."
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
            onClick={onImportFile}
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
      
      {spriteData.importPath && (
        <>
          {/* Sprite Name */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>Sprite Name</label>
            <input
              type="text"
              value={spriteData.name}
              onChange={(e) => onDataChange({...spriteData, name: e.target.value})}
              placeholder="My Imported Sprite"
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
          
          {/* Sprite Type for Import */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontSize: "12px", fontWeight: "500" }}>What type of sprite is this?</label>
            <select
              value={spriteData.type}
              onChange={(e) => onDataChange({...spriteData, type: e.target.value as SpriteType})}
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
              <option value="static">🖼️ Static - Single image sprite</option>
              <option value="animated">🎬 Animated - Sprite sheet with multiple frames</option>
              <option value="tileset">🧩 Tileset - Grid of tiles for level building</option>
              <option value="particle">✨ Particle - Effects sprite for particles</option>
            </select>
            <div style={{ fontSize: "11px", color: "#888", marginTop: "4px" }}>
              Choose how this imported image should be interpreted by the sprite editor.
            </div>
          </div>
          
          {/* Import Settings */}
          <div style={{
            padding: "12px",
            background: "#1e2128",
            border: "1px solid #2a2d36",
            borderRadius: "4px",
            fontSize: "12px",
            color: "#ccc"
          }}>
            <div><strong>File:</strong> {spriteData.importPath.split(/[\\\/]/).pop()}</div>
            <div style={{ marginTop: "4px", fontSize: "11px", color: "#888" }}>The image will be automatically analyzed for optimal sprite settings.</div>
          </div>
        </>
      )}
    </div>
  );
}
