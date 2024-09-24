import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Formik, Field} from 'formik'
import Yup from 'lib/yup'
import {Box, Modal, LabeledInput, LabeledTextArea, Button} from 'components'
import {create} from 'clubs/actions'
import useCustomTranslation from 'lib/customT'

const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  zip: Yup.string().required().min(4).max(8),
})

class CreateClubForm extends Component {
  t = useCustomTranslation()

  handleSubmit = (values, {setErrors}) => {
    new Promise((resolve, reject) => {
      this.props.create({values, resolve, reject})
    })
      .then(this.props.hide)
      .catch(() => setErrors({title: t('Foreningen findes allerede')}))
  }

  render() {
    var me = this;


    const {hide} = this.props

    return (
      <Modal hide={hide} title={this.t('Opret forening')}>
        <Box p={3}>
          <Formik
            validationSchema={validationSchema}
            onSubmit={this.handleSubmit}
          >
            {({handleSubmit}) => (
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <Field
                    name="title"
                    label={this.t('Foreningsnavn *')}
                    component={LabeledInput}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    name="phoneNumber"
                    label={this.t('Telefonnummer')}
                    component={LabeledInput}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    name="address"
                    label={this.t('Adresse')}
                    component={LabeledInput}
                  />
                </Box>
                <Box mb={2}>
                  <Field
                    name="zip"
                    label={this.t('Postnummer *')}
                    component={LabeledInput}
                  />
                </Box>
                <Box mb={2}>
                  <Field name="city" label={this.t('By')} component={LabeledInput} />
                </Box>
                <Box mb={2}>
                  <Field
                    name="homePage"
                    label={this.t('hjemmeside')}
                    component={LabeledInput}
                  />
                </Box>
                <Box mb={4}>
                  <Field
                    name="description"
                    label={this.t('Beskrivelse')}
                    render={() => <LabeledTextArea label={me.t('Beskrivelse')} />}
                  />
                </Box>

                <Button block small primary type="submit">
                  {me.t('Opret forening')}
                </Button>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    )
  }
}

const enhancer = connect(null, {
  create: create.requested,
})

export default enhancer(CreateClubForm)
