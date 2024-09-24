import React, {useState, useMemo} from 'react'
import {connect} from 'react-redux'
import {omit} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Button, Flex, Box, Loading, LabeledInput} from 'components'
import {ThemeProvider} from 'styled-components'
import {Formik, Field, } from 'formik'

const createTheme = (color) => (theme) =>
  color
    ? {
        ...theme,
        colors: {
          ...theme.colors,
          primary: theme.colors[color],
        },
      }
    : theme

const SetTitleModal = ({create, hide, template, handleGroupTitle}) => {

  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true)
    handleGroupTitle(values.title)
  }

  const back = useMemo(
    () => hide
  )

  const t = useCustomTranslation()

  return (
    <Modal title={t('Ændre chat title')} hide={hide} back={back}>
<Formik
      enableReinitialize
      onSubmit={handleSubmit}
      initialValues={{
        title: ''
      }}
      render={({handleSubmit, isValid, ...props}) => (
        <ThemeProvider
          theme={createTheme(undefined)}
        >
          <form onSubmit={handleSubmit}>
            <Flex flexDirection="column" p={3}>
                <Box mb={2}>
                    <Field
                        name="title"
                        component={LabeledInput}
                        label={`${t('Titel')} *`}
                    />
                </Box>
            </Flex>

            <Button small block>
                {t('Ændre')}
            </Button>
          </form>
        </ThemeProvider>
      )}
    />
    </Modal>
  )
}

export default SetTitleModal
