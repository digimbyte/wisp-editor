import React, { useEffect, useState } from 'react';
import ColorPickerLib from 'react-best-gradient-color-picker';

export type ColorTabType = 'picker' | 'custom' | 'common' | 'variations';

// Temporary shim to maintain compatibility while migrating to react-best-gradient-color-picker
// Accepts legacy props but ignores most, focusing on value/onChange if provided.
export interface ColorPickerProps {
  activeTab?: ColorTabType;
  setActiveTab?: (tab: ColorTabType) => void;
  showLutManager?: boolean;
  setShowLutManager?: (show: boolean) => void;
  onColorChange?: (color: { hex: string }) => void;
  hideChrome?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ value, onChange, onColorChange }) => {
  const [internal, setInternal] = useState<string>(value ?? '#FF0000');

  // keep internal state in sync with external value
  useEffect(() => {
    if (typeof value === 'string' && value !== internal) {
      setInternal(value);
    }
  }, [value]);

  const handleChange = (v: string) => {
    setInternal(v);
    onChange?.(v);
    // Bridge legacy onColorChange expecting {hex}
    onColorChange?.({ hex: v });
  };

  return (
    <ColorPickerLib
      value={value ?? internal}
      onChange={handleChange}
      className="wisp-gradient-color-picker"
    />
  );
};
