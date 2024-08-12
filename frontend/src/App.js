import React from 'react';
import './App.css';
import Weather from './Weather';
import InstallPrompt from './InstallPrompt';


function App() {
  return (
    <div className="App">
      <InstallPrompt />
       <Weather />
    </div>
  );
}

export default App;
