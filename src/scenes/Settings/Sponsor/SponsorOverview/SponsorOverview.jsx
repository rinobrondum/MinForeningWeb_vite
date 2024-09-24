import React from 'react'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Flex, Text} from 'components'
import Table, {Cell, Row} from 'components/Table'
import SponsorRow from './SponsorRow'

const SponsorOverview = ({
    sponsors,
    zipcodes,
    showEditModal,
    showEditZipCodesModal,
    handleRemove,
}) => {
  const t = useCustomTranslation()

  return (
    <>
        <Flex flexDirection="column">    
            <Table>
                    <Row header>
                        <Cell  light bold width={1 / 8}>
                            <Text>
                                {t('Billede')}
                            </Text>
                        </Cell>
                        <Cell bold light width={1 / 8}>
                            <Text>
                                {t('Navn')}
                            </Text>
                        </Cell>
                        <Cell light bold width={1 / 8}>
                            <Text>
                                {t('Link')}
                            </Text>
                        </Cell>   
                        <Cell light bold width={1 / 8}>
                            <Text>
                                {t('Medlemmer')}
                            </Text>
                        </Cell>
                        <Cell light bold width={1 / 8}>
                            <Text>
                                {t('Ekstern')}
                            </Text>
                        </Cell> 
                        <Cell light bold width={1 / 8}>
                            <Text>
                                {t('Visninger')}
                            </Text>
                        </Cell> 
                        <Cell light bold width={1 / 8}>
                            <Text> 
                            {t('Maks visninger')}                              
                            </Text>
                        </Cell>
                        <Cell light bold width={1 / 8}>
                            <Text >  
                                {t('Options')}                             
                            </Text>
                        </Cell> 
                    </Row>
                    
                {sponsors.map(({id, ...sponsor}) => (                
                    <SponsorRow
                        key={id}
                        id={id}
                        zipcodes={zipcodes}
                        showEditModal={showEditModal}
                        showEditZipCodesModal={showEditZipCodesModal}
                        handleRemove={handleRemove}
                        {...sponsor}
                    />
                ))}

            </Table>
        </Flex>
    </>
  )
}

export default SponsorOverview