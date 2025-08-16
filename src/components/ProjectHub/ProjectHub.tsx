import React from 'react';
import { AppLogo, LogoFallback } from '../common/AppLogo';
import { RecentProject } from '../../services/config';

interface ProjectHubProps {
  packageVersion: string;
  onStartProjectWizard: (template?: string) => void;
  onOpenExistingProject: () => void;
  recentProjects: RecentProject[];
  onOpenProject: (projectPath: string) => Promise<void>;
  onRemoveRecentProject: (projectPath: string, e: React.MouseEvent) => Promise<void>;
  formatLastOpened: (lastOpened: string) => string;
}

export const ProjectHub: React.FC<ProjectHubProps> = ({
  packageVersion,
  onStartProjectWizard,
  onOpenExistingProject,
  recentProjects,
  onOpenProject,
  onRemoveRecentProject,
  formatLastOpened
}) => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "#0f1115",
      color: "#e6e6e6",
      display: "flex",
      flexDirection: "column",
      fontFamily: "system-ui, sans-serif",
      overflow: "hidden"
    }}>
      {/* Project Hub Header */}
      <div style={{
        height: "60px",
        background: "#181b20",
        borderBottom: "1px solid #2a2d36",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <AppLogo size={32} />
            <LogoFallback size={32} />
          </div>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#ffffff" }}>Wisp Editor</div>
            <div style={{ fontSize: "12px", color: "#888" }}>v{packageVersion}</div>
          </div>
        </div>
      </div>

      {/* Project Hub Content */}
      <div style={{ flex: 1, display: "flex" }}>
        
        {/* Left Side - Actions */}
        <div style={{ 
          width: "400px", 
          padding: "40px", 
          borderRight: "1px solid #2a2d36",
          display: "flex",
          flexDirection: "column",
          gap: "20px"
        }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "600" }}>Get Started</h2>
            <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>Create a new project or open an existing one</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={() => onStartProjectWizard()}
              style={{
                padding: "16px 20px",
                background: "linear-gradient(135deg, #2b6cff, #4d8aff)",
                border: "none",
                borderRadius: "8px",
                color: "#ffffff",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "flex-start"
              }}
            >
              <div style={{ position: "relative" }}>
                <AppLogo size={20} />
                <LogoFallback size={20} />
              </div>
              <div style={{ textAlign: "left" }}>
                <div>New Project</div>
                <div style={{ fontSize: "12px", opacity: 0.8, fontWeight: "normal" }}>Create a new Wisp project</div>
              </div>
            </button>

            <button
              onClick={onOpenExistingProject}
              style={{
                padding: "16px 20px",
                background: "#1d2330",
                border: "1px solid #2a3348",
                borderRadius: "8px",
                color: "#e6e6e6",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                justifyContent: "flex-start"
              }}
            >
              <span style={{ fontSize: "20px" }}>📁</span>
              <div style={{ textAlign: "left" }}>
                <div>Open Project</div>
                <div style={{ fontSize: "12px", opacity: 0.8, fontWeight: "normal" }}>Open an existing project folder</div>
              </div>
            </button>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "600" }}>Project Templates</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "2D Platformer", desc: "Side-scrolling game with physics", icon: "🏃" },
                { name: "Top-down Shooter", desc: "Arcade-style space shooter", icon: "🚀" },
                { name: "Menu System", desc: "UI-focused project template", icon: "📱" },
                { name: "Empty Project", desc: "Start from scratch", icon: "📄" }
              ].map(template => (
                <button
                  key={template.name}
                  onClick={() => onStartProjectWizard(template.name)}
                  style={{
                    padding: "12px 16px",
                    background: "transparent",
                    border: "1px solid #2a2d36",
                    borderRadius: "6px",
                    color: "#e6e6e6",
                    cursor: "pointer",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    justifyContent: "flex-start",
                    textAlign: "left"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#1d2330"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <span style={{ fontSize: "16px" }}>{template.icon}</span>
                  <div>
                    <div style={{ fontWeight: "500" }}>{template.name}</div>
                    <div style={{ fontSize: "12px", color: "#888" }}>{template.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Recent Projects */}
        <div style={{ flex: 1, padding: "40px" }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "600" }}>Recent Projects</h2>
            <p style={{ margin: "0 0 24px 0", color: "#888", fontSize: "14px" }}>Continue working on your recent projects</p>
          </div>

          {recentProjects.length === 0 ? (
            <div style={{
              textAlign: "center",
              color: "#666",
              fontSize: "14px",
              padding: "40px",
              border: "2px dashed #2a2d36",
              borderRadius: "8px"
            }}>
              No recent projects\nCreate or open a project to get started
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {recentProjects.map((project, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <button
                    onClick={() => onOpenProject(project.path)}
                    style={{
                      padding: "16px 20px",
                      background: "transparent",
                      border: "1px solid #2a2d36",
                      borderRadius: "8px",
                      color: "#e6e6e6",
                      cursor: "pointer",
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      justifyContent: "flex-start",
                      textAlign: "left",
                      width: "100%"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#1d2330"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div style={{
                      width: "48px",
                      height: "48px",
                      background: "#2a2d36",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative"
                    }}>
                      <AppLogo size={28} />
                      <LogoFallback size={28} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>{project.name}</div>
                      <div style={{ fontSize: "12px", color: "#888", wordBreak: "break-all" }}>{project.path}</div>
                      <div style={{ fontSize: "11px", color: "#666", marginTop: "2px" }}>Last opened: {formatLastOpened(project.lastOpened)}</div>
                      {project.template && <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>Template: {project.template}</div>}
                    </div>
                  </button>
                  <button
                    onClick={(e) => onRemoveRecentProject(project.path, e)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: "#ff4444",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "12px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.7
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0.7"}
                    title="Remove from recent projects"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div style={{
            marginTop: "32px",
            padding: "20px",
            background: "#1a1d23",
            border: "1px solid #2a2d36",
            borderRadius: "8px"
          }}>
            <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600" }}>💡 Quick Tip</h4>
            <p style={{ margin: 0, fontSize: "13px", color: "#888", lineHeight: 1.5 }}>
              Wisp projects are ESP32-optimized with ECS architecture for maximum performance.
              Use the Layout workspace for visual design and Systems for code management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
