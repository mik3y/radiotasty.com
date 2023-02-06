import React from 'react';

import './App.scss';
import HomeView from './views/Home';

const App = () => {
  return (
    <>
      <HomeView />
      <div className="overlay"></div>
      <div className="overlay glitch"></div>
    </>
  );
};

export default App;
