import React from 'react';
import { InfiniteCanvas, InfiniteFocusButton } from '../canvas/InfiniteCanvas';
import type { SpriteAsset } from '../../types';

interface SpriteWorkspaceProps {
  sprites: SpriteAsset[];
  selectedSprite: string;
  spriteEditorMode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot';
  canvasView: '2d' | '3d';
  onSpriteEditorModeChange: (mode: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot') => void;
  onCanvasViewChange: (view: '2d' | '3d') => void;
  onOpenSpriteDialog: (mode?: 'create' | 'import') => void;
  buttonStyle: React.CSSProperties;
}

export const SpriteWorkspace: React.FC<SpriteWorkspaceProps> = ({
  sprites,
  selectedSprite,
  spriteEditorMode,
  canvasView,
  onSpriteEditorModeChange,
  onCanvasViewChange,
  onOpenSpriteDialog,
  buttonStyle
}) => {
  return (
    <div style={{ height: "100%", display: "flex" }}>
      {sprites.length === 0 ? (
        // No sprites exist - show creation message
        <div style={{ 
          width: "100%",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          background: "#1e2128",
          border: "2px dashed #2a2d36",
          margin: "20px",
          borderRadius: "8px"
        }}>
          <div style={{
            padding: "40px",
            textAlign: "center",
            color: "#888",
            fontSize: "16px",
            lineHeight: "1.6"
          }}>
            <div style={{ marginBottom: "16px", fontSize: "64px" }}>🎨</div>
            <div style={{ marginBottom: "12px", fontWeight: "600", fontSize: "20px", color: "#e6e6e6" }}>Welcome to the Sprite Editor</div>
            <div style={{ marginBottom: "8px" }}>Create your first sprite to start designing pixel art</div>
            <div style={{ marginTop: "20px" }}>
              <button 
                onClick={() => onOpenSpriteDialog('create')}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(135deg, #2b6cff, #4d8aff)",
                  border: "none",
                  borderRadius: "6px",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                + Create First Sprite
              </button>
            </div>
          </div>
        </div>
      ) : selectedSprite === '' ? (
        // Sprites exist but none selected
        <div style={{ 
          width: "100%",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center" 
        }}>
          <div style={{
            padding: "20px",
            textAlign: "center",
            color: "#666",
            fontSize: "14px",
            lineHeight: "1.5"
          }}>
            <div style={{ marginBottom: "12px", fontSize: "48px" }}>🖼️</div>
            <div style={{ marginBottom: "8px", fontWeight: "600" }}>No Sprite Selected</div>
            <div>Select a sprite from the panel to edit it</div>
          </div>
        </div>
      ) : (
        // Sprite selected - show modern pixel editor
        <div style={{ 
          width: "100%", 
          display: "flex", 
          flexDirection: "column", 
          position: "relative",
          overflow: "hidden",
          minHeight: 0,
          height: "100%" 
        }}>
          {(() => {
            const sprite = sprites.find(s => s.id === selectedSprite);
            if (!sprite) return null;

            return (
              <>
                {/* Sprite Editor Header */}
                <div style={{
                  height: "40px",
                  borderBottom: "1px solid #2a2d36",
                  display: "flex",
                  alignItems: "center",
                  padding: "0 16px",
                  justifyContent: "space-between"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <h3 style={{ margin: 0, fontSize: "16px" }}>
                      {sprite.type === 'background' && '🌄'}
                      {sprite.type === 'world tile' && '🧱'}
                      {sprite.type === 'entity' && '👾'}
                      {sprite.type === 'interface' && '🖼️'}
                      {sprite.type === 'font' && '🔤'}
                      {' '}{sprite.name}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      {sprite.width}×{sprite.height} • {sprite.frames} frame{sprite.frames !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>💾 Save</button>
                    <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>📤 Export</button>
                  </div>
                </div>

                {/* Main Canvas Area with Floating Controls */}
                <div style={{ 
                  flex: 1, 
                  position: "relative", 
                  background: "#1a1d23",
                  overflow: "hidden",
                  minHeight: 0,
                  display: "flex",
                  flexDirection: "column" 
                }}>
                  {/* Left Floating Mode Buttons */}
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    left: "16px",
                    zIndex: 10,
                    display: "flex",
                    gap: "4px",
                    padding: "8px",
                    background: "rgba(42, 45, 54, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    border: "1px solid #3a3d46",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}>
                    {[
                      { mode: 'brush', icon: '🖌️', label: 'Brush Tool' },
                      { mode: 'regions', icon: '🔲', label: 'Region Tool' },
                      { mode: 'animations', icon: '🎬', label: 'Animation Tool' },
                      { mode: 'depth', icon: '📐', label: 'Depth Tool' },
                      { mode: 'logic', icon: '⚡', label: 'Logic Tool' },
                      { mode: 'pivot', icon: '🎯', label: 'Pivot Tool' }
                    ].map(m => (
                      <button
                        key={m.mode}
                        onClick={() => onSpriteEditorModeChange(m.mode as any)}
                        title={m.label} // Tooltip for accessibility
                        style={{
                          padding: "8px",
                          background: spriteEditorMode === m.mode ? "#2b6cff" : "transparent",
                          border: "1px solid " + (spriteEditorMode === m.mode ? "#4d8aff" : "#3a3d46"),
                          borderRadius: "6px",
                          color: spriteEditorMode === m.mode ? "#ffffff" : "#e6e6e6",
                          cursor: "pointer",
                          fontSize: "18px",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "36px",
                          height: "36px",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={e => {
                          if (spriteEditorMode !== m.mode) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                          }
                        }}
                        onMouseLeave={e => {
                          if (spriteEditorMode !== m.mode) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        {m.icon}
                      </button>
                    ))}
                  </div>

                  {/* Right Floating View Buttons */}
                  <div style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    zIndex: 10,
                    display: "flex",
                    gap: "8px",
                    padding: "8px",
                    background: "rgba(42, 45, 54, 0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "8px",
                    border: "1px solid #3a3d46",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                  }}>
                    <button
                      onClick={() => onCanvasViewChange(canvasView === '2d' ? '3d' : '2d')}
                      style={{
                        padding: "8px 16px",
                        background: "linear-gradient(135deg, #2b6cff, #4d8aff)",
                        border: "none",
                        borderRadius: "6px",
                        color: "#ffffff",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.2s",
                        minWidth: "60px"
                      }}
                    >
                      {canvasView === '2d' ? '📐' : '🔄'} {canvasView === '2d' ? '2D' : '3D'}
                    </button>
                    <InfiniteFocusButton 
                      spriteWidth={sprite.width}
                      spriteHeight={sprite.height}
                    />
                  </div>

                  {/* Infinite Canvas Container */}
                  {canvasView === '2d' ? (
                    <InfiniteCanvas 
                      spriteWidth={sprite.width}
                      spriteHeight={sprite.height}
                      onPixelClick={(x, y) => {
                        console.log(`Pixel clicked: ${x}, ${y}`);
                      }}
                    />
                  ) : (
                    // 3D Rotating View - keep existing implementation
                    <div style={{ 
                      width: "100%", 
                      height: "100%", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      overflow: "auto"
                    }}>
                      <div style={{
                        width: `${sprite.width * 16}px`,
                        height: `${sprite.height * 16}px`,
                        background: "#1a1d23",
                        border: "1px solid #666",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        {/* 3D Canvas Placeholder */}
                        <div style={{
                          width: "80%",
                          height: "80%",
                          background: "linear-gradient(45deg, #4d8aff, #2b6cff)",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#ffffff",
                          fontSize: "14px",
                          fontWeight: "600",
                          transform: "perspective(500px) rotateX(15deg) rotateY(25deg)",
                          boxShadow: "0 8px 24px rgba(43,108,255,0.3)",
                          animation: "rotate3d 8s linear infinite"
                        }}>
                          3D View
                        </div>
                        <style>{`
                          @keyframes rotate3d {
                            0% { transform: perspective(500px) rotateX(15deg) rotateY(0deg); }
                            100% { transform: perspective(500px) rotateX(15deg) rotateY(360deg); }
                          }
                        `}</style>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
