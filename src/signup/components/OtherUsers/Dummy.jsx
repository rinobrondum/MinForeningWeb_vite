import React, {Component} from 'react'
import styled from 'styled-components'
import includes from 'lodash/includes'
import pick from 'lodash/pick'
import {darken} from 'polished'
import {Formik, Form} from 'formik'
import Yup from 'lib/yup'
import {Box, Text, Button} from 'components'
import {Right} from 'components/icons'
import TypeSelector from './TypeSelector'
import User from './User'
import Child from './Child'
import Existing from './Existing'

const validationSchema = Yup.object().shape({
  type: Yup.mixed().oneOf(['user', 'child', 'existing']),
  ownLogin: Yup.mixed().oneOf(['yes', 'no']),
  email: Yup.string()
    .email()
    .when('type', {
      is: (type) => includes(['user'], type),
      then: Yup.string().required(),
    }),
  password: Yup.string().when('type', {
    is: (type) => includes(['user'], type),
    then: Yup.string().required(),
  }),
  passwordConfirmation: Yup.string().when('type', {
    is: (type) => includes(['user'], type),
    then: Yup.string()
      .required()
      .oneOf([Yup.ref('password'), null]),
  }),
  parents: Yup.mixed().when('type', {
    is: 'child',
    then: Yup.array().required().min(1),
  }),
  existing: Yup.mixed().when('type', {
    is: 'existing',
    then: Yup.mixed().required(),
  }),
})

const Arrow = styled(Right)`
  position: absolute;
  top: 5px;
  right: 5px;

  transform: rotate(${(props) => (props.isOpen ? 90 : 0)}deg);
  transition: transform 0.25s ease;
`

const Details = styled(Box).attrs({
  p: 4,
})`
  background: ${(props) => darken(0.05, props.theme.colors.secondaryLight)};
`

const Header = styled(Box).attrs({
  bg: 'primary',
  p: 2,
})`
  ${(props) => props.canOpen && 'cursor: pointer'};
`

class Dummy extends Component {
  state = {
    isOpen: false,
  }

  toggle = () => this.setState(({isOpen}) => ({isOpen: !isOpen}))

  openForm = () => this.setState({isOpen: true})

  handleSubmit = (values) =>
    this.setState({isOpen: false}, () =>
      this.props.save(
        pick(values, [
          'userId',
          'email',
          'password',
          'type',
          'parents',
          'existing',
          'ownLogin',
        ])
      )
    )

  remove = () => {
    const {
      remove,
      userId: id,
      urlEmail: email,
      urlPassword: password,
    } = this.props

    remove({id, email, password})
  }

  renderForm = ({type, ...values}) =>
    ({
      user: <User />,
      child: <Child {...this.props} {...values} />,
      existing: <Existing {...this.props} {...values} />,
    }[type] || null)

  get canOpen() {
    return !!this.props.type
  }

  componentDidUpdate(prevProps, prevState) {
    const {error} = this.props

    if (!prevProps.error && error) {
      this.openForm()
    }
  }

  render() {
    const {firstName, surname, error} = this.props
    const {isOpen} = this.state

    return (
      <Box borderRadius={4} mb={3}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ownLogin: 'no', ...this.props}}
          onSubmit={this.handleSubmit}
        >
          {({isValid, values}) => (
            <Form>
              <Header canOpen={this.canOpen} onClick={this.toggle}>
                <Box my={3} position="relative">
                  <Arrow isOpen={isOpen} fill="white" size={16} />
                  <Text color="white" textAlign="center">
                    {firstName} {surname}
                  </Text>
                </Box>

                <TypeSelector openForm={this.openForm} />
              </Header>

              {isOpen && (
                <Details>
                  <Box mx="auto" width={300}>
                    {this.renderForm(values)}

                    {error && (
                      <Text danger mb={3}>
                        {error}
                      </Text>
                    )}

                    <Button
                      small
                      success
                      block
                      disabled={!isValid}
                      type="submit"
                      mb={3}
                    >
                      Gem
                    </Button>

                    <Button
                      small
                      danger
                      block
                      type="button"
                      transparent
                      onClick={this.remove}
                    >
                      <Text danger>Slet bruger</Text>
                    </Button>
                  </Box>
                </Details>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    )
  }
}

export default Dummy
