import React from 'react';

export interface InfiniteFocusButtonProps {
  spriteWidth: number;
  spriteHeight: number;
}

export const InfiniteFocusButton: React.FC<InfiniteFocusButtonProps> = ({ spriteWidth, spriteHeight }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // Get reference to the InfiniteCanvas focusView function
  const handleFocus = React.useCallback(() => {
    // Find the InfiniteCanvas component and call its focusView method
    // This is a placeholder - in a real implementation, you'd use refs or context
    // to communicate between components
    console.log('Focus button clicked', { spriteWidth, spriteHeight });
    
    // For now, just trigger a custom event that the InfiniteCanvas can listen to
    const focusEvent = new CustomEvent('infinite-canvas-focus', {
      detail: { spriteWidth, spriteHeight }
    });
    window.dispatchEvent(focusEvent);
  }, [spriteWidth, spriteHeight]);

  return (
    <button
      onClick={handleFocus}
      style={{
        padding: "8px 16px",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid #3a3d46",
        borderRadius: "6px",
        color: "#e6e6e6",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "500",
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: "6px"
      }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
      title="Focus and center the sprite in the viewport"
    >
      🎯 Focus
    </button>
  );
};
