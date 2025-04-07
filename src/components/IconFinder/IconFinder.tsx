import React, { JSX } from 'react';
import { useIconManagerContext } from '../../context/IconManagerProvider';
import SearchIcon from '../../assets/img/icons/svg/ic_search_black_24px.svg';
import ClearIcon from '../../assets/img/icons/svg/ic_clear_black_24px.svg';

const IconFinder = (): JSX.Element => {

    const {setFilter} = useIconManagerContext();
    
    const handleSearch = (text: string):void => {
        setFilter(text)
    }
    
    return(
        <div className="search-container">
            <span className="search-icon">
                <img src={SearchIcon} alt="Buscar" />
            </span>
            <input id="searchterm" type="text" name="searchterm" placeholder="Search..." onChange={(text) => handleSearch(text.target.value)}></input>        
            <span id="clear">
                <button><img src={ClearIcon} alt="Close" /></button>
            </span>
        </div>
    );
};

export default IconFinder;