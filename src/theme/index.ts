// Wisp Editor Theme System
// Provides universal design tokens and typography scales

export const theme = {
  // Font families
  fonts: {
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: '"Consolas", "Monaco", "Courier New", monospace',
    code: '"Fira Code", "SF Mono", Monaco, Inconsolata, "Roboto Mono", "Source Code Pro", monospace'
  },

  // Typography scale (similar to markdown H1-H6)
  typography: {
    // Headings
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '24px',
      fontWeight: '600', 
      lineHeight: '1.3',
      letterSpacing: '-0.01em'
    },
    h3: {
      fontSize: '20px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    h4: {
      fontSize: '18px',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    h5: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0'
    },
    h6: {
      fontSize: '14px',
      fontWeight: '600',
      lineHeight: '1.5',
      letterSpacing: '0'
    },
    
    // Body text
    body: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0'
    },
    bodyLarge: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0'
    },
    bodySmall: {
      fontSize: '12px',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    
    // UI elements
    button: {
      fontSize: '14px',
      fontWeight: '500',
      lineHeight: '1',
      letterSpacing: '0'
    },
    buttonSmall: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1',
      letterSpacing: '0'
    },
    buttonLarge: {
      fontSize: '16px',
      fontWeight: '600',
      lineHeight: '1',
      letterSpacing: '0'
    },
    
    // Input fields
    input: {
      fontSize: '14px',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    inputLarge: {
      fontSize: '16px',
      fontWeight: '500',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    
    // Code and monospace
    code: {
      fontSize: '13px',
      fontWeight: '400',
      lineHeight: '1.4',
      letterSpacing: '0'
    },
    codeSmall: {
      fontSize: '11px',
      fontWeight: '400',
      lineHeight: '1.3',
      letterSpacing: '0'
    },
    
    // Labels and captions
    label: {
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1.3',
      letterSpacing: '0'
    },
    caption: {
      fontSize: '11px',
      fontWeight: '400',
      lineHeight: '1.3',
      letterSpacing: '0.01em'
    },
    overline: {
      fontSize: '10px',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '0.1em',
      textTransform: 'uppercase' as const
    }
  },

  // Color palette
  colors: {
    // Backgrounds
    background: '#0f1115',
    surface: '#1a1d23',
    surfaceElevated: '#1e2128',
    surfaceAccent: '#252832',
    
    // Borders and dividers
    border: '#2a2d36',
    borderHover: '#3a3d46',
    borderActive: '#4a4d56',
    
    // Text colors
    text: {
      primary: '#e6e6e6',
      secondary: '#ccc',
      tertiary: '#999',
      disabled: '#666',
      inverse: '#0f1115'
    },
    
    // Interactive colors
    primary: '#2b6cff',
    primaryHover: '#4d8aff',
    primaryActive: '#1a5ce6',
    
    success: '#22cc22',
    successHover: '#44dd44',
    
    warning: '#ff8800',
    warningHover: '#ffaa33',
    
    error: '#ff4444',
    errorHover: '#ff6666',
    
    // Neutral variants
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },

  // Spacing scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
    '6xl': '64px'
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    '2xl': '12px',
    full: '9999px'
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    contextMenu: '0 4px 12px rgba(0, 0, 0, 0.3)'
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    tooltip: 1100,
    contextMenu: 1200
  },

  // Animation durations
  animation: {
    fast: '0.15s',
    normal: '0.2s',
    slow: '0.3s'
  }
} as const;

// Helper function to get typography styles
export const getTypographyStyle = (variant: keyof typeof theme.typography): React.CSSProperties => {
  const typography = theme.typography[variant];
  return {
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    fontFamily: theme.fonts.body,
    ...('textTransform' in (typography as any) ? { textTransform: (typography as any).textTransform } : {})
  };
};

// Helper function to get code typography styles
export const getCodeTypographyStyle = (variant: keyof typeof theme.typography = 'code'): React.CSSProperties => {
  const typography = theme.typography[variant];
  return {
    fontSize: typography.fontSize,
    fontWeight: typography.fontWeight,
    lineHeight: typography.lineHeight,
    letterSpacing: typography.letterSpacing,
    fontFamily: theme.fonts.code
  };
};

// Common component styles
export const componentStyles = {
  button: {
    base: {
      ...getTypographyStyle('button'),
      padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
      cursor: 'pointer',
      transition: `all ${theme.animation.normal} ease`,
      background: theme.colors.surfaceAccent,
      color: theme.colors.text.primary
    },
    primary: {
      background: theme.colors.primary,
      borderColor: theme.colors.primary,
      color: theme.colors.text.inverse
    },
    success: {
      background: theme.colors.success,
      borderColor: theme.colors.success,
      color: theme.colors.text.inverse
    }
  },
  
  input: {
    base: {
      ...getTypographyStyle('input'),
      padding: `${theme.spacing.sm} ${theme.spacing.md}`,
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
      background: theme.colors.surface,
      color: theme.colors.text.primary,
      fontFamily: theme.fonts.body
    }
  },
  
  panel: {
    base: {
      background: theme.colors.surface,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md
    },
    header: {
      ...getTypographyStyle('h6'),
      padding: `${theme.spacing.md} ${theme.spacing.lg}`,
      background: theme.colors.surfaceAccent,
      borderBottom: `1px solid ${theme.colors.border}`,
      color: theme.colors.text.primary
    }
  }
};

export type Theme = typeof theme;
export default theme;
