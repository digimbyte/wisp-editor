import React from 'react';

interface AppLogoProps {
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 32, className = "" }) => {
  return (
    <img 
      src="/icon.png" 
      alt="Wisp Editor" 
      width={size} 
      height={size} 
      className={className}
      style={{
        borderRadius: Math.max(2, size * 0.15) + "px",
        objectFit: "contain",
        imageRendering: "crisp-edges" as const
      }}
      onError={(e) => {
        // Fallback to emoji if image fails to load
        console.warn('Logo failed to load, using fallback');
        e.currentTarget.style.display = 'none';
        const fallback = e.currentTarget.nextElementSibling as HTMLElement;
        if (fallback) fallback.style.display = 'flex';
      }}
    />
  );
};

interface LogoFallbackProps {
  size?: number;
}

export const LogoFallback: React.FC<LogoFallbackProps> = ({ size = 32 }) => {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      background: "linear-gradient(135deg, #2b6cff, #4d8aff)",
      borderRadius: Math.max(2, size * 0.15) + "px",
      display: "none",
      alignItems: "center",
      justifyContent: "center",
      fontSize: `${Math.max(12, size * 0.5)}px`,
      color: "#ffffff",
      fontWeight: "bold"
    }}>⚡</div>
  );
};
