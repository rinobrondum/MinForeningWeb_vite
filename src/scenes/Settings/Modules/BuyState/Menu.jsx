import React from 'react';

import useCustomTranslation from 'lib/customT'; // Importer den brugerdefinerede oversættelsesfunktion
import { Divider, MenuContainer, MenuItem } from './DynamicModule.styles';



// ModuleMenu-komponenten
const ModuleMenu = ({ handleMenuItemClick }) => {
  const t = useCustomTranslation(); 
  return (
    <MenuContainer>
      <MenuItem onClick={() => handleMenuItemClick('Prisstruktur')}>{t('Prisstruktur')}</MenuItem>
      <Divider />
      <MenuItem onClick={() => handleMenuItemClick('Faktura-oversigt')}>{t('Faktura-oversigt')}</MenuItem>
      <Divider />
      <MenuItem onClick={() => handleMenuItemClick('Betingelser')}>{t('Betingelser')}</MenuItem>
    </MenuContainer>
  );
};

export default ModuleMenu;
