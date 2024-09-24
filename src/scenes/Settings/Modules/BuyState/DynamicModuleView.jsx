import React from 'react';
import { DynamicButtonContainer, Button, Icon, HeaderContainer, IconTitleBox, Title, MainContentContainer, BackToText, PausedTab, Container } from './DynamicModule.styles';
import { OplevButton, FaqButton } from '../Panel.styles';
import { QuestionExchange, Experience} from 'components/icons';
import ModuleMenu from './Menu'; 
import useCustomTranslation from 'lib/customT'; // Importer den brugerdefinerede oversættelsesfunktion

const DynamicModuleView = ({ icon, title, data, contentComponent, originalContent, onBackClick, handleIconTitleBoxClick, handleOplevButtonClick, handleMenuItemClick }) => {
  const t = useCustomTranslation();

  return (
    <>
    
      <Button onClick={onBackClick}><span>Back to ModuleOverview</span></Button>
      <HeaderContainer>
          {/* The blue box in the left top corner */}
          <IconTitleBox onClick={handleIconTitleBoxClick}>

            <Icon>{icon}</Icon>
            <Title>
            {/* Rendered when you have clicked the right-menu and have changed the mainContent, to tell the user that they can push this and get the content back */}
            {contentComponent && <BackToText> {t('tilbage til')}</BackToText>}
            {title}</Title>
            {/* {the status refers to the status of the clients module. 1: client has installed the module, 2: client has not installed the module, 3: The module is installed but Paused} */}
            {/* Render the "Paused" tab when status is 3 */}
            {data && data[0]?.status === 3 && <PausedTab>{t('På pause')}</PausedTab>}
          </IconTitleBox>
      </HeaderContainer>
      <Container>
      <MainContentContainer>
        {contentComponent ? null : originalContent}
        {contentComponent}
      </MainContentContainer>
      <ModuleMenu handleMenuItemClick={handleMenuItemClick} />
        
        </Container>
      <DynamicButtonContainer>
        <FaqButton style={{ backgroundColor: '#86C7E3'}}>
          <QuestionExchange style={{ fill: '#fff', marginRight: '0.5rem', width: '2rem', height: '2rem' }} />
          {t('FAQ')}
        </FaqButton>
        <OplevButton style={{ backgroundColor: '#86C7E3'}} onClick={handleOplevButtonClick}>
          <Experience style={{ fill: '#fff', marginRight: '0.5rem', width: '2rem', height: '2rem' }} />
          {t('oplev modulerne')}
        </OplevButton>
      </DynamicButtonContainer>
 
    </>
  );
}

export default DynamicModuleView;
