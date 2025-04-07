import React, { forwardRef, JSX, useEffect, useRef, useState } from 'react';
import { useIconManagerContext } from '../../context/IconManagerProvider';
import { FixedSizeList as List } from 'react-window';
import IconComponent from '../IconComponent';


const OuterContainer = forwardRef<HTMLDivElement, any>(({ children, ...rest}, ref) => (
  <div ref={ref} {...rest} className="icon-box" id="icon-box">
    {children}
  </div>
));


const InnerContainer = forwardRef<HTMLDivElement, any>(({ children, style, ...rest }, ref) => (
  <div ref={ref} {...rest} className="icon-section" id="icon-section" style={style}>
    {children}
  </div>
));


const IconList = (): JSX.Element => {
  const { icons, backgroundColor, currentIconColor } = useIconManagerContext();


  useEffect(() => {
    document.documentElement.style.setProperty('--icon-caption-color', currentIconColor);
  }, [currentIconColor])
  
  const ICONS_PER_ROW = 9;

  const rows = icons.flatMap((chunk) => {
    const title = chunk.find((icon) => !icon.id);
    const iconList = chunk.filter((icon) => icon.id);
    const groupedIcons = [];

    for (let i = 0; i < iconList.length; i += ICONS_PER_ROW) {
      groupedIcons.push(iconList.slice(i, i + ICONS_PER_ROW)); 
    }
    return title ? [{ title }, ...groupedIcons] : groupedIcons; 
  });


  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const row = rows[index];
    if ('title' in row) {
      return (
        <h2 className="category-title" style={style} dangerouslySetInnerHTML={{ __html: row.title.html }} />
      );
    }

    return (
      <div className="icon-row" style={style}>
        {row.map((icon) => (
          <IconComponent key={icon.id} icon={icon}></IconComponent>
        ))}
      </div>
      
    );
  };

  return (
    <List
      height={1000} 
      itemCount={rows.length} 
      itemSize={100} 
      width="100%" 
      outerElementType={OuterContainer}
      innerElementType={InnerContainer}
      style={{backgroundColor: `${backgroundColor}`}}
    >
      {Row}
    </List>
    
  );
}

export default IconList;