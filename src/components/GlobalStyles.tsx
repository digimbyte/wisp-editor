import React, { useEffect } from 'react';

export const GlobalStyles: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }

      /* Context menu animations */
      .context-menu {
        animation: contextMenuFadeIn 0.15s ease-out;
        transform-origin: top left;
      }

      @keyframes contextMenuFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      .context-menu-item { transition: background-color 0.1s ease; }
    `;
    document.head.appendChild(style);

    const handleGlobalContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const hasCustomContextMenu = target.closest('[data-context-menu="true"]');
      if (!hasCustomContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      return true;
    };

    document.addEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
    return () => {
      document.head.removeChild(style);
      document.removeEventListener('contextmenu', handleGlobalContextMenu, { capture: true });
    };
  }, []);

  return null;
};
