import React from 'react';

interface DrawingToolsProps {
  onSelectTool?: (tool: 'pencil' | 'eraser' | 'fill' | 'picker') => void;
}

const baseButton: React.CSSProperties = {
  padding: '6px 12px',
  background: '#1d2330',
  border: '1px solid #2a3348',
  borderRadius: '4px',
  cursor: 'pointer',
  color: '#e6e6e6',
  fontSize: '13px',
  fontWeight: 500
};

export const DrawingTools: React.FC<DrawingToolsProps> = ({ onSelectTool }) => {
  const tools = [
    { tool: 'pencil' as const, icon: '✏️', label: 'Pencil' },
    { tool: 'eraser' as const, icon: '🧽', label: 'Eraser' },
    { tool: 'fill' as const, icon: '🪣', label: 'Fill' },
    { tool: 'picker' as const, icon: '🎯', label: 'Picker' },
  ];

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '12px', marginBottom: '8px', color: '#e6e6e6' }}>Drawing Tools</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px' }}>
        {tools.map((t) => (
          <button
            key={t.tool}
            onClick={() => onSelectTool?.(t.tool)}
            style={{
              ...baseButton,
              padding: '6px 4px',
              fontSize: '10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: '#252832',
              minHeight: '50px',
            }}
          >
            <span style={{ fontSize: '14px' }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

