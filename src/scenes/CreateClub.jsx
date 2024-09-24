import React, {Component, Fragment} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import Yup from 'lib/yup'
import {compose} from 'recompose'
import {Redirect} from 'react-router-dom'
import {Formik, Form, Field} from 'formik'
import {withTranslation} from 'react-i18next'
import {withAuthenticationRequirement} from 'lib/hoc'
import {getHasClubs} from 'clubs/selectors'
import {
  Flex,
  Box,
  Page,
  FormikInput as Input,
  Card,
  TextArea,
  Image,
  Button,
  H2,
  ImageInput,
  Text,
  Link,
} from 'components'
import {Right, Camera, Back} from 'components/icons'
import {create} from 'clubs/actions'
import {getTldLocale} from 'app/selectors'
import validateZip from 'lib/validateZip'
import club from 'images/club-default.png'
import getLogo from 'jsonFetches/getLogo'
import useCustomTranslation from 'lib/customT'

const Arrow = styled(Right)`
  transform: rotate(${(props) => (props.isOpen ? 90 : 0)}deg);
  transition: transform 0.125s ease;
`

class CreateClub extends Component {
  t = () => useCustomTranslation()

  state = {
    moreInfoVisible: false,
    complete: false,
  }

  get validationSchema() {
    return Yup.object().shape({
      title: Yup.string().required(),
      zip: Yup.string()
        .required(),
    })
  }

  toggleInfo = () => {
    this.setState(({moreInfoVisible}) => ({
      moreInfoVisible: !moreInfoVisible,
    }))
  }

  handleSubmit = (values, {setErrors}) => {
    const {locale, create} = this.props

    new Promise((resolve, reject) =>
      create({values: {...values, locale}, resolve, reject})
    )
      .then(() => this.setState({complete: true}))
      .catch(() => setErrors({title: t('Foreningen findes allerede')}))
  }

  render() {
    const {moreInfoVisible, complete} = this.state
    const {hasClubs, t, locale, whiteLabelData} = this.props

    return complete ? (
      <Redirect to={{pathname: '/overview', state: {clubCreated: true}}} />
    ) : (
      <Page>
        {!hasClubs && (
          <Box>
            {
              whiteLabelData.logos &&
            <Image
              src={getLogo(locale, whiteLabelData,  'dark')}
              width={300}
              mx="auto"
              mb={4}
              display="block"
            />
            }
          </Box>
        )}
        <Box my={3} width={400} mx="auto">
          <Link fontWeight={400} secondary to="/">
            <Flex alignItems="center">
              <Box mr={2}>
                <Back fill="secondary" size={12} />
              </Box>
              {t('Tilbage')}
            </Flex>
          </Link>
        </Box>
        <Card secondaryLight p={4} width={400} mx="auto">
          <Box mb={4}>
            <H2 secondary bold textAlign="center">
              <strong>{t('Opret forening')}</strong>
            </H2>
          </Box>
          <Formik
            initialValues={{
              image: null,
              title: '',
              zip: '',
              description: '',
              phone: '',
              address: '',
              city: '',
              website: '',
            }}
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}
          >
            {() => (
              <Form>
                <Field
                  name="image"
                  component={ImageInput}
                  placeholder={club}
                  renderButton={({value}) => (
                    <Flex justifyContent="center" alignItems="center">
                      <Box mr={2}>
                        <Camera fill="purple" size={18} />
                      </Box>
                      <Text purple fontWeight={400}>
                        {value ? t('Skift billede') : t('Tilføj billede')}
                      </Text>
                    </Flex>
                  )}
                />
                <Box mt={3}>
                  <Text small secondary>
                    <strong>{t('Navn')} *</strong>
                  </Text>
                </Box>
                <Field
                  small
                  white
                  noBorder
                  placeholder={t('Navngiv din forening, klub, hold')}
                  name="title"
                  component={Input}
                />
                <Flex>
                  <Box mr={3}>
                    <Text small secondary>
                      <strong>{t('Postnummer')} *</strong>
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Field
                      small
                      white
                      noBorder
                      placeholder={t('Postnummer')}
                      name="zip"
                      component={Input}
                    />
                  </Box>
                </Flex>

                <Box my={3}>
                  <Button
                    block
                    bold
                    secondary
                    transparent
                    tiny
                    type="button"
                    onClick={this.toggleInfo}
                  >
                    <Flex alignItems="center" justifyContent="center">
                      <Box mr={2}>{t('Tilføj flere oplysninger')}</Box>
                      <Arrow
                        size={12}
                        fill="secondary"
                        isOpen={moreInfoVisible}
                      />
                    </Flex>
                  </Button>
                </Box>

                {moreInfoVisible && (
                  <Fragment>
                    <Box>
                      <Text small secondary>
                        {t('Beskrivelse')}
                      </Text>
                    </Box>
                    <Field
                      small
                      white
                      noBorder
                      name="description"
                      placeholder={t('Beskrivelse')}
                      component={TextArea}
                    />

                    <Box>
                      <Text small secondary>
                        {t('Telefonnummer')}
                      </Text>
                    </Box>
                    <Field
                      small
                      white
                      noBorder
                      placeholder={t('Telefonnummer')}
                      name="phone"
                      component={Input}
                    />

                    <Box>
                      <Text small secondary>
                        {t('Adresse')}
                      </Text>
                    </Box>
                    <Field
                      small
                      white
                      noBorder
                      placeholder={`${t('Adresse')}...`}
                      name="address"
                      component={Input}
                    />

                    <Box>
                      <Text small secondary>
                        {t('By')}
                      </Text>
                    </Box>
                    <Field
                      small
                      white
                      noBorder
                      placeholder={`${t('By')}...`}
                      name="city"
                      component={Input}
                    />

                    <Box>
                      <Text small secondary>
                        {t('Hjemmeside')}
                      </Text>
                    </Box>
                    <Field
                      small
                      white
                      noBorder
                      placeholder={`${t('Hjemmeside')}...`}
                      name="website"
                      component={Input}
                    />
                  </Fragment>
                )}

                <Button bold block purple small type="submit">
                  {t('Opret')}
                </Button>
              </Form>
            )}
          </Formik>
        </Card>
      </Page>
    )
  }
}

const enhancer = compose(
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      hasClubs: getHasClubs,
      locale: getTldLocale,
    }),
    {create: create.requested}
  ),
  withTranslation()
)

export default enhancer(CreateClub)