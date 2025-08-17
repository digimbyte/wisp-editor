import React, { useEffect } from 'react';
import type { 
  SpriteAsset, 
  EditorTab,
  WorkspaceTab 
} from '../../types';
import { RightPanelProvider, useRightPanel } from '../rightPanel/RightPanelContext';
import { ColorTabs } from '../rightPanel/ColorTabs';
import { AdvancedSettings } from '../rightPanel/AdvancedSettings';
import { CurrentColorSummary } from '../rightPanel/CurrentColorSummary';
import { TabContent } from '../rightPanel/TabContent';
import { SpriteInfo } from '../rightPanel/SpriteInfo';
import { DrawingTools } from '../rightPanel/DrawingTools';
import { RegionTools } from '../rightPanel/RegionTools';
import { AnimationTools } from '../rightPanel/AnimationTools';
import { DepthTools } from '../rightPanel/DepthTools';
import { LogicTools } from '../rightPanel/LogicTools';
import { PivotTools } from '../rightPanel/PivotTools';

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
  // Sprite editing specific props
  spriteEditorMode?: 'brush' | 'regions' | 'animations' | 'depth' | 'logic' | 'pivot';
  // Paint tool state (passed through from MainApp)
  activePaintTool?: string;
  onPaintToolChange?: (tool: string) => void;
  paintColor?: string;
  brushSize?: number;
  onBrushSizeChange?: (size: number) => void;
}

// Bridge component to sync context state with external props
const RightPanelStateBridge: React.FC<{
  activeColorTab: 'picker' | 'custom' | 'common' | 'variations';
  setActiveColorTab: (tab: 'picker' | 'custom' | 'common' | 'variations') => void;
  showLutManager: boolean;
  setShowLutManager: (show: boolean) => void;
}> = ({ activeColorTab, setActiveColorTab, showLutManager, setShowLutManager }) => {
  const ctx = useRightPanel();
  // Push prop changes into context
  useEffect(() => {
    if (ctx.activeColorTab !== activeColorTab) ctx.setActiveColorTab(activeColorTab as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColorTab]);
  useEffect(() => {
    if (ctx.showLutManager !== showLutManager) ctx.setShowLutManager(showLutManager);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showLutManager]);
  // Notify parent when context changes (user interactions)
  useEffect(() => {
    setActiveColorTab(ctx.activeColorTab as any);
  }, [ctx.activeColorTab, setActiveColorTab]);
  useEffect(() => {
    setShowLutManager(ctx.showLutManager);
  }, [ctx.showLutManager, setShowLutManager]);
  return null;
};

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
  setShowLutManager,
  spriteEditorMode,
  activePaintTool,
  onPaintToolChange,
  paintColor,
  brushSize,
  onBrushSizeChange
}) => {
  const panelStyle = {
    background: "#1a1d23",
    border: "1px solid #2a2d36",
    display: "flex",
    flexDirection: "column" as const,
    height: "100%" // Use full height of parent container
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


  return (
    <div style={{ ...panelStyle, width: `${rightPanelWidth}px`, minWidth: "340px" }}>
      <div style={panelHeaderStyle}>
        <span>🎛️ Properties</span>
        <span style={{ cursor: "pointer" }} onClick={() => setRightPanelWidth(rightPanelWidth === 250 ? 350 : 250)}>⚙️</span>
      </div>
      <div style={{ 
        flex: 1, 
        padding: "8px", 
        fontSize: "12px", 
        overflow: "auto",
        minHeight: 0 // Important for flex child to allow scrolling
      }}>
        {activeWorkspace === 'sprites' && selectedSprite ? (() => {
          const sprite = sprites.find(s => s.id === selectedSprite);
          if (!sprite) return null;
          
          // Helper function to render tool-specific sidebar
          const renderToolSidebar = () => {
            switch (spriteEditorMode) {
              case 'brush':
              default:
                return <DrawingTools 
                  activeTool={activePaintTool as any}
                  onSelectTool={onPaintToolChange as any}
                  brushSize={brushSize}
                  onBrushSizeChange={onBrushSizeChange}
                  currentColor={paintColor}
                />;
              case 'regions':
                return <RegionTools />;
              case 'animations':
                return <AnimationTools />;
              case 'depth':
                return <DepthTools />;
              case 'logic':
                return <LogicTools />;
              case 'pivot':
                return <PivotTools />;
            }
          };

          return (
            <div>
              <SpriteInfo sprite={sprite} />
              
              {/* Tool-specific sidebar based on current mode */}
              {renderToolSidebar()}

              {/* Pixel Artist Color Picker - only show for brush mode */}
              {(!spriteEditorMode || spriteEditorMode === 'brush') && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ fontSize: "12px", marginBottom: "8px", color: "#e6e6e6", fontWeight: "600" }}>Color Picker</div>
                  <RightPanelProvider>
                    <RightPanelStateBridge
                      activeColorTab={activeColorTab}
                      setActiveColorTab={setActiveColorTab}
                      showLutManager={showLutManager}
                      setShowLutManager={setShowLutManager}
                    />
                    <ColorTabs />
                    {/* Tab Content */}
                    <TabContent />
                    <CurrentColorSummary />
                    <AdvancedSettings />
                  </RightPanelProvider>
                </div>
              )}
            </div>
          );
        })() : (
          // Default properties panel for other workspaces
          <div>
            <div style={{ marginBottom: "12px" }}>
              <strong>File:</strong> {activeTab?.title || 'None'}
            </div>
            <div style={{ marginBottom: "12px" }}>
              <strong>Lines:</strong> {(activeTab?.content || '').split('\n').length}
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
          </div>
        )}
      </div>
    </div>
  );
};
