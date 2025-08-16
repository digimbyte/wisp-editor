import React from 'react';
import type { SpriteAsset } from '../../types';

interface SpriteInfoProps {
  sprite: SpriteAsset;
}

export const SpriteInfo: React.FC<SpriteInfoProps> = ({ sprite }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#e6e6e6' }}>Sprite Info</div>
      <div style={{ fontSize: '11px', color: '#ccc', lineHeight: 1.4 }}>
        <div><strong>Name:</strong> {sprite.name}</div>
        <div><strong>Size:</strong> {sprite.width}×{sprite.height}</div>
        <div><strong>Type:</strong> {sprite.type}</div>
        <div><strong>Frames:</strong> {sprite.frames}</div>
        {sprite.animationSpeed && <div><strong>Speed:</strong> {sprite.animationSpeed}fps</div>}
      </div>
    </div>
  );
};

