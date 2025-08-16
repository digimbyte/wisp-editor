import React, { useState } from 'react';
import { ColorPicker, ColorTabType } from './ui/ColorPicker';
import { InfiniteCanvas, InfiniteFocusButton } from './canvas/InfiniteCanvas';
import { LUTManager } from './dialogs/LUTManager';

// This is a simplified demo showing how App.tsx would look with modular components
export const AppDemo: React.FC = () => {
  // State that would normally be in App.tsx
  const [activeColorTab, setActiveColorTab] = useState<ColorTabType>('picker');
  const [showLutManager, setShowLutManager] = useState(false);
  
  // Sprite data (would come from main App state)
  const currentSprite = {
    width: 32,
    height: 32,
    name: 'Demo Sprite'
  };

  const handlePixelClick = (x: number, y: number) => {
    console.log(`Pixel clicked: ${x}, ${y}`);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#0f1115',
      color: '#e6e6e6',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Left Panel - Color Picker */}
      <div style={{
        width: '300px',
        background: '#1a1d23',
        border: '1px solid #2a2d36',
        padding: '16px',
        overflow: 'auto'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Properties Panel</h3>
        
        {/* Modular Color Picker Component */}
        <ColorPicker
          activeTab={activeColorTab}
          setActiveTab={setActiveColorTab}
          showLutManager={showLutManager}
          setShowLutManager={setShowLutManager}
        />
        
        {/* Other properties would go here */}
        <div style={{ marginTop: '16px' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Drawing Tools</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
            {['✏️ Pencil', '🧽 Eraser', '🪣 Fill', '🎯 Picker'].map(tool => (
              <button key={tool} style={{
                padding: '8px 4px',
                background: '#252832',
                border: '1px solid #2a2d36',
                borderRadius: '4px',
                color: '#e6e6e6',
                fontSize: '11px',
                cursor: 'pointer'
              }}>
                {tool}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Center Panel - Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Canvas Header */}
        <div style={{
          height: '40px',
          background: '#1a1d23',
          borderBottom: '1px solid #2a2d36',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          justifyContent: 'space-between'
        }}>
          <h3 style={{ margin: 0, fontSize: '16px' }}>
            🎨 {currentSprite.name} - {currentSprite.width}×{currentSprite.height}
          </h3>
          
          {/* Canvas Controls */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <InfiniteFocusButton 
              spriteWidth={currentSprite.width}
              spriteHeight={currentSprite.height}
            />
            <button style={{
              padding: '6px 12px',
              background: '#22cc22',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '12px',
              cursor: 'pointer'
            }}>
              💾 Save
            </button>
          </div>
        </div>

        {/* Modular Infinite Canvas Component */}
        <div style={{ flex: 1, background: '#1e2128' }}>
          <InfiniteCanvas
            spriteWidth={currentSprite.width}
            spriteHeight={currentSprite.height}
            onPixelClick={handlePixelClick}
          />
        </div>
      </div>

      {/* Right Panel - More Tools */}
      <div style={{
        width: '250px',
        background: '#1a1d23',
        border: '1px solid #2a2d36',
        padding: '16px'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Tools</h3>
        <div style={{ fontSize: '13px', color: '#888' }}>
          Additional tools and options would go here...
        </div>
      </div>

      {/* Modular LUT Manager Dialog */}
      <LUTManager
        isOpen={showLutManager}
        onClose={() => setShowLutManager(false)}
      />
    </div>
  );
};

// Usage example in main App.tsx would be:
// import { AppDemo } from './components/AppDemo';
// 
// Then in your main App component:
// return projectDir ? <MainEditor /> : <ProjectHub />;
// 
// Where MainEditor would use the modular components like:
// <ColorPicker activeTab={activeColorTab} setActiveTab={setActiveColorTab} ... />
// <InfiniteCanvas spriteWidth={sprite.width} spriteHeight={sprite.height} ... />
// <LUTManager isOpen={showLutManager} onClose={() => setShowLutManager(false)} />
