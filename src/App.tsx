import React, { JSX} from 'react';
import { IconManagerProvider} from './context/IconManagerProvider';
import IconList from './components/IconList/IconList';
import './index.css';
import HeaderContainer from './components/Header/HeaderContainer';

const App = ():JSX.Element => {
  return (
    <IconManagerProvider>
      <div className="app">
        <HeaderContainer/>
        <IconList/>
      </div>
    </IconManagerProvider>
  );
};

export default App;