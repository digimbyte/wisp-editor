import React, { createContext, useContext, useMemo, useState } from 'react';

export type ColorTab = 'picker' | 'custom' | 'common' | 'variations';

interface RightPanelState {
  activeColorTab: ColorTab;
  setActiveColorTab: (tab: ColorTab) => void;
  showLutManager: boolean;
  setShowLutManager: (v: boolean) => void;
  selectedColor: string;
  setSelectedColor: (hex: string) => void;
}

const Ctx = createContext<RightPanelState | null>(null);

export const RightPanelProvider: React.FC<{ children: React.ReactNode }>
  = ({ children }) => {
  const [activeColorTab, setActiveColorTab] = useState<ColorTab>('picker');
  const [showLutManager, setShowLutManager] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FF0000');

  const value = useMemo(() => ({
    activeColorTab,
    setActiveColorTab,
    showLutManager,
    setShowLutManager,
    selectedColor,
    setSelectedColor,
  }), [activeColorTab, showLutManager, selectedColor]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useRightPanel() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useRightPanel must be used within RightPanelProvider');
  return ctx;
}

