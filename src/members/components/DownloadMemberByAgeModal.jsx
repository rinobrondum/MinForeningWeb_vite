import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {withRouterParams} from 'lib/hoc'
import {FormikInput as Input, Modal, Button, Box} from 'components'
import {Formik, Field, Form} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {downloadByage} from 'members'
import {getActiveClubName, getActive} from 'clubs/selectors'
import Yup from 'lib/yup'

const initialValues = {
    from: "",
    to: "",
  }
  const validationSchema = Yup.object().shape({
    from: Yup.number().required(),
    to: Yup.number().required()
  })

const DownloadMemberByAgeModal = ({
    clubName,
    downloadByage,
    hide,
    setIsFetchingMembers
}) => {
    const t = useCustomTranslation()


    const handleSubmit = (values) => {
        const fromAge = Number(values.from)
        const toAge = Number(values.to)
        new Promise((resolve, reject) =>
        downloadByage({fromAge, toAge, resolve, reject}) //clubId: get(activeClub, 'id'),
        ).then((data) => {
            const blob = new Blob(['\ufeff', data], {
            type: 'text/csv;charset=utf-8;',
            })
            const link = document.createElement('a')
            link.download = `${clubName}_${fromAge}_${toAge}.csv`
            link.href = window.URL.createObjectURL(blob)
            link.click()
            setIsFetchingMembers(false)
        })
    hide()   
    }
  return (
        <>
            <Modal title={t('Export members by Age')} hide={()=>{hide(), setIsFetchingMembers(false)}} width={350}>
                <Box bg="secondaryLight" p={3}>
                    <>
                        <Formik  
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({isValid}) => (
                                <Form>
                                    <Field
                                        small
                                        width={'100%'}
                                        placeholder={`${t('Fra Alder')} ...`}
                                        name="from"
                                        component={Input}
                                        type="text" pattern="[0-9]*"
                                    />
                                    <Field
                                        small
                                        width={'100%'}
                                        placeholder={`${t('Til Alder')} ...`}
                                        name="to"
                                        component={Input}
                                        type="text" pattern="[0-9]*"
                                    />
                                    <Button
                                        small
                                        block
                                        bold
                                        primary
                                        type="submit"
                                        disabled={!isValid}
                                    >
                                        {t('Export members')}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </>
                </Box>
            </Modal>
        </>   
  )
}

const enhancer = compose(
    withRouterParams,
    connect(
      createStructuredSelector({
        activeClub: getActive,
        clubName: getActiveClubName,
      }),
      {downloadByage}
    ),
  )
export default enhancer(DownloadMemberByAgeModal)
