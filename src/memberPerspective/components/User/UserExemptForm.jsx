import React, {useState, useCallback } from 'react'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Loading, Text, Flex, Box, Button, Dropdown, Switch, Tooltip,} from 'components'
import {Alert} from 'components/icons'
import Yup from 'lib/yup'

const validationSchema = Yup.object({
    amount: Yup.mixed().required(),
})

const initialValues = {
  amount: null,
  isSubmitting: false,
}

const items = [
  {value: null},
  {value: 250, text: 125},
  {value: 500, text: 200},
  {value: 1000, text: 300},
]


const UserExemptForm = ({
    viewsLeft,
    enabledForSelf,
    enabledForRelations,
    handleUpdateUserExemptions,
    handleOnSubmit,
    hide,
    isSubmitting,
}) => {
    const t = useCustomTranslation()
    const [isExepmtSelfEnabled, setIsExepmtSelfEnabled] = useState(enabledForSelf)
    const [isExepmtRelationsEnabled, setIsExepmtRelationsEnabled] = useState(enabledForRelations)

    const handleOnChangeSelf = useCallback((e) => {  
        const isEnabledForSelf = e.target.checked
        handleUpdateUserExemptions({isEnabledForSelf})
        setIsExepmtSelfEnabled(isEnabledForSelf)
    }, [handleUpdateUserExemptions, setIsExepmtSelfEnabled])

    const handleOnChangeRelations = useCallback((e) => {     
        const isEnabledForRelations = e.target.checked 
        handleUpdateUserExemptions({isEnabledForRelations})
        setIsExepmtRelationsEnabled(isEnabledForRelations)
    }, [handleUpdateUserExemptions, setIsExepmtRelationsEnabled])

  return (
    <>
        <Flex mb={1}>
            <Text mb={2} mr={2}>
                {t('Exempts left')}
                <strong> {viewsLeft}</strong>
            </Text>

            <Tooltip width="200px" text={t('KøbSponsorExemptionsForUser')}>
                {({show, hide}) => (
                    <Alert
                        onMouseEnter={show}
                        onMouseLeave={hide}
                        fill="secondary"
                        size={16}
                    />
                )}
            </Tooltip>
        </Flex>
        <Flex mb={1}>
            {enabledForSelf !== undefined && (
                <>
                    <Box  mr={2}>
                        <Switch
                            name={enabledForSelf}
                            value={isExepmtSelfEnabled}
                            onChange={(e) => {handleOnChangeSelf(e)}}
                        />
                    </Box>
                    <Text>
                        {t('Exempt self')}
                    </Text>
                </>
            )} 
        </Flex>
        <Flex mb={1}>
            {enabledForRelations !== undefined && (
                <>
                    <Box  mr={2}>
                        <Switch
                            name={enabledForRelations}
                            value={isExepmtRelationsEnabled}
                            onChange={(e) => {handleOnChangeRelations(e)}}
                        />
                    </Box>
                    <Text>
                        {t('Exempt relations')}
                    </Text>
                </>
            )} 
        </Flex>
        <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleOnSubmit}
        >
        {({}) => ( 
            <Form>
                <Flex flexDirection="column" >                        
                    <Flex flexDirection="row" justify-content="center">
                        <Text>
                            {t('All prices include VAT.')}
                        </Text>
                    </Flex>
                    <Flex  >
                    <Box width={1 / 2} mt={2}>
                        <Field name="amount">
                        {({field, form: {setFieldValue}}) => (
                            <Box width={200}>
                            <Dropdown
                                items={items}
                                title={() => {
                                if (field.value) {
                                    const item = items.find(
                                    ({value}) => value === field.value
                                    )

                                    return `${item.value} (${item.text} DKK)`
                                } else {
                                    return t('Vælg antal visninger')
                                }
                                }}
                                renderItem={({value, text}, hide) => (
                                <Flex
                                    p={2}
                                    onClick={(event) => {
                                    event.stopPropagation()
                                    setFieldValue(field.name, value)
                                    hide()
                                    }}
                                    justifyContent="space-between"
                                >
                                    {text ? (
                                    <>
                                        <Text>{value}</Text>
                                        <Text>{text} DKK</Text>
                                    </>
                                    ) : (
                                    <Text>{t('Vælg antal visninger')}</Text>
                                    )}
                                </Flex>
                                )}
                            />
                            </Box>
                        )}
                        </Field>
                    </Box>
                    <Box width={1 / 2} mt={2}>
                        <Button type="submit" small disabled={isSubmitting}>
                            {isSubmitting ? <Loading size={16} /> : t('Godkend')}
                        </Button>
                    </Box>
                    </Flex>                    
                </Flex>    
            </Form>
            
        )}
        </Formik>

        <Button mt={2} small onClick={()=> hide()} >
            { t('Undo')}
        </Button>
    </>
  )
}

export default UserExemptForm