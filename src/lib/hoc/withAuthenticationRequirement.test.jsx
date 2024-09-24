import React from 'react'
import withAuthenticationRequirement from './withAuthenticationRequirement'

describe.skip('withAuthenticationRequirement', () => {
  it('should render the base component if token is present', () => {
    const state = {
      authentication: {
        token: 'abc123',
      },
    }

    const wrapper = withAuthenticationRequirement(<div></div>)
  })
})
