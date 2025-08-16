import React from 'react';
import type { AudioAsset } from '../../types';

interface AudioWorkspaceProps {
  audioAssets: AudioAsset[];
  selectedAudio: string;
  onAudioSelect: (id: string) => void;
  buttonStyle: React.CSSProperties;
}

export function AudioWorkspace({
  audioAssets: _audioAssets,
  selectedAudio: _selectedAudio,
  onAudioSelect: _onAudioSelect,
  buttonStyle
}: AudioWorkspaceProps) {
  return (
    <div style={{ height: "100%", display: "flex" }}>
      {/* Audio List */}
      <div style={{ width: "300px", borderRight: "1px solid #2a2d36", padding: "16px" }}>
        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0, fontSize: "16px" }}>Audio Assets</h3>
          <button style={{ ...buttonStyle, padding: "4px 8px", fontSize: "11px" }}>+ Add</button>
        </div>
        
        {/* Music Section */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "600", marginBottom: "8px", fontSize: "14px", color: "#e6e6e6" }}>🎵 Music</div>
          <div style={{ paddingLeft: "12px" }}>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>🎼 Main Theme</div>
              <div style={{ fontSize: "11px", color: "#888" }}>2:45 • 44.1kHz • Stereo</div>
            </div>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>🎼 Battle Music</div>
              <div style={{ fontSize: "11px", color: "#888" }}>1:30 • 44.1kHz • Stereo</div>
            </div>
          </div>
        </div>
        
        {/* Sound Effects Section */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontWeight: "600", marginBottom: "8px", fontSize: "14px", color: "#e6e6e6" }}>🔊 Sound Effects</div>
          <div style={{ paddingLeft: "12px" }}>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>💥 Explosion</div>
              <div style={{ fontSize: "11px", color: "#888" }}>0:02 • 44.1kHz • Mono</div>
            </div>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>⚔️ Sword Clash</div>
              <div style={{ fontSize: "11px", color: "#888" }}>0:01 • 44.1kHz • Mono</div>
            </div>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>🚶 Footsteps</div>
              <div style={{ fontSize: "11px", color: "#888" }}>0:05 • 44.1kHz • Mono</div>
            </div>
          </div>
        </div>
        
        {/* Voice Section */}
        <div>
          <div style={{ fontWeight: "600", marginBottom: "8px", fontSize: "14px", color: "#e6e6e6" }}>🗣️ Voice</div>
          <div style={{ paddingLeft: "12px" }}>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>🎭 Game Over</div>
              <div style={{ fontSize: "11px", color: "#888" }}>0:03 • 22kHz • Mono</div>
            </div>
            <div style={{ 
              padding: "8px 12px", 
              marginBottom: "4px", 
              background: "#252832", 
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px"
            }}>
              <div style={{ fontWeight: "600", marginBottom: "4px" }}>🏆 Victory</div>
              <div style={{ fontSize: "11px", color: "#888" }}>0:02 • 22kHz • Mono</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Audio Editor */}
      <div style={{ flex: 1, padding: "16px" }}>
        <div style={{ fontSize: "14px", color: "#888" }}>Select an audio asset to preview and edit its properties...</div>
        
        {/* Audio Controls */}
        <div style={{
          marginTop: "20px",
          padding: "16px",
          background: "#252832",
          border: "1px solid #2a2d36",
          borderRadius: "6px"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>🎵 Audio Preview</div>
          
          {/* Waveform placeholder */}
          <div style={{
            height: "80px",
            background: "#1a1d23",
            border: "1px solid #2a2d36",
            borderRadius: "4px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#666",
            fontSize: "12px"
          }}>
            [Waveform visualization would appear here]
          </div>
          
          {/* Control buttons */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
            <button style={{ ...buttonStyle, background: "#22cc22" }}>▶️ Play</button>
            <button style={buttonStyle}>⏸️ Pause</button>
            <button style={buttonStyle}>⏹️ Stop</button>
            <button style={buttonStyle}>🔄 Loop</button>
          </div>
          
          {/* Volume and settings */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Volume</label>
              <input type="range" min="0" max="100" defaultValue="100" style={{ width: "100%" }} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "12px" }}>Pan</label>
              <input type="range" min="-100" max="100" defaultValue="0" style={{ width: "100%" }} />
            </div>
          </div>
        </div>
        
        {/* Drag and drop area */}
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          border: "2px dashed #2a2d36", 
          borderRadius: "8px",
          textAlign: "center",
          color: "#888"
        }}>
          Drag & Drop Audio Files Here\nSupported: WAV, MP3, OGG
        </div>
      </div>
    </div>
  );
}
