import React, {useCallback} from 'react'
import {connect} from 'react-redux'
import {Formik, Form, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Loading, Text, Flex, Box, Button, Dropdown} from 'components'
import Yup from 'lib/yup'
import {buyViews} from 'sponsors/actions'

const validationSchema = Yup.object({
  count: Yup.mixed().required(),
})

const initialValues = {
  count: null,
}

const items = [
  {value: null},
  {value: 2500, text: 550},
  {value: 10000, text: 2000},
  {value: 20000, text: 3600},
  {value: 50000, text: 8000},
]

const BuyViewsForm = ({buyViews, hide}) => {
  const t = useCustomTranslation()
  const handleSubmit = useCallback(
    ({count}, {resetForm}) => {
      new Promise((resolve, reject) => {
        buyViews({resolve, reject, count})
      }).then(() => {
        resetForm()
        hide()
      })
    },
    [buyViews]
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({isValid, isSubmitting}) => ( 
        <Form>
          <Flex flexDirection="column" >    
            
            <Flex flexDirection="row" justify-content="center">
              <Text>
                  {t('Alle priser inkl. moms')}
              </Text>
            </Flex>

            <Flex  >
              <Box width={1 / 2} mt={2}>
                <Field name="count">
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
                <Button small disabled={isSubmitting}>
                  {isSubmitting ? <Loading size={16} /> : t('Godkend')}
                </Button>
              </Box>
            </Flex>

          </Flex>    
        </Form>
      )}
    </Formik>
  )
}

const enhancer = connect(null, {buyViews: buyViews.requested})

export default enhancer(BuyViewsForm)
