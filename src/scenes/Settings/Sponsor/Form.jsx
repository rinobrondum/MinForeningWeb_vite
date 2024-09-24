import React, {useCallback, useEffect, useState} from 'react'
import {useField, Formik, Form as FormikForm, Field} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {useDropzone} from 'react-dropzone'
import Yup from 'lib/yup'
import {Loading, Box, Text, Button, FormikInput as Input, StyledCheckbox, Flex} from 'components'
import ZipcodesSelect from './components/ZipcodesSelect'

const validationSchema = Yup.object({
  title: Yup.string().required(),
  url: Yup.string().required(),
  logo: Yup.string(),
  logoBase64: Yup.mixed().when('logo', {
    is: (value) => !value,
    then: Yup.mixed().required(),
  }),
})

const ImageInput = ({placeholder}) => {
  const [{value}, {error}, {setValue}] = useField('logoBase64')
  const handleDrop = useCallback(
    (files) => {
      setValue(
        Object.assign(files[0], {preview: URL.createObjectURL(files[0])})
      )
    },
    [setValue]
  )
  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    onDropAccepted: handleDrop,
  })
  const t = useCustomTranslation()

  return (
    <Box mt={2} mb={2}>
      <Box
        {...getRootProps({
          p: 2,
          border: '1px dashed',
          borderColor: 'secondary',
          borderRadius: 3,
          width: 400,
        })}
      >
        <input {...getInputProps()} />
        {value || placeholder ? (
          <img
            alt="Sponsor preview"
            style={{width: '100%', height: '100%'}}
            src={(value && value.preview) || placeholder}
          />
        ) : (
          <Text>{t('Vælg fil')}</Text>
        )}
      </Box>
      {error && (
        <Text small danger mt={2}>
          {error}
        </Text>
      )}
    </Box>
  )
}

const Form = ({formId, initialValues, onSubmit, isCreate, isEdit, isZipCodesEdit, isNoSponsorEdit, zipcodeOptions, currentZipCodes, isSubmitting}) => {
  const t = useCustomTranslation()
  const [isExternalVisible, setIsExternalVisible] = useState(initialValues.isExternal)
  return (
    <Formik
    initialValues={{
      ...initialValues,
      formId,
    }}     
      onSubmit={onSubmit}
      validationSchema={isEdit ? validationSchema : ""}
    >
      {({ isValid, setFieldValue, field}) => (
        <FormikForm> 
          <Field type="hidden" name="formId" value={formId} />         
          {!isZipCodesEdit && (
            <>
              {!isNoSponsorEdit && (
                <>
                  <Field small name="title" placeholder={t('Navn')} component={Input} />
                  <Field small name="url" placeholder={t('Link')} component={Input} />
                </>
              )}
              <Field small name="maxViews" placeholder={t('Maks visninger')} component={Input} />
            </>
          )}      
          {!isNoSponsorEdit && (            
            <>     
              <Flex>                  
                <StyledCheckbox
                  checked={isExternalVisible}
                  onChange={({target: {checked}}) => {                     
                    setIsExternalVisible(checked)                    
                  }}
                />               
                  <Text ml={2}>
                    {t('Sæt som ekstern')}
                  </Text>                       
              </Flex> 
              {isExternalVisible && (
                <>
                    <Field isEdit small name="zipCodes" setFieldValue={setFieldValue} options={zipcodeOptions} defaultValue={currentZipCodes} component={ZipcodesSelect} />
                </>
              )}
            </>
          )}  
          {!isNoSponsorEdit && (
            <>
              {!isZipCodesEdit && (
                <ImageInput placeholder={initialValues && initialValues.logo} />
              )}
            </>
          )}
          <Button type="submit" block small disabled={isSubmitting || !isValid}>
            {isSubmitting ? <Loading size={16} /> : t( isZipCodesEdit || isNoSponsorEdit ? 'Opdater' : isEdit ? 'Gem' : 'Opret' )}
          </Button>
        </FormikForm>
      )}

    </Formik>
  )
}

export default Form
