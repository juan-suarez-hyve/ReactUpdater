import React, { CSSProperties, JSX, useState } from 'react';
import { SketchPicker, ChromePicker } from 'react-color';
import { useIconManagerContext } from '../../context/IconManagerProvider';


const ColorPicker = () => {
  const [ displayColor, setDisplayColor ] = useState(false)
  const { currentIconColor, handleChangeColor } = useIconManagerContext()

  const ChangeColor = (newColor:any) => {
    handleChangeColor(newColor.hex)
  }
  const handleShowChrome = ():void => {
    setDisplayColor(!displayColor)
  }
  const handleClose = (): void => {
    setDisplayColor(false)
  }

  return (
    <div className="color-picker">
      <button style={{backgroundColor:`${currentIconColor}`}} onClick={handleShowChrome}></button>
      { displayColor ? <div style={{position:"absolute",zIndex:"2", top: "8em"}}>
          <div style={{position: 'fixed',top: '0px',right: '0px',bottom: '0px',left: '0px',}} onClick={handleClose} />
          <SketchPicker color={currentIconColor} onChange={ChangeColor}/>
        </div> : null } 
    </div>
  );
};

export default ColorPicker;