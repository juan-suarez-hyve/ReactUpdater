import React, { useState, useEffect, useContext, JSX, createContext} from 'react';
import iconsData from '../data/icon-library.json';
import FuzzySearch from 'fuzzy-search';

interface IconManagerContextType {
  icons: Icon[][],
  filteredIcons: Icon[][],
  favorites: string[],
  filter: string,
  showFavorites: boolean,
  currentIconColor: string,
  backgroundColor: string,
  chunkIcons: (icons: Icon[], chunkSize: number) => Icon[][]
  toggleFavorite: (id: string) => void
  setShowFavorites: (value:boolean) => void
  setFilter: (value: string) => void
  handleChangeColor: (newColor:string) => void
}

const IconManagerContext = createContext<IconManagerContextType | null>(null);

export const IconManagerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [icons, setIcons] = useState([]);
  const [filteredIcons, setFilteredIcons] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filter, setFilter] = useState('');
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentIconColor, setCurrentIconColor] = useState('#000000')
  const [ backgroundColor, setBackgroundColor ] = useState('')

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(storedFavorites)
    const storeCurrentIconColor = JSON.parse(localStorage.getItem('CurrentIconColor') || '"#000000"')
    setCurrentIconColor(storeCurrentIconColor) 
  }, []);
 

  useEffect(() => {
    const allIcons = Object.values(iconsData).filter(icon => icon.html) as Icon[];
    const filtered = filter ? new FuzzySearch(allIcons, ['name', 'tags']).search(filter) : allIcons;
    const favoriteIcons = filtered.filter(icon => favorites.includes(icon.id));
    const chunkedIcons = chunkIcons(showFavorites ? favoriteIcons : filtered);
    setFilteredIcons(chunkedIcons);
  }, [filter, showFavorites, favorites]);

  useEffect(() => {
    setBackgroundColor(GetBackGroundColor(currentIconColor)) 
  }, [currentIconColor])

  const chunkIcons = (icons: Icon[], chunkSize = 9): Icon[][] => {
    const chunks: Icon[][] = [];
    for (let i = 0; i < icons.length; i += chunkSize) {
      chunks.push(icons.slice(i, i + chunkSize));
    }
    return chunks;
  }

  const toggleFavorite = (id: string): void => {
    console.log(id)
    const updatedFavorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  }
  
  const handleChangeColor = (newColor:string): void=> {
    setCurrentIconColor(newColor)
    localStorage.setItem('CurrentIconColor', JSON.stringify(newColor));
  }

  const lightCalculator = (colorHex:string):number => {
    const r = parseInt(colorHex.substring(1, 3), 16) / 255;
    const g = parseInt(colorHex.substring(3, 5), 16) / 255;
    const b = parseInt(colorHex.substring(5, 7), 16) / 255;
  
    const luminosidad = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminosidad;
  }

  const GetBackGroundColor = (colorHex:string):string => {
    const luminosidad = lightCalculator(colorHex);
    return luminosidad > 0.5 ? '#333333' : '#FFFFFF'; // Fondo oscuro para íconos claros, fondo claro para íconos oscuros
  }

  return (
    <IconManagerContext.Provider 
    value={{
      icons:filteredIcons, 
      filteredIcons, 
      filter, 
      showFavorites,  
      favorites, 
      currentIconColor,
      backgroundColor,
      handleChangeColor,
      toggleFavorite,
      chunkIcons, 
      setShowFavorites,
      setFilter
    }}
    >
      {children}
    </IconManagerContext.Provider>
    
  );
}

export const useIconManagerContext = (): IconManagerContextType => {
  const context = useContext(IconManagerContext)
  if (context == null) {
    throw new Error('useDebugMode must use on DebugModeProvider')
  }
  return context
}