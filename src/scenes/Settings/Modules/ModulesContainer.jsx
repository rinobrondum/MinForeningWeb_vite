//Landingpage when choosing the tab modules in the setting-scene
import React, { useState } from 'react';
import Panel from './Panel';
import Modules from './ColorGridModules';
import DynamicModule from './BuyState/DynamicModule';


const ModulesContainer = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);

  const handleSquareClick = (title, icon) => {
    setSelectedModule(title);
    setSelectedTitle(title);
    setSelectedIcon(icon);
  };

  const handleBackClick = () => {
    setSelectedModule(null);
    setSelectedTitle(null);
    setSelectedIcon(null);
  };

  return (
    <>
      {!selectedModule && <Panel />}
      {!selectedModule && <Modules onSquareClick={handleSquareClick} />}

      {selectedModule && selectedTitle && selectedIcon && (
        <DynamicModule title={selectedTitle} icon={selectedIcon} onBackClick={handleBackClick} />
      )}
    </>
  );
};

export default ModulesContainer;
