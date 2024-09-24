import React, { useState, useEffect } from 'react';
import { Goblet, People, Activities, Board, Booking, Person, DashBoard, Email, Star, Payment, InstalledModule, PausedModule } from 'components/icons';
import ColorGridView from './ModulesView';
import fetchData from './BuyState/fetchData';
import { useTranslation } from 'react-i18next';

const colors = ['#9A8EC5', '#DFB388', '#86C7E3', '#D89194', '#ABD395'];

const Modules = ({ onSquareClick }) => {
  const { t } = useTranslation(); 
  
  const [installedModules, setInstalledModules] = useState([]);

  useEffect(() => {
    const fetchInstalledModules = async () => {
      const squares = getSquareData();
      const installedModulesData = await Promise.all(squares.map(square => fetchData(square.title)));
      setInstalledModules(installedModulesData);
    };

    fetchInstalledModules();
  }, []);

  const getSquareData = () => {
    
    return [
      { title: t('Bookinger'), icon: <Booking style={{ fill: '#fff' }} />, color: colors[0] },
      { title: t('Medlems-indstillinger'), icon: <Person style={{ fill: '#fff' }} />, color: colors[1] },
      { title: t('Aktiviteter'), icon: <Activities style={{ fill: '#fff' }} />, color: colors[2] },
      { title: t('Medlemmer'), icon: <People style={{ fill: '#fff' }} />, color: colors[3] },
      { title: t('Betalinger'), icon: <Payment style={{ fill: '#fff' }} />, color: colors[4] },
      { title: t('Dashboard'), icon: <DashBoard style={{ fill: '#fff' }} />, color: colors[1] },
      { title: t('Roller & Rettigheder'), icon: <Star style={{ fill: '#fff' }} />, color: colors[2] },
      { title: t('Grupper'), icon: <People style={{ fill: '#fff' }} />, color: colors[3] },
      { title: t('Chat'), icon: <Email style={{ fill: '#fff' }} />, color: colors[4] },
      { title: t('Bestyrelse'), icon: <Board style={{ fill: '#fff' }} />, color: colors[0] },
      { title: 'Title 11', icon: <Goblet style={{ fill: '#fff' }} />, color: colors[2] },
      { title: 'Title 12', icon: <Goblet style={{ fill: '#fff' }} />, color: colors[3] },
      { title: 'Title 13', icon: <Goblet style={{ fill: '#fff' }} />, color: colors[4] },
    ];
  };

  const handleClick = (title, icon) => {
    if (onSquareClick) {
      onSquareClick(title, icon);
    }
  };

  return <ColorGridView squares={getSquareData()} installedModules={installedModules} handleClick={handleClick} />;
};

export default Modules;
