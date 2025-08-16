import React from 'react';
import { useRightPanel } from './RightPanelContext';

export const ColorTabs: React.FC = () => {
  const { activeColorTab, setActiveColorTab } = useRightPanel();
  const tabs = [
    { id: 'picker', label: '🎨', title: 'Color Picker' },
    { id: 'custom', label: '📌', title: 'Custom Channels' },
    { id: 'common', label: '🎯', title: 'Common Colors' },
    { id: 'variations', label: '🌈', title: 'Variations' }
  ] as const;

  return (
    <div style={{
      display: 'flex', marginBottom: '8px', border: '1px solid #2a2d36', borderRadius: '4px', overflow: 'hidden'
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveColorTab(tab.id as any)}
          title={tab.title}
          style={{
            flex: 1,
            padding: '6px 4px',
            background: activeColorTab === tab.id ? '#2b6cff' : '#252832',
            border: 'none',
            color: activeColorTab === tab.id ? '#ffffff' : '#888',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: activeColorTab === tab.id ? '600' : 'normal',
            transition: 'all 0.2s'
          }}     >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
