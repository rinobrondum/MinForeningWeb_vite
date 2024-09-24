import React, {useCallback, useState} from 'react'
import {Formik, Form, Field} from 'formik'
import {Box, Flex} from '@rebass/grid'
import {FormikInput as Input, Button, Switch, Text} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Tooltip} from 'components'
import { Alert } from 'components/icons'
import { useFeature } from '@growthbook/growthbook-react'
import { module_invisible_group, module_free_access_group} from "globalModuleNames"

const EditForm = ({ setHiddenForClubLeaders, handleSubmit, ...props}) => {
  const t = useCustomTranslation()
  return (
    <Formik 
      {...props}
    >
      {({setFieldValue, values}) => (
        <Form onSubmit={(e)=>{
          e.preventDefault()
          handleSubmit(values)
        }}>
          <Field name="id" component="input" type="hidden" />
          <Flex>
            <Box mr={3} flex="2">
              <Field name="title" component={Input} />
            </Box>
            <Box mr={3} flex="1">
              <Field name="maxUsers" component={Input} placeholder={t('Max Users')} /> 
            </Box>
            <Button type="submit" success >
              {t('Gem')}
            </Button>
          </Flex>
          <Flex style={{marginTop: "10px", marginBottom: "10px", gap: "20px"}}>
            {
              useFeature(module_free_access_group).on &&
                <Flex style={{gap: "10px"}}>
                  <Flex style={{alignItems: "center"}}>
                    <Text mr="1"><strong>{t("Fri adgang gruppe")}</strong> </Text>
                  </Flex>
                  <Field name="open" component={Switch} checked={values.open} onChange={(event) => {
                      setFieldValue('open', event.target.checked);
                    }}></Field>
                </Flex>
            }
            {
              useFeature(module_invisible_group).on && 
                <Flex style={{gap: "10px"}}>
                  <Text>
                    <strong>{t("Usynlig gruppe")}</strong>
                  </Text>
                  <Field name="hiddenForClubMembers" component={Switch} checked={values.hiddenForClubMembers} onChange={(event) => {
                      setFieldValue('hiddenForClubMembers', event.target.checked);
                    }}></Field>
                </Flex>
            }
            {
              useFeature(module_invisible_group).on && 
                <Flex style={{alignItems: "center", marginLeft: "auto"}}>
                  <Tooltip text={t('Usynlig gruppe betyder, at gruppe ikke bliver vist i gruppeoversigten for medlemmer, som ikke er i gruppen')}>
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
            }
        </Flex>
        </Form>
      )}
    </Formik>
  )
}
export default EditForm
