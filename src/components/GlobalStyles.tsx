import React, { useEffect } from 'react';
import { theme } from '../theme';

export const GlobalStyles: React.FC = () => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Global base styles */
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        font-family: ${theme.fonts.body};
        box-sizing: border-box;
      }
      
      body {
        font-family: ${theme.fonts.body};
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.body.fontWeight};
        line-height: ${theme.typography.body.lineHeight};
        color: ${theme.colors.text.primary};
        background-color: ${theme.colors.background};
        margin: 0;
        padding: 0;
      }
      
      /* Form elements */
      input, textarea, [contenteditable="true"] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
        font-family: inherit;
      }
      
      /* Typography scale */
      h1 {
        font-size: ${theme.typography.h1.fontSize};
        font-weight: ${theme.typography.h1.fontWeight};
        line-height: ${theme.typography.h1.lineHeight};
        letter-spacing: ${theme.typography.h1.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      h2 {
        font-size: ${theme.typography.h2.fontSize};
        font-weight: ${theme.typography.h2.fontWeight};
        line-height: ${theme.typography.h2.lineHeight};
        letter-spacing: ${theme.typography.h2.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      h3 {
        font-size: ${theme.typography.h3.fontSize};
        font-weight: ${theme.typography.h3.fontWeight};
        line-height: ${theme.typography.h3.lineHeight};
        letter-spacing: ${theme.typography.h3.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      h4 {
        font-size: ${theme.typography.h4.fontSize};
        font-weight: ${theme.typography.h4.fontWeight};
        line-height: ${theme.typography.h4.lineHeight};
        letter-spacing: ${theme.typography.h4.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      h5 {
        font-size: ${theme.typography.h5.fontSize};
        font-weight: ${theme.typography.h5.fontWeight};
        line-height: ${theme.typography.h5.lineHeight};
        letter-spacing: ${theme.typography.h5.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      h6 {
        font-size: ${theme.typography.h6.fontSize};
        font-weight: ${theme.typography.h6.fontWeight};
        line-height: ${theme.typography.h6.lineHeight};
        letter-spacing: ${theme.typography.h6.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      p {
        font-size: ${theme.typography.body.fontSize};
        font-weight: ${theme.typography.body.fontWeight};
        line-height: ${theme.typography.body.lineHeight};
        letter-spacing: ${theme.typography.body.letterSpacing};
        margin: 0;
        color: ${theme.colors.text.primary};
      }
      
      code, pre {
        font-family: ${theme.fonts.code};
        font-size: ${theme.typography.code.fontSize};
        background: ${theme.colors.surfaceElevated};
        border: 1px solid ${theme.colors.border};
        border-radius: ${theme.borderRadius.sm};
      }
      
      code {
        padding: 2px 4px;
      }
      
      pre {
        padding: ${theme.spacing.md};
        overflow-x: auto;
      }

      /* Context menu animations */
      .context-menu {
        animation: contextMenuFadeIn ${theme.animation.fast} ease-out;
        transform-origin: top left;
        box-shadow: ${theme.shadows.contextMenu};
      }

      @keyframes contextMenuFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      .context-menu-item { 
        transition: background-color ${theme.animation.normal} ease;
      }
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
