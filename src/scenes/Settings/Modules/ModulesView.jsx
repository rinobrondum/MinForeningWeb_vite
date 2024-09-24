import React from 'react';
import { Headline, GridContainer, Square, IconWrapper, Title, InstalledBar, PausedBar } from './ColorGridModule.styles'; 
import { InstalledModule, PausedModule } from 'components/icons';
import useCustomTranslation from 'lib/customT'

const ColorGridView = ({ squares, installedModules, handleClick }) => {
  const t = useCustomTranslation()
  return (
    <>
      <Headline style={{ textTransform: 'uppercase' }}> { t('Tilføj moduler fra MinOrganisation')}</Headline>
      <GridContainer>
        {squares.map((square, index) => {
          const installedModuleData = installedModules[index];
          return (
            <Square key={index} color={square.color} onClick={() => handleClick(square.title, square.icon)}>
              <IconWrapper>
                {square.icon}
              </IconWrapper>
              <Title>{square.title}</Title>
              {installedModuleData && installedModuleData[0]?.status === 1 && (
                <InstalledBar>
                <p style={{ textTransform: 'uppercase' }}>
                  <InstalledModule style={{ marginRight: '0.5rem', marginLeft: '0.5rem', marginBottom: '0.5rem', fill: '#8395AB', width: '2rem', height: '2rem' }} />
                  { t('Installeret')}
                </p>
              </InstalledBar>
              )}
              {installedModuleData && installedModuleData[0]?.status === 3 && (
                <PausedBar>
                <p style={{ textTransform: 'uppercase' }}>
                  {/* Paused module icon */}
                  <PausedModule style={{ marginRight: '0.5rem', marginLeft: '0.5rem', marginBottom: '0.5rem', fill: '#8395AB', width: '2rem', height: '2rem' }} />
                  { t('På pause')}
                </p>
              </PausedBar>
              )}
            </Square>
          );
        })}
      </GridContainer>
    </>
  );
};

export default ColorGridView;
