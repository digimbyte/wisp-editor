import React from 'react';
import { useRightPanel } from './RightPanelContext';
import ColorPicker from 'react-best-gradient-color-picker';

export const TabContent: React.FC = () => {
  const { activeColorTab, selectedColor, setSelectedColor } = useRightPanel();
  return (
    <div style={{
      padding: '8px',
      background: '#1e2128',
      border: '1px solid #2a2d36',
      borderRadius: '4px',
      minHeight: '200px'
    }}>
      {activeColorTab === 'picker' && (
        <ColorPicker
          value={selectedColor}
          onChange={(value: string) => setSelectedColor(value)}
          className="wisp-gradient-color-picker"
        />
      )}

      {activeColorTab !== 'picker' && (
        <div style={{ color: '#888', fontSize: '12px' }}>
          Select the Picker tab to choose a color. Current: {selectedColor}
        </div>
      )}
    </div>
  );
};

