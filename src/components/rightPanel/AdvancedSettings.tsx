import React from 'react';

export const AdvancedSettings: React.FC = () => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', color: '#e6e6e6' }}>Advanced</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <input type="checkbox" style={{ margin: 0 }} />
          Grid Snap
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <input type="checkbox" style={{ margin: 0 }} />
          Onion Skin
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
          <input type="checkbox" style={{ margin: 0 }} />
          Show Pixels
        </label>
      </div>
    </div>
  );
};
