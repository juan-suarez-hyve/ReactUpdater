import svgToTinyDataUri from "mini-svg-data-uri";
import React, { useEffect, useState } from "react";
import { JSX } from "react";
import { useIconManagerContext } from "../../context/IconManagerProvider";
import starIcon from '../../img-fav/star.svg';
import starIconSelected from '../../img-fav/star-selected.svg';
interface IconProps {
    icon: Icon
}

const IconComponent = ({ icon }: IconProps): JSX.Element => {

    const { favorites, toggleFavorite, currentIconColor } = useIconManagerContext()
    const [ container ] = useState(document.getElementById(`icon-${icon.id}`))
    const [ svgElement ] = useState(container?.querySelector('svg'))
    const [ IconHtml, setIconHtml ] = useState(icon.html.replace(new RegExp('#000000', 'g'), currentIconColor))
    
    useEffect(() => {
        const tempContainer = document.createElement('div');
            tempContainer.innerHTML = IconHtml;
            
            const captionElement = tempContainer.querySelector('.caption');
            if (captionElement instanceof HTMLElement) {
                captionElement.style.color = currentIconColor;
            }
        setIconHtml(tempContainer.innerHTML)
    })

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        if (svgElement) {
          const dataURL = svgToTinyDataUri(svgElement.outerHTML);
          const link = document.createElement('a');
          link.href = dataURL;
          link.download = `${icon.id}.svg`;
          link.click();
        }
    };
    
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const fileName = icon.id;

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'copy';
        }

        if (!fileName || !svgElement) {
            console.log("Error: Missing data");
            return;
        }

        window.electronAPI.send('ondragstart', fileName, svgElement.outerHTML);
    };
    
    return (
        <div
            id={`icon-${icon.id}`}
            className="icon"
            data-id={icon.id}
            draggable={true}
            onClick={handleClick}
            onDragStart={handleDragStart}
        >
            <div dangerouslySetInnerHTML={{ __html: IconHtml }} />
            <button
            className="favorite"
            onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(icon.id)
            }}
            >
            <img
                src={
                favorites.includes(icon.id)
                ? starIconSelected
                : starIcon
                
                }
                alt="Favorite"
            />
            </button>
        </div>
    );
}

export default IconComponent;