import React from 'react';
import type { 
  SpriteAsset, 
  EditorTab,
  WorkspaceTab 
} from '../../types';

interface RightPanelProps {
  activeWorkspace: WorkspaceTab;
  rightPanelWidth: number;
  setRightPanelWidth: (width: number) => void;
  selectedSprite: string;
  sprites: SpriteAsset[];
  activeTab: EditorTab | undefined;
  activeColorTab: 'picker' | 'custom' | 'common' | 'variations';
  setActiveColorTab: (tab: 'picker' | 'custom' | 'common' | 'variations') => void;
  showLutManager: boolean;
  setShowLutManager: (show: boolean) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activeWorkspace,
  rightPanelWidth,
  setRightPanelWidth,
  selectedSprite,
  sprites,
  activeTab,
  activeColorTab,
  setActiveColorTab,
  showLutManager,
  setShowLutManager
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
    <div style={{ ...panelStyle, width: `${rightPanelWidth}px`, minWidth: "200px" }}>
      <div style={panelHeaderStyle}>
        <span>🎛️ Properties</span>
        <span style={{ cursor: "pointer" }} onClick={() => setRightPanelWidth(rightPanelWidth === 250 ? 350 : 250)}>⚙️</span>
      </div>
      <div style={{ flex: 1, padding: "8px", fontSize: "12px", overflow: "auto" }}>
        {activeWorkspace === 'sprites' && selectedSprite ? (() => {
          const sprite = sprites.find(s => s.id === selectedSprite);
          if (!sprite) return null;
          
          return (
            <>
              {/* Sprite Information */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: "600", marginBottom: "8px", fontSize: "14px", color: "#e6e6e6" }}>Sprite Info</div>
                <div style={{ fontSize: "11px", color: "#ccc", lineHeight: 1.4 }}>
                  <div><strong>Name:</strong> {sprite.name}</div>
                  <div><strong>Size:</strong> {sprite.width}×{sprite.height}</div>
                  <div><strong>Type:</strong> {sprite.type}</div>
                  <div><strong>Frames:</strong> {sprite.frames}</div>
                  {sprite.animationSpeed && <div><strong>Speed:</strong> {sprite.animationSpeed}fps</div>}
                </div>
              </div>
              
              {/* Drawing Tools */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6" }}>Drawing Tools</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "4px" }}>
                  {[
                    { tool: 'pencil', icon: '✏️', label: 'Pencil' },
                    { tool: 'eraser', icon: '🧽', label: 'Eraser' },
                    { tool: 'fill', icon: '🪣', label: 'Fill' },
                    { tool: 'picker', icon: '🎯', label: 'Picker' }
                  ].map(t => (
                    <button key={t.tool} style={{
                      ...buttonStyle,
                      padding: "6px 4px",
                      fontSize: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      background: "#252832",
                      minHeight: "50px"
                    }}>
                      <span style={{ fontSize: "14px" }}>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))
                }
                </div>
              </div>

              {/* Pixel Artist Color Picker */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>Color Picker</div>
                
                {/* Color Picker Tabs */}
                <div style={{
                  display: "flex",
                  marginBottom: "8px",
                  border: "1px solid #2a2d36",
                  borderRadius: "4px",
                  overflow: "hidden"
                }}>
                  {[
                    { id: 'picker', label: '🎨', title: 'Color Picker' },
                    { id: 'custom', label: '📌', title: 'Custom Channels' },
                    { id: 'common', label: '🎯', title: 'Common Colors' },
                    { id: 'variations', label: '🌈', title: 'Variations' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveColorTab(tab.id)}
                      style={{
                        flex: 1,
                        padding: "6px 4px",
                        background: activeColorTab === tab.id ? "#2b6cff" : "#252832",
                        border: "none",
                        color: activeColorTab === tab.id ? "#ffffff" : "#888",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: activeColorTab === tab.id ? "600" : "normal",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        if (activeColorTab !== tab.id) {
                          e.currentTarget.style.background = "#2a2d36";
                          e.currentTarget.style.color = "#e6e6e6";
                        }
                      }}
                      onMouseLeave={e => {
                        if (activeColorTab !== tab.id) {
                          e.currentTarget.style.background = "#252832";
                          e.currentTarget.style.color = "#888";
                        }
                      }}
                      title={tab.title}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                
                {/* Tab Content */}
                <div style={{
                  padding: "8px",
                  background: "#1e2128",
                  border: "1px solid #2a2d36",
                  borderRadius: "4px",
                  minHeight: "200px"
                }}>
                  {/* Color Picker Tab */}
                  {activeColorTab === 'picker' && (
                    <div>
                      {/* HSV Color Wheel */}
                      <div style={{ marginBottom: "12px", display: "flex", justifyContent: "center" }}>
                        <div style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          background: "conic-gradient(from 0deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                          position: "relative",
                          border: "2px solid #2a2d36",
                          cursor: "crosshair",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
                        }}>
                          {/* Hue indicator */}
                          <div style={{
                            position: "absolute",
                            top: "8px",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: "#ffffff",
                            border: "1px solid #000000",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
                            pointerEvents: "none"
                          }} />
                        </div>
                      </div>
                      
                      {/* HSV Sliders */}
                      <div style={{ marginBottom: "12px" }}>
                        {/* Hue Slider */}
                        <div style={{ marginBottom: "8px" }}>
                          <label style={{ display: "block", marginBottom: "3px", fontSize: "10px", color: "#ccc" }}>Hue: 0°</label>
                          <div style={{
                            height: "12px",
                            background: "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
                            borderRadius: "2px",
                            border: "1px solid #2a2d36",
                            position: "relative",
                            cursor: "pointer"
                          }}>
                            <div style={{
                              position: "absolute",
                              top: "-2px",
                              left: "0%",
                              width: "4px",
                              height: "16px",
                              background: "#ffffff",
                              border: "1px solid #000000",
                              borderRadius: "2px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              pointerEvents: "none"
                            }} />
                          </div>
                        </div>
                        
                        {/* Saturation Slider */}
                        <div style={{ marginBottom: "8px" }}>
                          <label style={{ display: "block", marginBottom: "3px", fontSize: "10px", color: "#ccc" }}>Saturation: 100%</label>
                          <div style={{
                            height: "12px",
                            background: "linear-gradient(to right, #808080, #ff0000)",
                            borderRadius: "2px",
                            border: "1px solid #2a2d36",
                            position: "relative",
                            cursor: "pointer"
                          }}>
                            <div style={{
                              position: "absolute",
                              top: "-2px",
                              left: "100%",
                              width: "4px",
                              height: "16px",
                              background: "#ffffff",
                              border: "1px solid #000000",
                              borderRadius: "2px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              pointerEvents: "none"
                            }} />
                          </div>
                        </div>
                        
                        {/* Value/Brightness Slider */}
                        <div>
                          <label style={{ display: "block", marginBottom: "3px", fontSize: "10px", color: "#ccc" }}>Brightness: 100%</label>
                          <div style={{
                            height: "12px",
                            background: "linear-gradient(to right, #000000, #ff0000)",
                            borderRadius: "2px",
                            border: "1px solid #2a2d36",
                            position: "relative",
                            cursor: "pointer"
                          }}>
                            <div style={{
                              position: "absolute",
                              top: "-2px",
                              left: "100%",
                              width: "4px",
                              height: "16px",
                              background: "#ffffff",
                              border: "1px solid #000000",
                              borderRadius: "2px",
                              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                              pointerEvents: "none"
                            }} />
                          </div>
                        </div>
                      </div>
                      
                      {/* RGB Hex Input */}
                      <div style={{ marginBottom: "8px" }}>
                        <label style={{ display: "block", marginBottom: "3px", fontSize: "10px", color: "#ccc" }}>Hex Color</label>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <input
                            type="text"
                            defaultValue="#FF0000"
                            style={{
                              flex: 1,
                              padding: "4px 6px",
                              background: "#252832",
                              border: "1px solid #2a2d36",
                              borderRadius: "3px",
                              color: "#e6e6e6",
                              fontSize: "10px",
                              fontFamily: "'Consolas', 'Monaco', monospace",
                              textTransform: "uppercase"
                            }}
                            placeholder="#RRGGBB"
                            maxLength={7}
                          />
                          
                          <div style={{
                            width: "20px",
                            height: "20px",
                            background: "#ff0000",
                            border: "2px solid #2b6cff",
                            borderRadius: "3px",
                            cursor: "pointer"
                          }} />
                        </div>
                      </div>
                  )}
                  
                  {/* Custom Channels Tab - For Animated Textures */}
                  {activeColorTab === 'custom' && (
                    <div>
                      <div style={{ marginBottom: "8px", fontSize: "10px", color: "#888", textAlign: "center" }}>Custom Color Palette</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "2px" }}>
                        {Array.from({ length: 32 }, (_, index) => {
                          const isEmpty = index > 5; // Only first 6 have default colors
                          return (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "16px",
                                background: isEmpty 
                                  ? "#333333"
                                  : index === 0 ? "#000000" 
                                  : index === 1 ? "#ffffff" 
                                  : index === 2 ? "#ff0000"
                                  : index === 3 ? "#00ff00"
                                  : index === 4 ? "#0000ff"
                                  : index === 5 ? "#ffff00"
                                  : "#666666",
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s",
                                position: "relative"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected custom color slot: ${index}`)}
                              onContextMenu={e => {
                                e.preventDefault();
                                console.log(`Set custom color for slot: ${index}`);
                              }}
                              title={`Custom Color ${index + 1}`}
                            >
                              {isEmpty && (
                                <div style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                  color: "#888",
                                  fontSize: "6px",
                                  fontWeight: "600",
                                  pointerEvents: "none"
                                }}>
                                  +
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  {/* Common Colors Tab */}
                  {activeColorTab === 'common' && (
                    <div>
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontWeight: "600", fontSize: "10px", color: "#ccc", marginBottom: "4px" }}>Basic Colors</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "2px" }}>
                          {[
                            '#000000', '#404040', '#808080', '#c0c0c0', '#ffffff', '#800000', '#ff0000', '#ff8080',
                            '#808000', '#ffff00', '#ffff80', '#008000', '#00ff00', '#80ff80', '#008080', '#00ffff',
                            '#80ffff', '#000080', '#0000ff', '#8080ff', '#800080', '#ff00ff', '#ff80ff', '#804000'
                          ].map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "16px",
                                background: color,
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected common color: ${color}`)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "10px", color: "#ccc", marginBottom: "4px" }}>Pixel Art Palette</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: "2px" }}>
                          {[
                            '#2d1b69', '#5d275d', '#b13e53', '#ef7d57', '#ffcd75', '#a7f070', '#38b764', '#257179',
                            '#29366f', '#3b5dc9', '#41a6f6', '#73eff7', '#f4f4f4', '#94b0c2', '#566c86', '#333c57'
                          ].map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "16px",
                                background: color,
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.1)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected pixel art color: ${color}`)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Variations Tab */}
                  {activeColorTab === 'variations' && (
                    <div>
                      <div style={{ marginBottom: "8px", fontSize: "10px", color: "#888", textAlign: "center" }}>Variations of selected color: #FF0000</div>
                      
                      {/* Lightness variations */}
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontWeight: "600", fontSize: "10px", color: "#ccc", marginBottom: "4px" }}>Lightness</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                          {[
                            '#330000', '#660000', '#990000', '#cc0000', '#ff0000', '#ff3333', '#ff6666'
                          ].map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "20px",
                                background: color,
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected variation: ${color}`)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Saturation variations */}
                      <div style={{ marginBottom: "8px" }}>
                        <div style={{ fontWeight: "600", fontSize: "10px", color: "#ccc", marginBottom: "4px" }}>Saturation</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
                          {[
                            '#808080', '#996666', '#b34d4d', '#cc3333', '#e61a1a', '#ff0000', '#ff0000'
                          ].map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "20px",
                                background: color,
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected variation: ${color}`)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {/* Complementary colors */}
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "10px", color: "#ccc", marginBottom: "4px" }}>Harmony</div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "2px" }}>
                          {[
                            '#ff0000', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'
                          ].map((color, index) => (
                            <div
                              key={index}
                              style={{
                                width: "100%",
                                height: "24px",
                                background: color,
                                border: "1px solid #555",
                                borderRadius: "2px",
                                cursor: "pointer",
                                transition: "all 0.1s"
                              }}
                              onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#2b6cff";
                                e.currentTarget.style.transform = "scale(1.05)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "#555";
                                e.currentTarget.style.transform = "scale(1)";
                              }}
                              onClick={() => console.log(`Selected harmony: ${color}`)}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{
                  marginTop: "8px",
                  padding: "8px",
                  background: "#252832",
                  border: "1px solid #2a2d36",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    background: "#ff0000",
                    border: "2px solid #2b6cff",
                    borderRadius: "4px",
                    flexShrink: 0
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "11px", fontWeight: "600", color: "#e6e6e6", marginBottom: "2px" }}>Current Color</div>
                    <div style={{ fontSize: "9px", color: "#888", fontFamily: "'Consolas', 'Monaco', monospace" }}>
                      RGB: 255, 0, 0<br/>
                      HSV: 0°, 100%, 100%
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLutManager(!showLutManager)}
                    style={{
                      background: showLutManager ? "#2b6cff" : "rgba(255,255,255,0.1)",
                      border: "1px solid #3a3d46",
                      borderRadius: "4px",
                      padding: "6px 12px",
                      cursor: "pointer",
                      color: "#e6e6e6",
                      fontSize: "11px",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      whiteSpace: "nowrap"
                    }}
                    title="Configure Animated Texture LUT Channels"
                  >
                    <span>🎬</span>
                    <span>LUT</span>
                  </button>
                </div>
              </div>
              
              {/* Advanced Settings */}
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6" }}>Advanced</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    Grid Snap
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    Onion Skin
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px" }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    Show Pixels
                  </label>
                </div>
              </div>
            </>
          );
        })() : (
          // Default properties panel for other workspaces
          <>
            <div style={{ marginBottom: "12px" }}>
              <strong>File:</strong> {activeTab?.title || 'None'}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Lines:</strong> {activeTab?.content.split('\n').length || 0}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Modified:</strong> {activeTab?.modified ? 'Yes' : 'No'}
            </div>
            <hr style={{ border: "1px solid #2a2d36", margin: "12px 0" }} />
            <div style={{ marginBottom: "8px", fontWeight: "600" }}>Build Settings</div>
            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Target:</label>
              <select style={{ width: "100%", padding: "4px", background: "#2a2d36", border: "1px solid #3a3d46", color: "#e6e6e6" }}>
                <option>WSBC Bytecode</option>
                <option>JavaScript</option>
              </select>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <label style={{ display: "block", marginBottom: "4px" }}>Optimization:</label>
              <select style={{ width: "100%", padding: "4px", background: "#2a2d36", border: "1px solid #3a3d46", color: "#e6e6e6" }}>
                <option>Debug</option>
                <option>Release</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
