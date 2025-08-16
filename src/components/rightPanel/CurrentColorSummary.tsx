import React from 'react';
import { useRightPanel } from './RightPanelContext';

export const CurrentColorSummary: React.FC = () => {
  const { selectedColor, showLutManager, setShowLutManager } = useRightPanel();
  return (
    <div style={{
      marginTop: '8px', padding: '8px', background: '#252832', border: '1px solid #2a2d36',
      borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px'
    }}>
      <div style={{ width: '32px', height: '32px', background: selectedColor, border: '2px solid #2b6cff', borderRadius: '4px', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: '600', color: '#e6e6e6', marginBottom: '2px' }}>Current Color</div>
        <div style={{ fontSize: '9px', color: '#888', fontFamily: "'Consolas', 'Monaco', monospace" }}>
          HEX: {selectedColor}
        </div>
      </div>
      <button
        onClick={() => setShowLutManager(!showLutManager)}
        style={{
          background: showLutManager ? '#2b6cff' : 'rgba(255,255,255,0.1)', border: '1px solid #3a3d46',
          borderRadius: '4px', padding: '6px 12px', cursor: 'pointer', color: '#e6e6e6', fontSize: '11px',
          fontWeight: '600', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', whiteSpace: 'nowrap'
        }}
        title="Configure Animated Texture LUT Channels"
      >
        <span>🎬</span>
        <span>LUT</span>
      </button>
    </div>
  );
};
