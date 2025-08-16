import React from 'react';
import type { 
  SpriteAsset, 
  AudioAsset, 
  WorkspaceTab, 
  EditorTab,
  SystemDefinition,
  LayoutPanel 
} from '../../types';
import { SpritesExplorer } from '../panels/SpritesExplorer';

interface LeftPanelProps {
  activeWorkspace: WorkspaceTab;
  leftPanelWidth: number;
  setLeftPanelWidth: (width: number) => void;
  sprites: SpriteAsset[];
  selectedSprite: string;
  setSelectedSprite: (id: string) => void;
  handleContextMenu: (e: React.MouseEvent, type: string, name: string, path: string, category?: string) => void;
  audioAssets: AudioAsset[];
  selectedAudio: string;
  setSelectedAudio: (id: string) => void;
  editorTabs: EditorTab[];
  activeTabId: string;
  setActiveTabId: (id: string) => void;
  systems: SystemDefinition[];
  openSpriteDialog: (mode?: 'create' | 'import') => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  activeWorkspace,
  leftPanelWidth,
  setLeftPanelWidth,
  sprites,
  selectedSprite,
  setSelectedSprite,
  handleContextMenu,
  audioAssets,
  selectedAudio,
  setSelectedAudio,
  editorTabs,
  activeTabId,
  setActiveTabId,
  systems,
  openSpriteDialog
}) => {
  const panelStyle = {
    background: "#1a1d23",
    border: "1px solid #2a2d36",
    display: "flex",
    flexDirection: "column" as const
  };

  const panelHeaderStyle = {
    padding: "8px 12px",
    background: "#252832",
    borderBottom: "1px solid #2a2d36",
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#e6e6e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };

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
    <div style={{ ...panelStyle, width: `${leftPanelWidth}px`, minWidth: "200px" }}>
      <div style={panelHeaderStyle}>
        <span>
          {activeWorkspace === 'sprites' && '🎨 Sprites'}
          {activeWorkspace === 'audio' && '🔊 Audio'}
          {activeWorkspace === 'layout' && '🏗️ Layouts'}
          {activeWorkspace === 'database' && '🗄️ Tables'}
          {activeWorkspace === 'code' && '📄 Scripts'}
        </span>
        <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
          <button 
            style={{
              ...buttonStyle,
              padding: "4px 6px",
              fontSize: "11px",
              background: "#22cc22",
              border: "none"
            }}
            title="Add New"
            onClick={() => openSpriteDialog('create')}
          >
            +
          </button>
          <span style={{ cursor: "pointer" }} onClick={() => setLeftPanelWidth(leftPanelWidth === 250 ? 350 : 250)}>⚙️</span>
        </div>
      </div>
      <div style={{ flex: 1, padding: "8px", fontSize: "13px", overflow: "auto" }}>
        
        {/* Sprites Explorer */}
        {activeWorkspace === 'sprites' && (
          <SpritesExplorer
            sprites={sprites}
            selectedSprite={selectedSprite}
            onSpriteSelect={setSelectedSprite}
            onContextMenu={handleContextMenu}
          />
        )}

        {/* Layout Explorer */}
        {activeWorkspace === 'layout' && (
          <div>
            {/* Empty state message */}
            <div style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.5"
            }}>
              <div style={{ marginBottom: "12px", fontSize: "48px" }}>🏗️</div>
              <div style={{ marginBottom: "8px", fontWeight: "600" }}>No Scenes Yet</div>
              <div>Create layout scenes to design your game's UI and world structure.</div>
              <div style={{ marginTop: "16px" }}>
                <button style={{
                  padding: "8px 16px",
                  background: "#2b6cff",
                  border: "none",
                  borderRadius: "4px",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>+ Create Scene</button>
              </div>
            </div>
          </div>
        )}

        {/* Database Explorer */}
        {activeWorkspace === 'database' && (
          <div>
            {/* Empty state message */}
            <div style={{
              padding: "20px",
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              lineHeight: "1.5"
            }}>
              <div style={{ marginBottom: "12px", fontSize: "48px" }}>🗄️</div>
              <div style={{ marginBottom: "8px", fontWeight: "600" }}>No Database Tables</div>
              <div>Create database tables to store your game's data efficiently.</div>
              <div style={{ marginTop: "16px" }}>
                <button style={{
                  padding: "8px 16px",
                  background: "#2b6cff",
                  border: "none",
                  borderRadius: "4px",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "500"
                }}>+ Create Table</button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Explorer */}
        {activeWorkspace === 'audio' && (
          <div>
            {audioAssets.length === 0 ? (
              /* Empty state message */
              <div style={{
                padding: "20px",
                textAlign: "center",
                color: "#666",
                fontSize: "14px",
                lineHeight: "1.5"
              }}>
                <div style={{ marginBottom: "12px", fontSize: "48px" }}>🔊</div>
                <div style={{ marginBottom: "8px", fontWeight: "600" }}>No Audio Yet</div>
                <div>Import audio files or generate procedural cries with the <strong>+</strong> above</div>
              </div>
            ) : null}
            
            {/* Category Folders - Always Show */}
            <div>
              {/* Music Category */}
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
                  onContextMenu={(e) => handleContextMenu(e, 'folder', 'Music', 'audio/music')}
                  data-context-menu="true"
                >
                  <span>📂</span>
                  <span>🎵 Music</span>
                  <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({audioAssets.filter(a => a.type === 'music').length})</span>
                </div>
                <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {audioAssets.filter(audio => audio.type === 'music').map(audio => (
                    <div 
                      key={audio.id}
                      style={{ 
                        padding: "4px 8px", 
                        cursor: "pointer", 
                        fontSize: "12px",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "2px",
                        background: selectedAudio === audio.id ? "#2b6cff" : "transparent",
                        color: selectedAudio === audio.id ? "#ffffff" : "#e6e6e6"
                      }}
                      onClick={() => setSelectedAudio(audio.id)}
                      onMouseEnter={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "#1e2128")}
                      onMouseLeave={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "transparent")}
                      onContextMenu={(e) => handleContextMenu(e, 'file', audio.name, `audio/music/${audio.name.toLowerCase().replace(/\s+/g, '_')}.ogg`, 'audio')}
                      data-context-menu="true"
                    >
                      <span>🎼</span>
                      <span style={{ flex: 1 }}>{audio.name}.ogg</span>
                      <div style={{ 
                        fontSize: "10px", 
                        color: selectedAudio === audio.id ? "rgba(255,255,255,0.7)" : "#888",
                        textAlign: "right"
                      }}>
                        <div>{audio.duration ? `${Math.floor(audio.duration / 60)}:${String(Math.floor(audio.duration % 60)).padStart(2, '0')}` : '--:--'}</div>
                        <div>{audio.channels}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Burst Category */}
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
                  onContextMenu={(e) => handleContextMenu(e, 'folder', 'Burst', 'audio/burst')}
                  data-context-menu="true"
                >
                  <span>📂</span>
                  <span>💥 Burst</span>
                  <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({audioAssets.filter(a => a.type === 'burst').length})</span>
                </div>
                <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {audioAssets.filter(audio => audio.type === 'burst').map(audio => (
                    <div 
                      key={audio.id}
                      style={{ 
                        padding: "4px 8px", 
                        cursor: "pointer", 
                        fontSize: "12px",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "2px",
                        background: selectedAudio === audio.id ? "#2b6cff" : "transparent",
                        color: selectedAudio === audio.id ? "#ffffff" : "#e6e6e6"
                      }}
                      onClick={() => setSelectedAudio(audio.id)}
                      onMouseEnter={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "#1e2128")}
                      onMouseLeave={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "transparent")}
                      onContextMenu={(e) => handleContextMenu(e, 'file', audio.name, `audio/burst/${audio.name.toLowerCase().replace(/\s+/g, '_')}.wav`, 'audio')}
                      data-context-menu="true"
                    >
                      <span>🔊</span>
                      <span style={{ flex: 1 }}>{audio.name}.wav</span>
                      <div style={{ 
                        fontSize: "10px", 
                        color: selectedAudio === audio.id ? "rgba(255,255,255,0.7)" : "#888",
                        textAlign: "right"
                      }}>
                        <div>{audio.duration ? `${audio.duration.toFixed(2)}s` : '--s'}</div>
                        <div>{audio.channels}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Cries Category */}
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
                  onContextMenu={(e) => handleContextMenu(e, 'folder', 'Cries', 'audio/cries')}
                  data-context-menu="true"
                >
                  <span>📂</span>
                  <span>🎯 Cries</span>
                  <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({audioAssets.filter(a => a.type === 'cries').length})</span>
                </div>
                <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
                  {audioAssets.filter(audio => audio.type === 'cries').map(audio => (
                    <div 
                      key={audio.id}
                      style={{ 
                        padding: "4px 8px", 
                        cursor: "pointer", 
                        fontSize: "12px",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        marginBottom: "2px",
                        background: selectedAudio === audio.id ? "#2b6cff" : "transparent",
                        color: selectedAudio === audio.id ? "#ffffff" : "#e6e6e6",
                        fontStyle: audio.generated ? "italic" : "normal",
                        opacity: audio.generated ? 0.8 : 1
                      }}
                      onClick={() => setSelectedAudio(audio.id)}
                      onMouseEnter={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "#1e2128")}
                      onMouseLeave={e => selectedAudio !== audio.id && (e.currentTarget.style.background = "transparent")}
                      onContextMenu={(e) => handleContextMenu(e, 'file', audio.name, `audio/cries/${audio.name.toLowerCase().replace(/\s+/g, '_')}.synth`, 'audio')}
                      data-context-menu="true"
                    >
                      <span>{audio.generated ? '⚡' : '🗣️'}</span>
                      <span style={{ flex: 1 }}>{audio.name}{audio.generated ? '.synth' : '.wav'}</span>
                      <div style={{ 
                        fontSize: "10px", 
                        color: selectedAudio === audio.id ? "rgba(255,255,255,0.7)" : "#888",
                        textAlign: "right"
                      }}>
                        <div>{audio.generated ? 'GEN' : (audio.duration ? `${audio.duration.toFixed(2)}s` : '--s')}</div>
                        <div>{audio.channels}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Explorer */}
        {activeWorkspace === 'code' && (
          <div>
            <div style={{ marginBottom: "12px" }}>
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
              >
                <span>📂</span>
                <span>Scripts</span>
                <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({editorTabs.length})</span>
              </div>
              <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
                {editorTabs.map(tab => (
                  <div 
                    key={tab.id}
                    style={{ 
                      padding: "4px 8px", 
                      cursor: "pointer", 
                      fontSize: "12px",
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: activeTabId === tab.id ? "#2b6cff" : "transparent",
                      color: activeTabId === tab.id ? "#ffffff" : "#e6e6e6"
                    }}
                    onClick={() => setActiveTabId(tab.id)}
                    onMouseEnter={e => activeTabId !== tab.id && (e.currentTarget.style.background = "#1e2128")}
                    onMouseLeave={e => activeTabId !== tab.id && (e.currentTarget.style.background = "transparent")}
                  >
                    <span>📝</span>
                    <span>{tab.title}</span>
                    {tab.modified && <span style={{ color: "#ffa500", fontSize: "10px" }}>●</span>}
                  </div>
                ))}
                {/* Additional scripts would appear here when they exist */}
              </div>
            </div>

            <div style={{ marginBottom: "12px" }}>
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
              >
                <span>📂</span>
                <span>Systems</span>
                <span style={{ marginLeft: "auto", color: "#666", fontSize: "11px" }}>({systems.length})</span>
              </div>
              <div style={{ paddingLeft: "20px", marginTop: "4px" }}>
                {systems.map(system => (
                  <div 
                    key={system.id}
                    style={{ 
                      padding: "4px 8px", 
                      cursor: "pointer", 
                      fontSize: "12px",
                      borderRadius: "3px",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      opacity: system.enabled ? 1 : 0.6
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1e2128"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span>
                      {system.type === 'input' && '🎮'}
                      {system.type === 'movement' && '🏃'}
                      {system.type === 'collision' && '💥'}
                      {system.type === 'render' && '🖼️'}
                    </span>
                    <span>{system.name}</span>
                    {!system.enabled && <span style={{ color: "#888", fontSize: "10px" }}>disabled</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
