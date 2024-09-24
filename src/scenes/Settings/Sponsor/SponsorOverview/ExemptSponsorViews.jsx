import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Text} from 'components'
import Table, {Cell, Row} from 'components/Table'
import ExemptSponsorViewsRow from './ExemptSponsorViewsRow'

const ExemptSponsorViews = ({
    exemptRoles,
    handleUpdate,
    showEditNoSponsorModal,
}) => {
    const t = useCustomTranslation()
  return (
    <>     
        <Flex flexDirection="column">    
            <Table >
                <Row header>	
                    <Cell bold light width={1 / 5}>
                        <Text>
                            {t('Aktiv status')}
                        </Text>
                    </Cell>			
                    <Cell bold light width={1 / 5}>
                        <Text>
                            {t('Navn')}
                        </Text>
                    </Cell>
                    <Cell light bold width={1 / 5}>
                        <Text>
                            {t('Visninger')}
                        </Text>
                    </Cell> 
                    <Cell light bold width={1 / 5}>
                        <Text> 
                            {t('Maks visninger')}                              
                        </Text>
                    </Cell>
                    <Cell light bold width={1 / 5}>
                        <Text >  
                            {t('Indstillinger')}                             
                        </Text>
                    </Cell> 
                </Row>
                {exemptRoles.map(({index, ...exemptRole}) => (                
                    <ExemptSponsorViewsRow
                        key={index}
                        id={index}
                        handleUpdate={handleUpdate}
                        showEditNoSponsorModal={showEditNoSponsorModal}
                        {...exemptRole}
                    />
                ))}
            </Table>
        </Flex>
    </>
  )
}

export default ExemptSponsorViews