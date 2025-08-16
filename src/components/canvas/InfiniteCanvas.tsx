import React from 'react';

// Focus Button Component for InfiniteCanvas
interface InfiniteFocusButtonProps {
  spriteWidth: number;
  spriteHeight: number;
}

export const InfiniteFocusButton: React.FC<InfiniteFocusButtonProps> = ({ spriteWidth, spriteHeight }) => {
  // Get reference to the InfiniteCanvas focusView function
  const handleFocus = React.useCallback(() => {
    console.log('🎯 Focus button clicked!', { spriteWidth, spriteHeight });
    
    // Trigger a custom event that the InfiniteCanvas can listen to
    const focusEvent = new CustomEvent('infinite-canvas-focus', {
      detail: { spriteWidth, spriteHeight, timestamp: Date.now() }
    });
    window.dispatchEvent(focusEvent);
    
    // Also log to verify event was dispatched
    console.log('🎯 Focus event dispatched:', focusEvent.detail);
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

// Infinite Canvas Component for Sprite Editing
interface InfiniteCanvasProps {
  spriteWidth: number;
  spriteHeight: number;
  onPixelClick: (x: number, y: number) => void;
}

export const InfiniteCanvas: React.FC<InfiniteCanvasProps> = ({ spriteWidth, spriteHeight, onPixelClick }) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  
  // Canvas state
  const [zoom, setZoom] = React.useState(1); // Will be set by auto-focus
  const [panX, setPanX] = React.useState(0); // Will be set by auto-focus
  const [panY, setPanY] = React.useState(0); // Will be set by auto-focus
  const [isPanning, setIsPanning] = React.useState(false);
  const [lastMousePos, setLastMousePos] = React.useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  // Canvas dimensions
  const GRID_SIZE = 16; // Base grid size in pixels
  const MIN_ZOOM = 0.25;
  const MAX_ZOOM = 32;
  
  // Draw the infinite grid and sprite bounds
  const drawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Clear canvas
    ctx.fillStyle = '#1a1d23';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate sprite bounds - NO SNAPPING
    // Make sprite pixels much smaller - each sprite pixel should be 1/32 of the grid size
    // so a 32x32 sprite fits nicely in a single grid cell of 16px
        const spritePixelSize = zoom; // Each sprite pixel = 1px * zoom (1:1 with grid)
        // gridSpacing unused (computed implicitly via zoom)
    
    // Position sprite exactly where pan dictates - NO SNAPPING
    const worldCenterX = canvasWidth / 2 + panX;
    const worldCenterY = canvasHeight / 2 + panY;
    
    const spriteTotalWidth = spriteWidth * spritePixelSize;
    const spriteTotalHeight = spriteHeight * spritePixelSize;
    
    // Center the sprite exactly - NO SNAPPING
    const spriteBoundsX = worldCenterX - (spriteTotalWidth / 2);
    const spriteBoundsY = worldCenterY - (spriteTotalHeight / 2);
    
    // Draw finite grid (1024x1024 world) - FIXED AND CONSTRAINED
    ctx.strokeStyle = '#2a2d36';
    ctx.lineWidth = 0.5;
    
    const WORLD_SIZE_PIXELS = 1024; // 1024 pixel world
    const GRID_CELLS_PER_SIDE = WORLD_SIZE_PIXELS / GRID_SIZE; // 64 cells per side (1024/16)
    const scaledGridSize = GRID_SIZE * zoom;
    const scaledWorldSize = WORLD_SIZE_PIXELS * zoom;
    
    // Calculate world bounds in screen space
    const worldLeft = worldCenterX - scaledWorldSize / 2;
    const worldTop = worldCenterY - scaledWorldSize / 2;
    const worldRight = worldLeft + scaledWorldSize;
    const worldBottom = worldTop + scaledWorldSize;
    
    // Only draw if any part of the world is visible
    if (worldRight > 0 && worldLeft < canvasWidth && worldBottom > 0 && worldTop < canvasHeight) {
      // Draw exactly 65 vertical lines (64 cells + 1) and 65 horizontal lines
      for (let i = 0; i <= GRID_CELLS_PER_SIDE; i++) {
        const x = worldLeft + i * scaledGridSize;
        const y = worldTop + i * scaledGridSize;
        
        // Draw vertical line if visible
        if (x >= 0 && x <= canvasWidth) {
          ctx.beginPath();
          ctx.moveTo(x, Math.max(0, worldTop));
          ctx.lineTo(x, Math.min(canvasHeight, worldBottom));
          ctx.stroke();
        }
        
        // Draw horizontal line if visible
        if (y >= 0 && y <= canvasHeight) {
          ctx.beginPath();
          ctx.moveTo(Math.max(0, worldLeft), y);
          ctx.lineTo(Math.min(canvasWidth, worldRight), y);
          ctx.stroke();
        }
      }
    }
    
    // Sprite background (white)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(spriteBoundsX, spriteBoundsY, spriteTotalWidth, spriteTotalHeight);
    
    // Sprite border (thin red line)
    ctx.strokeStyle = '#ff4444';
    ctx.lineWidth = 2;
    ctx.strokeRect(spriteBoundsX, spriteBoundsY, spriteTotalWidth, spriteTotalHeight);
    
    // Draw sprite pixel grid if zoomed in enough (subdivisions within sprite)
    if (spritePixelSize >= 8) {
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 0.5;
      
      // Vertical lines for sprite pixels
      for (let x = 0; x <= spriteWidth; x++) {
        const lineX = spriteBoundsX + x * spritePixelSize;
        ctx.beginPath();
        ctx.moveTo(lineX, spriteBoundsY);
        ctx.lineTo(lineX, spriteBoundsY + spriteTotalHeight);
        ctx.stroke();
      }
      
      // Horizontal lines for sprite pixels
      for (let y = 0; y <= spriteHeight; y++) {
        const lineY = spriteBoundsY + y * spritePixelSize;
        ctx.beginPath();
        ctx.moveTo(spriteBoundsX, lineY);
        ctx.lineTo(spriteBoundsX + spriteTotalWidth, lineY);
        ctx.stroke();
      }
    }
    
    // Center crosshair removed per user request
  }, [zoom, panX, panY, spriteWidth, spriteHeight]);
  
  // Handle mouse wheel for zooming
  const handleWheel = React.useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    // Get mouse position relative to canvas
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate world position of mouse before zoom
    const worldX = (mouseX - rect.width / 2 - panX) / zoom;
    const worldY = (mouseY - rect.height / 2 - panY) / zoom;
    
    // Calculate new zoom
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom * zoomFactor));
    
    // Calculate new pan to keep mouse position consistent
    const newPanX = mouseX - rect.width / 2 - worldX * newZoom;
    const newPanY = mouseY - rect.height / 2 - worldY * newZoom;
    
    setZoom(newZoom);
    setPanX(newPanX);
    setPanY(newPanY);
  }, [zoom, panX, panY]);
  
  // Handle mouse down for panning
  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // Right click
      e.preventDefault();
      setIsPanning(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    } else if (e.button === 0) { // Left click for pixel editing
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // Convert to world coordinates
      const worldX = mouseX - panX;
      const worldY = mouseY - panY;
      
      // Calculate sprite bounds in world space (same logic as drawing)
      const spritePixelSize = GRID_SIZE * zoom;
      const gridSpacing = GRID_SIZE * zoom;
      
      const worldCenterX = rect.width / 2 + panX;
      const worldCenterY = rect.height / 2 + panY;
      
      const spriteTotalWidth = spriteWidth * spritePixelSize;
      const spriteTotalHeight = spriteHeight * spritePixelSize;
      
      const spriteCenterX = worldCenterX - (spriteTotalWidth / 2);
      const spriteCenterY = worldCenterY - (spriteTotalHeight / 2);
      
      // Snap to 16px grid
      const spriteBoundsX = Math.round(spriteCenterX / gridSpacing) * gridSpacing;
      const spriteBoundsY = Math.round(spriteCenterY / gridSpacing) * gridSpacing;
      
      // Check if click is within sprite bounds
      const relativeX = worldX - spriteBoundsX;
      const relativeY = worldY - spriteBoundsY;
      
      if (relativeX >= 0 && relativeX < spriteTotalWidth &&
          relativeY >= 0 && relativeY < spriteTotalHeight) {
        const pixelX = Math.floor(relativeX / spritePixelSize);
        const pixelY = Math.floor(relativeY / spritePixelSize);
        onPixelClick(pixelX, pixelY);
      }
    }
  }, [zoom, panX, panY, spriteWidth, spriteHeight, onPixelClick]);
  
  // Handle mouse move for panning
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      // Update pan directly with mouse delta (1:1 movement)
      setPanX(prev => prev + deltaX);
      setPanY(prev => prev + deltaY);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, lastMousePos]);
  
  // Handle mouse up
  const handleMouseUp = React.useCallback(() => {
    setIsPanning(false);
  }, []);
  
  // Handle context menu
  const handleContextMenu = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);
  
  // Focus view function - dynamically fits sprite to canvas with margins
  const focusView = React.useCallback(() => {
    console.log('🎯 focusView called for sprite:', spriteWidth, 'x', spriteHeight);
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.warn('❌ Canvas ref not available for focus');
      return;
    }
    
    const rect = canvas.getBoundingClientRect();
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    console.log('📐 Canvas dimensions:', canvasWidth, 'x', canvasHeight);
    
    // Target the sprite to use about 60% of the smaller canvas dimension
    // This ensures nice margins while being clearly visible
    const smallerDimension = Math.min(canvasWidth, canvasHeight);
    const targetSpriteScreenSize = smallerDimension * 0.6;
    
    // Calculate zoom based on the larger sprite dimension to ensure it fits
    const largerSpriteDimension = Math.max(spriteWidth, spriteHeight);
    let targetZoom = targetSpriteScreenSize / largerSpriteDimension;
    
    // For very small sprites, apply reasonable minimum zoom for visibility
    if (spriteWidth <= 16 && spriteHeight <= 16) {
      targetZoom = Math.max(targetZoom, 16); // At least 16x zoom for very tiny sprites
    } else if (spriteWidth <= 32 && spriteHeight <= 32) {
      targetZoom = Math.max(targetZoom, 12); // At least 12x zoom for small sprites  
    } else if (spriteWidth <= 64 && spriteHeight <= 64) {
      targetZoom = Math.max(targetZoom, 8); // At least 8x zoom for medium sprites
    }
    
    // Clamp zoom to our limits
    targetZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom));
    
    // Center the sprite perfectly in the viewport
    // According to drawCanvas: worldCenterX = canvasWidth / 2 + panX
    // For perfect centering, we want worldCenterX = canvasWidth / 2
    // Therefore: canvasWidth / 2 + panX = canvasWidth / 2 → panX = 0
    const targetPanX = 0;
    const targetPanY = 0;
    
    // Calculate actual sprite screen size with the target zoom
    const actualSpriteScreenWidth = spriteWidth * targetZoom;
    const actualSpriteScreenHeight = spriteHeight * targetZoom;
    
    console.log('🎯 Focus calculations:');
    console.log('   - Smaller canvas dimension:', smallerDimension);
    console.log('   - Target sprite screen size:', targetSpriteScreenSize.toFixed(1), 'px');
    console.log('   - Larger sprite dimension:', largerSpriteDimension, 'px');
    console.log('   - Target zoom:', targetZoom.toFixed(2));
    console.log('   - Actual sprite screen size:', actualSpriteScreenWidth.toFixed(1), 'x', actualSpriteScreenHeight.toFixed(1));
    console.log('   - Canvas utilization:', ((actualSpriteScreenWidth / canvasWidth) * 100).toFixed(1) + '%', 'x', ((actualSpriteScreenHeight / canvasHeight) * 100).toFixed(1) + '%');
    console.log('   - Pan offset:', targetPanX, targetPanY);
    
    // Apply the new zoom and pan
    setZoom(targetZoom);
    setPanX(targetPanX);
    setPanY(targetPanY);
    
    console.log('✅ Focus view applied successfully');
  }, [spriteWidth, spriteHeight, MIN_ZOOM, MAX_ZOOM]);
  
  // Auto-focus on initial load and when sprite dimensions change
  React.useEffect(() => {
    if (!isInitialized) {
      // Small delay to ensure canvas is properly sized
      const timer = setTimeout(() => {
        focusView();
        setIsInitialized(true);
      }, 100);
      
      return () => clearTimeout(timer);
    } else {
      // Re-focus when sprite dimensions change (for dynamic fitting)
      focusView();
    }
  }, [isInitialized, focusView, spriteWidth, spriteHeight]);
  
  // Redraw canvas when properties change
  React.useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);
  
  // Set up resize observer
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeObserver = new ResizeObserver(() => {
      drawCanvas();
    });
    
    resizeObserver.observe(canvas);
    
    return () => {
      resizeObserver.disconnect();
    };
  }, [drawCanvas]);
  
  // Handle global mouse events for panning
  React.useEffect(() => {
    if (isPanning) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - lastMousePos.x;
        const deltaY = e.clientY - lastMousePos.y;
        
        setPanX(prev => prev + deltaX);
        setPanY(prev => prev + deltaY);
        setLastMousePos({ x: e.clientX, y: e.clientY });
      };
      
      const handleGlobalMouseUp = () => {
        setIsPanning(false);
      };
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isPanning, lastMousePos]);
  
  // Listen for focus events from InfiniteFocusButton
  React.useEffect(() => {
    const handleFocusEvent = (event: CustomEvent) => {
      console.log('📡 InfiniteCanvas received focus event:', event.detail);
      console.log('📡 Current sprite dimensions:', spriteWidth, 'x', spriteHeight);
      
      // Verify the sprite dimensions match to ensure this is the right canvas
      if (event.detail.spriteWidth === spriteWidth && event.detail.spriteHeight === spriteHeight) {
        console.log('✅ Dimensions match, triggering focus view');
        focusView();
      } else {
        console.log('⚠️ Dimensions do not match, ignoring event');
      }
    };
    
    console.log('🔍 Setting up focus event listener for sprite:', spriteWidth, 'x', spriteHeight);
    window.addEventListener('infinite-canvas-focus', handleFocusEvent as EventListener);
    
    return () => {
      console.log('🧽 Cleaning up focus event listener for sprite:', spriteWidth, 'x', spriteHeight);
      window.removeEventListener('infinite-canvas-focus', handleFocusEvent as EventListener);
    };
  }, [spriteWidth, spriteHeight, focusView]);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        width: "100%", 
        height: "100%", 
        position: "relative",
        overflow: "hidden",
        cursor: isPanning ? 'grabbing' : 'default'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          imageRendering: "pixelated" as const
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onContextMenu={handleContextMenu}
      />
      
      {/* Zoom indicator */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        left: "16px",
        background: "rgba(42, 45, 54, 0.9)",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #3a3d46",
        color: "#e6e6e6",
        fontSize: "12px",
        fontWeight: "500",
        userSelect: "none",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
      }}>
        {Math.round(zoom * 100)}% • {spriteWidth}×{spriteHeight}px • Grid: {GRID_SIZE}px
      </div>
      
      {/* Instructions */}
      <div style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        background: "rgba(42, 45, 54, 0.9)",
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #3a3d46",
        color: "#e6e6e6",
        fontSize: "11px",
        userSelect: "none",
        backdropFilter: "blur(8px)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        maxWidth: "200px",
        lineHeight: "1.3"
      }}>
        <div style={{ marginBottom: "4px", fontWeight: "600" }}>Controls:</div>
        <div>• Scroll to zoom</div>
        <div>• Right-click + drag to pan</div>
        <div>• Left-click to paint pixels</div>
        <div>• 16px base grid system</div>
      </div>
    </div>
  );
};
