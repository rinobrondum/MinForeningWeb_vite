import React, {useCallback, useState, useEffect} from 'react'
import {Row, Cell} from 'components/Table'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Button, Switch, Flex} from 'components'

const ExemptSponsorViewsRow = ({
    id,  
    memberType,
    memberTypeString,
    enabled,
    shownCount,
    maxViews,
    handleUpdate,
    showEditNoSponsorModal,
}) => {
    

    const t = useCustomTranslation()
    const [isExepmtEnabled, setIsExepmtEnabled] = useState(false)
    const onChange = useCallback((e, memberType) => {  
        const isEnabled = e.target.checked
        setIsExepmtEnabled(isEnabled) 
        handleUpdate({memberType, isEnabled: isEnabled})         
    }, [handleUpdate])

    useEffect(() => {
        if (enabled !== undefined) {
            setIsExepmtEnabled(enabled)
        }
    }, [enabled])
    
  return (
    <>
        <Row noHover>
            <Cell width={1 / 5}>
                {enabled !== undefined && (
                    <Switch
                        name={memberType}
                        value={isExepmtEnabled}
                        onChange={(e) => { onChange(e, memberType)}}
                    />
                )} 
            </Cell>
            <Cell width={1 / 5}>
                <Text mr={2}>
                    {memberTypeString}
                </Text> 
            </Cell>   
            <Cell  width={1 / 5}>
                {id ? (
                    <Text mr={2}>
                        {shownCount ? shownCount : 0}
                    </Text>
                ) : (
                    <Text mr={2}>
                        {shownCount ? shownCount : '-'}
                    </Text>
                )}       
            </Cell>
            <Cell  width={1 / 5}>
                {id ? (
                    <Text mr={2}>
                        {maxViews ? maxViews : 0}
                    </Text>
                ) : (
                    <Text mr={2}>
                        {maxViews ? maxViews : '-'}
                    </Text>
                )}         
            </Cell>
            {id && (
                <>
                    <Cell width={1 / 5}>
                        <Button tiny mr={2} onClick={() => {showEditNoSponsorModal(id)}}>
                            {t('Rediger')}
                        </Button>                
                    </Cell>
                </>
            )}            
        </Row>
    </>
  )
}
export default ExemptSponsorViewsRow