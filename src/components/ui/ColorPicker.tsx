import React from 'react';

export type ColorTabType = 'picker' | 'custom' | 'common' | 'variations';

interface ColorPickerProps {
  activeTab: ColorTabType;
  setActiveTab: (tab: ColorTabType) => void;
  showLutManager: boolean;
  setShowLutManager: (show: boolean) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  activeTab,
  setActiveTab,
  showLutManager,
  setShowLutManager
}) => {
  return (
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
            onClick={() => setActiveTab(tab.id as ColorTabType)}
            style={{
              flex: 1,
              padding: "6px 4px",
              background: activeTab === tab.id ? "#2b6cff" : "#252832",
              border: "none",
              color: activeTab === tab.id ? "#ffffff" : "#888",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: activeTab === tab.id ? "600" : "normal",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.background = "#2a2d36";
                e.currentTarget.style.color = "#e6e6e6";
              }
            }}
            onMouseLeave={e => {
              if (activeTab !== tab.id) {
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
        {activeTab === 'picker' && (
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
          </div>
        )}
        
        {/* Custom Channels Tab - For Animated Textures */}
        {activeTab === 'custom' && (
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
        {activeTab === 'common' && (
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
        {activeTab === 'variations' && (
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
      
      {/* Current Color Display */}
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
  );
};
