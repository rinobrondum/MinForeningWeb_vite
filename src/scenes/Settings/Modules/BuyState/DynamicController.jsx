// DynamicModuleController.js
import React, { useState } from 'react';
import { useModuleData } from './modulesData';
import DynamicModuleView from './DynamicModuleView';
import PriceStructure from './PriceStructure';
import InvoiceOverview from './invoiceOverview';
import Conditions from './Conditions';
import VideoModal from '../VideoModal'; 
import FormModal from './FormModal'; 

const DynamicModuleController = ({ title, icon, onBackClick }) => {
  const [contentComponent, setContentComponent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const data = useModuleData(title);

  const handleOplevButtonClick = () => {
    setShowModal(true);
  };

  const handleBuyButtonClick = () => {
    setShowModal(false);
    setShowModal(true);
  };


  const handleMenuItemClick = (component) => {
    switch (component) {
      case 'Prisstruktur':
        setContentComponent(<PriceStructure />);
        break;
      case 'Faktura-oversigt':
        setContentComponent(<InvoiceOverview />);
        break;
      case 'Betingelser':
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

  const handleCloseModal = () => {
    setShowModal(false);
  };

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
      {showModal && <FormModal onClose={handleCloseModal} />}
      {showModal && <VideoModal videoUrl="https://www.youtube.com/watch?v=Ahfj-maje4A&list=PLDnCJQgSSAyvnAPQKTC1qQqqiKrDN9nm-" onClose={handleCloseModal} />}
    </>
  );
};

export default DynamicModuleController;
