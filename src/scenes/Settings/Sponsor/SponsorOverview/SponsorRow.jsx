import React from 'react'
import {Row, Cell} from 'components/Table'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Button, Image, ButtonWithProtectedAction} from 'components'


const SponsorRow = ({
    id,
    logo,
    title,
    url,
    shownCount,
    maxViews,
    zipCodes,
    isExternal,
    showEditModal,
    showEditZipCodesModal,
    handleRemove,
}) => {
    const t = useCustomTranslation()

  return id ? (
    <>     
        <Row noHover>
            <Cell width={1 / 8} >
                <Image width={35} mr={2} src={logo} alt={title} />
            </Cell>

            <Cell width={1 / 8} >
                <Text mr={2}>{title}</Text> 
            </Cell>   

            <Cell width={1 / 8}>
                <Text mr={2}>
                    {url}
                </Text>          
            </Cell>

            <Cell width={1 / 8}>
                <Text mr={2}>
                    {t(isExternal ? "Ja": "Nej")}
                </Text>        
            </Cell>

            <Cell onClick={() => showEditZipCodesModal(id)} light bold width={1 / 6} zipCodes={zipCodes}>
                <Text mr={2}>            
                    {zipCodes ? zipCodes.length : 0}
                </Text>
            </Cell>             

            <Cell width={1 / 8}>
                <Text mr={2}>
                    {shownCount}
                </Text>        
            </Cell>

            <Cell width={1 / 8}>
                <Text mr={2}>
                    {maxViews}
                </Text>        
            </Cell>

            <Cell width={1 / 8}>
                <Button tiny mr={2} onClick={() => {showEditModal(id)}}>
                    {t('Rediger')}
                </Button>            
                <ButtonWithProtectedAction
                    tiny
                    danger
                    accept={() => {handleRemove(id)}}
                >
                    {t('Slet')}
                </ButtonWithProtectedAction>
            </Cell>
        </Row> 
  </>
  ): null
}

export default SponsorRow