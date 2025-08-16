import React from 'react';
import { ProjectCreationStep, BoardDefinition, BoardColumn } from '../../types';

interface ProjectWizardProps {
  show: boolean;
  onClose: () => void;
  projectName: string;
  setProjectName: (name: string) => void;
  projectPath: string;
  setProjectPath: (path: string) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
  selectedBoard: string;
  setSelectedBoard: (board: string) => void;
  projectCreationStep: ProjectCreationStep;
  setProjectCreationStep: (step: ProjectCreationStep) => void;
  isCreatingProject: boolean;
  availableBoards: BoardDefinition[];
  boardColumns: BoardColumn[];
  setBoardColumns: (columns: BoardColumn[]) => void;
  boardSortColumn: string;
  setBoardSortColumn: (column: string) => void;
  boardSortDirection: 'asc' | 'desc';
  setBoardSortDirection: (direction: 'asc' | 'desc') => void;
  showColumnManager: boolean;
  setShowColumnManager: (show: boolean) => void;
  onOpenBoardConfigDialog: (mode: 'import' | 'manual') => void;
  onEditCustomBoard: () => void;
  onCreateProject: () => void;
  log: string;
  getSortedBoards: () => BoardDefinition[];
  handleColumnSort: (column: string) => void;
  buttonStyle: React.CSSProperties;
}

export const ProjectWizard: React.FC<ProjectWizardProps> = ({
  show,
  onClose,
  projectName,
  setProjectName,
  projectPath,
  setProjectPath,
  selectedTemplate,
  setSelectedTemplate,
  selectedBoard,
  setSelectedBoard,
  projectCreationStep,
  setProjectCreationStep,
  isCreatingProject,
  availableBoards,
  boardColumns,
  setBoardColumns,
  boardSortColumn,
  boardSortDirection,
  showColumnManager,
  setShowColumnManager,
  onOpenBoardConfigDialog,
  onEditCustomBoard,
  onCreateProject,
  log,
  getSortedBoards,
  handleColumnSort,
  buttonStyle
}) => {
  if (!show) return null;
  
  // Debug logging for board selection
  console.log('ProjectWizard - selectedBoard:', selectedBoard, 'step:', projectCreationStep);

  const selectDirectory = async () => {
    try {
      const { dialogService } = await import('../../services/dialog');
      const selectedPath = await dialogService.selectDirectory();
      if (selectedPath) {
        setProjectPath(selectedPath);
      }
    } catch (error) {
      console.error('Failed to open directory dialog:', error);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#1a1d23",
        border: "1px solid #2a2d36",
        borderRadius: "8px",
        width: "800px",
        height: "600px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
        {/* Wizard Header */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderBottom: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", whiteSpace: "nowrap" }}>Create Project:</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="My Wisp Project"
              style={{
                flex: 1,
                padding: "8px 12px",
                background: "#1a1d23",
                border: "1px solid #2a2d36",
                borderRadius: "4px",
                color: "#e6e6e6",
                fontSize: "16px",
                fontWeight: "600"
              }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              fontSize: "20px",
              cursor: "pointer",
              padding: "4px"
            }}
          >×</button>
        </div>

        {/* Step Indicators */}
        <div style={{
          padding: "16px 24px",
          background: "#1e2128",
          borderBottom: "1px solid #2a2d36",
          display: "flex",
          gap: "12px"
        }}>
          {[
            { id: 'setup', label: 'Setup', icon: '⚙️' },
            { id: 'board', label: 'Board', icon: '🔧' },
            { id: 'assets', label: 'Assets', icon: '🎨' }
          ].map((step, index) => {
            const stepOrder = ['setup', 'board', 'assets'];
            const currentIndex = stepOrder.indexOf(projectCreationStep);
            const isActive = step.id === projectCreationStep;
            const isCompleted = index < currentIndex;
            
            return (
              <div key={step.id} style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 12px",
                borderRadius: "4px",
                background: isActive ? "#2b6cff" : isCompleted ? "#22cc22" : "#2a2d36",
                color: isActive || isCompleted ? "#ffffff" : "#888",
                fontSize: "13px"
              }}>
                <span>{step.icon}</span>
                <span>{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Loading Overlay */}
        {isCreatingProject && (
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(26, 29, 35, 0.95)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            gap: "20px"
          }}>
            <div style={{
              width: "80px",
              height: "80px",
              border: "4px solid #2a2d36",
              borderTop: "4px solid #2b6cff",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }} />
            
            <div style={{
              textAlign: "center",
              maxWidth: "400px"
            }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "600" }}>Creating Project...</h3>
              
              {/* Progress Bar */}
              <div style={{
                width: "300px",
                height: "8px",
                background: "#2a2d36",
                borderRadius: "4px",
                overflow: "hidden",
                marginBottom: "16px"
              }}>
                <div style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #2b6cff, #4d8aff)",
                  width: "100%",
                  animation: "progress 2s ease-in-out infinite"
                }} />
              </div>
              
              {/* Live Status */}
              <div style={{
                background: "#1e2128",
                border: "1px solid #2a2d36",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "13px",
                fontFamily: "'Consolas', 'Monaco', monospace",
                textAlign: "left",
                maxHeight: "120px",
                overflow: "auto",
                color: "#ccc"
              }}>
                {log.split('\n').slice(-6).map((line, i) => (
                  <div key={i} style={{ 
                    marginBottom: "2px",
                    opacity: i === log.split('\n').slice(-6).length - 1 ? 1 : 0.7
                  }}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Add CSS animations */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              @keyframes progress {
                0% { transform: translateX(-100%); }
                50% { transform: translateX(0%); }
                100% { transform: translateX(100%); }
              }
            `}</style>
          </div>
        )}

        {/* Wizard Content */}
        <div style={{ 
          flex: 1,
          padding: "20px 24px",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          opacity: isCreatingProject ? 0.3 : 1,
          pointerEvents: isCreatingProject ? "none" : "auto"
        }}>
          {/* Setup Step - Combined Location and Template */}
          {projectCreationStep === 'setup' && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              {/* Project Location */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Project Location</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={projectPath}
                    onChange={(e) => setProjectPath(e.target.value)}
                    placeholder="Choose folder where to save project..."
                    style={{
                      flex: 1,
                      padding: "12px",
                      background: "#252832",
                      border: "1px solid #2a2d36",
                      borderRadius: "4px",
                      color: "#e6e6e6",
                      fontSize: "14px"
                    }}
                  />
                  <button
                    onClick={selectDirectory}
                    style={{
                      ...buttonStyle,
                      padding: "12px 16px",
                      whiteSpace: "nowrap"
                    }}
                  >
                    📁 Browse
                  </button>
                </div>
              </div>
              
              {/* Template Selection */}
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Project Template</label>
                <div style={{ marginBottom: "12px", fontSize: "12px", color: "#888", fontStyle: "italic" }}>
                  Templates are starter scripts and assets to help you get started quickly
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                  {[
                    { name: "Empty Project", desc: "Start from scratch", icon: "📄" },
                    { name: "2D Platformer", desc: "Side-scrolling game", icon: "🏃" },
                    { name: "Top-down Shooter", desc: "Arcade shooter", icon: "🚀" },
                    { name: "Menu System", desc: "UI navigation", icon: "📱" }
                  ].map(template => (
                    <button
                      key={template.name}
                      onClick={() => setSelectedTemplate(template.name)}
                      style={{
                        ...buttonStyle,
                        background: selectedTemplate === template.name ? "#2b6cff" : "#252832",
                        border: `2px solid ${selectedTemplate === template.name ? "#4d8aff" : "#2a2d36"}`,
                        padding: "10px",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderRadius: "6px"
                      }}
                    >
                      <span style={{ fontSize: "16px" }}>{template.icon}</span>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "12px", marginBottom: "1px" }}>{template.name}</div>
                        <div style={{ fontSize: "10px", opacity: 0.8 }}>{template.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Board Selection */}
          {projectCreationStep === 'board' && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "600" }}>Select Target Board</h3>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setShowColumnManager(!showColumnManager)}
                    style={{
                      ...buttonStyle,
                      background: showColumnManager ? "#4d8aff" : "#666",
                      padding: "6px 8px",
                      fontSize: "12px",
                      border: "none",
                      minWidth: "32px"
                    }}
                    title="Manage Columns"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onOpenBoardConfigDialog('import')}
                    style={{
                      ...buttonStyle,
                      background: "#2b6cff",
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "none"
                    }}
                  >
                    📥 Import Board
                  </button>
                  {/* Show Edit button only if a custom (unverified) board is selected */}
                  {selectedBoard && availableBoards.find(b => b.id === selectedBoard && !b.verified) && (
                    <button
                      onClick={onEditCustomBoard}
                      style={{
                        ...buttonStyle,
                        background: "#ff8800",
                        padding: "6px 12px",
                        fontSize: "12px",
                        border: "none"
                      }}
                    >
                      ✏️ Edit Board
                    </button>
                  )}
                  <button
                    onClick={() => onOpenBoardConfigDialog('manual')}
                    style={{
                      ...buttonStyle,
                      background: "#22cc22",
                      padding: "6px 12px",
                      fontSize: "12px",
                      border: "none"
                    }}
                  >
                    ➕ Add Custom
                  </button>
                </div>
              </div>

              {/* Column Manager Dropdown */}
              {showColumnManager && (
                <div style={{
                  position: "absolute",
                  top: "50px",
                  right: "16px",
                  background: "#1a1d23",
                  border: "1px solid #2a2d36",
                  borderRadius: "6px",
                  padding: "8px",
                  zIndex: 10,
                  minWidth: "200px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                }}>
                  <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "8px", color: "#e6e6e6" }}>Manage Columns</div>
                  {boardColumns.map(col => (
                    <div key={col.key} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <input
                        type="checkbox"
                        checked={col.visible}
                        onChange={(e) => {
                          setBoardColumns(boardColumns.map(c => 
                            c.key === col.key ? { ...c, visible: e.target.checked } : c
                          ));
                        }}
                        style={{ margin: 0 }}
                      />
                      <span style={{ fontSize: "11px", color: col.visible ? "#e6e6e6" : "#888" }}>{col.label}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #2a2d36", marginTop: "8px", paddingTop: "6px" }}>
                    <button
                      onClick={() => setShowColumnManager(false)}
                      style={{
                        ...buttonStyle,
                        padding: "4px 8px",
                        fontSize: "10px",
                        width: "100%"
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
              
              <div style={{ 
                flex: 1, 
                border: "1px solid #2a2d36",
                borderRadius: "4px",
                background: "#1e2128",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}>
                {/* Table Header */}
                <div style={{
                  display: "flex",
                  background: "#252832",
                  borderBottom: "1px solid #2a2d36",
                  fontSize: "12px",
                  fontWeight: "600",
                  color: "#e6e6e6"
                }}>
                  {boardColumns.filter(col => col.visible).map(col => (
                    <div
                      key={col.key}
                      onClick={() => col.sortable && handleColumnSort(col.key)}
                      style={{
                        width: col.width,
                        padding: "8px 12px",
                        cursor: col.sortable ? "pointer" : "default",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        borderRight: "1px solid #2a2d36",
                        userSelect: "none"
                      }}
                      onMouseEnter={(e) => {
                        if (col.sortable) {
                          e.currentTarget.style.background = "#2a2d36";
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span style={{ 
                          fontSize: "10px", 
                          opacity: boardSortColumn === col.key ? 1 : 0.3,
                          transform: boardSortColumn === col.key && boardSortDirection === 'desc' ? 'rotate(180deg)' : 'none'
                        }}>
                          ▲
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Table Body */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  {getSortedBoards().map((board) => {
                    const getCellContent = (column: BoardColumn) => {
                      switch (column.key) {
                        case 'name':
                          return (
                            <>
                              <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: selectedBoard === board.id ? "#ffffff" : (board.verified ? "#22cc22" : "#ff8800"),
                                flexShrink: 0
                              }} />
                              <span style={{ 
                                overflow: "hidden", 
                                textOverflow: "ellipsis", 
                                whiteSpace: "nowrap",
                                flex: 1,
                                minWidth: 0
                              }}>
                                {board.name}
                              </span>
                            </>
                          );
                        case 'brand':
                          return board.mcu.split('-')[0] || board.mcu;
                        case 'architecture':
                          return board.architecture;
                        case 'flash':
                          return board.flash;
                        case 'sram':
                          return board.sram || '-';
                        case 'psram':
                          return board.psram || '-';
                        case 'lpram':
                          return board.lpram || '-';
                        case 'wifi':
                          return board.wifi || '-';
                        case 'btc':
                          return board.bluetooth?.classic ? (
                            <span style={{ color: "#22cc22" }}>✓</span>
                          ) : (
                            <span style={{ color: "#666" }}>✗</span>
                          );
                        case 'ble':
                          return board.bluetooth?.le ? (
                            <span style={{ color: "#22cc22" }}>✓</span>
                          ) : (
                            <span style={{ color: "#666" }}>✗</span>
                          );
                        case 'pixels':
                          if (!board.display) return '-';
                          const pixels = board.display.width * board.display.height;
                          return pixels >= 1000000 ? `${(pixels / 1000000).toFixed(1)}M` : 
                                 pixels >= 1000 ? `${(pixels / 1000).toFixed(0)}K` : 
                                 pixels.toString();
                        case 'status':
                          return board.verified ? (
                            <span style={{ color: "#22cc22" }}>✓ Verified</span>
                          ) : (
                            <span style={{ color: "#ff8800" }}>⚠ Custom</span>
                          );
                        default:
                          return '-';
                      }
                    };
                    
                    return (
                      <div
                        key={board.id}
                        onClick={() => {
                          console.log('Board clicked:', board.id, board.name);
                          setSelectedBoard(board.id);
                        }}
                        style={{
                          display: "flex",
                          background: selectedBoard === board.id ? "#2b6cff" : "transparent",
                          cursor: "pointer",
                          transition: "background-color 0.2s",
                          borderBottom: "1px solid #2a2d36"
                        }}
                        onMouseEnter={(e) => {
                          if (selectedBoard !== board.id) {
                            e.currentTarget.style.background = "#252832";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedBoard !== board.id) {
                            e.currentTarget.style.background = "transparent";
                          }
                        }}
                      >
                        {boardColumns.filter(col => col.visible).map(column => (
                          <div
                            key={column.key}
                            style={{
                              width: column.width,
                              padding: "8px 12px",
                              borderRight: "1px solid #2a2d36",
                              fontSize: column.key === 'name' ? "13px" : column.key === 'pixels' || column.key.includes('ram') ? "11px" : "12px",
                              fontWeight: column.key === 'name' ? "500" : "normal",
                              color: selectedBoard === board.id ? 
                                (column.key === 'name' ? "#ffffff" : "rgba(255,255,255,0.8)") : 
                                (column.key === 'name' ? "#e6e6e6" : "#ccc"),
                              display: "flex",
                              alignItems: "center",
                              gap: column.key === 'name' ? "8px" : "0",
                              justifyContent: column.key === 'flash' || column.key === 'pixels' || column.key === 'status' || column.key === 'btc' || column.key === 'ble' ? "center" : "flex-start",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              minWidth: 0
                            }}
                          >
                            {getCellContent(column)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Assets & Finalization Step */}
          {projectCreationStep === 'assets' && (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ marginBottom: "20px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>Project Assets</h3>
                <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>Add starter assets to your project or start with an empty project</p>
              </div>
              
              {/* Asset Options */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "24px" }}>
                {/* Starter Sprites */}
                <div style={{
                  padding: "16px",
                  background: "#1e2128",
                  border: "1px solid #2a2d36",
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <input type="checkbox" defaultChecked style={{ margin: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>🎮 Starter Sprites</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.4 }}>
                    Basic player, enemy, and UI sprites optimized for ESP32 displays
                  </div>
                </div>
                
                {/* Sample Audio */}
                <div style={{
                  padding: "16px",
                  background: "#1e2128",
                  border: "1px solid #2a2d36",
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <input type="checkbox" defaultChecked style={{ margin: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>🔊 Sample Audio</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.4 }}>
                    Sound effects and music clips for game development
                  </div>
                </div>
                
                {/* Fonts Pack */}
                <div style={{
                  padding: "16px",
                  background: "#1e2128",
                  border: "1px solid #2a2d36",
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>🔤 Font Pack</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.4 }}>
                    Bitmap fonts optimized for small displays and low memory
                  </div>
                </div>
                
                {/* Public Asset Library */}
                <div style={{
                  padding: "16px",
                  background: "#1e2128",
                  border: "1px solid #2a2d36",
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <input type="checkbox" style={{ margin: 0 }} />
                    <span style={{ fontSize: "14px", fontWeight: "600" }}>🌐 Browse Public Assets</span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.4 }}>
                    Import community-created sprites, sounds, and code snippets
                  </div>
                </div>
              </div>
              
              {/* Import Options */}
              <div style={{
                padding: "16px",
                background: "#252832",
                border: "1px solid #2a2d36",
                borderRadius: "6px",
                marginBottom: "24px"
              }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600" }}>📁 Import Existing Assets</h4>
                <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                  <button style={{
                    ...buttonStyle,
                    padding: "6px 12px",
                    fontSize: "12px",
                    background: "#2b6cff"
                  }}>
                    📂 Import Folder
                  </button>
                  <button style={{
                    ...buttonStyle,
                    padding: "6px 12px",
                    fontSize: "12px"
                  }}>
                    🖼️ Import Images
                  </button>
                  <button style={{
                    ...buttonStyle,
                    padding: "6px 12px",
                    fontSize: "12px"
                  }}>
                    🎵 Import Audio
                  </button>
                </div>
                <div style={{ fontSize: "11px", color: "#888" }}>
                  Supported formats: PNG, JPG, GIF, BMP • WAV, MP3, OGG • TTF fonts
                </div>
              </div>
              
              {/* Project Summary */}
              <div style={{
                padding: "16px",
                background: "#1a1d23",
                border: "1px solid #2a2d36",
                borderRadius: "6px",
                marginBottom: "16px"
              }}>
                <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>📋 Project Summary</h4>
                <div style={{ fontSize: "12px", color: "#ccc", lineHeight: 1.5 }}>
                  <div><strong>Name:</strong> {projectName}</div>
                  <div><strong>Template:</strong> {selectedTemplate}</div>
                  <div><strong>Board:</strong> {availableBoards.find(b => b.id === selectedBoard)?.name}</div>
                  <div><strong>Location:</strong> {projectPath}/{projectName}</div>
                  <div style={{ marginTop: "8px" }}>
                    <strong>Features:</strong> {availableBoards.find(b => b.id === selectedBoard)?.wifi}, 
                    {availableBoards.find(b => b.id === selectedBoard)?.bluetooth?.classic && ' BT Classic'}
                    {availableBoards.find(b => b.id === selectedBoard)?.bluetooth?.le && ' BT LE'}
                    {availableBoards.find(b => b.id === selectedBoard)?.display && `, ${availableBoards.find(b => b.id === selectedBoard)?.display?.width}×${availableBoards.find(b => b.id === selectedBoard)?.display?.height} Display`}
                  </div>
                </div>
              </div>
              
              {/* Create Button */}
              <div style={{ textAlign: "center" }}>
                <button
                  onClick={onCreateProject}
                  disabled={!projectName || !projectPath || !selectedBoard || isCreatingProject}
                  style={{
                    ...buttonStyle,
                    background: isCreatingProject ? "#666" : "linear-gradient(135deg, #22cc22, #44dd44)",
                    border: "none",
                    padding: "16px 32px",
                    fontSize: "16px",
                    fontWeight: "600",
                    borderRadius: "8px",
                    opacity: (!projectName || !projectPath || !selectedBoard || isCreatingProject) ? 0.5 : 1,
                    cursor: (!projectName || !projectPath || !selectedBoard || isCreatingProject) ? "not-allowed" : "pointer"
                  }}
                >
                  {isCreatingProject ? "⏳ Creating..." : "🚀 Create Project with Assets"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer */}
        <div style={{
          padding: "16px 24px",
          background: "#252832",
          borderTop: "1px solid #2a2d36",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <button
            onClick={() => {
              const steps = ['setup', 'board', 'assets'] as ProjectCreationStep[];
              const currentIndex = steps.indexOf(projectCreationStep);
              if (currentIndex > 0) {
                setProjectCreationStep(steps[currentIndex - 1]);
              }
            }}
            disabled={projectCreationStep === 'setup'}
            style={{
              ...buttonStyle,
              opacity: projectCreationStep === 'setup' ? 0.5 : 1,
              cursor: projectCreationStep === 'setup' ? "not-allowed" : "pointer"
            }}
          >
            ← Back
          </button>
          
          <div style={{ fontSize: "12px", color: "#888" }}>
            Step {['setup', 'board', 'assets'].indexOf(projectCreationStep) + 1} of 3
          </div>
          
          {projectCreationStep !== 'assets' && (
            <button
              onClick={() => {
                const steps = ['setup', 'board', 'assets'] as ProjectCreationStep[];
                const currentIndex = steps.indexOf(projectCreationStep);
                const canProceed = 
                  (projectCreationStep === 'setup' && selectedTemplate && projectName && projectPath) ||
                  (projectCreationStep === 'board' && selectedBoard);
                
                if (canProceed && currentIndex < steps.length - 1) {
                  setProjectCreationStep(steps[currentIndex + 1]);
                }
              }}
              disabled={!(
                (projectCreationStep === 'setup' && selectedTemplate && projectName && projectPath) ||
                (projectCreationStep === 'board' && selectedBoard)
              )}
              style={{
                ...buttonStyle,
                background: "#2b6cff",
                opacity: !(
                  (projectCreationStep === 'setup' && selectedTemplate && projectName && projectPath) ||
                  (projectCreationStep === 'board' && selectedBoard)
                ) ? 0.5 : 1,
                cursor: !(
                  (projectCreationStep === 'setup' && selectedTemplate && projectName && projectPath) ||
                  (projectCreationStep === 'board' && selectedBoard)
                ) ? "not-allowed" : "pointer"
              }}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
