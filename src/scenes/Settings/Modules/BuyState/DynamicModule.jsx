import React, { useState } from 'react';
import { useModuleData } from './modulesData';
import DynamicModuleView from './DynamicModuleView';
import PriceStructure from './PriceStructure';
import InvoiceOverview from './invoiceOverview';
import Conditions from './Conditions';
import VideoModal from '../VideoModal'; 
import FormModal from './FormModal'; 
import { Tagline, Price, Rabat, Her, BuyButton, BuyButtonContainer} from './DynamicModule.styles';
import { BuyModule, InstalledModule, PausedModule } from 'components/icons';
import useCustomTranslation from 'lib/customT'; // Importer den brugerdefinerede oversættelsesfunktion

const DynamicModule = ({ title, icon, onBackClick }) => {
  const [contentComponent, setContentComponent] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [buyButtonText, setBuyButtonText] = useState('');

  const t = useCustomTranslation(); 

  const data = useModuleData(title);

  const handleBuyButtonClick = (status) => {
    setShowFormModal(true);
    setBuyButtonText(getBuyButtonText(status));
  };

  const handleOplevButtonClick = () => {
    setShowVideoModal(true);
  };

  const handleMenuItemClick = (component) => {
    switch (component) {
      case t('Prisstruktur'):
        setContentComponent(<PriceStructure />);
        break;
      case t('Faktura-oversigt'):
        setContentComponent(<InvoiceOverview />);
        break;
      case t('Betingelser'):
        setContentComponent(<Conditions />);
        break;
      default:
        setContentComponent(null);
        break;
    }
  };

  const handleIconTitleBoxClick = () => {
    setContentComponent(null);
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
  };

  const handleCloseFormModal = () => {
    setShowFormModal(false);
  };

  const getBuyButtonText = (status) => {
    switch (status) {
      case 3:
        return t('Aktiver modul');
      case 1:
        return t('Pauser modul');
      default:
        return t('Bestil modul');
    }
  };

  const originalContent = (
    <>
     <Tagline>{data && data[0] ? (data[0].tagline || t('Tagline')) : t('Tagline')}</Tagline>
      <Price>{data && data[0] ? (data[0].price || t('Price')) : t('Price')}</Price>
      <Rabat>
        {t('Få rabat ved køb af flere moduler. Se vores prisstruktur')} 
        <Her onClick={() => handleMenuItemClick('PriceStructure')}> {t('her')}</Her>.
      </Rabat>
      <BuyButtonContainer>
        {/* {the status refers to the status of the clients module. 1: client has installed the module, 2: client has not installed the module, 3: The module is installed but Paused} */}
        {data && data[0]?.status === 3 ? (
          <>
            <InstalledModule style={{ fill: '#8395AB', marginRight: '0.5rem', width: '6rem', height: '6rem' }} />
            <BuyButton onClick={() => handleBuyButtonClick(3)}>
              {getBuyButtonText(3)}
            </BuyButton>
          </>
        ) : data && data[0]?.status === 1 ? (
          <>
            <PausedModule style={{ fill: '#8395AB', marginRight: '0.5rem', width: '6rem', height: '6rem' }} />
            <BuyButton onClick={() => handleBuyButtonClick(1)}>
              {getBuyButtonText(1)}
            </BuyButton>
          </>
        ) : (
          <>
            <BuyModule style={{ fill: '#8395AB', marginRight: '0.5rem', width: '6rem', height: '6rem' }} />
            <BuyButton onClick={() => handleBuyButtonClick()}>
              {getBuyButtonText()}
            </BuyButton>
          </>
        )}
     
      </BuyButtonContainer>
    </>
  );

  return (
    <>
      <DynamicModuleView
        icon={icon}
        title={title}
        data={data}
        contentComponent={contentComponent}
        originalContent={originalContent}
        onBackClick={onBackClick}
        handleIconTitleBoxClick={handleIconTitleBoxClick}
        handleOplevButtonClick={handleOplevButtonClick}
        handleMenuItemClick={handleMenuItemClick}
      />
      {showVideoModal && <VideoModal videoUrl="https://www.youtube.com/watch?v=Ahfj-maje4A&list=PLDnCJQgSSAyvnAPQKTC1qQqqiKrDN9nm-" onClose={handleCloseVideoModal} />}
      {showFormModal && <FormModal onClose={handleCloseFormModal} buttonText={buyButtonText} />}
    </>
  );
};

export default DynamicModule;
