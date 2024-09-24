import React, {useCallback, useEffect, useState} from 'react'
import {Formik, Field, Form} from 'formik'
import {useToggle} from 'lib/hooks'
import {Modal, Button, Box, TextArea} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import { getPaymentImages, getIsFetchingImages } from 'payments/selectors'
import { getActive } from 'clubs'
import imageToBase64 from 'lib/imageToBase64'
import {updatePayer, uploadImage, fetchImages, deleteImage} from 'payments/actions'
import PaymentImages from '../PaymentImages'

const ApproveWithNoteButton = ({
  approve,
  memberId,
  userPaymentId,
  status,
  payers,
  paymentImages,
  activeClub,
  isFetchingImages,
  fetchImages,
  deleteImage,
  uploadImage,
  ...props
}) => {
  const t = useCustomTranslation()
  const [isOpen, open, close] = useToggle()
  const [paymentNote, setPaymentNote] = useState("")
  
  const handleSubmit = async (values, {note}) => {
    if(values.images !== null && values.images.length > 0 && values.images[0]){
      new Promise(async (resolve, reject) => {
        const base64String = await imageToBase64(values.images[0])

        uploadImage({
          resolve, reject, 
          entityId: userPaymentId,
          entityType: 17,
          base64String: base64String,
          fileName: values.images[0].name,
          clubId: activeClub.id
         })
        approve(memberId, {userPaymentId, internalNote: note, status})
      }).then(close);
    } else {
      new Promise((resolve, reject) => {
        approve(memberId, {userPaymentId, internalNote: note, status})
      }).then(close);
    }
  }

  useEffect(()=>{
    payers.forEach((payer)=> {
      if(payer.id === userPaymentId){
        setPaymentNote(payer.internalNote)
      }
    })
  }, [payers])

  useEffect(()=>{
    if(isOpen){
      new Promise((resolve, reject) => {
       fetchImages({resolve, reject, entityId: userPaymentId, entityType: 17})
      })
    }
  }, [isOpen])

  if (isFetchingImages) {
    return (
    <Button onClick={open} {...props}>
      {t('Godkend')}
    </Button>
    )
  } else {
  return (
    <>
      {isOpen && (
        <Modal title={`${t('Godkend betaling')}`} hide={close}>
          <Box p={3}>
            <Formik onSubmit={handleSubmit} initialValues={{note: paymentNote, images: ""}}>
            {({ values, setFieldValue }) => (
              <Form>
                <Field
                  
                  name="note"
                  component={TextArea}
                  placeholder={`${t('Note')}...`}
                  mb={3}
                />
                <PaymentImages
                  setFieldValue={setFieldValue}
                  value={values.images}
                  id={values.id}
                  paymentImages={paymentImages}
                  deleteFn={deleteImage}
                />
              
                <Button small block type="submit" >
                  {t('Godkend')}
                </Button>
              </Form>
            )}
            </Formik>
          </Box>
        </Modal>
      )}
      <Button onClick={open} {...props}>
        {t('Godkend')}
      </Button>
    </>
  )}
}

const enhancer = connect(
  createStructuredSelector({
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

export default enhancer(ApproveWithNoteButton)
