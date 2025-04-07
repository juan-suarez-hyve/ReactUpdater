import React, { JSX } from 'react';
import { useIconManagerContext } from '../../context/IconManagerProvider';

const FavoritesToggle = (): JSX.Element => {
  const { showFavorites, setShowFavorites } = useIconManagerContext();
  return (
    <div id="header-buttons">
      <label className="switch">
        <input id="favorites-toggle" type="checkbox" onClick={(e) => setShowFavorites(!showFavorites)}/>
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default FavoritesToggle;