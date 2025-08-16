import React from 'react';
import type { SpriteAsset } from '../../types';

interface SpritesExplorerProps {
  sprites: SpriteAsset[];
  selectedSprite: string;
  onSelectSprite: (spriteId: string) => void;
  onContextMenu: (e: React.MouseEvent, type: 'folder' | 'file', name: string, path: string, category?: string) => void;
}

export const SpritesExplorer: React.FC<SpritesExplorerProps> = ({
  sprites,
  selectedSprite,
  onSelectSprite,
  onContextMenu
}) => {
  return (
    <div>
      {/* Category Folders - Always Show */}
      <div>
        {/* Background Category */}
        <div style={{
          marginBottom: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'Background', 'sprites/background')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>🌄 Background</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.filter(s => s.type === 'background').length})</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {sprites.filter(sprite => sprite.type === 'background').map(sprite => (
              <div 
                key={sprite.id}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: selectedSprite === sprite.id ? "#2b6cff" : "transparent",
                  color: selectedSprite === sprite.id ? "#ffffff" : "#e6e6e6"
                }}
                onClick={() => onSelectSprite(sprite.id)}
                onMouseEnter={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "#1e2128")}
                onMouseLeave={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "transparent")}
                onContextMenu={(e) => onContextMenu(e, 'file', sprite.name, `sprites/background/${sprite.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 'sprite')}
                data-context-menu="true"
              >
                <span>📄</span>
                <span style={{ flex: 1 }}>{sprite.name}.yaml</span>
                <div style={{ 
                  fontSize: "10px", 
                  color: selectedSprite === sprite.id ? "rgba(255,255,255,0.7)" : "#888",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                  {sprite.frames > 1 && <div>{sprite.frames}f</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* World Tile Category */}
        <div style={{
          marginBottom: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'World Tile', 'sprites/world-tile')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>🧱 World Tile</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.filter(s => s.type === 'world tile').length})</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {sprites.filter(sprite => sprite.type === 'world tile').map(sprite => (
              <div 
                key={sprite.id}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: selectedSprite === sprite.id ? "#2b6cff" : "transparent",
                  color: selectedSprite === sprite.id ? "#ffffff" : "#e6e6e6"
                }}
                onClick={() => onSelectSprite(sprite.id)}
                onMouseEnter={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "#1e2128")}
                onMouseLeave={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "transparent")}
                onContextMenu={(e) => onContextMenu(e, 'file', sprite.name, `sprites/world-tile/${sprite.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 'sprite')}
                data-context-menu="true"
              >
                <span>📄</span>
                <span style={{ flex: 1 }}>{sprite.name}.yaml</span>
                <div style={{ 
                  fontSize: "10px", 
                  color: selectedSprite === sprite.id ? "rgba(255,255,255,0.7)" : "#888",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                  {sprite.frames > 1 && <div>{sprite.frames}f</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Entity Category */}
        <div style={{
          marginBottom: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'Entity', 'sprites/entity')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>👾 Entity</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.filter(s => s.type === 'entity').length})</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {sprites.filter(sprite => sprite.type === 'entity').map(sprite => (
              <div 
                key={sprite.id}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: selectedSprite === sprite.id ? "#2b6cff" : "transparent",
                  color: selectedSprite === sprite.id ? "#ffffff" : "#e6e6e6"
                }}
                onClick={() => onSelectSprite(sprite.id)}
                onMouseEnter={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "#1e2128")}
                onMouseLeave={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "transparent")}
                onContextMenu={(e) => onContextMenu(e, 'file', sprite.name, `sprites/entity/${sprite.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 'sprite')}
                data-context-menu="true"
              >
                <span>📄</span>
                <span style={{ flex: 1 }}>{sprite.name}.yaml</span>
                <div style={{ 
                  fontSize: "10px", 
                  color: selectedSprite === sprite.id ? "rgba(255,255,255,0.7)" : "#888",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                  {sprite.frames > 1 && <div>{sprite.frames}f</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Interface Category */}
        <div style={{
          marginBottom: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'Interface', 'sprites/interface')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>🖼️ Interface</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.filter(s => s.type === 'interface').length})</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {sprites.filter(sprite => sprite.type === 'interface').map(sprite => (
              <div 
                key={sprite.id}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: selectedSprite === sprite.id ? "#2b6cff" : "transparent",
                  color: selectedSprite === sprite.id ? "#ffffff" : "#e6e6e6"
                }}
                onClick={() => onSelectSprite(sprite.id)}
                onMouseEnter={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "#1e2128")}
                onMouseLeave={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "transparent")}
                onContextMenu={(e) => onContextMenu(e, 'file', sprite.name, `sprites/interface/${sprite.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 'sprite')}
                data-context-menu="true"
              >
                <span>📄</span>
                <span style={{ flex: 1 }}>{sprite.name}.yaml</span>
                <div style={{ 
                  fontSize: "10px", 
                  color: selectedSprite === sprite.id ? "rgba(255,255,255,0.7)" : "#888",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                  {sprite.frames > 1 && <div>{sprite.frames}f</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Font Category */}
        <div style={{
          marginBottom: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'Font', 'sprites/font')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>🔤 Font</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.filter(s => s.type === 'font').length})</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {sprites.filter(sprite => sprite.type === 'font').map(sprite => (
              <div 
                key={sprite.id}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: selectedSprite === sprite.id ? "#2b6cff" : "transparent",
                  color: selectedSprite === sprite.id ? "#ffffff" : "#e6e6e6"
                }}
                onClick={() => onSelectSprite(sprite.id)}
                onMouseEnter={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "#1e2128")}
                onMouseLeave={e => selectedSprite !== sprite.id && (e.currentTarget.style.background = "transparent")}
                onContextMenu={(e) => onContextMenu(e, 'file', sprite.name, `sprites/font/${sprite.name.toLowerCase().replace(/\s+/g, '_')}.yaml`, 'sprite')}
                data-context-menu="true"
              >
                <span>📄</span>
                <span style={{ flex: 1 }}>{sprite.name}.yaml</span>
                <div style={{ 
                  fontSize: "10px", 
                  color: selectedSprite === sprite.id ? "rgba(255,255,255,0.7)" : "#888",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                  {sprite.frames > 1 && <div>{sprite.frames}f</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Atlas Folder */}
        <div style={{
          marginBottom: "8px",
          borderTop: "1px solid #2a2d36",
          paddingTop: "8px"
        }}>
          <div 
            style={{ 
              padding: "6px 8px", 
              cursor: "pointer", 
              borderRadius: "3px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }} 
            onMouseEnter={e => e.currentTarget.style.background = "#252832"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            onContextMenu={(e) => onContextMenu(e, 'folder', 'Atlas', 'sprites/atlas')}
            data-context-menu="true"
          >
            <span>📂</span>
            <span>🗂️ Atlas</span>
            <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({sprites.length} PNG)</span>
          </div>
          <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
            {/* Show atlas PNG files - one per sprite with UUID names */}
            {sprites.map(sprite => (
              <div 
                key={`atlas-${sprite.id}`}
                style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  fontSize: "12px",
                  borderRadius: "3px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  marginBottom: "2px",
                  background: "transparent",
                  color: "#888"
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e2128"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                onContextMenu={(e) => onContextMenu(e, 'file', `${sprite.id}.png`, `sprites/atlas/${sprite.id}.png`, 'atlas')}
                data-context-menu="true"
              >
                <span>🖼️</span>
                <span style={{ flex: 1, fontFamily: "'Consolas', 'Monaco', monospace", fontSize: "11px" }}>{sprite.id}.png</span>
                <div style={{ 
                  fontSize: "9px", 
                  color: "#666",
                  textAlign: "right"
                }}>
                  <div>{sprite.width}×{sprite.height}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Empty state message - only show if no sprites exist */}
      {sprites.length === 0 && (
        <div style={{
          padding: "20px",
          textAlign: "center",
          color: "#666",
          fontSize: "14px",
          lineHeight: "1.5",
          marginTop: "20px",
          border: "2px dashed #2a2d36",
          borderRadius: "8px"
        }}>
          <div style={{ marginBottom: "12px", fontSize: "48px" }}>🎨</div>
          <div style={{ marginBottom: "8px", fontWeight: "600" }}>No Sprites Yet</div>
          <div>To get started, create your first sprite with the <strong>+</strong> above</div>
        </div>
      )}
    </div>
  );
};
