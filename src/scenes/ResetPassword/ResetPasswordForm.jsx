import React from 'react'
import { connect } from 'react-redux'
import { Form, Field, reduxForm } from 'redux-form'
import { compose, withHandlers } from 'recompose'
import { withRouterParams } from 'lib/hoc'
import { Button, Input } from 'components'
import { resetPassword } from 'authentication'

const renderInput = ({ input, meta, ...rest }) => (
  <Input {...input} {...meta} {...rest} />
)

const ResetPasswordForm = ({ handleSubmit }) => (
  <Form onSubmit={handleSubmit}>
    <Field
      type="password"
      name="password"
      placeholder="Nyt password"
      component={renderInput}
    />
    <Field
      type="password"
      name="passwordConfirmation"
      placeholder="Nyt password gentaget"
      component={renderInput}
    />

    <Button block type="submit">
      Nulstil adgangskode
    </Button>
  </Form>
)

const enhancer = compose(
  withRouterParams,
  connect(null, {
    resetPassword: resetPassword.requested
  }),
  withHandlers({
    onSubmit: ({ resetPassword }) => values =>
      new Promise((resolve, reject) =>
        resetPassword({ values, resolve, reject })
      ),
  }),
  reduxForm({
    form: 'resetPassword',
  })
)

export default enhancer(ResetPasswordForm)
