import React, { useState } from 'react';
import { QuestionExchange, HelpCenter, Experience } from 'components/icons';
import { PanelContainer, ButtonContainer, TitleContainer, Title, TextInput, AskButton, OplevButton, FaqButton } from './Panel.styles'; 
import VideoModal from './VideoModal'; 
import useCustomTranslation from 'lib/customT';

const Panel = () => {
  const [showModal, setShowModal] = useState(false); // State for controlling the modal

  // Function to open the modal with the videos about the usage of the modules
  const handleOplevButtonClick = () => {
    setShowModal(true);
  };

  // Function to close this modal again
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const t = useCustomTranslation();

  return (
    <>
      <PanelContainer>
        <TitleContainer>
          <HelpCenter style={{ fill: '#fff', width: '3rem', height: '3rem' }} />
          <Title style={{ textTransform: 'uppercase' }}> { t('Spørg vores AI til råds')}</Title>
        </TitleContainer>
        <TextInput type="text" placeholder={ t('Ex. hvilke moduler er gode til en håndboldforening?')} />
        <AskButton>{t('Spørg')}</AskButton>
      </PanelContainer>
      
      <ButtonContainer>
        <FaqButton>
          <QuestionExchange style={{ fill: '#fff', marginRight: '0.5rem', width: '2rem', height: '2rem' }} />
          FAQ
        </FaqButton>
        {/* onClick-handler for opening the modal */}
        <OplevButton onClick={handleOplevButtonClick}>
          <Experience style={{ fill: '#fff', marginRight: '0.5rem', width: '2rem', height: '2rem' }} />
          {t('oplev modulerne')}
        </OplevButton>
      </ButtonContainer>
      
      {showModal && <VideoModal videoUrl="URL_TIL_DIN_VIDEO" onClose={handleCloseModal} />}
    </>
  );
};

export default Panel;
