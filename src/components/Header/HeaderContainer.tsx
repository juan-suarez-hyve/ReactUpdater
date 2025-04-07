import React, { JSX } from 'react';
import IconFinder from '../IconFinder/IconFinder';
import FavoritesToggle from '../FavoritesToggle/FavoritesToggle';
import ColorPicker from '../ColorPicker/ColorPicker';


const HeaderContainer = (): JSX.Element => {
    
    return(
        <div className='header-container'>
            <IconFinder/>
            <ColorPicker/>
            <FavoritesToggle/>

        </div>
    );
};



export default HeaderContainer;