import React from 'react';
import type { EditorTab } from '../../types';

interface CodeWorkspaceProps {
  editorTabs: EditorTab[];
  activeTabId: string;
  activeTab: EditorTab | undefined;
  onTabSelect: (tabId: string) => void;
  onCloseTab: (tabId: string, e: React.MouseEvent) => void;
  onAddNewTab: () => void;
  onUpdateContent: (content: string) => void;
  tabStyle: React.CSSProperties;
  activeTabStyle: React.CSSProperties;
}

export function CodeWorkspace({
  editorTabs,
  activeTabId,
  activeTab,
  onTabSelect,
  onCloseTab,
  onAddNewTab,
  onUpdateContent,
  tabStyle,
  activeTabStyle
}: CodeWorkspaceProps) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* File Tabs */}
      <div style={{
        height: "36px",
        background: "#1a1d23",
        borderBottom: "1px solid #2a2d36",
        display: "flex",
        alignItems: "stretch"
      }}>
        {editorTabs.map(tab => (
          <button
            key={tab.id}
            style={tab.id === activeTabId ? activeTabStyle : tabStyle}
            onClick={() => onTabSelect(tab.id)}
          >
            <span>{tab.title}</span>
            {tab.modified && <span style={{ color: "#ffa500" }}>●</span>}
            <span 
              style={{ 
                marginLeft: "6px", 
                padding: "0 4px", 
                borderRadius: "2px",
                fontSize: "10px",
                opacity: 0.7,
                cursor: "pointer"
              }}
              onClick={(e) => onCloseTab(tab.id, e)}
              onMouseEnter={e => e.currentTarget.style.background = "#ff4444"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              ×
            </span>
          </button>
        ))}
        
        <button 
          style={{ ...tabStyle, width: "36px", justifyContent: "center" }}
          onClick={onAddNewTab}
          title="New File"
        >
          +
        </button>
      </div>
      
      {/* Code Editor */}
      <div style={{ flex: 1, padding: "12px" }}>
        <textarea
          value={activeTab?.content || ''}
          onChange={e => onUpdateContent(e.target.value)}
          style={{
            width: "100%",
            height: "100%",
            background: "#1e2128",
            border: "none",
            color: "#e6e6e6",
            fontFamily: "'Consolas', 'Monaco', monospace",
            fontSize: "14px",
            lineHeight: "1.5",
            resize: "none",
            outline: "none",
            padding: "0"
          }}
          placeholder="Start coding your Wisp script..."
        />
      </div>
    </div>
  );
}
