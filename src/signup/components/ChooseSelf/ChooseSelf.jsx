import React, {Component} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Formik, Form} from 'formik'
import {Redirect} from 'react-router-dom'
import {withTranslation} from 'react-i18next'
import {Card, Button, H2} from 'components'
import {getAsArray as getDummies} from 'signup/dummies'
import {setDummy, getDummy} from 'signup/user'
import validationSchema from './validationSchema'
import Dummy from './Dummy'
import None from './None'

class ChooseSelf extends Component {
  static defaultProps = {
    dummies: [],
    submitted: false,
  }

  state = {
    submitted: false,
  }

  handleSubmit = (values) => {
    this.props.setDummy(values.self)
    this.setState({submitted: true})
  }

  render() {
    const {
      dummies,
      userDummy,
      location: {search},
      t,
    } = this.props
    const {submitted} = this.state

    return submitted ? (
      <Redirect to={{pathname: '/register/other-users', search}} />
    ) : (
      <Card secondaryLight width={400} mx="auto">
        <H2 secondary textAlign="center" py={3} mb={3}>
          <strong>{t('Er nedenstående dig')}? </strong>
          {t('Er du forælder, vælger du "Ingen af dem er mig".')}{' '}
        </H2>

        <Formik
          initialValues={{self: userDummy}}
          isInitialValid={!!userDummy || userDummy === ''}
          validationSchema={validationSchema}
          onSubmit={this.handleSubmit}
        >
          {({isValid, handleSubmit}) => (
            <Form>
              {dummies.map(({userId, firstName, surname, headerImage}) => (
                <Dummy
                  key={userId}
                  id={userId}
                  firstName={firstName}
                  surname={surname}
                  image={headerImage}
                />
              ))}
              <None />

              <Button block disabled={!isValid} type="submit" mt={3}>
                {t('Fortsæt')}
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    )
  }
}

const enhancer = connect(
  createStructuredSelector({
    dummies: getDummies,
    userDummy: getDummy,
  }),
  {setDummy}
)

export default withTranslation()(enhancer(ChooseSelf))
