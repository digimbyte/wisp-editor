import React from 'react';

export type TopMenuProps = {
  version: string;
  onNewProject: () => void;
  onOpenProject: () => void;
  onAddNewFile: () => void;
  onCloseProject: () => void;
  onBuildProject: () => void;
  onFlashProject: () => void;
  onCleanBuild: () => void;
  showFileMenu: boolean;
  setShowFileMenu: (v: boolean) => void;
  showEditMenu: boolean;
  setShowEditMenu: (v: boolean) => void;
  showBuildMenu: boolean;
  setShowBuildMenu: (v: boolean) => void;
  buttonStyle: React.CSSProperties;
  panelHeaderExtras?: React.ReactNode;
};

import { AppLogo, LogoFallback } from '../common/AppLogo';

export const TopMenu: React.FC<TopMenuProps> = ({
  version,
  onNewProject,
  onOpenProject,
  onAddNewFile,
  onCloseProject,
  onBuildProject,
  onFlashProject,
  onCleanBuild,
  showFileMenu,
  setShowFileMenu,
  showEditMenu,
  setShowEditMenu,
  showBuildMenu,
  setShowBuildMenu,
  buttonStyle
}) => {
  return (
    <div style={{
      height: '40px',
      background: '#181b20',
      borderBottom: '1px solid #2a2d36',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <AppLogo size={24} />
            <LogoFallback size={24} />
          </div>
        </div>

        {/* File Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFileMenu(!showFileMenu);
              setShowEditMenu(false);
              setShowBuildMenu(false);
            }}
            style={{
              ...buttonStyle,
              background: showFileMenu ? '#2b6cff' : 'transparent',
              border: 'none',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            File
          </button>
          {showFileMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#1a1d23',
              border: '1px solid #2a2d36',
              borderRadius: '4px',
              minWidth: '160px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <button onClick={() => { onNewProject(); setShowFileMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#e6e6e6', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >New Project</button>
              <button onClick={() => { onOpenProject(); setShowFileMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#e6e6e6', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >Open Project</button>
              <div style={{ height: '1px', background: '#2a2d36', margin: '4px 0' }} />
              <button onClick={() => { onAddNewFile(); setShowFileMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#e6e6e6', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >New File</button>
              <div style={{ height: '1px', background: '#2a2d36', margin: '4px 0' }} />
              <button onClick={() => { onCloseProject(); setShowFileMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#cc4444', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >Close Project</button>
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEditMenu(!showEditMenu);
              setShowFileMenu(false);
              setShowBuildMenu(false);
            }}
            style={{
              ...buttonStyle,
              background: showEditMenu ? '#2b6cff' : 'transparent',
              border: 'none',
              padding: '6px 12px',
              fontSize: '13px'
            }}
          >
            Edit
          </button>
          {showEditMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              background: '#1a1d23',
              border: '1px solid #2a2d36',
              borderRadius: '4px',
              minWidth: '160px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'not-allowed', fontSize: '13px' }}>Undo</button>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'not-allowed', fontSize: '13px' }}>Redo</button>
              <div style={{ height: '1px', background: '#2a2d36', margin: '4px 0' }} />
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'not-allowed', fontSize: '13px' }}>Cut</button>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'not-allowed', fontSize: '13px' }}>Copy</button>
              <button style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'not-allowed', fontSize: '13px' }}>Paste</button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ fontSize: '10px', opacity: 0.6 }}>Wisp v{version}</div>
        {/* Build Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowBuildMenu(!showBuildMenu);
              setShowFileMenu(false);
              setShowEditMenu(false);
            }}
            style={{
              ...buttonStyle,
              background: showBuildMenu ? '#44dd44' : '#22cc22',
              border: 'none',
              padding: '6px 12px',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            Build
          </button>
          {showBuildMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: '#1a1d23',
              border: '1px solid #2a2d36',
              borderRadius: '4px',
              minWidth: '160px',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <button onClick={() => { onBuildProject(); setShowBuildMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#22cc22', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >🔨 Build Project</button>
              <button onClick={() => { onFlashProject(); setShowBuildMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#2b6cff', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >📡 Flash to Device</button>
              <button onClick={() => { onCleanBuild(); setShowBuildMenu(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#ff8800', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >🗑️ Clean Build</button>
              <div style={{ height: '1px', background: '#2a2d36', margin: '4px 0' }} />
              <button onClick={() => setShowBuildMenu(false)}
                style={{ width: '100%', textAlign: 'left', padding: '8px 12px', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '13px' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#2a2d36')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >⚙️ Build Settings</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

