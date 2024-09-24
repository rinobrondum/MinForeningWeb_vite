import React, {Component, useEffect} from 'react'
import {connect} from 'react-redux'
import {Formik, Field} from 'formik'
import {withTranslation} from 'react-i18next'
import {Flex} from '@rebass/grid'
import {Button, Modal, TextArea} from 'components'
import {updatePayer, uploadImage, fetchImages, deleteImage} from 'payments/actions'
import PaymentImages from '../../PaymentImages'
import { getActiveType } from 'user'
import { createStructuredSelector } from 'reselect'
import { getPaymentImages, getIsFetchingImages } from 'payments/selectors'
import { getActive } from 'clubs'
import imageToBase64 from 'lib/imageToBase64'
import { useFeature } from '@growthbook/growthbook-react'
import {module_document_library} from 'globalModuleNames';

const InternalNoteModal = ({ hide, t, updatePayer, activeMember, initialValues, 
  uploadImage, fetchImages, paymentImages, activeClub, isFetchingImages,
  deleteImage}) => {
  
  useEffect(()=>{
    new Promise((resolve, reject) => {
      fetchImages({resolve, reject, entityId: initialValues.id, entityType: 17})
    })
    
  }, [initialValues.id, activeClub.id])

  const handleSubmit = async (values) => {
    if(values.images !== null && Array.isArray(values.images)
      && values.images.length > 0 && values.images[0]){
      new Promise(async (resolve, reject) => {
        const base64String = await imageToBase64(values.images[0])

        uploadImage({
         resolve, reject, 
         entityId: values.id,
         entityType: 17,
         base64String: base64String,
         fileName: values.images[0].name,
         clubId: activeClub.id
        })
        updatePayer({ values, resolve, reject })
      }).then(hide);
    } else {
      new Promise((resolve, reject) => {
        updatePayer({ values, resolve, reject })
      }).then(hide);
    }
  }

  if (isFetchingImages) {
    return <></>
  } else {
    return (<Modal hide={hide} title={`${t('Redigér note')}...`}>
      <Flex flexDirection="column" p={3}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleSubmit, values, setFieldValue }) => {

            return (
            <form onSubmit={handleSubmit}>
              <Field
                name="internalNote"
                placeholder={`${t('Indtast note')}...`}
                rows="3"
                component={TextArea}
              />
              {activeMember === 2 && useFeature(module_document_library).on &&
                <PaymentImages
                  setFieldValue={setFieldValue}
                  value={values.images}
                  id={values.id}
                  paymentImages={paymentImages}
                  deleteFn={deleteImage}
                />
              }
              <Button primary small block type="submit" mt={3}>
                {t('Gem')}
              </Button>
            </form>
          )}}
        </Formik>
      </Flex>
    </Modal>
    )
  }
};


const mapDispatchToProps = {
  
}



const enhancer = connect(
  createStructuredSelector({
    activeMember: getActiveType,
    paymentImages: getPaymentImages,
    activeClub: getActive,
    isFetchingImages: getIsFetchingImages
  }),{
    updatePayer: updatePayer.requested,
    uploadImage: uploadImage.requested,
    fetchImages: fetchImages.requested,
    deleteImage: deleteImage.requested
  }
)


export default withTranslation()(enhancer(InternalNoteModal))
