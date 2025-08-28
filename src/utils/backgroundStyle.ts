import React from 'react';

export function getBackgroundStyle(background: string): React.CSSProperties {
  if (background.startsWith('data:image')) {
    return {
      backgroundImage: `url(${background})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }
  return { backgroundColor: background };
}
